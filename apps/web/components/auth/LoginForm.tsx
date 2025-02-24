import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthButton from "./AuthButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon, MessageCircle } from "lucide-react";
import { PasswordToggle } from "./TogglePassword";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";

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
      toast.error(error.message);
      console.log("Login error:", error.message);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>MsgMate</CardTitle>
        <CardDescription className="flex gap-2">
          Chat with fun.{" "}
          <span>
            <MessageCircle className="h-4 w-4" />
          </span>
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-2">
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
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="button"
              className="w-full"
              onClick={showSignUp}
              variant={"outline"}
            >
              Dont have an account? Sign Up
            </Button>
            <Button
              type="submit"
              className="w-full"
              variant={"default"}
              disabled={isLoading}
            >
              {isLoading ? <LoaderIcon className="animate-spin" /> : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
