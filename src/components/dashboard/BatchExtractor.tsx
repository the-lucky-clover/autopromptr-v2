
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { extractPromptsFromText, optimizePrompt, type ExtractedPrompt } from "@/utils/textProcessing";
import { 
  Download, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronUp,
  ChevronDown,
  Wand2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const CHARACTER_LIMIT = 50000;

const PLATFORM_OPTIONS = [
  { value: "lovable.dev", label: "Lovable", color: "bg-blue-500" },
  { value: "bolt.new", label: "Bolt", color: "bg-green-500" },
  { value: "replit.com", label: "Replit", color: "bg-orange-500" },
  { value: "v0.dev", label: "v0", color: "bg-purple-500" },
  { value: "cursor.so", label: "Cursor", color: "bg-yellow-500" },
  { value: "claude.ai", label: "Claude", color: "bg-red-500" },
];

export const BatchExtractor = () => {
  const [inputText, setInputText] = useState("");
  const [batchName, setBatchName] = useState("");
  const [targetUrl, setTargetUrl] = useState("lovable.dev");
  const [extractedPrompts, setExtractedPrompts] = useState<ExtractedPrompt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExtractPrompts = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to extract prompts from.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const extracted = extractPromptsFromText(inputText);
      setExtractedPrompts(extracted);
      
      // Auto-generate batch name if empty
      if (!batchName.trim()) {
        const timestamp = new Date().toLocaleDateString();
        setBatchName(`Extracted Batch - ${timestamp}`);
      }
      
      toast({
        title: "Success",
        description: `Extracted ${extracted.length} prompts from the text.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract prompts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromptEdit = (id: string, newContent: string) => {
    setExtractedPrompts(prompts =>
      prompts.map(prompt =>
        prompt.id === id ? { ...prompt, content: newContent } : prompt
      )
    );
  };

  const handlePromptDelete = (id: string) => {
    setExtractedPrompts(prompts => prompts.filter(prompt => prompt.id !== id));
  };

  const handleOptimizePrompt = (id: string) => {
    setExtractedPrompts(prompts =>
      prompts.map(prompt =>
        prompt.id === id 
          ? { ...prompt, content: optimizePrompt(prompt.content) }
          : prompt
      )
    );
    toast({
      title: "Prompt Optimized",
      description: "Applied AI optimization suggestions to the prompt.",
    });
  };

  const movePrompt = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === extractedPrompts.length - 1)
    ) {
      return;
    }

    const newPrompts = [...extractedPrompts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newPrompts[index], newPrompts[targetIndex]] = [newPrompts[targetIndex], newPrompts[index]];
    
    // Update positions
    const updatedPrompts = newPrompts.map((prompt, i) => ({
      ...prompt,
      position: i
    }));
    
    setExtractedPrompts(updatedPrompts);
  };

  const handleCreateBatch = async () => {
    if (extractedPrompts.length === 0) {
      toast({
        title: "Error",
        description: "No prompts to create batch with.",
        variant: "destructive",
      });
      return;
    }

    if (!batchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a batch name.",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the actual batch creation logic
    // For now, we'll just show a success message
    toast({
      title: "Batch Created",
      description: `Successfully created "${batchName}" with ${extractedPrompts.length} prompts.`,
    });

    // Reset form
    setInputText("");
    setBatchName("");
    setExtractedPrompts([]);
  };

  const totalTokens = extractedPrompts.reduce((sum, prompt) => sum + prompt.estimatedTokens, 0);
  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === targetUrl);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Batch Extractor</h1>
        <p className="text-gray-600 mt-1">
          Extract and organize prompts from large text documents automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Text Input
            </CardTitle>
            <CardDescription>
              Paste your text content here to extract individual prompts automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Input Text</label>
                <span className={`text-xs ${inputText.length > CHARACTER_LIMIT * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {inputText.length.toLocaleString()} / {CHARACTER_LIMIT.toLocaleString()} characters
                </span>
              </div>
              <Textarea
                placeholder="Paste your text content here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, CHARACTER_LIMIT))}
                className="min-h-[300px] resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch Name</label>
                <Input
                  placeholder="Enter batch name..."
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Platform</label>
                <select
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PLATFORM_OPTIONS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleExtractPrompts}
              disabled={!inputText.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Extract Prompts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Prompts
              </div>
              {extractedPrompts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {extractedPrompts.length} prompts
                  </Badge>
                  <Badge variant="outline">
                    ~{totalTokens.toLocaleString()} tokens
                  </Badge>
                  {selectedPlatform && (
                    <Badge className={`text-white ${selectedPlatform.color}`}>
                      {selectedPlatform.label}
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {extractedPrompts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No prompts extracted yet</p>
                <p className="text-sm">
                  Add some text and click "Extract Prompts" to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {extractedPrompts.map((prompt, index) => (
                    <div key={prompt.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => movePrompt(index, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => movePrompt(index, 'down')}
                            disabled={index === extractedPrompts.length - 1}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600">
                                Prompt {index + 1}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                ~{prompt.estimatedTokens} tokens
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOptimizePrompt(prompt.id)}
                                className="h-7 w-7 p-0"
                              >
                                <Wand2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingPrompt(prompt.id)}
                                className="h-7 w-7 p-0"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePromptDelete(prompt.id)}
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {editingPrompt === prompt.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={prompt.content}
                                onChange={(e) => handlePromptEdit(prompt.id, e.target.value)}
                                className="text-sm"
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => setEditingPrompt(null)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingPrompt(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {prompt.content.length > 200
                                ? `${prompt.content.substring(0, 200)}...`
                                : prompt.content
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCreateBatch}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!batchName.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Batch ({extractedPrompts.length} prompts)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
