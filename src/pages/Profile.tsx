
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, BarChart3, Zap } from "lucide-react";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { UsageStats } from "@/components/profile/UsageStats";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { parseUsageLimits, parseCurrentUsage } from "@/utils/usageUtils";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user usage for current month
  const { data: usage } = useQuery({
    queryKey: ["user-usage", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", new Date().toISOString().split("T")[0])
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data || { api_calls: 0, executions_count: 0, tokens_used: 0 };
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { display_name?: string; email?: string }) => {
      if (!user?.id) throw new Error("No user");
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = (updates: { display_name?: string; email?: string }) => {
    updateProfileMutation.mutate(updates);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const usageLimits = parseUsageLimits(profile?.usage_limits);
  const currentUsage = parseCurrentUsage(usage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AutoPromptr Profile</h1>
          </div>
          <p className="text-gray-600">Manage your account settings and monitor your usage</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileInfo 
              profile={profile}
              user={user}
              onUpdateProfile={handleUpdateProfile}
              isUpdating={updateProfileMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <UsageStats 
              usageLimits={usageLimits}
              currentUsage={currentUsage}
              profile={profile}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
