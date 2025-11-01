'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils"
import { UserRole } from "@/generated/prisma";
import Link from "next/link";

interface School {
  id: string;
  name: string;
  code: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolId: "",
  });
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(true);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch('/api/schools');
        if (res.ok) {
          const data = await res.json();
          setSchools(data.schools || []);
        }
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!PASSWORD_REGEX.test(formData.password)) {
      toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
      setLoading(false);
      return;
    }

    if (!formData.schoolId) {
      toast.error("Please select a school");
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
          schoolId: formData.schoolId,
          role: UserRole.STUDENT, // Default role for public registration
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Verification code sent to your email!");
      router.push(`/register/verify-otp?email=${encodeURIComponent(formData.email)}`);
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
          alt="SchoolBridge Registration"
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
                <form className={cn("flex flex-col gap-4")} onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center gap-2 text-center mb-2">
                    <h1 className="text-2xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter your details below to create your account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="school">School</Label>
                    <Select
                      value={formData.schoolId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, schoolId: value }))}
                      disabled={loadingSchools}
                    >
                      <SelectTrigger id="school">
                        <SelectValue placeholder={loadingSchools ? "Loading schools..." : "Select your school"} />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name} ({school.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Min 8 chars: 1 upper, 1 lower, 1 number"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading || loadingSchools} className="w-full mt-2">
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full" disabled>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Apple</span>
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Meta</span>
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="mt-4 text-balance text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
