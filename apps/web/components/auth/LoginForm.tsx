import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthButton from "./AuthButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { PasswordToggle } from "./TogglePassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginInput } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/useAuthStore";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid address"),
  password: z
    .string()
    .min(1, "Password is require")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  showSignUp: () => void;
}

export default function LoginForm({ showSignUp }: LoginFormProps) {
  const { login } = useAuth();
  const { isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 sm:border rounded-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-2"
        >
          <h1 className="text-center text-2xl font-bold">
            Sign in to Chat-app
          </h1>
          <p className="max-w-[300px] mx-auto text-center text-sm">
            Please confirm to your country code and enter your phone number
          </p>

          <div className="space-y-2 mt-10">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      className="h-12"
                      {...field}
                    />
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
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="h-12"
                        {...field}
                      />
                      <PasswordToggle
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm text-red-500 text-center">
                {error.message}
              </p>
            )}
          </div>
          <Button type="submit" className="mt-5 h-12" disabled={isLoading}>
            {isLoading ? <LoaderIcon className="animate-spin" /> : "Login"}
          </Button>
          <div className="flex flex-col mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <AuthButton onClick={showSignUp} label="Sign up" className="mt-2" />
          </div>
        </form>
      </Form>
    </div>
  );
}
