"use client";
import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserAvatar } from "../shared/UserAvatar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { userApi } from "@/services/api/users";

import { X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUploadThing } from "@/utils/uploathings";
import { UploadProgressIndicator } from "../shared/UpladingIndicator";

const Setting = ({ onClose }: { onClose: () => void }) => {
  const { user, updateUser, accessToken } = useAuthStore();
  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.profilePicture || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("profilePicture", {
    onClientUploadComplete: (res) => {
      if (res && res[0]?.url) {
        setPreviewImage(res[0].url);
        form.setValue("avatar", res[0].url, { shouldDirty: true });
        toast.success("Profile picture uploaded successfully");
      }
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onUploadError: (error) => {
      toast.error("Failed to upload profile picture");
      setUploadProgress(0);
    },
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await startUpload([file]);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const payload: Record<string, any> = {};

    if (data.name !== user?.name) payload.name = data.name;
    if (data.username !== user?.username) payload.username = data.username;
    if (data.email !== user?.email) payload.email = data.email;
    if (data.avatar !== user?.profilePicture)
      payload.profilePicture = data.avatar;

    if (data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }

    setIsLoading(true);
    try {
      const updatedData = await userApi.updateUserData(payload);
      updateUser(updatedData.data);
      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to update profile";
      toast.error(message);
      if (payload.profilePicture) {
        setPreviewImage(user?.profilePicture || "");
      }
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="relative overflow-hidden">
                  <UserAvatar
                    size="xl"
                    className="object-cover"
                    url={previewImage || form.watch("avatar")}
                  />
                  {isUploading && (
                    <UploadProgressIndicator progress={uploadProgress} />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className={cn(
                    "text-sm text-blue-500 cursor-pointer bg-transparent border-none p-0",
                    previewImage && "text-green-500"
                  )}
                >
                  {previewImage ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Uploaded!</span>
                    </div>
                  ) : (
                    <span>Change profile picture</span>
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Change Password</h3>

                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Current Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="New Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Confirm New Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                  className={isLoading ? "opacity-70" : ""}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;
