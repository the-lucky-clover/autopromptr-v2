
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LocalTool {
  id: string;
  tool_name: string;
  tool_path: string | null;
  enabled: boolean;
  version: string | null;
  last_verified: string | null;
  configuration: any;
}

const POPULAR_TOOLS = [
  { name: "vscode", displayName: "VS Code", defaultPath: "code" },
  { name: "cursor", displayName: "Cursor", defaultPath: "cursor" },
  { name: "zed", displayName: "Zed", defaultPath: "zed" },
  { name: "sublime", displayName: "Sublime Text", defaultPath: "subl" },
  { name: "vim", displayName: "Vim", defaultPath: "vim" },
  { name: "nvim", displayName: "Neovim", defaultPath: "nvim" }
];

const LocalToolsSettings = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState<LocalTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState({ name: "", path: "" });

  useEffect(() => {
    if (user) {
      loadLocalTools();
    }
  }, [user]);

  const loadLocalTools = async () => {
    try {
      const { data, error } = await supabase
        .from('local_tools_settings')
        .select('*')
        .eq('user_id', user?.id)
        .order('tool_name');

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading local tools:', error);
      toast.error('Failed to load local tools settings');
    } finally {
      setLoading(false);
    }
  };

  const addTool = async (toolName: string, toolPath: string) => {
    try {
      const { data, error } = await supabase
        .from('local_tools_settings')
        .insert({
          user_id: user?.id,
          tool_name: toolName,
          tool_path: toolPath,
          enabled: true
        })
        .select()
        .single();

      if (error) throw error;
      
      setTools([...tools, data]);
      setShowAddForm(false);
      setNewTool({ name: "", path: "" });
      toast.success(`${toolName} added successfully`);
    } catch (error) {
      console.error('Error adding tool:', error);
      toast.error('Failed to add tool');
    }
  };

  const toggleTool = async (toolId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('local_tools_settings')
        .update({ enabled })
        .eq('id', toolId);

      if (error) throw error;

      setTools(tools.map(tool => 
        tool.id === toolId ? { ...tool, enabled } : tool
      ));
      
      toast.success(`Tool ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating tool:', error);
      toast.error('Failed to update tool');
    }
  };

  const deleteTool = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('local_tools_settings')
        .delete()
        .eq('id', toolId);

      if (error) throw error;

      setTools(tools.filter(tool => tool.id !== toolId));
      toast.success('Tool removed successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to remove tool');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Local Tools Settings</h2>
          <p className="text-gray-400">Configure your local development tools for offline prompt processing</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {/* Quick Add Popular Tools */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Popular Tools</CardTitle>
          <CardDescription>Quick setup for commonly used development tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {POPULAR_TOOLS.filter(popular => 
              !tools.some(tool => tool.tool_name === popular.name)
            ).map(tool => (
              <Button
                key={tool.name}
                variant="outline"
                className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => addTool(tool.name, tool.defaultPath)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {tool.displayName}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configured Tools */}
      <div className="grid gap-4">
        {tools.map(tool => (
          <Card key={tool.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {tool.enabled ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="font-semibold text-white capitalize">{tool.tool_name}</h3>
                  </div>
                  <Badge variant={tool.enabled ? "default" : "secondary"}>
                    {tool.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tool.enabled}
                    onCheckedChange={(enabled) => toggleTool(tool.id, enabled)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTool(tool.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {tool.tool_path && (
                <p className="text-sm text-gray-400 mt-2">
                  Path: <code className="bg-gray-700 px-2 py-1 rounded">{tool.tool_path}</code>
                </p>
              )}
              
              {tool.version && (
                <p className="text-sm text-gray-400 mt-1">Version: {tool.version}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Tool Form */}
      {showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add Custom Tool</CardTitle>
            <CardDescription>Configure a custom development tool</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tool-name" className="text-white">Tool Name</Label>
              <Input
                id="tool-name"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                placeholder="e.g., custom-editor"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="tool-path" className="text-white">Command/Path</Label>
              <Input
                id="tool-path"
                value={newTool.path}
                onChange={(e) => setNewTool({ ...newTool, path: e.target.value })}
                placeholder="e.g., /usr/local/bin/custom-editor"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => addTool(newTool.name, newTool.path)}
                disabled={!newTool.name || !newTool.path}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Tool
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tools.length === 0 && !showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Local Tools Configured</h3>
            <p className="text-gray-400 mb-4">
              Add your local development tools to enable offline prompt processing
            </p>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Tool
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocalToolsSettings;
