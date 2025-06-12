
import { supabase } from "@/integrations/supabase/client";
import { ExtractedPrompt, ExtractionOptions } from "@/utils/textProcessing";

export interface TextExtractionRequest {
  text: string;
  extractionType: 'auto' | 'manual' | 'intelligent';
  options?: ExtractionOptions;
}

export interface BatchCreationRequest {
  batchName: string;
  description?: string;
  prompts: Array<{
    content: string;
    platform_target: string;
    execution_order: number;
  }>;
  tags?: string[];
}

export class TextExtractionService {
  async extractPrompts(request: TextExtractionRequest): Promise<ExtractedPrompt[]> {
    try {
      const response = await supabase.functions.invoke('text-extractor/parse-text', {
        body: request
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data.extractedPrompts || [];

    } catch (error) {
      console.error('Failed to extract prompts:', error);
      throw error;
    }
  }

  async createBatchFromExtracted(request: BatchCreationRequest): Promise<any> {
    try {
      const response = await supabase.functions.invoke('text-extractor/create-batch', {
        body: request
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;

    } catch (error) {
      console.error('Failed to create batch from extracted prompts:', error);
      throw error;
    }
  }

  async analyzeTextComplexity(text: string): Promise<{
    complexity: 'low' | 'medium' | 'high';
    recommendedExtractionType: 'auto' | 'intelligent' | 'manual';
    estimatedPromptCount: number;
    textStatistics: {
      characterCount: number;
      wordCount: number;
      paragraphCount: number;
      sentenceCount: number;
    };
  }> {
    const characterCount = text.length;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Determine complexity
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (wordCount > 5000 || paragraphCount > 50) {
      complexity = 'high';
    } else if (wordCount > 1000 || paragraphCount > 10) {
      complexity = 'medium';
    }

    // Recommend extraction type based on complexity and content patterns
    let recommendedExtractionType: 'auto' | 'intelligent' | 'manual' = 'auto';
    
    const hasStructuredContent = /(?:\d+\.|[-*•]|\#{1,6})/gm.test(text);
    const hasActionWords = /\b(?:create|build|make|develop|implement|design|write|generate)\b/gi.test(text);
    const hasPromptMarkers = /\b(?:prompt|task|instruction|request|todo):/gi.test(text);

    if (hasPromptMarkers || hasStructuredContent) {
      recommendedExtractionType = 'intelligent';
    } else if (complexity === 'high' && hasActionWords) {
      recommendedExtractionType = 'intelligent';
    } else if (complexity === 'low') {
      recommendedExtractionType = 'manual';
    }

    // Estimate prompt count
    let estimatedPromptCount = Math.max(1, Math.floor(paragraphCount * 0.6));
    if (hasStructuredContent) {
      const structuredItems = (text.match(/(?:\d+\.|[-*•])/gm) || []).length;
      estimatedPromptCount = Math.max(estimatedPromptCount, structuredItems);
    }

    return {
      complexity,
      recommendedExtractionType,
      estimatedPromptCount,
      textStatistics: {
        characterCount,
        wordCount,
        paragraphCount,
        sentenceCount
      }
    };
  }

  async validateExtractionQuality(prompts: ExtractedPrompt[]): Promise<{
    overallQuality: 'excellent' | 'good' | 'fair' | 'poor';
    averageQualityScore: number;
    issues: string[];
    recommendations: string[];
  }> {
    if (prompts.length === 0) {
      return {
        overallQuality: 'poor',
        averageQualityScore: 0,
        issues: ['No prompts were extracted'],
        recommendations: ['Try different extraction settings or check input text']
      };
    }

    const averageQualityScore = prompts.reduce((sum, prompt) => sum + prompt.qualityScore, 0) / prompts.length;
    
    let overallQuality: 'excellent' | 'good' | 'fair' | 'poor';
    if (averageQualityScore >= 0.8) overallQuality = 'excellent';
    else if (averageQualityScore >= 0.6) overallQuality = 'good';
    else if (averageQualityScore >= 0.4) overallQuality = 'fair';
    else overallQuality = 'poor';

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Analyze common issues
    const shortPrompts = prompts.filter(p => p.content.length < 50).length;
    const longPrompts = prompts.filter(p => p.content.length > 1000).length;
    const lowConfidencePrompts = prompts.filter(p => p.confidence < 0.5).length;

    if (shortPrompts > prompts.length * 0.3) {
      issues.push(`${shortPrompts} prompts are too short`);
      recommendations.push('Consider combining short prompts or adding more context');
    }

    if (longPrompts > prompts.length * 0.2) {
      issues.push(`${longPrompts} prompts are very long`);
      recommendations.push('Consider breaking long prompts into smaller tasks');
    }

    if (lowConfidencePrompts > prompts.length * 0.4) {
      issues.push(`${lowConfidencePrompts} prompts have low confidence scores`);
      recommendations.push('Review and manually refine low-confidence prompts');
    }

    // Check for duplicates
    const duplicateCount = this.findDuplicates(prompts).length;
    if (duplicateCount > 0) {
      issues.push(`${duplicateCount} potential duplicate prompts found`);
      recommendations.push('Remove or merge duplicate prompts');
    }

    return {
      overallQuality,
      averageQualityScore,
      issues,
      recommendations
    };
  }

  private findDuplicates(prompts: ExtractedPrompt[]): ExtractedPrompt[] {
    const duplicates: ExtractedPrompt[] = [];
    const seen = new Set<string>();

    for (const prompt of prompts) {
      const normalized = prompt.content.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      
      if (seen.has(normalized)) {
        duplicates.push(prompt);
      } else {
        seen.add(normalized);
      }
    }

    return duplicates;
  }

  async optimizeExtractedPrompts(prompts: ExtractedPrompt[]): Promise<ExtractedPrompt[]> {
    return prompts.map(prompt => ({
      ...prompt,
      content: this.optimizePromptContent(prompt.content),
      suggestions: this.generateOptimizationSuggestions(prompt.content)
    }));
  }

  private optimizePromptContent(content: string): string {
    let optimized = content;

    // Add action words if missing
    const actionWords = ['create', 'build', 'implement', 'develop', 'design'];
    const hasAction = actionWords.some(word => optimized.toLowerCase().includes(word));
    
    if (!hasAction && !optimized.toLowerCase().startsWith('create')) {
      optimized = `Create ${optimized.toLowerCase()}`;
    }

    // Improve specificity
    optimized = optimized.replace(/\bsomething\b/gi, 'a specific component');
    optimized = optimized.replace(/\banything\b/gi, 'appropriate content');
    optimized = optimized.replace(/\bstuff\b/gi, 'the necessary elements');

    // Add context if too short
    if (optimized.length < 100) {
      optimized += '. Make sure it follows modern best practices and is well-documented.';
    }

    return optimized;
  }

  private generateOptimizationSuggestions(content: string): string[] {
    const suggestions: string[] = [];

    if (content.length < 50) {
      suggestions.push('Add more details and context');
    }

    if (!/\b(?:react|vue|angular|component|function)\b/i.test(content)) {
      suggestions.push('Specify the technology or framework to use');
    }

    if (!/\b(?:responsive|mobile|desktop|ui|interface)\b/i.test(content)) {
      suggestions.push('Consider mentioning UI/UX requirements');
    }

    const vagueWords = ['something', 'anything', 'stuff', 'things'];
    if (vagueWords.some(word => content.toLowerCase().includes(word))) {
      suggestions.push('Replace vague terms with specific requirements');
    }

    return suggestions;
  }
}

export const textExtractionService = new TextExtractionService();
