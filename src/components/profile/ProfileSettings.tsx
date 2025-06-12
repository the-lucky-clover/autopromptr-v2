
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ProfileSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start">
          Change Password
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Notification Preferences
        </Button>
        <Button variant="outline" className="w-full justify-start">
          API Credentials
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Export Data
        </Button>
        <Separator />
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};
