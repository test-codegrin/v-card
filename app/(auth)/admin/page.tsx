'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    sendOtp,
    verifyOtp,
    resendOtp,   
    loading
  } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  // Resend OTP timer
  const [cooldown, setCooldown] = useState(30);

  /*     SEND OTP     */
  const handleSendOtp = async () => {
    if (!email) {
      showToast({
        variant: 'error',
        title: 'Missing email',
        message: 'Please enter admin email'
      });
      return;
    }

    try {
      await sendOtp(email);
      setStep('otp');
      setCooldown(30);

      showToast({
        variant: 'success',
        title: 'OTP sent',
        message: 'Verification code sent to admin email.'
      });
    } catch (err: any) {
      showToast({
        variant: 'error',
        title: 'Failed',
        message: err.message || 'Unable to send OTP'
      });
    }
  };

  /*     VERIFY OTP     */
  const handleVerifyOtp = async () => {
    if (!otp) {
      showToast({
        variant: 'error',
        title: 'Missing OTP',
        message: 'Please enter the OTP'
      });
      return;
    }

    try {
      await verifyOtp(email, otp);

      showToast({
        variant: 'success',
        title: 'Welcome Admin',
        message: 'Logged in successfully.'
      });

      router.replace('/admin/dashboard');
    } catch (err: any) {
      showToast({
        variant: 'error',
        title: 'Invalid OTP',
        message: err.message || 'Please try again.'
      });
    }
  };

  /*     RESEND OTP     */
  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
      setCooldown(30);

      showToast({
        variant: 'success',
        title: 'OTP resent',
        message: 'A new verification code has been sent.'
      });
    } catch (err: any) {
      showToast({
        variant: 'error',
        title: 'Failed',
        message: err.message || 'Unable to resend OTP'
      });
    }
  };

  /*     TIMER EFFECT     */
  useEffect(() => {
    if (step !== 'otp' || cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown, step]);

  return (
    <div className="grid lg:py-52 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      {/* LEFT CONTENT */}
      <div className="space-y-4">
        <p className="text-lg uppercase tracking-widest text-[#9f2b34]">
          Admin access
        </p>

        <h1 className="text-5xl font-semibold leading-tight text-black">
          Sign in to Admin Panel
        </h1>

        <p className="text-md text-gray-600">
          Secure admin-only access to manage the platform.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="ds-badge">Admin only</span>
          <span className="ds-badge">OTP secured</span>
        </div>
      </div>

      {/* LOGIN PANEL */}
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)]">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold text-black">
            Admin Login
          </h2>
          <p className="text-sm text-gray-600">
            Verify your identity to continue.
          </p>
        </div>

        {/* EMAIL STEP */}
        {step === 'email' && (
          <div className="space-y-4">
            <Input
              tone="light"
              label="Admin Email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              variant="primary"
              className="w-full"
              loading={loading}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </div>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <Input
              tone="light"
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              variant="primary"
              className="w-full"
              loading={loading}
              onClick={handleVerifyOtp}
            >
              Verify & Continue
            </Button>

            {/* RESEND + CHANGE EMAIL */}
            <div className="flex items-center justify-between text-sm">
              {cooldown > 0 ? (
                <span className="text-gray-500">
                  Resend OTP in {cooldown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="font-medium text-[#9f2b34] underline underline-offset-4 hover:text-[#7a1f27]"
                >
                  Resend OTP
                </button>
              )}

              <button
                onClick={() => setStep('email')}
                className="font-medium text-[#9f2b34] underline underline-offset-4 hover:text-[#7a1f27]"
              >
                Change email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
