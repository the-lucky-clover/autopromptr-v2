
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { performanceService } from "@/services/performanceService";
import { jobQueueService } from "@/services/jobQueueService";
import { cacheService } from "@/services/cacheService";
import { Activity, Zap, Database, Clock, RefreshCw } from "lucide-react";

export const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const [performance, queue, cache] = await Promise.all([
        performanceService.getPerformanceReport(),
        jobQueueService.getQueueStats(),
        Promise.resolve(cacheService.getStats())
      ]);
      
      setPerformanceData(performance);
      setQueueStats(queue);
      setCacheStats(cache);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-gray-600">Monitor system performance and resource utilization</p>
        </div>
        <Button onClick={loadPerformanceData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.averages?.browser_response_time 
                ? `${Math.round(performanceData.averages.browser_response_time)}ms`
                : 'N/A'
              }
            </div>
            <p className="text-xs text-gray-600">Average browser response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {queueStats?.pending || 0}
            </div>
            <p className="text-xs text-gray-600">Jobs pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cacheStats ? `${Math.round(cacheStats.hitRate * 100)}%` : 'N/A'}
            </div>
            <p className="text-xs text-gray-600">
              {cacheStats?.size || 0}/{cacheStats?.maxSize || 0} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {performanceData?.alerts || 0}
            </div>
            <p className="text-xs text-gray-600">Performance alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Average response times by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData?.averages && Object.entries(performanceData.averages).map(([metric, value]) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="font-medium capitalize">
                    {metric.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="secondary">
                    {typeof value === 'number' ? `${Math.round(value)}ms` : 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Queue Status</CardTitle>
            <CardDescription>Background job processing statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Pending Jobs</span>
                <Badge variant="outline">{queueStats?.pending || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Running Jobs</span>
                <Badge variant="secondary">{queueStats?.running || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Failed Jobs</span>
                <Badge variant="destructive">{queueStats?.failed || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Avg Processing Time</span>
                <Badge variant="outline">
                  {queueStats?.avgProcessingTime 
                    ? `${Math.round(queueStats.avgProcessingTime)}ms`
                    : 'N/A'
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      {performanceData?.trends && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Recent performance data points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(performanceData.trends).map(([metric, values]) => (
                <div key={metric} className="space-y-2">
                  <h4 className="font-medium capitalize">{metric.replace(/_/g, ' ')}</h4>
                  <div className="flex items-end space-x-1 h-20">
                    {(values as number[]).slice(-10).map((value, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-sm flex-1 min-w-[4px]"
                        style={{
                          height: `${Math.max((value / Math.max(...(values as number[]))) * 100, 2)}%`
                        }}
                        title={`${Math.round(value)}ms`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
