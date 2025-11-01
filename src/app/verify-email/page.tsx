'use client';

  import { useEffect, useState, Suspense } from 'react';
  import { useSearchParams } from 'next/navigation';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
  import { Button } from '@/components/ui/button';

  function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      verifyEmail(token);
    }, [token]);

    const verifyEmail = async (token: string) => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
        } else {
          const data = await response.text();
          setStatus('error');
          setMessage(data || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred');
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                <p>Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                <p className="text-lg font-semibold">{message}</p>
                <Button asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 mx-auto text-destructive" />
                <p className="text-lg font-semibold">{message}</p>
                <Button variant="outline" asChild>
                  <a href="/profile">Back to Profile</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  export default function VerifyEmailPage() {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                <p>Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    );
  }