
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { errorHandlingService, ErrorReport } from "@/services/errorHandlingService";
import { AlertTriangle, Bug, Clock, TrendingDown, RefreshCw } from "lucide-react";

export const ErrorAnalytics = () => {
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadErrorData();
  }, [timeRange]);

  const loadErrorData = async () => {
    setLoading(true);
    try {
      const errorTrends = await errorHandlingService.getErrorTrends(parseInt(timeRange));
      setTrends(errorTrends);
    } catch (error) {
      console.error('Failed to load error analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BROWSER':
        return <Bug className="w-4 h-4" />;
      case 'AI':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Error Analytics</h2>
          <p className="text-gray-600">Monitor and analyze system errors</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadErrorData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {trends && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trends.totalErrors}</div>
                <p className="text-xs text-gray-600">Last {timeRange} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trends.errorsBySeverity?.CRITICAL || 0}
                </div>
                <p className="text-xs text-gray-600">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(trends.errorsByCategory)[0] || 'N/A'}
                </div>
                <p className="text-xs text-gray-600">Error category</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trends.hourlyDistribution.indexOf(Math.max(...trends.hourlyDistribution))}:00
                </div>
                <p className="text-xs text-gray-600">Most errors occur</p>
              </CardContent>
            </Card>
          </div>

          {/* Error Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Errors by Category</CardTitle>
                <CardDescription>
                  Distribution of errors across different system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(trends.errorsByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{count as number}</Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((count as number) / trends.totalErrors) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errors by Severity</CardTitle>
                <CardDescription>
                  Severity levels of reported errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(trends.errorsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">{severity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(severity)}>{count as number}</Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              severity === 'CRITICAL' ? 'bg-red-500' :
                              severity === 'HIGH' ? 'bg-orange-500' :
                              severity === 'MEDIUM' ? 'bg-yellow-500' : '
                              bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(((count as number) / trends.totalErrors) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution by Hour</CardTitle>
              <CardDescription>
                When errors occur most frequently throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2">
                {trends.hourlyDistribution.map((count: number, hour: number) => (
                  <div key={hour} className="text-center">
                    <div 
                      className="bg-blue-500 rounded mb-1 transition-all hover:bg-blue-600"
                      style={{ 
                        height: `${Math.max((count / Math.max(...trends.hourlyDistribution)) * 60, 4)}px` 
                      }}
                      title={`${count} errors at ${hour}:00`}
                    />
                    <div className="text-xs text-gray-600">{hour}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
