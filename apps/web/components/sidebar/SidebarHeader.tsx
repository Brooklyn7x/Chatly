import dynamic from "next/dynamic";
import {
  Bookmark,
  LogOut,
  LucideIcon,
  Menu,
  Palette,
  Settings,
  User,
  User2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { SearchInput } from "./SearchInput";
import useAuthStore from "@/store/useAuthStore";
import { ViewType } from "@/types";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenu),
  { ssr: false }
);
const DropdownMenuContent = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuContent
    ),
  { ssr: false }
);
const DropdownMenuItem = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuItem),
  { ssr: false }
);
const DropdownMenuLabel = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuLabel
    ),
  { ssr: false }
);
const DropdownMenuSeparator = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuSeparator
    ),
  { ssr: false }
);
const DropdownMenuTrigger = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuTrigger
    ),
  { ssr: false }
);

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
  const router = useRouter();

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push("/login");
  };

  const MENU_ITEMS = [
    {
      icon: Bookmark,
      label: "Saved Message",
      onClick: null,
    },
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
      icon: Palette,
      label: "Theme Settings",
      onClick: (onViewChange: (view: ViewType) => void) =>
        onViewChange("theme_setting"),
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
              <DropdownMenuContent className="w-56" align="start">
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
      <div className="flex items-center gap-4 text-muted-foreground">
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
      <div className="flex gap-4 items-center text-muted-foreground">
        <Icon size={16} strokeWidth={2} />
        <p>{label}</p>
      </div>
    </DropdownMenuItem>
  );
}
