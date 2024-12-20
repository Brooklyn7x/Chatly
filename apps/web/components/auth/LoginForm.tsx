import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth-store";
import AuthButton from "./AuthButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  showSignUp: () => void;
}

export default function LoginForm({ showSignUp }: LoginFormProps) {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { login } = useAuthStore();
  const handleSubmit = async () => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4">
      <div className="flex flex-col gap-2 p-2">
        <h1 className="text-center text-2xl font-bold">Sign in to Chat-app</h1>
        <span className="max-w-[300px] mx-auto text-center text-sm">
          Please confirm to your country code and enter your phone number
        </span>

        <div className="space-y-2 mt-10">
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
          LOGIN
        </Button>
        <AuthButton
          onClick={() => showSignUp()}
          label="SIGN UP"
          className="mt-2"
        />
      </div>

      {/* {step === "step2" && (
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src="/user.png"
              alt="user"
              className="object-cover"
              fill
              sizes="128px"
              priority
            />
          </div>
          <div className="flex items-center gap-4 mt-10">
            <span className="text-3xl font-bold">+12345670 </span>
            <button className="hover:text-muted-foreground transition-colors">
              <Edit2 className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2 text-muted-foreground">
            We have sent you a message code
          </p>

          <Input type="email" placeholder="Code" className="h-12 mt-10" />
          <Button
            className="w-full mt-2"
            variant={"outline"}
            onClick={handlePrev}
          >
            Back
          </Button>
        </div>
      )} */}
    </div>
  );
}
