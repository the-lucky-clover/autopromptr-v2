
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { systemHealthService, SystemHealth, HealthCheck } from "@/services/systemHealthService";
import { errorHandlingService } from "@/services/errorHandlingService";
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock } from "lucide-react";

export const SystemHealthDashboard = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [errorTrends, setErrorTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      const [health, trends] = await Promise.all([
        systemHealthService.getSystemHealth(),
        errorHandlingService.getErrorTrends(7)
      ]);
      
      setSystemHealth(health);
      setErrorTrends(trends);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
      {/* Overall System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Real-time monitoring of all system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {systemHealth && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(systemHealth.overall)}
                </div>
                <h3 className="text-lg font-semibold capitalize">{systemHealth.overall}</h3>
                <p className="text-sm text-gray-600">Overall Status</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">{systemHealth.uptime.toFixed(2)}%</h3>
                <p className="text-sm text-gray-600">24h Uptime</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold">{systemHealth.slaStatus.current.toFixed(2)}%</h3>
                <p className="text-sm text-gray-600">SLA Compliance</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemHealth?.services.map((service: HealthCheck) => (
          <Card key={service.service}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="capitalize">{service.service.replace('_', ' ')}</span>
                {getStatusIcon(service.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                    {service.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span>{service.responseTime}ms</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Last Check</span>
                  <span>{new Date(service.lastCheck).toLocaleTimeString()}</span>
                </div>
                
                {/* Response Time Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Performance</span>
                    <span>{service.responseTime > 5000 ? 'Slow' : service.responseTime > 2000 ? 'Normal' : 'Fast'}</span>
                  </div>
                  <Progress 
                    value={Math.min((service.responseTime / 5000) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Trends */}
      {errorTrends && (
        <Card>
          <CardHeader>
            <CardTitle>Error Analytics (Last 7 Days)</CardTitle>
            <CardDescription>
              Error patterns and trends across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Errors by Category</h4>
                <div className="space-y-2">
                  {Object.entries(errorTrends.errorsByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Errors by Severity</h4>
                <div className="space-y-2">
                  {Object.entries(errorTrends.errorsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center">
                      <span className="text-sm">{severity}</span>
                      <Badge variant={severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Total Errors: {errorTrends.totalErrors}</h4>
              <Progress 
                value={Math.min((errorTrends.totalErrors / 100) * 100, 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Alerts */}
      {systemHealth?.overall !== 'healthy' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Performance Alert</AlertTitle>
          <AlertDescription>
            Some services are experiencing issues. Our team has been notified and is working on a resolution.
            {systemHealth.services
              .filter(s => s.status !== 'healthy')
              .map(s => ` ${s.service} is ${s.status}.`)
              .join('')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
