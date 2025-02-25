"use client";

import { useState } from "react";

import { Moon, Sun, Monitor, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeSelector } from "./ThemeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useTheme } from "../provider/ThemeProvider";

export default function ThemeSettings({ onClose }) {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="p-4 h-full flex flex-col relative">
      <h1 className="text-xl font-bold mb-2">Theme Settings</h1>
      <button className="absolute right-4 top-5" onClick={handleClose}>
        <X />
      </button>
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="font-medium">Mode</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Light</span>
                  </Button>

                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Dark</span>
                  </Button>

                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-6 w-6" />
                    <span>System</span>
                  </Button>
                </div>
              </div>

              <ThemeSelector />

              <div className="flex items-center justify-between">
                <Label htmlFor="animation-mode">Interface animations</Label>
                <Switch id="animation-mode" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion">Reduce motion</Label>
                <Switch id="reduce-motion" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>
                {saved ? "Saved!" : "Save preferences"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your theme selections look with different UI components.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buttons" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                </TabsList>
                <TabsContent value="buttons" className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </TabsContent>
                <TabsContent value="cards" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium">Card Title</h3>
                      <p className="text-sm text-muted-foreground">
                        This is a card example with your current theme.
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="text-sm font-medium">Muted Card</h3>
                      <p className="text-sm text-muted-foreground">
                        This shows the muted variant.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="forms" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <input
                        id="name"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="Enter your name"
                      />
                    </div>
                    <Button className="w-full">Submit</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
