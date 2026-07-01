import { NextResponse } from "next/server";

// Simulated admin settings DB
let adminSettings = {
  provider: "sms-activate",
  multiplier: 1.5,
  flatFee: 2.0,
  providerKeyLength: 0
};

export async function GET() {
  // Hide actual API key for safety, return length or boolean indicator
  const hasKey = !!(process.env.SMS_ACTIVATE_API_KEY || process.env.NEXT_PUBLIC_SMS_ACTIVATE_API_KEY);
  
  return NextResponse.json({
    ...adminSettings,
    hasUpstreamKey: hasKey,
    mode: hasKey ? "Production (API Live)" : "Sandbox (Demo Mode)"
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider, multiplier, flatFee } = body;

    if (provider) adminSettings.provider = provider;
    if (multiplier) adminSettings.multiplier = parseFloat(multiplier);
    if (flatFee) adminSettings.flatFee = parseFloat(flatFee);

    return NextResponse.json({
      success: true,
      message: "Admin settings updated successfully on server.",
      currentConfig: adminSettings
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
