import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

/**
 * Toast notification utilities with consistent styling and messages
 * Provides info, success, warning, and error toast types with visual styling
 */

export const showToast = {
  /**
   * Info toast - blue, for informational messages
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      position: "top-right",
      duration: 4000,
      icon: <Info className="h-5 w-5" />,
      style: {
        background: "rgb(239, 246, 255)",
        border: "1px solid rgb(147, 197, 253)",
        color: "rgb(30, 58, 138)",
      },
      descriptionStyle: {
        color: "rgb(55, 65, 81)",
      },
    });
  },

  /**
   * Success toast - green, for successful operations
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      position: "top-right",
      duration: 3000,
      icon: <CheckCircle2 className="h-5 w-5" />,
      style: {
        background: "rgb(240, 253, 244)",
        border: "1px solid rgb(134, 239, 172)",
        color: "rgb(20, 83, 45)",
      },
      descriptionStyle: {
        color: "rgb(55, 65, 81)",
      },
    });
  },

  /**
   * Warning toast - orange, for warnings
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      position: "top-right",
      duration: 4000,
      icon: <AlertTriangle className="h-5 w-5" />,
      style: {
        background: "rgb(254, 252, 232)",
        border: "1px solid rgb(253, 230, 138)",
        color: "rgb(113, 63, 18)",
      },
      descriptionStyle: {
        color: "rgb(55, 65, 81)",
      },
    });
  },

  /**
   * Error toast - red, for errors
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      position: "top-right",
      duration: 4000,
      icon: <AlertCircle className="h-5 w-5" />,
      style: {
        background: "rgb(254, 242, 242)",
        border: "1px solid rgb(248, 113, 113)",
        color: "rgb(127, 29, 29)",
      },
      descriptionStyle: {
        color: "rgb(55, 65, 81)",
      },
    });
  },

  /**
   * Loading toast - for async operations
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "rgb(249, 250, 251)",
        border: "1px solid rgb(226, 232, 240)",
        color: "rgb(51, 65, 85)",
      },
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

/**
 * Parse authentication error messages and provide user-friendly messages
 */
export const getAuthErrorMessage = (error?: string | null): { title: string; description: string } => {
  if (!error) {
    return {
      title: "Authentication Error",
      description: "An unexpected error occurred. Please try again.",
    };
  }

  const errorMap: Record<string, { title: string; description: string }> = {
    "Invalid credentials": {
      title: "Login Failed",
      description: "The email or password you entered is incorrect. Please try again.",
    },
    "CredentialsSignin": {
      title: "Login Failed",
      description: "The email or password you entered is incorrect. Please try again.",
    },
    "Account is locked": {
      title: "Account Locked",
      description: "Your account has been locked due to too many failed login attempts. Please try again later.",
    },
    "locked for": {
      title: "Account Locked",
      description: "Too many failed login attempts. Please try again in a few minutes.",
    },
    "User not found": {
      title: "User Not Found",
      description: "No account found with this email address. Please check and try again.",
    },
    "Invalid token": {
      title: "Invalid Token",
      description: "The verification link has expired or is invalid. Please request a new one.",
    },
    "Token expired": {
      title: "Token Expired",
      description: "Your verification link has expired. Please request a new one.",
    },
    "Email already exists": {
      title: "Email Already Registered",
      description: "An account with this email already exists. Please login instead.",
    },
    "Passwords do not match": {
      title: "Password Mismatch",
      description: "The passwords you entered do not match. Please try again.",
    },
  };

  // Find matching error
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return value;
    }
  }

  // Default error message
  return {
    title: "Error",
    description: error,
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  return { valid: true, message: "" };
};
