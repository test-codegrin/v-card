import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";
import { transporter } from "@/lib/mailer";

export const runtime = "nodejs";

/*  
   Helpers
  */

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate Admin JWT
function generateAdminToken(payload: { admin_id: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

/**
 * OTP store (in-memory)
 * key   -> email
 * value -> { otp, expiresAt, lastSentAt? }
 */
const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; lastSentAt?: number }
>();

/*  
   MAIN HANDLER
  */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { message: "Action is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "send-otp":
        return await sendAdminOTP(body);

      case "verify-otp":
        return await verifyAdminOTP(body);

      case "resend-otp":
        return await resendAdminOTP(body);

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin Auth API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/*  
   SEND OTP
  */
async function sendAdminOTP(body: any) {
  let { email } = body;

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  email = email.trim().toLowerCase();

const admins = await query<any[]>(
  "SELECT admin_id, admin_name FROM admin WHERE email = ?",
  [email]
);

if (!admins || admins.length === 0) {
  return NextResponse.json(
    { message: "Unauthorized email. Admin access only." },
    { status: 403 }
  );
}

const admin = admins[0];
const userName = admin.admin_name || "";


  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

  otpStore.set(email, { otp, expiresAt });

  await sendOTPEmail(
    email,
    userName,
    otp,
    "Your Admin Login Verification Code"
  );

  return NextResponse.json({ message: "OTP sent to admin email" });
}

/*  
   VERIFY OTP
  */
async function verifyAdminOTP(body: any) {
  let { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required" },
      { status: 400 }
    );
  }

  email = email.trim().toLowerCase();

  const storedOtpData = otpStore.get(email);

  if (!storedOtpData) {
    return NextResponse.json(
      { message: "OTP not found or expired" },
      { status: 401 }
    );
  }

  if (Date.now() > storedOtpData.expiresAt) {
    otpStore.delete(email);
    return NextResponse.json(
      { message: "OTP expired" },
      { status: 401 }
    );
  }

  if (storedOtpData.otp !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 401 }
    );
  }

  otpStore.delete(email);

 const admins = await query<any[]>(
  "SELECT admin_id, email, admin_name FROM admin WHERE email = ?",
  [email]
);

if (!admins || admins.length === 0) {
  return NextResponse.json(
    { message: "Admin not found" },
    { status: 404 }
  );
}

const admin = admins[0];


  const token = generateAdminToken({
    admin_id: admin.admin_id,
    email: admin.email,
  });

  return NextResponse.json({
    message: "Admin authenticated successfully",
    token,
    admin: {
      admin_id: admin.admin_id,
      email: admin.email,
      admin_name: admin.admin_name,
    },
  });
}

/*  
   RESEND OTP
  */
async function resendAdminOTP(body: any) {
  let { email } = body;

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  email = email.trim().toLowerCase();

 const admins = await query<any[]>(
  "SELECT admin_id, admin_name FROM admin WHERE email = ?",
  [email]
);

if (!admins || admins.length === 0) {
  return NextResponse.json(
    { message: "Unauthorized email. Admin access only." },
    { status: 403 }
  );
}

const admin = admins[0];
const userName = admin.admin_name || "";


  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, {
    otp,
    expiresAt,
    lastSentAt: Date.now(),
  });

  await sendOTPEmail(
    email,
    userName,
    otp,
    "Admin Login New Verification Code"
  );

  return NextResponse.json({ message: "OTP resent successfully" });
}

/*  
   EMAIL HELPER
  */
async function sendOTPEmail(
  email: string,
  userName: string,
  otp: string,
  subject: string
) {
  await transporter.sendMail({
    from: `"Admin Login" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html: `
      <h2>Hello${userName ? " " + userName : ""}</h2>
      <p>Your verification code:</p>
      <h1 style="letter-spacing:6px">${otp}</h1>
      <p>This code expires in <b>5 minutes</b>.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
    text: `
Hello${userName ? " " + userName : ""},
Your verification code is: ${otp}
Expires in 5 minutes.
    `,
  });
}
