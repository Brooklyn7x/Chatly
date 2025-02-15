"use client";
import { useRef, useState } from "react";

type AuthType = "phone" | "code" | "password";

export default function AuthContainer() {
  const [step, setStep] = useState<AuthType>("phone");
  const [authData, setAuthData] = useState({
    phone: "",
    code: "",
    password: "",
    twoFactorCode: "",
  });
  // const [showSignUp, setShowSignUp] = useState(false);
  // const toggleForm = () => setShowSignUp((prev) => !prev);

  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <PhoneInput
            value={authData.phone}
            onChange={(phone) => setAuthData({ ...authData, phone })}
            onSubmit={() => setStep("code")}
          />
        );
      case "code":
        return (
          <CodeVerfication
            phone={authData.phone}
            onCodeSubmit={(code) => {
              setAuthData({ ...authData, code });
              setStep("password");
            }}
            onBack={() => setStep("phone")}
          />
        );
      case "password":
        return <PasswordInput />;
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="w-[420px] border rounded-lg p-8">{renderStep()}</div>
    </div>
  );
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const PhoneInput = ({ value, onChange, onSubmit }: PhoneInputProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Sign in to Chat App
        </h1>
        <p className="text-telegram-text-secondary">
          Please confirm your country code and enter your phone number.
        </p>
      </div>

      <div className="space-y-4 mt-5">
        <div className="py-4 py-3">
          <label className="block text-sm text-telegram-text-secondary mb-1">
            Country
          </label>
          <select
            className="w-full bg-telegram-input text-white rounded-lg 
      px-4 py-3"
          >
            {/* Country options */}
          </select>
        </div>

        <div>
          <label className="block text-sm text-telegram-text-secondary mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-telegram-input text-white rounded-lg px-4 py-3"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-telegram-button text-white rounded-lg px-4 py-3
    hover:bg-telegram-button-hover transition-colors"
      >
        Next
      </button>
    </div>
  );
};

interface CodeVerficationProps {
  phone: string;
  onCodeSubmit: (code: string) => void;
  onBack: () => void;
}

const CodeVerfication = ({
  phone,
  onCodeSubmit,
  onBack,
}: CodeVerficationProps) => {
  const [code, setCode] = useState("");
  const inputRefs = Array(5)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = code.split("");
      newCode[index] = value;
      setCode(newCode.join(""));

      // Move to next input
      if (value && index < 4) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Enter Code</h1>
        <p className="text-telegram-text-secondary">
          We've sent a code to {phone}
        </p>
      </div>

      <div className="flex justify-center space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={code[index] || ""}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-12 h-12 text-center bg-telegram-input text-white 
        rounded-lg text-2xl"
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-telegram-text-secondary hover:text-white 
          transition-colors"
        >
          Change Phone Number
        </button>
        <button
          onClick={() => onCodeSubmit(code)}
          disabled={code.length !== 5}
          className="bg-telegram-button text-white rounded-lg px-6 py-2
          hover:bg-telegram-button-hover transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PasswordInput = () => {
  return <div>Password Input</div>;
};
