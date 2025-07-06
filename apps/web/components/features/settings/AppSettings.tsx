"use client";

import { useState } from "react";
import {
  ArrowLeft,
  X,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Globe,
  Palette,
  MessageSquare,
  Clock,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

const AppSettings = () => {
  const { closeModal } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // App Settings State
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    messageNotifications: true,
    groupNotifications: true,
    soundNotifications: true,
    vibrationNotifications: false,

    // Privacy & Security
    readReceipts: true,
    typingIndicators: true,
    onlineStatus: true,
    lastSeen: true,
    profileVisibility: true,

    // Appearance
    darkMode: false,
    compactMode: false,
    largeText: false,
    highContrast: false,

    // Chat & Messages
    autoSaveMedia: true,
    downloadMedia: true,
    messagePreview: true,
    linkPreview: true,

    // Performance
    lowDataMode: false,
    backgroundSync: true,
    autoUpdate: true,

    // Accessibility
    screenReader: false,
    reducedMotion: false,
    highContrastText: false,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically save to your backend
      // await saveAppSettings(settings);

      toast.success("Settings saved successfully");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        closeModal("appSettings");
      }
    } else {
      closeModal("appSettings");
    }
  };

  const resetForm = () => {
    setSettings({
      pushNotifications: true,
      messageNotifications: true,
      groupNotifications: true,
      soundNotifications: true,
      vibrationNotifications: false,
      readReceipts: true,
      typingIndicators: true,
      onlineStatus: true,
      lastSeen: true,
      profileVisibility: true,
      darkMode: false,
      compactMode: false,
      largeText: false,
      highContrast: false,
      autoSaveMedia: true,
      downloadMedia: true,
      messagePreview: true,
      linkPreview: true,
      lowDataMode: false,
      backgroundSync: true,
      autoUpdate: true,
      screenReader: false,
      reducedMotion: false,
      highContrastText: false,
    });
    setIsDirty(false);
  };

  const SettingItem = ({
    icon: Icon,
    label,
    description,
    settingKey,
    value,
  }: {
    icon: any;
    label: string;
    description: string;
    settingKey: keyof typeof settings;
    value: boolean;
  }) => (
    <div className="flex items-center justify-between group hover:bg-muted/50 p-3 rounded-md transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Icon size={16} className="text-muted-foreground" />
        <div className="flex-1">
          <Label className="text-sm font-medium cursor-pointer">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        checked={value}
        onCheckedChange={(checked) => handleSettingChange(settingKey, checked)}
      />
    </div>
  );

  return (
    <div className="absolute inset-0">
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

          <h2 className="text-2xl font-semibold">App Settings</h2>

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
        <div className="flex-1 overflow-y-auto mb-4 space-y-6">
          {/* Notifications Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Bell}
                label="Push Notifications"
                description="Receive notifications for new messages"
                settingKey="pushNotifications"
                value={settings.pushNotifications}
              />
              <SettingItem
                icon={MessageSquare}
                label="Message Notifications"
                description="Show notifications for new messages"
                settingKey="messageNotifications"
                value={settings.messageNotifications}
              />
              <SettingItem
                icon={Globe}
                label="Group Notifications"
                description="Receive notifications for group messages"
                settingKey="groupNotifications"
                value={settings.groupNotifications}
              />
              <SettingItem
                icon={Volume2}
                label="Sound Notifications"
                description="Play sound for notifications"
                settingKey="soundNotifications"
                value={settings.soundNotifications}
              />
              <SettingItem
                icon={Smartphone}
                label="Vibration"
                description="Vibrate for notifications"
                settingKey="vibrationNotifications"
                value={settings.vibrationNotifications}
              />
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Eye}
                label="Read Receipts"
                description="Show when messages are read"
                settingKey="readReceipts"
                value={settings.readReceipts}
              />
              <SettingItem
                icon={MessageSquare}
                label="Typing Indicators"
                description="Show when someone is typing"
                settingKey="typingIndicators"
                value={settings.typingIndicators}
              />
              <SettingItem
                icon={Globe}
                label="Online Status"
                description="Show your online status to others"
                settingKey="onlineStatus"
                value={settings.onlineStatus}
              />
              <SettingItem
                icon={Clock}
                label="Last Seen"
                description="Show when you were last online"
                settingKey="lastSeen"
                value={settings.lastSeen}
              />
              <SettingItem
                icon={Eye}
                label="Profile Visibility"
                description="Allow others to see your profile"
                settingKey="profileVisibility"
                value={settings.profileVisibility}
              />
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Moon}
                label="Dark Mode"
                description="Use dark theme"
                settingKey="darkMode"
                value={settings.darkMode}
              />
              <SettingItem
                icon={MessageSquare}
                label="Compact Mode"
                description="Use compact chat layout"
                settingKey="compactMode"
                value={settings.compactMode}
              />
              <SettingItem
                icon={Eye}
                label="Large Text"
                description="Use larger text size"
                settingKey="largeText"
                value={settings.largeText}
              />
              <SettingItem
                icon={Palette}
                label="High Contrast"
                description="Use high contrast colors"
                settingKey="highContrast"
                value={settings.highContrast}
              />
            </div>
          </div>

          {/* Chat & Messages Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat & Messages
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Save}
                label="Auto Save Media"
                description="Automatically save media to gallery"
                settingKey="autoSaveMedia"
                value={settings.autoSaveMedia}
              />
              <SettingItem
                icon={VolumeX}
                label="Download Media"
                description="Allow media downloads"
                settingKey="downloadMedia"
                value={settings.downloadMedia}
              />
              <SettingItem
                icon={Eye}
                label="Message Preview"
                description="Show message preview in notifications"
                settingKey="messagePreview"
                value={settings.messagePreview}
              />
              <SettingItem
                icon={Globe}
                label="Link Preview"
                description="Show preview for links in messages"
                settingKey="linkPreview"
                value={settings.linkPreview}
              />
            </div>
          </div>

          {/* Performance Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Performance
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Globe}
                label="Low Data Mode"
                description="Reduce data usage"
                settingKey="lowDataMode"
                value={settings.lowDataMode}
              />
              <SettingItem
                icon={Clock}
                label="Background Sync"
                description="Sync messages in background"
                settingKey="backgroundSync"
                value={settings.backgroundSync}
              />
              <SettingItem
                icon={Save}
                label="Auto Update"
                description="Automatically update the app"
                settingKey="autoUpdate"
                value={settings.autoUpdate}
              />
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility
            </h3>
            <div className="space-y-1">
              <SettingItem
                icon={Volume2}
                label="Screen Reader"
                description="Enable screen reader support"
                settingKey="screenReader"
                value={settings.screenReader}
              />
              <SettingItem
                icon={Smartphone}
                label="Reduced Motion"
                description="Reduce animations and motion"
                settingKey="reducedMotion"
                value={settings.reducedMotion}
              />
              <SettingItem
                icon={Palette}
                label="High Contrast Text"
                description="Use high contrast text colors"
                settingKey="highContrastText"
                value={settings.highContrastText}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
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
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
 