
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Crown } from "lucide-react";

interface ProfileInfoProps {
  profile: any;
  user: any;
  onUpdateProfile: (updates: { display_name?: string; email?: string }) => void;
  isUpdating: boolean;
}

export const ProfileInfo = ({ profile, user, onUpdateProfile, isUpdating }: ProfileInfoProps) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdateProfile = () => {
    onUpdateProfile({
      display_name: displayName,
      email: email,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile?.display_name || "User"}</h3>
            <p className="text-gray-600">{user?.email}</p>
            <Badge variant="outline" className="mt-1">
              <Crown className="w-3 h-3 mr-1" />
              {profile?.subscription_plan || "Free"} Plan
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={profile?.display_name || "Enter your display name"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user?.email || "Enter your email"}
            />
          </div>
        </div>

        <Button 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};
