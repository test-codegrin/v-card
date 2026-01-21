'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from 'next/navigation';

type EmailForm = { email: string };
type OtpForm = { otp: string };
type PasswordForm = {
    password: string;
    confirmPassword: string;
};

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    /* ---------------- STEP 1: SEND OTP ---------------- */

    const emailForm = useForm<EmailForm>();

    const onSendOtp = async (data: EmailForm) => {
        try {
            setLoading(true);

            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send-otp',
                    email: data.email,
                }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message);

            setEmail(data.email);
            setStep(2);

            showToast({
                variant: 'success',
                title: 'OTP sent',
                message: 'Check your email for the verification code.',
            });
        } catch (err: any) {
            showToast({
                variant: 'error',
                title: 'Failed',
                message: err.message || 'Unable to send OTP',
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- STEP 2: VERIFY OTP ---------------- */

    const otpForm = useForm<OtpForm>();

    const onVerifyOtp = async (data: OtpForm) => {
        try {
            setLoading(true);

            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify-otp',
                    email,
                    otp: data.otp,
                }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message);

            setStep(3);

            showToast({
                variant: 'success',
                title: 'OTP verified',
                message: 'You can now reset your password.',
            });
        } catch (err: any) {
            showToast({
                variant: 'error',
                title: 'Verification failed',
                message: err.message || 'Invalid OTP',
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- STEP 3: RESET PASSWORD ---------------- */

    const passwordForm = useForm<PasswordForm>();

    const onResetPassword = async (data: PasswordForm) => {
        if (data.password !== data.confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Password mismatch',
                message: 'Both passwords must be the same.',
            });
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reset-password',
                    email,
                    password: data.password,
                }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message);

            showToast({
                variant: 'success',
                title: 'Password updated',
                message: 'You can now log in with your new password.',
            });

            router.replace('/login');
        } catch (err: any) {
            showToast({
                variant: 'error',
                title: 'Reset failed',
                message: err.message || 'Unable to reset password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-10 lg:py-48 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-4">
                <p className="text-lg uppercase tracking-widest text-[#9f2b34]">
                    Password recovery
                </p>
                <h1 className="text-5xl font-semibold leading-tight text-black">
                    Reset your password
                </h1>
                <p className="text-md text-gray-600">
                    Securely regain access to your V-Card workspace.
                </p>
            </div>

            {/* PANEL */}
            <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)]">
                {step === 1 && (
                    <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                        <Input
                            tone="light"
                            label="Email"
                            type="email"
                            placeholder="you@company.com"
                            {...emailForm.register('email', { required: true })}
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Send OTP
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                        <Input
                            tone="light"
                            label="OTP"
                            placeholder="Enter 6-digit OTP"
                            {...otpForm.register('otp', { required: true })}
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Verify OTP
                        </Button>
                    </form>
                )}

                {step === 3 && (
                    <form
                        onSubmit={passwordForm.handleSubmit(onResetPassword)}
                        className="space-y-4"
                    >
                        <Input
                            tone="light"
                            label="New password"
                            type="password"
                            placeholder="Minimum 8 characters"
                            {...passwordForm.register('password', { required: true })}
                        />
                        <Input
                            tone="light"
                            label="Confirm password"
                            type="password"
                            placeholder="Re-enter password"
                            {...passwordForm.register('confirmPassword', { required: true })}
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Update password
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
