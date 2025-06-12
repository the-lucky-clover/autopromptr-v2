
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ApiKeyManagement } from "./ApiKeyManagement";
import { UsageDashboard } from "@/components/subscription/UsageDashboard";
import { Settings, Key, BarChart3, CreditCard } from "lucide-react";

const DashboardSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Usage & Billing
          </TabsTrigger>
          <TabsTrigger value="ai-features" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageDashboard />
        </TabsContent>

        <TabsContent value="ai-features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Features & API Keys</CardTitle>
              <CardDescription>
                Manage your AI optimization settings and API keys for various providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage your subscription, billing, and plan details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Subscription management will be available here.
                </p>
                <p className="text-sm text-gray-500">
                  View billing history, change plans, and manage payment methods.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
