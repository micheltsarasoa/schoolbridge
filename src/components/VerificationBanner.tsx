'use client';

  import { useState, useEffect } from 'react';
  import { Alert, AlertDescription } from '@/components/ui/alert';
  import { Button } from '@/components/ui/button';
  import { Mail } from 'lucide-react';
  import { toast } from 'sonner';

  export function VerificationBanner() {
    const [isVerified, setIsVerified] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
      checkVerificationStatus();
    }, []);

    const checkVerificationStatus = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setIsVerified(!!data.emailVerified);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    const handleResend = async () => {
      setIsSending(true);
      try {
        const response = await fetch('/api/auth/send-verification', {
          method: 'POST',
        });

        if (response.ok) {
          toast.success('Verification email sent!');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Failed to send email');
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setIsSending(false);
      }
    };

    if (isVerified) return null;

    return (
      <Alert className="mb-6">
        <Mail className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Please verify your email address to access all features.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Resend Email'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }