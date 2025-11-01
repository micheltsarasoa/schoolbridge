'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils"
import Link from "next/link";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email) {
    return (
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">SchoolBridge</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 md:p-8">
              <p className="text-center text-muted-foreground">
                Invalid verification link. Please try registering again.
              </p>
              <Button className="w-full mt-4" onClick={() => router.push('/register')}>
                Go to Registration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register/verify-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Verification failed");
        return;
      }

      toast.success("Email verified successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/register/resend-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to resend code");
        return;
      }

      toast.success("Verification code resent successfully!");
      setOtp("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
          alt="SchoolBridge Verification"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">SchoolBridge</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className={cn("flex flex-col gap-4")}>
                  <div className="flex flex-col items-center gap-2 text-center mb-2">
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="font-medium">{email}</p>
                  </div>

                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button 
                    type="button" 
                    onClick={handleVerify}
                    disabled={loading || otp.length !== 6} 
                    className="w-full mt-2"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                      Didn't receive the code?{" "}
                      <button
                        onClick={handleResend}
                        disabled={resending}
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        {resending ? "Sending..." : "Resend"}
                      </button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 text-balance text-center text-xs text-muted-foreground">
              <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                Back to registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">SchoolBridge</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 md:p-8">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
