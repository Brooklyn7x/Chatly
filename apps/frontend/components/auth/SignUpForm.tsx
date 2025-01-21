import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useAuthStore from "@/store/useAuthStore";
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

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid address"),
  password: z
    .string()
    .min(1, "Password is require")
    .min(8, "Password must be at least 8 characters"),
});

interface SignUpFormProps {
  showLogin: () => void;
}

type signUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = ({ showLogin }: SignUpFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuthStore();

  const form = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: signUpFormValues) => {
    try {
      await register(data.email, data.password, data.username);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-2"
        >
          <h1 className="text-center text-2xl font-bold">Signup to Chat-app</h1>

          <FormField
            control={form.control}
            name="username"
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

export default SignUpForm;
