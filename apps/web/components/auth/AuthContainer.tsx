"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthContainer() {
  const [showSignUp, setShowSignUp] = useState(false);
  const toggleForm = () => setShowSignUp((prev) => !prev);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      {showSignUp ? (
        <SignUpForm showLogin={toggleForm} />
      ) : (
        <LoginForm showSignUp={toggleForm} />
      )}
    </div>
  );
}
