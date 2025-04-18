import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SettingProps {
  onClose: () => void;
}

const Setting = ({ onClose }: SettingProps) => {
  const router = useRouter();
  const { user, logout, loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username);
  const [status, setStatus] = useState(user?.status);
  const [bio, setBio] = useState("Just a simple bio.");
  const [theme, setTheme] = useState("light");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast.success("Account deleted successfully");
    }
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setIsEditing(false);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col md:p-2">
      <div className="flex flex-col p-6 bg-card rounded-lg shadow-lg h-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button
            variant="ghost"
            size={"icon"}
            onClick={onClose}
            className="rounded-full border"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Input
              value={status}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "online" || value === "offline") {
                  setStatus(value);
                }
              }}
              disabled={!isEditing}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>

          <div>
            {/* <div className="flex gap-4">
              <Button onClick={() => handleThemeChange("light")}>Light</Button>
            </div> */}
          </div>

          <div>
            <div className="grid gap-2 w-full">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg"
              >
                Delete Account
              </Button>
              <Button variant="outline" onClick={handleLogout} disabled={loading}>
               {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
