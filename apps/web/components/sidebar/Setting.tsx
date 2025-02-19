import useAuthStore from "@/store/useAuthStore";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserAvatar } from "../shared/UserAvatar";
import { UserApi } from "@/services/api/users";
import { toast } from "sonner";

const Setting = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuthStore();
  const [initialData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.profilePicture || "",
  });
  const [data, setData] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    avatar: user?.profilePicture,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};
    Object.keys(data).forEach((key) => {
      const currentValue = data[key as keyof typeof data];
      if (currentValue !== initialData[key as keyof typeof initialData]) {
        payload[key] = currentValue || "";
      }
    });

    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append profile image if changed
      if (profileImage) {
        formData.append("avatar", profileImage);
      }

      const response = await UserApi.updateUserData(formData as any);
      toast.success("Profile updated successfully");
      onClose();
      //update user store with changes
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 space-y-6">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <UserAvatar size="xl" url={data.avatar} />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
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
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
