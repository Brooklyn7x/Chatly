import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useUserStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AuthButton from "./AuthButton";
import { Eye, EyeClosed } from "lucide-react";
import { PasswordToggle } from "./LoginForm";

interface SignUpFormProps {
  showLogin: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUpForm = ({ showLogin }: SignUpFormProps) => {
  const [data, setData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register } = useAuthStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(data.email, data.password, data.username);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 overflow-hidden">
      <form onSubmit={handleSubmit} className="flex flex-col p-2">
        <h1 className="text-center text-2xl font-bold">Signup to Chat-app</h1>
        <div className="space-y-2 mt-10">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            className="h-12"
            value={data.username}
            onChange={handleChange}
          />
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
        </div>
        <Button type="submit" className="mt-5 h-12">
          Sign up
        </Button>
        <AuthButton onClick={showLogin} label="Sign in" className="mt-2" />
      </form>
    </div>
  );
};

export default SignUpForm;
