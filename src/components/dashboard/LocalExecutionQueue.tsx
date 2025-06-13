
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Square, RotateCcw, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface LocalExecutionQueue {
  id: string;
  tool_target: string;
  status: string;
  priority: number;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  execution_data: any;
  result_data: any;
  created_at: string;
  batch_id: string | null;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-400" />;
    case 'running':
      return <Play className="w-4 h-4 text-blue-400" />;
    case 'cancelled':
      return <Square className="w-4 h-4 text-gray-400" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-400" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, any> = {
    pending: "secondary",
    running: "default",
    completed: "default",
    failed: "destructive",
    cancelled: "outline"
  };

  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    running: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    completed: "bg-green-500/20 text-green-300 border-green-500/30",
    failed: "bg-red-500/20 text-red-300 border-red-500/30",
    cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30"
  };

  return (
    <Badge className={colors[status] || colors.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const LocalExecutionQueue = () => {
  const { user } = useAuth();
  const [executions, setExecutions] = useState<LocalExecutionQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadExecutionQueue();
      // Set up real-time updates
      const channel = supabase
        .channel('local-execution-updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'local_execution_queues', filter: `user_id=eq.${user.id}` },
          () => loadExecutionQueue()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadExecutionQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('local_execution_queues')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Error loading execution queue:', error);
      toast.error('Failed to load execution queue');
    } finally {
      setLoading(false);
    }
  };

  const cancelExecution = async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('local_execution_queues')
        .update({ status: 'cancelled' })
        .eq('id', executionId);

      if (error) throw error;
      toast.success('Execution cancelled');
      loadExecutionQueue();
    } catch (error) {
      console.error('Error cancelling execution:', error);
      toast.error('Failed to cancel execution');
    }
  };

  const retryExecution = async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('local_execution_queues')
        .update({ 
          status: 'pending',
          error_message: null,
          started_at: null,
          completed_at: null
        })
        .eq('id', executionId);

      if (error) throw error;
      toast.success('Execution queued for retry');
      loadExecutionQueue();
    } catch (error) {
      console.error('Error retrying execution:', error);
      toast.error('Failed to retry execution');
    }
  };

  const deleteExecution = async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('local_execution_queues')
        .delete()
        .eq('id', executionId);

      if (error) throw error;
      toast.success('Execution removed');
      loadExecutionQueue();
    } catch (error) {
      console.error('Error deleting execution:', error);
      toast.error('Failed to remove execution');
    }
  };

  const filteredExecutions = executions.filter(execution => {
    if (filter === 'all') return true;
    return execution.status === filter;
  });

  const statusCounts = executions.reduce((acc, exec) => {
    acc[exec.status] = (acc[exec.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Local Execution Queue</h2>
        <p className="text-gray-400">Monitor and manage your local tool execution queue</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['all', 'pending', 'running', 'completed', 'failed'].map(status => (
          <Card 
            key={status} 
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
              filter === status ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setFilter(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {status === 'all' ? executions.length : statusCounts[status] || 0}
              </div>
              <div className="text-sm text-gray-400 capitalize">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execution List */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Executions Found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'No local executions have been queued yet.' 
                  : `No ${filter} executions found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredExecutions.map(execution => (
            <Card key={execution.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon status={execution.status} />
                    <div>
                      <h3 className="font-semibold text-white">{execution.tool_target}</h3>
                      <p className="text-sm text-gray-400">
                        Created {formatDistanceToNow(new Date(execution.created_at))} ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={execution.status} />
                    
                    {execution.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelExecution(execution.id)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {execution.status === 'failed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryExecution(execution.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {['completed', 'failed', 'cancelled'].includes(execution.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExecution(execution.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {execution.error_message && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <p className="text-sm text-red-300">{execution.error_message}</p>
                  </div>
                )}

                {execution.started_at && (
                  <div className="mt-4 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Started: {formatDistanceToNow(new Date(execution.started_at))} ago</span>
                      {execution.completed_at && (
                        <span>
                          Completed: {formatDistanceToNow(new Date(execution.completed_at))} ago
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {execution.priority > 0 && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-yellow-300 border-yellow-500/30">
                      High Priority
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LocalExecutionQueue;
