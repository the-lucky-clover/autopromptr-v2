import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Key, TestTube, Trash2, DollarSign, Zap } from "lucide-react";
import { apiKeyService, API_PROVIDERS, type ApiProvider } from "@/services/apiKeyService";

export const ApiKeyManagement = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [userKeys, setUserKeys] = useState<Array<{ providerId: string; isValid: boolean; createdAt: string }>>([]);
  const [usageStats, setUsageStats] = useState({ totalCost: 0, operationsCount: 0, remainingQuota: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [keys, stats] = await Promise.all([
        apiKeyService.getUserApiKeys(),
        apiKeyService.getUsageStats()
      ]);
      setUserKeys(keys);
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select a provider and enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const isValid = await apiKeyService.testApiKey(selectedProvider, apiKey, customEndpoint);
      toast({
        title: isValid ? "Connection Successful" : "Connection Failed",
        description: isValid 
          ? "API key is valid and working correctly" 
          : "Unable to connect with the provided API key",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test the API key connection",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = async () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select a provider and enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiKeyService.saveApiKey(selectedProvider, apiKey, customEndpoint);
      toast({
        title: "API Key Saved",
        description: "Your API key has been securely saved and encrypted",
      });
      
      // Reset form
      setSelectedProvider("");
      setApiKey("");
      setCustomEndpoint("");
      
      // Reload user data
      await loadUserData();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveKey = async (providerId: string) => {
    try {
      await apiKeyService.removeApiKey(providerId);
      toast({
        title: "API Key Removed",
        description: "The API key has been removed from your account",
      });
      await loadUserData();
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove the API key",
        variant: "destructive",
      });
    }
  };

  const getProviderInfo = (providerId: string): ApiProvider | undefined => {
    return API_PROVIDERS.find(p => p.id === providerId);
  };

  const selectedProviderInfo = selectedProvider ? getProviderInfo(selectedProvider) : null;

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Usage Overview
          </CardTitle>
          <CardDescription>
            Track your AI optimization usage and costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${usageStats.totalCost.toFixed(4)}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{usageStats.operationsCount}</div>
              <div className="text-sm text-gray-600">Optimizations</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{usageStats.remainingQuota}</div>
              <div className="text-sm text-gray-600">Remaining Quota</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Add AI Provider API Key
          </CardTitle>
          <CardDescription>
            Add your own API keys to unlock premium AI optimization features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Provider</label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI provider" />
              </SelectTrigger>
              <SelectContent>
                {API_PROVIDERS.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{provider.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ${(provider.costPerToken! * 1000).toFixed(3)}/1k tokens
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProviderInfo && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm text-blue-800">{selectedProviderInfo.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedProviderInfo.supportedFeatures.map(feature => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {selectedProviderInfo?.keyLabel || 'API Key'}
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>

          {selectedProvider && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Endpoint (Optional)</label>
              <Input
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="Leave blank for default endpoint"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={!selectedProvider || !apiKey || isTesting}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              onClick={handleSaveKey}
              disabled={!selectedProvider || !apiKey || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save API Key'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your saved API keys and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userKeys.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No API keys configured</p>
          ) : (
            <div className="space-y-3">
              {userKeys.map(({ providerId, isValid, createdAt }) => {
                const provider = getProviderInfo(providerId);
                return (
                  <div key={providerId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{provider?.name || providerId}</p>
                      <p className="text-sm text-gray-600">
                        Added {new Date(createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isValid ? "default" : "destructive"}>
                        {isValid ? "Valid" : "Invalid"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveKey(providerId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
