"use client";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { LogOut, Settings, User, X } from "lucide-react";
import { toast } from "sonner";
import AppSettings from "../settings/AppSettings";
import ProfileSettingsModal from "../settings/ProfileSettingsModal";

interface SettingProps {
  onClose: () => void;
}

const Setting = ({ onClose }: SettingProps) => {
  const { user, logout, isLoading, openModal, closeModal, modals } =
    useAppStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleClose = () => {
    closeModal("settings");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user?.username}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12"
          onClick={() => openModal("profileSettings")}
        >
          <User className="h-5 w-5" />
          Profile Settings
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12"
          onClick={() => openModal("appSettings")}
        >
          <Settings className="h-5 w-5" />
          App Settings
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="h-5 w-5" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* Bottom close button */}
      <div className="pt-4 border-t mt-6">
        <Button variant="outline" className="w-full" onClick={handleClose}>
          Close Settings
        </Button>
      </div>

      {modals.profileSettings && <ProfileSettingsModal />}
      {modals.appSettings && <AppSettings />}
    </div>
  );
};

export default Setting;
