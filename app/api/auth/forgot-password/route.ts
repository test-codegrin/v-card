import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { transporter } from "@/lib/mailer";

export const runtime = "nodejs";

/* ---------------- HELPERS ---------------- */

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const otpStore = new Map<
    string,
    { otp: string; expiresAt: number; verified: boolean }
>();

/* ---------------- MAIN HANDLER ---------------- */

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
                return sendOTP(body);

            case "verify-otp":
                return verifyOTP(body);

            case "reset-password":
                return resetPassword(body);

            default:
                return NextResponse.json(
                    { message: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (err) {
        console.error("Forgot Password API Error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* ---------------- SEND OTP ---------------- */

async function sendOTP(body: any) {
    let { email } = body;

    if (!email) {
        return NextResponse.json(
            { message: "Email is required" },
            { status: 400 }
        );
    }

    email = email.trim().toLowerCase();

    const users = await query<any[]>(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (!users || users.length === 0) {
        return NextResponse.json(
            { message: "Account not found" },
            { status: 404 }
        );
    }

    const user = users[0];
    const otp = generateOTP();

    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        verified: false,
    });

    await sendOTPEmail(email, user.name, otp);

    return NextResponse.json({ message: "OTP sent to email" });
}

/* ---------------- VERIFY OTP ---------------- */

async function verifyOTP(body: any) {
    let { email, otp } = body;

    if (!email || !otp) {
        return NextResponse.json(
            { message: "Email and OTP are required" },
            { status: 400 }
        );
    }

    email = email.trim().toLowerCase();
    const stored = otpStore.get(email);

    if (!stored) {
        return NextResponse.json(
            { message: "OTP expired or not found" },
            { status: 401 }
        );
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return NextResponse.json(
            { message: "OTP expired" },
            { status: 401 }
        );
    }

    if (stored.otp !== otp) {
        return NextResponse.json(
            { message: "Invalid OTP" },
            { status: 401 }
        );
    }

    stored.verified = true;
    otpStore.set(email, stored);

    return NextResponse.json({ message: "OTP verified" });
}

/* ---------------- RESET PASSWORD ---------------- */

async function resetPassword(body: any) {
    let { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
            { message: "Email and new password are required" },
            { status: 400 }
        );
    }

    email = email.trim().toLowerCase();
    const stored = otpStore.get(email);

    if (!stored || !stored.verified) {
        return NextResponse.json(
            { message: "OTP verification required" },
            { status: 403 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email]
    );

    otpStore.delete(email);

    return NextResponse.json({
        message: "Password reset successful",
    });
}

/* ---------------- EMAIL ---------------- */

async function sendOTPEmail(
    email: string,
    name: string,
    otp: string
) {
    await transporter.sendMail({
        from: `"V-Card Support" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Password Reset Verification Code",
        html: `
        <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.08);padding:30px;">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <h1 style="margin:0;font-size:22px;color:#111;">V-Card</h1>
                      <p style="margin:6px 0 0;color:#666;font-size:14px;">
                        Password Reset Request
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="color:#333;font-size:15px;line-height:1.6;">
                      <p>Hi <b>${name || "there"}</b>,</p>

                      <p>
                        We received a request to reset your password.
                        Use the verification code below to continue.
                      </p>
                    </td>
                  </tr>

                  <!-- OTP -->
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <div style="
                        display:inline-block;
                        padding:14px 26px;
                        font-size:26px;
                        letter-spacing:8px;
                        font-weight:bold;
                        color:#111;
                        background:#f1f3f5;
                        border-radius:8px;
                      ">
                        ${otp}
                      </div>
                    </td>
                  </tr>

                  <!-- Footer text -->
                  <tr>
                    <td style="color:#555;font-size:14px;line-height:1.6;">
                      <p>
                        This code will expire in
                        <b>5 minutes</b>.
                      </p>

                      <p style="margin-top:12px;">
                        If you didn’t request a password reset,
                        you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding:20px 0;">
                      <hr style="border:none;border-top:1px solid #eee;">
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="font-size:12px;color:#999;">
                      © ${new Date().getFullYear()} V-Card. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
        `,
    });
}

