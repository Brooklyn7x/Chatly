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

interface QrFormProps {
  showLogin: () => void;
}

export default function QrForm({ showLogin }: QrFormProps) {
  return (
    <div className="w-full sm:max-w-sm mx-auto p-4 overflow-hidden">
      <div className="flex flex-col p-2">
        <h1 className="text-center text-2xl font-bold">
          Log in to Chat-app by QR Code
        </h1>

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

        <Button className="mt-5 h-12">Next</Button>
        <AuthButton
          onClick={() => showLogin()}
          label="LOGIN BY PHONE NUMBER"
          className="mt-2"
        />
      </div>
    </div>
  );
}
