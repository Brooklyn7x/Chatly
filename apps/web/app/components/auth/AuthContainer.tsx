"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import QrForm from "./QrForm";

export default function AuthContainer() {
  const [step, setStep] = useState(0);
  const [showQr, setShowQr] = useState(false);

  return (
    <div className="min-h-dvh flex items-center justify-center ">
      {showQr ? (
        <QrForm showLogin={() => setShowQr(false)} />
      ) : (
        <LoginForm showQr={() => setShowQr(true)} />
      )}
    </div>
  );
}
