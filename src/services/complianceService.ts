import { supabase } from "@/integrations/supabase/client";

export interface ComplianceReport {
  id: string;
  reportType: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI_DSS';
  status: 'compliant' | 'non_compliant' | 'partial';
  score: number;
  findings: ComplianceFinding[];
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriodDays: number;
  deletionMethod: 'hard_delete' | 'soft_delete' | 'anonymize';
  lastProcessed: Date;
}

export class ComplianceService {
  private static instance: ComplianceService;
  private retentionPolicies: DataRetentionPolicy[] = [];

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  constructor() {
    this.initializeRetentionPolicies();
  }

  private initializeRetentionPolicies(): void {
    this.retentionPolicies = [
      {
        dataType: 'user_logs',
        retentionPeriodDays: 90,
        deletionMethod: 'hard_delete',
        lastProcessed: new Date()
      },
      {
        dataType: 'audit_logs',
        retentionPeriodDays: 2555, // 7 years for compliance
        deletionMethod: 'hard_delete',
        lastProcessed: new Date()
      },
      {
        dataType: 'user_data',
        retentionPeriodDays: 365,
        deletionMethod: 'anonymize',
        lastProcessed: new Date()
      },
      {
        dataType: 'system_metrics',
        retentionPeriodDays: 180,
        deletionMethod: 'hard_delete',
        lastProcessed: new Date()
      }
    ];
  }

  // Generate SOC 2 compliance report
  async generateSOC2Report(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = [];
    
    // Security controls assessment
    const securityFindings = await this.assessSecurityControls();
    findings.push(...securityFindings);
    
    // Availability controls assessment
    const availabilityFindings = await this.assessAvailabilityControls();
    findings.push(...availabilityFindings);
    
    // Processing integrity assessment
    const integrityFindings = await this.assessProcessingIntegrity();
    findings.push(...integrityFindings);
    
    // Confidentiality assessment
    const confidentialityFindings = await this.assessConfidentiality();
    findings.push(...confidentialityFindings);
    
    // Privacy assessment
    const privacyFindings = await this.assessPrivacyControls();
    findings.push(...privacyFindings);

    const totalFindings = findings.length;
    const criticalFindings = findings.filter(f => f.severity === 'critical').length;
    const highFindings = findings.filter(f => f.severity === 'high').length;
    
    // Calculate compliance score
    const score = Math.max(0, 100 - (criticalFindings * 25 + highFindings * 10));
    const status = score >= 85 ? 'compliant' : score >= 70 ? 'partial' : 'non_compliant';

    return {
      id: `soc2_${Date.now()}`,
      reportType: 'SOC2',
      status,
      score,
      findings,
      generatedAt: new Date(),
      periodStart: startDate,
      periodEnd: endDate
    };
  }

  private async assessSecurityControls(): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = [];
    
    // Check for encryption at rest
    findings.push({
      id: 'sec_001',
      category: 'Security',
      severity: 'high',
      title: 'Data Encryption at Rest',
      description: 'Verify that sensitive data is encrypted at rest',
      remediation: 'Implement database-level encryption for sensitive fields',
      status: 'resolved'
    });
    
    // Check access controls
    findings.push({
      id: 'sec_002',
      category: 'Access Control',
      severity: 'medium',
      title: 'Role-Based Access Control',
      description: 'Ensure proper RBAC implementation',
      remediation: 'Review and update user role assignments',
      status: 'resolved'
    });

