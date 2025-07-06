"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Camera,
  Save,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useAppStore } from "@/store/useAppStore";
import { updateProfile } from "@/services/userService";

// Form validation schema
const profileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address"),
    bio: z.string().max(150, "Bio must be less than 150 characters").optional(),
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettingsModal = () => {
  const { user, modals, closeModal } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedNewPassword = watch("newPassword");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById(
      "profile-picture"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (data.bio) formData.append("bio", data.bio);
      if (data.currentPassword)
        formData.append("currentPassword", data.currentPassword);
      if (data.newPassword) formData.append("newPassword", data.newPassword);
      if (selectedFile) formData.append("profilePicture", selectedFile);

      const response = await updateProfile(formData);

      if (response.success) {
        toast.success("Profile updated successfully");
        closeModal("profileSettings");
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        closeModal("profileSettings");
      }
    } else {
      closeModal("profileSettings");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    reset();
  };

  // Don't render if modal is not open
  if (!modals.profileSettings) return null;

  return (
    <div className="absolute inset-0 z-50">
      <div onClick={handleClose} className="absolute inset-0 bg-card" />
      <div className="relative h-full w-full flex flex-col p-4 rounded-lg">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
            title="Back"
            onClick={() => {
              handleClose();
              resetForm();
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h2 className="text-2xl font-semibold">Profile Settings</h2>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
            title="Close"
            onClick={() => {
              handleClose();
              resetForm();
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <UserAvatar
                    user={user}
                    size="xl"
                    className="h-20 w-20"
                    src={previewUrl || user?.profilePicture}
                  />
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a new profile picture
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("profile-picture")?.click()
                      }
                    >
                      Choose File
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    {...register("username")}
                    className="pl-10"
                    placeholder="Enter username"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="pl-10"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    {...register("currentPassword")}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    {...register("newPassword")}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {watchedNewPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !isDirty}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ProfileSettingsModal;
