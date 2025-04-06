import {
  LogOut,
  LucideIcon,
  Menu,
  Settings,
  User,
  User2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { SearchInput } from "./SearchInput";
import useAuthStore from "@/store/useAuthStore";
import { ViewType } from "@/types";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "../ui/dropdown-menu";

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
  const handleLogout = () => {
    logout();
  };
  const MENU_ITEMS = [
    {
      icon: User,
      label: "Contact",
      onClick: (onViewChange: (view: ViewType) => void) =>
        onViewChange("contacts"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: (onViewChange: (view: ViewType) => void) =>
        onViewChange("setting"),
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="relative h-16 flex items-center px-4 border-b gap-3">
      {view === "main" && (
        <>
          <Suspense
            fallback={
              <Button
                variant={"outline"}
                size={"icon"}
                className="h-10 w-10"
                disabled
              >
                <Menu />
              </Button>
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="h-10 w-10">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44" align="start">
                <UserProfile
                  user={user ? { username: user.username } : { username: "" }}
                />
                <DropdownMenuSeparator />
                {MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={
                      item.onClick
                        ? () => item.onClick(onViewChange)
                        : undefined
                    }
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
          <SearchInput value={searchQuery} onChange={onSearchChange} />
        </>
      )}
    </div>
  );
}

function UserProfile({ user }: { user: { username: string } }) {
  return (
    <DropdownMenuLabel>
      <div className="flex items-center px-2 gap-4 text-muted-foreground">
        <User2Icon size={16} strokeWidth={2} />
        <p>{user?.username || "user"}</p>
      </div>
    </DropdownMenuLabel>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <DropdownMenuItem onClick={onClick}>
      <div className="flex gap-4 px-2 items-center text-muted-foreground">
        <Icon size={16} strokeWidth={2} />
        <p>{label}</p>
      </div>
    </DropdownMenuItem>
  );
}
