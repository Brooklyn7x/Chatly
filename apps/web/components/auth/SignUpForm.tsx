import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthButton from "./AuthButton";
import useAuthStore from "@/store/auth-store";
import { useRouter } from "next/navigation";

interface SignUpFormProps {
  showLogin: () => void;
}

export default function SignUpForm({ showLogin }: SignUpFormProps) {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { register } = useAuthStore();
  const handleSubmit = async () => {
    try {
      await register(data.email, data.password, data.username);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 overflow-hidden">
      <div className="flex flex-col p-2">
        <h1 className="text-center text-2xl font-bold">Signup to Chat-app</h1>

        <div className="space-y-2 mt-10">
          <Input
            type="text"
            placeholder="Username"
            className="h-12"
            value={data.username}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <Input
            type="email"
            placeholder="Email"
            className="h-12"
            value={data.email}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <Input
            type="password"
            placeholder="Password"
            className="h-12"
            value={data.password}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>

        <Button className="mt-5 h-12" onClick={handleSubmit}>
          SIGN UP
        </Button>

        <AuthButton
          onClick={() => showLogin()}
          label="LOGIN"
          className="mt-2"
        />
      </div>
    </div>
  );
}
