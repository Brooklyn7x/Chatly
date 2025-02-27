"use client";
import { useState, useEffect } from "react";

export function TestComponent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if(isLoading){
    return <p>Loading</p>
  }

  return <p className="p-5">Test Content</p>;
}
