
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UsageLimits, CurrentUsage } from "@/utils/usageUtils";

interface UsageStatsProps {
  usageLimits: UsageLimits;
  currentUsage: CurrentUsage;
  profile: any;
}

export const UsageStats = ({ usageLimits, currentUsage, profile }: UsageStatsProps) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentUsage.api_calls}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              of {usageLimits.api_calls} limit
            </div>
            <Progress 
              value={(currentUsage.api_calls / usageLimits.api_calls) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {currentUsage.executions_count}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              of {usageLimits.executions} limit
            </div>
            <Progress 
              value={(currentUsage.executions_count / usageLimits.executions) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tokens Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentUsage.tokens_used}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              of {usageLimits.tokens} limit
            </div>
            <Progress 
              value={(currentUsage.tokens_used / usageLimits.tokens) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            Upgrade your plan to increase your limits and unlock premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold capitalize">
                {profile?.subscription_plan || "Free"} Plan
              </h4>
              <p className="text-sm text-gray-600">
                Current plan with {usageLimits.api_calls} API calls, {usageLimits.executions} executions
              </p>
            </div>
            <Button variant="outline">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
