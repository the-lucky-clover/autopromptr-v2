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
import { textExtractionService } from "@/services/textExtractionService";
import { batchExecutionService } from "@/services/batchExecutionService";

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
  const [extractionType, setExtractionType] = useState<'auto' | 'intelligent' | 'manual'>('intelligent');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textAnalysis, setTextAnalysis] = useState<any>(null);
  const [extractionQuality, setExtractionQuality] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await textExtractionService.analyzeTextComplexity(inputText);
      setTextAnalysis(analysis);
      setExtractionType(analysis.recommendedExtractionType);
      
      toast({
        title: "Text Analysis Complete",
        description: `Detected ${analysis.complexity} complexity text with ~${analysis.estimatedPromptCount} potential prompts.`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze text complexity.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExtractPrompts = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to extract prompts from.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const extractedPrompts = await textExtractionService.extractPrompts({
        text: inputText,
        extractionType,
        options: {
          minPromptLength: 30,
          maxPromptLength: 2000,
          preserveContext: true,
          removeDuplicates: true,
          qualityThreshold: 0.6
        }
      });

      setExtractedPrompts(extractedPrompts.map((prompt, index) => ({
        ...prompt,
        position: index,
        platform: targetUrl
      })));

      // Validate extraction quality
      const quality = await textExtractionService.validateExtractionQuality(extractedPrompts);
      setExtractionQuality(quality);

      // Auto-generate batch name if empty
      if (!batchName.trim()) {
        const timestamp = new Date().toLocaleDateString();
        setBatchName(`Extracted Batch - ${timestamp}`);
      }

      toast({
        title: "Extraction Complete",
        description: `Extracted ${extractedPrompts.length} prompts (${quality.overallQuality} quality).`
      });

    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Could not extract prompts from text.",
        variant: "destructive"
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
        variant: "destructive"
      });
      return;
    }

    if (!batchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a batch name.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await textExtractionService.createBatchFromExtracted({
        batchName,
        description: `Batch created from text extraction with ${extractedPrompts.length} prompts`,
        prompts: extractedPrompts.map((prompt, index) => ({
          content: prompt.content,
          platform_target: prompt.platform,
          execution_order: index
        })),
        tags: ['extracted', 'auto-generated']
      });

      toast({
        title: "Batch Created Successfully",
        description: `Created "${batchName}" with ${extractedPrompts.length} prompts.`
      });

      // Reset form
      setInputText("");
      setBatchName("");
      setExtractedPrompts([]);
      setExtractionQuality(null);
      setTextAnalysis(null);

    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Could not create batch from extracted prompts.",
        variant: "destructive"
      });
    }
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
            {/* Text Analysis Section */}
            {!textAnalysis && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnalyzeText}
                  disabled={!inputText.trim() || isAnalyzing}
                  variant="outline"
                  size="sm"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                </Button>
              </div>
            )}

            {textAnalysis && (
              <div className="p-3 bg-blue-50 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-2">Text Analysis</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Complexity: <Badge variant="secondary">{textAnalysis.complexity}</Badge></div>
                  <div>Est. Prompts: <Badge variant="outline">{textAnalysis.estimatedPromptCount}</Badge></div>
                  <div>Words: {textAnalysis.textStatistics.wordCount.toLocaleString()}</div>
                  <div>Paragraphs: {textAnalysis.textStatistics.paragraphCount}</div>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Input Text</label>
                  <Badge variant="outline" className="text-xs">
                    {inputText.length.toLocaleString()}/{CHARACTER_LIMIT.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, CHARACTER_LIMIT))}
                placeholder="Paste your text content here... The AI will automatically identify and extract individual prompts from your text."
                className="min-h-[300px] text-sm"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Extraction Method</label>
                <div className="flex gap-2">
                  {[
                    { value: 'intelligent', label: 'Intelligent', desc: 'AI-powered pattern recognition' },
                    { value: 'auto', label: 'Automatic', desc: 'Simple paragraph detection' },
                    { value: 'manual', label: 'Manual', desc: 'Line-by-line extraction' }
                  ].map((method) => (
                    <Button
                      key={method.value}
                      variant={extractionType === method.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExtractionType(method.value as any)}
                      title={method.desc}
                    >
                      {method.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Batch Name"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                  />
                </div>
                <select
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PLATFORM_OPTIONS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handleExtractPrompts}
                disabled={!inputText.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Extracting Prompts...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Extract Prompts
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Prompts ({extractedPrompts.length})
              </div>
              {extractedPrompts.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full $${totalTokens < 5000 ? 'bg-green-500' : totalTokens < 10000 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  ~{totalTokens.toLocaleString()} tokens
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Review and edit extracted prompts before creating the batch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Quality Assessment */}
            {extractionQuality && (
              <div className={`p-3 rounded-lg border mb-4 ${
                extractionQuality.overallQuality === 'excellent' ? 'bg-green-50 border-green-200' :
                extractionQuality.overallQuality === 'good' ? 'bg-blue-50 border-blue-200' :
                extractionQuality.overallQuality === 'fair' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Quality Assessment</h4>
                  <Badge variant={
                    extractionQuality.overallQuality === 'excellent' ? 'default' :
                    extractionQuality.overallQuality === 'good' ? 'secondary' : 'destructive'
                  }>
                    {extractionQuality.overallQuality}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Average quality score: {(extractionQuality.averageQualityScore * 100).toFixed(1)}%
                </p>
                {extractionQuality.issues.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Issues:</p>
                    <ul className="text-xs text-gray-600 ml-2">
                      {extractionQuality.issues.map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {extractedPrompts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No prompts extracted yet</p>
                <p className="text-sm">Paste some text and click "Extract Prompts" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {extractedPrompts.map((prompt, index) => (
                  <div key={prompt.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.estimatedTokens} tokens
                          </Badge>
                          <Badge 
                            variant={prompt.qualityScore > 0.8 ? 'default' : prompt.qualityScore > 0.6 ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {(prompt.qualityScore * 100).toFixed(0)}% quality
                          </Badge>
                        </div>
                        {editingPrompt === prompt.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={prompt.content}
                              onChange={(e) => handlePromptEdit(prompt.id, e.target.value)}
                              className="text-sm"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => setEditingPrompt(null)}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingPrompt(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {prompt.content}
                          </p>
                        )}
                        {prompt.suggestions && prompt.suggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Suggestions:</p>
                            <ul className="text-xs text-gray-500">
                              {prompt.suggestions.slice(0, 2).map((suggestion, idx) => (
                                <li key={idx}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPrompt(prompt.id)}
                          disabled={editingPrompt === prompt.id}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOptimizePrompt(prompt.id)}
                        >
                          <Wand2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePromptDelete(prompt.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                {extractedPrompts.length} prompts • ~{totalTokens.toLocaleString()} tokens
              </div>
              <Button 
                onClick={handleCreateBatch}
                disabled={extractedPrompts.length === 0 || !batchName.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
