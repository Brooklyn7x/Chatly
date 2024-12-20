"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthContainer() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-dvh flex items-center justify-center ">
      {showSignUp ? (
        <SignUpForm showLogin={() => setShowSignUp(false)} />
      ) : (
        <LoginForm showSignUp={() => setShowSignUp(true)} />
      )}
    </div>
  );
}
