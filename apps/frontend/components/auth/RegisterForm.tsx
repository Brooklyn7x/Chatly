import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AuthButton from "./AuthButton";
import { PasswordToggle } from "./TogglePassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { RegisterInput, registerSchema } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth1";

interface SignUpFormProps {
  showLogin: () => void;
}

const RegisterForm = ({ showLogin }: SignUpFormProps) => {
  const { register, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 border rounded-sm overflow-hidden">
      <div className="p-4">
        <h1 className="text-center text-2xl font-bold">Signup to Chat-app</h1>
        <p className="text-center">select anything</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    type="text"
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

          <Button type="submit" className="mt-5 h-12">
            Sign up
          </Button>
          <AuthButton onClick={showLogin} label="Sign in" className="mt-2" />
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
