import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthButton from "./AuthButton";
import Image from "next/image";
import { Edit2 } from "lucide-react";

interface LoginFormProps {
  showQr: () => void;
}

export default function LoginForm({ showQr }: LoginFormProps) {
  const [step, setStep] = useState<"step1" | "step2">("step1");
  const handleNext = () => {
    setStep("step2");
  };

  const handlePrev = () => {
    setStep("step1");
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto p-4">
      {step === "step1" && (
        <div className="flex flex-col p-2">
          <h1 className="text-center text-2xl font-bold">
            Sign in to Chat-app
          </h1>
          <span className="max-w-[300px] mx-auto text-center text-sm">
            Please confirm to your country code and enter your phone number
          </span>

          <div className="mt-10">
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Input type="email" placeholder="Phone" className="h-12" />
          </div>

          <Button className="mt-5 h-12" onClick={handleNext}>
            Next
          </Button>
          <AuthButton
            onClick={() => showQr()}
            label="LOGIN BY QR CODE"
            className="mt-2"
          />
        </div>
      )}
      {step === "step2" && (
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
      )}
    </div>
  );
}
