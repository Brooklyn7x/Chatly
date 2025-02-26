import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserAvatar } from "../shared/UserAvatar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { userApi } from "@/services/api/users";

const Setting = ({ onClose }: { onClose: () => void }) => {
  const { user, updateUser } = useAuthStore();
  const [data, setData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.profilePicture || "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const payload: Record<string, any> = {};

    if (data.name !== user?.name) payload.name = data.name;
    if (data.username !== user?.username) payload.username = data.username;
    if (data.email !== user?.email) payload.email = data.email;
    if (profileImage) payload.profilePicture = profileImage;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes made.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = await userApi.updateUserData(payload);
      updateUser(updatedData.data);
      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      const message = error.response.data.error;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh p-4 space-y-6 bg-secondary/30">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-center font-semibold">Settings</h2>
        <Button
          variant="ghost"
          size={"icon"}
          onClick={onClose}
          className="rounded-full border"
        >
          ✕
        </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-4">
              <UserAvatar size="xl" url={previewImage || data.avatar} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="text-sm text-blue-500 cursor-pointer"
              >
                Change profile picture
              </label>
            </div>

            <div className="space-y-2">
              <label>Name</label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Name"
              />
            </div>

            <div className="space-y-2">
              <label>Username</label>
              <Input
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                placeholder="Username"
              />
            </div>

            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email"
              />
            </div>

            <div className="space-y-2">
              <label>Password</label>
              <Input
                type="password"
                value={""}
                onChange={() => {}}
                placeholder="Password"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : ""}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;
