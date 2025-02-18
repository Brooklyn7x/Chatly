import { cn } from "@/lib/utils";
import { User, Bookmark, Settings, Moon, LogOut } from "lucide-react";
import { MenuItem } from "../shared/MenuItem";
import useAuthStore from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const SidebarMenu = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.75, opacity: 0, y: -2 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{ scale: 0.75, opacity: 0, y: -2 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "absolute top-14 left-2 w-56 rounded-md z-20 shadow-md bg-background/70 border backdrop-blur-sm origin-top-left"
      )}
    >
      <div className="p-1 space-y-1">
        <div className="flex items-center gap-4 px-4 p-1.5 border-b">
          <User className="h-5 w-5" />
          <span className="font-medium">{user?.username || "user"}</span>
        </div>

        <MenuItem icon={Bookmark} onClick={() => {}} label="Saved Messages" />
        <MenuItem icon={User} onClick={() => {}} label="Contact" />
        <MenuItem icon={Settings} onClick={() => {}} label="Settings" />
        <MenuItem
          icon={Moon}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          label="Dark Mode"
        />
        <MenuItem icon={LogOut} onClick={handleLogout} label="Logout" />
      </div>
    </motion.div>
  );
};

export default SidebarMenu;
