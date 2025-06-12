
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Settings, Key, Bell, Shield, Download, Trash2 } from "lucide-react";

export const DashboardSettings = () => {
  const [notifications, setNotifications] = useState({
    emailOnSuccess: true,
    emailOnFailure: true,
    pushNotifications: false,
    weeklyReports: true
  });

  const [apiSettings, setApiSettings] = useState({
    autoRetry: true,
    maxRetries: 3,
    timeout: 30
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your dashboard preferences and account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified about batch executions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email on Success</p>
                <p className="text-sm text-gray-600">Get notified when batches complete successfully</p>
              </div>
              <Switch
                checked={notifications.emailOnSuccess}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, emailOnSuccess: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email on Failure</p>
                <p className="text-sm text-gray-600">Get notified when batches fail</p>
              </div>
              <Switch
                checked={notifications.emailOnFailure}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, emailOnFailure: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Real-time browser notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-gray-600">Summary of your weekly activity</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure default behavior for prompt executions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Retry</p>
                <p className="text-sm text-gray-600">Automatically retry failed executions</p>
              </div>
              <Switch
                checked={apiSettings.autoRetry}
                onCheckedChange={(checked) => 
                  setApiSettings(prev => ({ ...prev, autoRetry: checked }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Retries</label>
              <Input
                type="number"
                value={apiSettings.maxRetries}
                onChange={(e) => 
                  setApiSettings(prev => ({ ...prev, maxRetries: parseInt(e.target.value) || 0 }))
                }
                min="0"
                max="10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeout (seconds)</label>
              <Input
                type="number"
                value={apiSettings.timeout}
                onChange={(e) => 
                  setApiSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) || 0 }))
                }
                min="5"
                max="300"
              />
            </div>
          </CardContent>
        </Card>

        {/* API Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Credentials
            </CardTitle>
            <CardDescription>
              Manage your API keys for different platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Lovable API</p>
                  <p className="text-sm text-gray-600">••••••••••••••••</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Claude API</p>
                  <p className="text-sm text-gray-600">Not configured</p>
                </div>
                <Button size="sm" variant="outline">Add Key</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">OpenAI API</p>
                  <p className="text-sm text-gray-600">••••••••••••••••</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Key className="w-4 h-4 mr-2" />
              Manage All Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export your data or delete your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Batches Only
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Templates Only
            </Button>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">Danger Zone</p>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-gray-500">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
