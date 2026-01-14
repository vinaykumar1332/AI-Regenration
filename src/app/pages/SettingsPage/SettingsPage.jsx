import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Label } from "@/app/components/ui/Label/label";
import { Switch } from "@/app/components/ui/Switch/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Separator } from "@/app/components/ui/Separator/separator";
import { toast } from "sonner";
import { Bell, Lock, Palette, Eye, Zap, Database } from "lucide-react";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    // Account Settings
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",

    // Notification Settings
    emailNotifications: true,
    notifyOnJobComplete: true,
    notifyOnJobFailed: true,
    weeklyReport: true,
    promotionalEmails: false,

    // Privacy Settings
    profileVisibility: "private",
    dataCollection: false,

    // Display Settings
    theme: "dark",
    language: "en",

    // API Settings
    apiAccess: true,
    regenerateApiKey: false,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    toast.success("Setting updated");
  };

  const handleSave = () => {
    toast.success("All settings saved successfully");
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      {/* Account Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Account Settings</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email address"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Phone number"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save Account Settings</Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleChange("emailNotifications", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Job Completion Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when generation jobs complete</p>
            </div>
            <Switch
              checked={settings.notifyOnJobComplete}
              onCheckedChange={(value) => handleChange("notifyOnJobComplete", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Job Failure Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when generation jobs fail</p>
            </div>
            <Switch
              checked={settings.notifyOnJobFailed}
              onCheckedChange={(value) => handleChange("notifyOnJobFailed", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly usage and analytics reports</p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(value) => handleChange("weeklyReport", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Promotional Emails</Label>
              <p className="text-sm text-muted-foreground">Receive news about new features and promotions</p>
            </div>
            <Switch
              checked={settings.promotionalEmails}
              onCheckedChange={(value) => handleChange("promotionalEmails", value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save Notification Settings</Button>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select value={settings.profileVisibility} onValueChange={(value) => handleChange("profileVisibility", value)}>
              <SelectTrigger id="profileVisibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Only you can see)</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Data Collection</Label>
              <p className="text-sm text-muted-foreground">Allow usage data collection to improve the platform</p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(value) => handleChange("dataCollection", value)}
            />
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Two-Factor Authentication</Button>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Display Settings</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System preference)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save Display Settings</Button>
          </div>
        </div>
      </Card>

      {/* API Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5" />
          <h2 className="text-xl font-semibold">API & Integration</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">API Access</Label>
              <p className="text-sm text-muted-foreground">Enable API access for programmatic usage</p>
            </div>
            <Switch
              checked={settings.apiAccess}
              onCheckedChange={(value) => handleChange("apiAccess", value)}
            />
          </div>

          {settings.apiAccess && (
            <>
              <Separator />
              <div className="bg-muted p-3 rounded-md font-mono text-sm text-muted-foreground overflow-x-auto">
                sk_live_abc123def456ghi789jkl
              </div>
            </>
          )}

          <div className="pt-4">
            <Button variant="outline">Regenerate API Key</Button>
            <Button variant="outline" className="ml-2">
              View Documentation
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              These actions are permanent and cannot be undone. Please proceed with caution.
            </p>
          </div>

          <div className="space-y-2">
            <Button variant="outline">Download My Data</Button>
            <Button variant="destructive">Delete My Account</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
