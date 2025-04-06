"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { register } from "@/services/authService";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      const resposne = await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      if (resposne && resposne.success) {
        router.push("/chat");
      } else {
        toast.error("Failed to sign up");
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error.response);
      toast.error(error.response?.data.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setPasswordStrength(score);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">
            Start your journey with us today
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <CardDescription>
              Choose your preferred method to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="mt-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="John"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="name@example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-muted-foreground">
                                @
                              </span>
                              <Input
                                placeholder="username"
                                className="pl-8 test-center"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  checkPasswordStrength(e.target.value);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-2">
                      <div className="flex space-x-1 mb-1">
                        <div
                          className={`h-1 w-1/4 rounded-full ${passwordStrength >= 1 ? "bg-red-500" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`h-1 w-1/4 rounded-full ${passwordStrength >= 2 ? "bg-yellow-500" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`h-1 w-1/4 rounded-full ${passwordStrength >= 3 ? "bg-blue-500" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`h-1 w-1/4 rounded-full ${passwordStrength >= 4 ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {passwordStrength === 0 && "Enter a password"}
                        {passwordStrength === 1 && "Weak - Use longer password"}
                        {passwordStrength === 2 &&
                          "Fair - Add numbers or symbols"}
                        {passwordStrength === 3 && "Good - Almost there!"}
                        {passwordStrength === 4 && "Strong - Great password!"}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                          Creating account...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="social" className="mt-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full hover:border-[#4285F4] hover:text-[#4285F4]"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full hover:border-[#1877F2] hover:text-[#1877F2]"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="#1877F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full hover:border-black hover:text-black"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.892 18.862c-0.375 1.119-0.829 2.144-1.36 3.061-0.75 1.354-1.36 2.266-1.844 2.777-0.733 0.675-1.528 1.024-2.379 1.040-0.608 0-1.347-0.173-2.207-0.525-0.866-0.354-1.654-0.526-2.379-0.526-0.76 0-1.572 0.172-2.447 0.526-0.875 0.352-1.572 0.535-2.111 0.552-0.816 0.031-1.627-0.323-2.447-1.061-0.538-0.548-1.19-1.496-1.958-2.839-0.832-1.442-1.515-3.117-2.047-5.02-0.58-2.113-0.873-4.16-0.873-6.11 0-2.26 0.489-4.214 1.469-5.823 0.768-1.301 1.79-2.329 3.065-3.087 1.278-0.758 2.656-1.146 4.133-1.169 0.811 0 1.877 0.251 3.2 0.749 1.32 0.499 2.168 0.752 2.549 0.752 0.275 0 1.21-0.296 2.794-0.886 1.497-0.533 2.764-0.786 3.799-0.749 2.806 0.226 4.915 1.331 6.315 3.32-2.511 1.525-3.752 3.656-3.722 6.383 0.024 2.117 0.793 3.885 2.303 5.292 0.685 0.653 1.448 1.152 2.303 1.508-0.186 0.539-0.376 1.055-0.574 1.552zM16.8 0.232c0 1.662-0.604 3.208-1.816 4.644-1.457 1.707-3.224 2.702-5.132 2.544-0.025-0.205-0.037-0.42-0.037-0.645 0-1.635 0.712-3.385 1.972-4.827 0.629-0.733 1.433-1.343 2.406-1.83 0.974-0.484 1.895-0.752 2.758-0.803 0.028 0.234 0.049 0.469 0.049 0.702z" />
                  </svg>
                  Continue with Apple
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Our Promise
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p className="text-sm">
                      We will never post without your permission
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p className="text-sm">
                      We will never share your data with third parties
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p className="text-sm">
                      You can unlink your social account at any time
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