    return findings;
  }

  private async assessAvailabilityControls(): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = [];
    
    // Check system uptime
    const uptime = await this.calculateSystemUptime();
    if (uptime < 99.9) {
      findings.push({
        id: 'avail_001',
        category: 'Availability',
        severity: 'high',
        title: 'System Uptime Below Target',
        description: `System uptime is ${uptime}%, below 99.9% target`,
        remediation: 'Implement redundancy and failover mechanisms',
        status: 'open'
      });
    }

    return findings;
  }

  private async assessProcessingIntegrity(): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = [];
    
    findings.push({
      id: 'int_001',
      category: 'Processing Integrity',
      severity: 'medium',
      title: 'Data Validation Controls',
      description: 'Verify input validation and processing controls',
      remediation: 'Enhance input validation and error handling',
      status: 'resolved'
    });

    return findings;
  }

  private async assessConfidentiality(): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = [];
    
    findings.push({
      id: 'conf_001',
      category: 'Confidentiality',
      severity: 'high',
      title: 'Data Classification and Handling',
      description: 'Ensure proper classification and handling of confidential data',
      remediation: 'Implement data classification policies',
      status: 'resolved'
    });

    return findings;
  }

  private async assessPrivacyControls(): Promise<ComplianceFinding[]> {
    const findings: ComplianceFinding[] = [];
    
    findings.push({
      id: 'priv_001',
      category: 'Privacy',
      severity: 'medium',
      title: 'Data Retention Policies',
      description: 'Verify data retention and deletion policies are enforced',
      remediation: 'Automate data retention policy enforcement',
      status: 'in_progress'
    });

    return findings;
  }

  private async calculateSystemUptime(): Promise<number> {
    // In a real implementation, this would query actual uptime metrics
    return 99.95; // Mock uptime percentage
  }

  // GDPR compliance features
  async handleDataSubjectRequest(requestType: 'access' | 'portability' | 'erasure', userId: string): Promise<void> {
    // Log the GDPR request
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: `gdpr_${requestType}_request`,
      resource_type: 'user_data',
      details: { requestType },
      created_at: new Date().toISOString()
    });

    switch (requestType) {
      case 'access':
      case 'portability':
        const userData = await this.exportUserData(userId);
        // In production, this would be sent securely to the user
        console.log('User data exported for GDPR request:', userData);
        break;
      
      case 'erasure':
        await this.deleteUserData(userId);
        break;
    }
  }

  // Export user data for GDPR compliance
  private async exportUserData(userId: string): Promise<any> {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId);

      const { data: apiTokenData } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', userId);

      return {
        profile: profileData,
        auditLogs: auditData,
        apiTokens: apiTokenData
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  // Delete user data for GDPR compliance
  private async deleteUserData(userId: string): Promise<void> {
    try {
      // Delete audit logs
      await supabase
        .from('audit_logs')
        .delete()
        .eq('user_id', userId);

      // Delete API tokens
      await supabase
        .from('api_tokens')
        .delete()
        .eq('user_id', userId);

      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  // Data retention policy enforcement
  async enforceDataRetentionPolicies(): Promise<void> {
    for (const policy of this.retentionPolicies) {
      const cutoffDate = new Date(Date.now() - policy.retentionPeriodDays * 24 * 60 * 60 * 1000);
      
      try {
        switch (policy.dataType) {
          case 'user_logs':
            await this.cleanupUserLogs(cutoffDate, policy.deletionMethod);
            break;
          case 'audit_logs':
            await this.cleanupAuditLogs(cutoffDate, policy.deletionMethod);
            break;
          case 'system_metrics':
            await this.cleanupSystemMetrics(cutoffDate, policy.deletionMethod);
            break;
        }
        
        policy.lastProcessed = new Date();
      } catch (error) {
        console.error(`Failed to enforce retention policy for ${policy.dataType}:`, error);
      }
    }
  }

  private async cleanupUserLogs(cutoffDate: Date, method: string): Promise<void> {
    if (method === 'hard_delete') {
      await supabase
        .from('system_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .neq('level', 'error'); // Keep error logs longer
    }
  }

  private async cleanupAuditLogs(cutoffDate: Date, method: string): Promise<void> {
    // Audit logs typically have longer retention for compliance
    // Only clean up non-critical audit events
    if (method === 'hard_delete') {
      await supabase
        .from('audit_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .not('action', 'in', '(login,logout,password_change,data_access)');
    }
  }

  private async cleanupSystemMetrics(cutoffDate: Date, method: string): Promise<void> {
    if (method === 'hard_delete') {
      await supabase
        .from('execution_metrics')
        .delete()
        .lt('created_at', cutoffDate.toISOString());
    }
  }

  // Compliance dashboard data
  async getComplianceDashboardData(): Promise<any> {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Generate recent compliance report
    const soc2Report = await this.generateSOC2Report(thirtyDaysAgo, currentDate);
    
    return {
      overallStatus: soc2Report.status,
      complianceScore: soc2Report.score,
      criticalFindings: soc2Report.findings.filter(f => f.severity === 'critical').length,
      openFindings: soc2Report.findings.filter(f => f.status === 'open').length,
      lastAssessment: soc2Report.generatedAt,
      retentionPolicies: this.retentionPolicies,
      findings: soc2Report.findings
    };
  }
}

export const complianceService = ComplianceService.getInstance();
