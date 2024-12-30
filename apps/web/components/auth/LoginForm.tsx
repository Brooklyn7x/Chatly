"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import AuthButton from "./AuthButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, LoaderIcon } from "lucide-react";

interface LoginFormProps {
  showSignUp: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export const PasswordToggle = ({
  showPassword,
  togglePassword,
}: {
  showPassword: boolean;
  togglePassword: () => void;
}) => (
  <button
    onClick={togglePassword}
    className="absolute top-1/2 right-2 transform -translate-y-1/2 transition-all"
  >
    <span className="text-muted-foreground">
      {showPassword ? (
        <EyeClosed className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </span>
  </button>
);

export default function LoginForm({ showSignUp }: LoginFormProps) {
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
        <h1 className="text-center text-2xl font-bold">Sign in to Chat-app</h1>
        <span className="max-w-[300px] mx-auto text-center text-sm">
          Please confirm to your country code and enter your phone number
        </span>
        <div className="space-y-2 mt-10">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="h-12"
            value={data.email}
            onChange={handleChange}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="h-12"
              value={data.password}
              onChange={handleChange}
            />
            <PasswordToggle
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
        <Button type="submit" className="mt-5 h-12">
          {isLoading ? <LoaderIcon className="animate-spin" /> : "Login"}
        </Button>
        <AuthButton onClick={showSignUp} label="Sign up" className="mt-2" />
      </form>
    </div>
  );
}
