import { NextResponse } from "next/server";

// In-memory mock database for active rentals (resets on server restart/Vercel serverless sleep)
// In production, the user would connect this to a database (Supabase, PostgreSQL, etc.)
let mockActivations = [];

// Base API URL for SMS-Activate
const SMS_ACTIVATE_URL = "https://api.sms-activate.org/stubs/handler_api.php";

/**
 * Helper to communicate with upstream SMS API if key is present.
 * Otherwise, uses mock responses.
 */
async function callSmsActivate(action, params = {}) {
  const apiKey = process.env.SMS_ACTIVATE_API_KEY || process.env.NEXT_PUBLIC_SMS_ACTIVATE_API_KEY;
  
  if (!apiKey) {
    return { isMock: true };
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    action,
    ...params
  });

  try {
    const response = await fetch(`${SMS_ACTIVATE_URL}?${queryParams.toString()}`);
    const data = await response.text();
    return { isMock: false, raw: data };
  } catch (error) {
    console.error("SMS-Activate API Error:", error);
    return { isMock: true, error: error.message };
  }
}

// GET: Check activation status or get active list
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action"); // getStatus or getActiveList
  const id = searchParams.get("id"); // activation ID

  const apiCall = await callSmsActivate(action === "getStatus" ? "getStatus" : "getActiveActivations", { id });

  if (apiCall.isMock) {
    // Mock Mode logic
    if (action === "getStatus" && id) {
      const active = mockActivations.find(a => a.id === id);
      if (!active) {
        return NextResponse.json({ status: "STATUS_CANCEL" });
      }

      // If waiting, simulate OTP delivery after some time
      const elapsed = Date.now() - active.createdAt;
      if (elapsed > 12000 && !active.code) {
        active.code = Math.floor(10000 + Math.random() * 90000).toString();
        active.status = "STATUS_OK";
      }

      if (active.code) {
        return NextResponse.json({ status: `STATUS_OK:${active.code}` });
      }
      return NextResponse.json({ status: "STATUS_WAIT_CODE" });
    }

    return NextResponse.json({ activations: mockActivations });
  }

  // Real Provider parsing
  // SMS-Activate getStatus responds with string: STATUS_WAIT_CODE, STATUS_OK:code, STATUS_CANCEL, etc.
  if (action === "getStatus") {
    const statusString = apiCall.raw;
    return NextResponse.json({ status: statusString });
  }

  return NextResponse.json({ raw: apiCall.raw });
}

// POST: Rent/Buy a phone number
export async function POST(request) {
  try {
    const body = await request.json();
    const { service, countryId } = body;

    const apiCall = await callSmsActivate("getNumber", {
      service: service || "tg", // default to telegram
      country: countryId || "0" // default to Russia or India
    });

    if (apiCall.isMock) {
      // Generate a mock activation
      const activationId = Math.floor(100000 + Math.random() * 900000).toString();
      const mockNumber = "+91" + Math.floor(6000000000 + Math.random() * 3999999999).toString();
      
      const newActivation = {
        id: activationId,
        number: mockNumber,
        service: service || "Telegram",
        status: "STATUS_WAIT_CODE",
        code: null,
        createdAt: Date.now()
      };

      mockActivations.push(newActivation);

      return NextResponse.json({
        success: true,
        isMock: true,
        activationId,
        number: mockNumber,
        message: "Successfully rented mock number. Code will arrive in 12s."
      });
    }

    // Real Provider parsing
    // SMS-Activate response format: ACCESS_NUMBER:id:number
    const responseStr = apiCall.raw;
    if (responseStr.startsWith("ACCESS_NUMBER")) {
      const parts = responseStr.split(":");
      const activationId = parts[1];
      const number = parts[2];
      
      return NextResponse.json({
        success: true,
        isMock: false,
        activationId,
        number
      });
    }

    return NextResponse.json({
      success: false,
      error: responseStr || "Unknown error from upstream provider"
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Cancel or Complete activation
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const status = searchParams.get("status"); // 8: complete, 3: cancel/refund

  const apiCall = await callSmsActivate("setStatus", {
    id,
    status: status || "3" // default cancel
  });

  if (apiCall.isMock) {
    mockActivations = mockActivations.filter(a => a.id !== id);
    return NextResponse.json({ success: true, isMock: true, status: "ACTION_SUCCESS" });
  }

  // Real Provider response
  // SMS-Activate responses: ACCESS_CANCEL, ACCESS_READY, etc.
  return NextResponse.json({ success: true, isMock: false, raw: apiCall.raw });
}
