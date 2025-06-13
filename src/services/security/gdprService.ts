
import { supabase } from "@/integrations/supabase/client";

export class GDPRService {
  async exportUserData(userId: string): Promise<any> {
    try {
      const userDataTables = [
        'profiles',
        'prompt_batches', 
        'prompts',
        'user_usage',
        'notifications'
      ];

      const exportData: Record<string, any> = {};

      for (const tableName of userDataTables) {
        try {
          const { data, error } = await supabase
            .from(tableName as any)
            .select('*')
            .eq('user_id', userId);

          if (!error && data) {
            exportData[tableName] = data;
          }
        } catch (tableError) {
          console.error(`Failed to export data from ${tableName}:`, tableError);
        }
      }

      return exportData;
    } catch (error) {
      console.error('Data export failed:', error);
      throw new Error('Failed to export user data');
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      const userDataTables = [
        'user_usage',
        'notifications', 
        'prompts',
        'prompt_batches',
        'profiles'
      ];

      for (const tableName of userDataTables) {
        try {
          await supabase
            .from(tableName as any)
            .delete()
            .eq('user_id', userId);
        } catch (tableError) {
          console.error(`Failed to delete data from ${tableName}:`, tableError);
        }
      }
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw new Error('Failed to delete user data');
    }
  }

  async anonymizeUserData(userId: string): Promise<void> {
    try {
      // Replace user data with anonymized versions
      await supabase
        .from('profiles')
        .update({
          email: '[ANONYMIZED]',
          full_name: '[ANONYMIZED]',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Add anonymization record
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'data_anonymized',
        resource_type: 'gdpr',
        details: { reason: 'user_request' },
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Data anonymization failed:', error);
      throw new Error('Failed to anonymize user data');
    }
  }
}
