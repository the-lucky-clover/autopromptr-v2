
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { complianceService } from "@/services/complianceService";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Database } from "lucide-react";

export const ComplianceDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      const data = await complianceService.getComplianceDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'non_compliant':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'non_compliant':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
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
      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance Overview
          </CardTitle>
          <CardDescription>
            Current compliance status and key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(dashboardData.overallStatus)}
                </div>
                <h3 className={`text-lg font-semibold capitalize ${getStatusColor(dashboardData.overallStatus)}`}>
                  {dashboardData.overallStatus.replace('_', ' ')}
                </h3>
                <p className="text-sm text-gray-600">Overall Status</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">{dashboardData.complianceScore}%</h3>
                <p className="text-sm text-gray-600">Compliance Score</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold">{dashboardData.criticalFindings}</h3>
                <p className="text-sm text-gray-600">Critical Findings</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold">{dashboardData.openFindings}</h3>
                <p className="text-sm text-gray-600">Open Findings</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Score Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Score Breakdown</CardTitle>
          <CardDescription>
            Detailed view of compliance performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Compliance</span>
                <span>{dashboardData?.complianceScore || 0}%</span>
              </div>
              <Progress value={dashboardData?.complianceScore || 0} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-medium mb-3">SOC 2 Trust Services</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Security</span>
                    <Badge variant="default">95%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Availability</span>
                    <Badge variant="secondary">88%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Integrity</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidentiality</span>
                    <Badge variant="default">90%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Privacy</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Data Protection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GDPR Compliance</span>
                    <Badge variant="default">94%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Encryption</span>
                    <Badge variant="default">100%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Access Controls</span>
                    <Badge variant="default">96%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Audit Logging</span>
                    <Badge variant="default">98%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Retention Policies
          </CardTitle>
          <CardDescription>
            Automated data lifecycle management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.retentionPolicies?.map((policy: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium capitalize">{policy.dataType.replace('_', ' ')}</h4>
                  <p className="text-sm text-gray-600">
                    Retention: {policy.retentionPeriodDays} days • 
                    Method: {policy.deletionMethod.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Active</Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Last processed: {new Date(policy.lastProcessed).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
          <CardDescription>
            Latest compliance assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.findings?.slice(0, 5).map((finding: any) => (
              <div key={finding.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{finding.title}</h4>
                      <Badge variant={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                      <Badge variant={finding.status === 'resolved' ? 'default' : 'secondary'}>
                        {finding.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                    <p className="text-sm text-blue-600">{finding.remediation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      {dashboardData?.criticalFindings > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Compliance Issues Detected</AlertTitle>
          <AlertDescription>
            {dashboardData.criticalFindings} critical compliance finding(s) require immediate attention.
            Please review and address these issues to maintain compliance status.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
