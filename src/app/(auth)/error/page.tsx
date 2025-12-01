
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = "An unknown error occurred.";

  if (error) {
    switch (error) {
      case "CredentialsSignin":
        errorMessage = "Invalid credentials. Please check your email and password.";
        break;
      case "CallbackRouteError":
        errorMessage = "A server error occurred during authentication. Please try again.";
        break;
      case "OAuthAccountNotLinked":
        errorMessage = "An account with this email already exists. Please sign in with your original method or link your accounts.";
        break;
      case "EmailSignin":
        errorMessage = "Email sign-in failed. Please try again.";
        break;
      case "CredentialsSignin":
        errorMessage = "Invalid credentials. Please check your email and password.";
        break;
      case "AccountLocked": // Assuming this is a custom error type or part of the message
        errorMessage = "Your account is locked. Please try again later.";
        break;
      default:
        if (error.includes("Account locked for ")) {
          errorMessage = error; // Display the full message for locked accounts
        } else {
          errorMessage = "An unexpected authentication error occurred."; // Generic fallback
        }
        break;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-lg text-gray-700 mb-6">
        An error occurred during the authentication process.
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}
      <Link href="/login" className="text-blue-600 hover:underline">
        Go back to login
      </Link>
    </div>
  );
}
