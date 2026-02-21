import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Label } from "@/app/components/ui/Label/label";
import { Switch } from "@/app/components/ui/Switch/switch";
import { useAppConfig } from "@/appConfig/useAppConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Separator } from "@/app/components/ui/Separator/separator";
import { toast } from "sonner";
import { Bell, Lock, Palette, Eye, Zap, Database } from "lucide-react";

export function SettingsPage() {
  const { text, language } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const settingsText = text?.settingsPage || {};
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
    language: language || "en",

    // API Settings
    apiAccess: true,
    regenerateApiKey: false,
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, language: language || "en" }));
  }, [language]);

  const handleChange = (field, value) => {
    if (field === "language") {
      const selectedLanguage = value === "ge" ? "ge" : "en";
      const segments = location.pathname.split("/").filter(Boolean);
      const currentPathWithoutLanguage = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";
      const targetPath = `/${selectedLanguage}${currentPathWithoutLanguage}${location.search}${location.hash}`;

      setSettings((prev) => ({ ...prev, language: selectedLanguage }));

      if (selectedLanguage !== language) {
        navigate(targetPath, { replace: true });
      }

      return;
    }

    setSettings((prev) => ({ ...prev, [field]: value }));
    toast.success(settingsText?.toasts?.settingUpdated || "Setting updated");
  };

  const handleSave = () => {
    toast.success(settingsText?.toasts?.saveSuccess || "All settings saved successfully");
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{settingsText?.header?.title || "Settings"}</h1>
        <p className="text-muted-foreground">{settingsText?.header?.subtitle || "Manage your account preferences and settings"}</p>
      </div>

      {/* Account Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{settingsText?.sections?.account || "Account Settings"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{settingsText?.fields?.firstName || "First Name"}</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder={settingsText?.placeholders?.firstName || "First name"}
              />
            </div>
            <div>
              <Label htmlFor="lastName">{settingsText?.fields?.lastName || "Last Name"}</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder={settingsText?.placeholders?.lastName || "Last name"}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{settingsText?.fields?.emailAddress || "Email Address"}</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={settingsText?.placeholders?.emailAddress || "Email address"}
            />
          </div>

          <div>
            <Label htmlFor="phone">{settingsText?.fields?.phoneNumber || "Phone Number"}</Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={settingsText?.placeholders?.phoneNumber || "Phone number"}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>{settingsText?.buttons?.saveAccount || "Save Account Settings"}</Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{settingsText?.sections?.notifications || "Notification Settings"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.notifications?.email?.title || "Email Notifications"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.notifications?.email?.description || "Receive email updates about your account"}</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleChange("emailNotifications", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.notifications?.jobComplete?.title || "Job Completion Alerts"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.notifications?.jobComplete?.description || "Get notified when generation jobs complete"}</p>
            </div>
            <Switch
              checked={settings.notifyOnJobComplete}
              onCheckedChange={(value) => handleChange("notifyOnJobComplete", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.notifications?.jobFailed?.title || "Job Failure Alerts"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.notifications?.jobFailed?.description || "Get notified when generation jobs fail"}</p>
            </div>
            <Switch
              checked={settings.notifyOnJobFailed}
              onCheckedChange={(value) => handleChange("notifyOnJobFailed", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.notifications?.weeklyReport?.title || "Weekly Reports"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.notifications?.weeklyReport?.description || "Receive weekly usage and analytics reports"}</p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(value) => handleChange("weeklyReport", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.notifications?.promotional?.title || "Promotional Emails"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.notifications?.promotional?.description || "Receive news about new features and promotions"}</p>
            </div>
            <Switch
              checked={settings.promotionalEmails}
              onCheckedChange={(value) => handleChange("promotionalEmails", value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>{settingsText?.buttons?.saveNotifications || "Save Notification Settings"}</Button>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{settingsText?.sections?.privacy || "Privacy & Security"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">{settingsText?.fields?.profileVisibility || "Profile Visibility"}</Label>
            <Select value={settings.profileVisibility} onValueChange={(value) => handleChange("profileVisibility", value)}>
              <SelectTrigger id="profileVisibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">{settingsText?.privacy?.options?.private || "Private (Only you can see)"}</SelectItem>
                <SelectItem value="friends">{settingsText?.privacy?.options?.friends || "Friends Only"}</SelectItem>
                <SelectItem value="public">{settingsText?.privacy?.options?.public || "Public"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.privacy?.dataCollectionTitle || "Data Collection"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.privacy?.dataCollectionDescription || "Allow usage data collection to improve the platform"}</p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(value) => handleChange("dataCollection", value)}
            />
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline">{settingsText?.buttons?.changePassword || "Change Password"}</Button>
            <Button variant="outline">{settingsText?.buttons?.twoFactor || "Two-Factor Authentication"}</Button>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{settingsText?.sections?.display || "Display Settings"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">{settingsText?.fields?.theme || "Theme"}</Label>
            <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{settingsText?.display?.themeOptions?.light || "Light"}</SelectItem>
                <SelectItem value="dark">{settingsText?.display?.themeOptions?.dark || "Dark"}</SelectItem>
                <SelectItem value="auto">{settingsText?.display?.themeOptions?.auto || "Auto (System preference)"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">{settingsText?.fields?.language || "Language"}</Label>
            <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{settingsText?.display?.languageOptions?.en || "English"}</SelectItem>
                <SelectItem value="ge">{settingsText?.display?.languageOptions?.ge || "German"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>{settingsText?.buttons?.saveDisplay || "Save Display Settings"}</Button>
          </div>
        </div>
      </Card>

      {/* API Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{settingsText?.sections?.api || "API & Integration"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{settingsText?.api?.accessTitle || "API Access"}</Label>
              <p className="text-sm text-muted-foreground">{settingsText?.api?.accessDescription || "Enable API access for programmatic usage"}</p>
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
            <Button variant="outline">{settingsText?.buttons?.regenerateApiKey || "Regenerate API Key"}</Button>
            <Button variant="outline" className="ml-2">
              {settingsText?.buttons?.viewDocumentation || "View Documentation"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">{settingsText?.sections?.danger || "Danger Zone"}</h2>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {settingsText?.danger?.description || "These actions are permanent and cannot be undone. Please proceed with caution."}
            </p>
          </div>

          <div className="space-y-2">
            <Button variant="outline">{settingsText?.buttons?.downloadData || "Download My Data"}</Button>
            <Button variant="destructive">{settingsText?.buttons?.deleteAccount || "Delete My Account"}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
