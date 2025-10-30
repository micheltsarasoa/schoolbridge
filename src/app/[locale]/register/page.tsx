
'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/generated/prisma";
import Link from "next/link";

export default function SignupPage() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: UserRole.STUDENT, // Default role for public registration
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
          alt="Image"
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
            <form className={cn("flex flex-col gap-4")} onSubmit={handleSubmit} >
                <div className="flex flex-col items-center gap-1 text-center mb-4">
                  <h1 className="text-3xl font-bold">Create an Account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your details below to create your account
                  </p>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="name">Full Name</label>
                  <Input id="name" type="text" placeholder="John Doe" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email">Email</label>
                  <Input id="email" type="email" placeholder="name@example.com" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password">Password</label>
                  <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                
                <Button type="submit" disabled={loading} className="mt-4">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
