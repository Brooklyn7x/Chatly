"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./RegisterForm";

export default function AuthContainer() {
  const [showSignUp, setShowSignUp] = useState(false);
  const toggleForm = () => setShowSignUp((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center p-2">
      {showSignUp ? (
        <SignUpForm showLogin={toggleForm} />
      ) : (
        <LoginForm showSignUp={toggleForm} />
      )}
    </div>
  );
}
