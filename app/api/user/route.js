import { NextResponse } from "next/server";

// Simulated user database
let userBalance = 150.00;

export async function GET() {
  return NextResponse.json({
    username: "developer_dev",
    email: "dev@catchotp.in",
    balance: userBalance,
    registered: "2026-06-25"
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, amount } = body;

    if (action === "recharge") {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
      }

      userBalance += parsedAmount;
      return NextResponse.json({
        success: true,
        newBalance: userBalance,
        message: `Successfully recharged ₹${parsedAmount}.`
      });
    }

    if (action === "deduct") {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
      }

      if (userBalance < parsedAmount) {
        return NextResponse.json({ success: false, error: "Insufficient balance" }, { status: 400 });
      }

      userBalance -= parsedAmount;
      return NextResponse.json({
        success: true,
        newBalance: userBalance
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
