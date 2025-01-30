import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import {
  GroupIcon,
  ContactIcon,
  BookmarkIcon,
  SettingsIcon,
} from "lucide-react";
import { MenuItem } from "../shared/MenuItem";
import { UserAvatar } from "../user/UserAvatar";

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SlideMenu = ({ open, onClose }: SlideMenuProps) => {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-overlay transition-opacity",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-[280px] h-full bg-background transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Profile Section */}
        <div className="p-4 border-b border-divider">
          <div className="flex items-center">
            <UserAvatar />
            <div className="ml-3">
              <h3 className="font-medium">{user?.displayName}</h3>
              <p className="text-sm text-secondary">
                {user?.phoneNumber || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <MenuItem icon={GroupIcon} label="New Group" onClick={() => {}} />
          <MenuItem icon={ContactIcon} label="Contacts" onClick={() => {}} />
          {/* <MenuItem icon={CallIcon} label="Calls" onClick={() => {}} /> */}
          <MenuItem
            icon={BookmarkIcon}
            label="Saved Messages"
            onClick={() => {}}
          />
          <MenuItem icon={SettingsIcon} label="Settings" onClick={() => {}} />
        </div>

        {/* Bottom Section */}
        {/* <div className="absolute bottom-0 w-full p-4 border-t border-divider">
          <MenuItem
            icon={InviteIcon}
            label="Invite Friends"
            onClick={() => {}}
          />
          <MenuItem
            icon={HelpIcon}
            label="Telegram Features"
            onClick={() => {}}
          />
        </div> */}
      </div>
    </div>
  );
};

export default SlideMenu;
