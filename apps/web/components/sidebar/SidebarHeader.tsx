import {
  Bookmark,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  User2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type ViewType =
  | "main"
  | "search"
  | "new_message"
  | "new_group"
  | "new_channel"
  | "setting";
interface SidebarHeaderProps {
  view: ViewType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewChange: (view: ViewType) => void;
}

export default function SidebarHeader({
  view,
  searchQuery,
  onSearchChange,
  onViewChange,
}: SidebarHeaderProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout !");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleThemeToggle = () => {
    setTheme(() => (theme === "dark" ? "light" : "dark"));
  };
  return (
    <div className="relative h-16 flex items-center px-4 border-b gap-3">
      {view === "main" && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <User2Icon size={16} strokeWidth={2} />
                  <p>{user?.username || "user"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex gap-4 items-center text-muted-foreground">
                  <Bookmark size={16} strokeWidth={2} />
                  <p>Saved Message</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex gap-4 items-center">
                  <User
                    size={16}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <p className="text-muted-foreground">Contact</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("setting")}>
                <div className="flex gap-4 items-center">
                  <Settings
                    size={16}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <p className="text-muted-foreground">Settings</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleThemeToggle}>
                <div className="flex gap-4 items-center">
                  {theme === "light" ? (
                    <Moon
                      size={16}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                  ) : (
                    <Sun
                      size={16}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                  )}

                  <p className="text-muted-foreground">App Theme</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <div className="flex gap-4 items-center">
                  <LogOut
                    size={16}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <p className="text-muted-foreground">Logout</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search chats"
              className="pl-12 py-5 text-base rounded-full bg-background"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
