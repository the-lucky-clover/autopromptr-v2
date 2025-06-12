
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Zap, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";

const MOCK_ANALYTICS_DATA = {
  totalExecutions: 1247,
  successRate: 94.2,
  avgResponseTime: 1450,
  totalTokensUsed: 158420,
  platformStats: [
    { name: "Lovable", executions: 523, successRate: 96.1, avgTime: 1200 },
    { name: "Bolt", executions: 312, successRate: 94.8, avgTime: 1350 },
    { name: "Claude", executions: 198, successRate: 91.4, avgTime: 1650 },
    { name: "v0", executions: 214, successRate: 92.5, avgTime: 1520 }
  ],
  recentTrends: {
    executions: "+12.5%",
    successRate: "+2.1%",
    responseTime: "-8.3%"
  }
};

export const Analytics = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Monitor your prompt execution performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {MOCK_ANALYTICS_DATA.totalExecutions.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {MOCK_ANALYTICS_DATA.recentTrends.executions} from last month
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {MOCK_ANALYTICS_DATA.successRate}%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {MOCK_ANALYTICS_DATA.recentTrends.successRate} from last month
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-600">
                  {MOCK_ANALYTICS_DATA.avgResponseTime}ms
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {MOCK_ANALYTICS_DATA.recentTrends.responseTime} from last month
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens Used</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(MOCK_ANALYTICS_DATA.totalTokensUsed / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {MOCK_ANALYTICS_DATA.totalTokensUsed.toLocaleString()} total
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Compare execution metrics across different AI platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_ANALYTICS_DATA.platformStats.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-600">{platform.executions} executions</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{platform.successRate}%</p>
                    <p className="text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{platform.avgTime}ms</p>
                    <p className="text-gray-600">Avg Time</p>
                  </div>
                  <Badge 
                    className={
                      platform.successRate >= 95 
                        ? "bg-green-100 text-green-800"
                        : platform.successRate >= 90
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {platform.successRate >= 95 ? "Excellent" : platform.successRate >= 90 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key observations from your usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">High Success Rate</p>
                  <p className="text-sm text-green-700">
                    Your prompts have a 94.2% success rate, which is above average.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Improving Performance</p>
                  <p className="text-sm text-blue-700">
                    Response times have improved by 8.3% over the last month.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Optimization Opportunity</p>
                  <p className="text-sm text-orange-700">
                    Consider optimizing prompts for Claude to improve success rate.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Recommendations</CardTitle>
            <CardDescription>Tips to optimize your prompt execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900">Use Lovable for Web Apps</p>
                <p className="text-sm text-gray-600">
                  Lovable shows the highest success rate (96.1%) for web application prompts.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium text-gray-900">Optimize Token Usage</p>
                <p className="text-sm text-gray-600">
                  Consider using the batch extractor to optimize prompt structure and reduce token usage.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium text-gray-900">Schedule Executions</p>
                <p className="text-sm text-gray-600">
                  Peak performance hours are 9 AM - 11 AM UTC for fastest response times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
