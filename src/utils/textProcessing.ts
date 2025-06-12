
// Advanced text processing utilities for prompt extraction and optimization

export interface ExtractedPrompt {
  id: string;
  content: string;
  originalText: string;
  platform: string;
  estimatedTokens: number;
  qualityScore: number;
  confidence: number;
  extractionMethod: 'intelligent' | 'automatic' | 'manual';
  context?: string;
  position: number;
  suggestions?: string[];
}

export interface ExtractionOptions {
  minPromptLength?: number;
  maxPromptLength?: number;
  preserveContext?: boolean;
  removeDuplicates?: boolean;
  qualityThreshold?: number;
  extractionType?: 'intelligent' | 'automatic' | 'manual';
}

// Enhanced prompt extraction with multiple algorithms
export function extractPromptsFromText(
  text: string, 
  options: ExtractionOptions = {}
): ExtractedPrompt[] {
  const {
    minPromptLength = 30,
    maxPromptLength = 2000,
    preserveContext = true,
    removeDuplicates = true,
    qualityThreshold = 0.6,
    extractionType = 'intelligent'
  } = options;

  let extractedPrompts: ExtractedPrompt[] = [];

  switch (extractionType) {
    case 'intelligent':
      extractedPrompts = intelligentExtraction(text, options);
      break;
    case 'automatic':
      extractedPrompts = automaticExtraction(text, options);
      break;
    case 'manual':
      extractedPrompts = manualExtraction(text, options);
      break;
  }

  // Apply filters
  extractedPrompts = extractedPrompts
    .filter(prompt => 
      prompt.content.length >= minPromptLength && 
      prompt.content.length <= maxPromptLength
    )
    .filter(prompt => prompt.qualityScore >= qualityThreshold);

  // Remove duplicates if requested
  if (removeDuplicates) {
    extractedPrompts = removeDuplicates ? removeDuplicatePrompts(extractedPrompts) : extractedPrompts;
  }

  // Add optimization suggestions
  extractedPrompts = extractedPrompts.map(prompt => ({
    ...prompt,
    suggestions: generateOptimizationSuggestions(prompt.content)
  }));

  return extractedPrompts;
}

function intelligentExtraction(text: string, options: ExtractionOptions): ExtractedPrompt[] {
  const prompts: ExtractedPrompt[] = [];
  
  // Multiple extraction patterns for different content types
  const patterns = [
    // Numbered or bulleted lists
    {
      regex: /(?:^|\n)(?:\d+\.|\*|-|\•)\s+(.+?)(?=\n(?:\d+\.|\*|-|\•)|$)/gms,
      method: 'list_item' as const
    },
    // Markdown headers as prompts
    {
      regex: /(?:^|\n)#{1,6}\s+(.+?)(?=\n|$)/gms,
      method: 'header' as const
    },
    // Action-oriented sentences
    {
      regex: /(?:^|\n)(.+?(?:create|build|make|develop|implement|design|write|generate|add|remove|update|modify|fix|improve).+?)(?:\.|!|\?|$)/gims,
      method: 'action_sentence' as const
    },
    // Questions
    {
      regex: /(?:^|\n)(.+?\?)/gm,
      method: 'question' as const
    },
    // Explicit prompt markers
    {
      regex: /(?:^|\n)(?:prompt|task|instruction|request|todo):\s*(.+?)(?=\n(?:prompt|task|instruction|request|todo):|$)/gims,
      method: 'explicit_marker' as const
    },
    // Code comments as prompts
    {
      regex: /(?:\/\/|#|\<!--)\s*(?:TODO|FIXME|NOTE):\s*(.+?)(?=\n|$)/gims,
      method: 'code_comment' as const
    }
  ];

  patterns.forEach(({ regex, method }) => {
    const matches = text.matchAll(regex);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 20) {
        const content = cleanPromptContent(match[1].trim());
        const position = match.index || 0;
        
        prompts.push({
          id: generatePromptId(),
          content,
          originalText: match[0],
          platform: 'lovable.dev',
          estimatedTokens: estimateTokenCount(content),
          qualityScore: calculateQualityScore(content, method),
          confidence: calculateConfidence(content, method),
          extractionMethod: 'intelligent',
          context: options.preserveContext ? extractContext(text, position) : undefined,
          position: prompts.length
        });
      }
    }
  });

  return prompts;
}

function automaticExtraction(text: string, options: ExtractionOptions): ExtractedPrompt[] {
  const prompts: ExtractedPrompt[] = [];
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  paragraphs.forEach((paragraph, index) => {
    const content = paragraph.trim();
    
    if (isLikelyPrompt(content)) {
      prompts.push({
        id: generatePromptId(),
        content: cleanPromptContent(content),
        originalText: content,
        platform: 'lovable.dev',
        estimatedTokens: estimateTokenCount(content),
        qualityScore: calculateQualityScore(content, 'paragraph'),
        confidence: 0.7,
        extractionMethod: 'automatic',
        position: index
      });
    }
  });

  return prompts;
}

function manualExtraction(text: string, options: ExtractionOptions): ExtractedPrompt[] {
  const prompts: ExtractedPrompt[] = [];
  const lines = text.split('\n').filter(line => line.trim().length > 20);
  
  lines.forEach((line, index) => {
    const content = cleanPromptContent(line.trim());
    
    prompts.push({
      id: generatePromptId(),
      content,
      originalText: line,
      platform: 'lovable.dev',
      estimatedTokens: estimateTokenCount(content),
      qualityScore: 0.8, // Neutral score for manual extraction
      confidence: 1.0, // High confidence since it's manual
      extractionMethod: 'manual',
      position: index
    });
  });

  return prompts;
}

function cleanPromptContent(content: string): string {
  return content
    .replace(/^\d+\.\s*/, '') // Remove numbering
    .replace(/^[-*•]\s*/, '') // Remove bullet points
    .replace(/^#+\s*/, '') // Remove markdown headers
    .replace(/^\w+:\s*/, '') // Remove labels like "Task:", "Prompt:"
    .replace(/^(TODO|FIXME|NOTE):\s*/i, '') // Remove comment markers
    .trim();
}

function isLikelyPrompt(text: string): boolean {
  const promptIndicators = [
    // Action verbs
    /\b(?:create|build|make|develop|implement|design|write|generate|add|remove|update|modify|fix|improve|enhance|optimize)\b/i,
    // Technical terms
    /\b(?:component|function|api|database|ui|interface|feature|button|form|page|screen|website|app|system)\b/i,
    // Question patterns
    /^(?:how|what|when|where|why|can|could|would|should|will)/i,
    // Request patterns
    /^(?:please|can you|would you|i need|help me|let's|we need to)/i,
    // Imperative mood
    /^(?:add|remove|create|update|fix|improve|change|modify)/i
  ];
  
  return promptIndicators.some(pattern => pattern.test(text)) && text.length > 20;
}

function calculateQualityScore(content: string, method: string): number {
  let score = 0.5; // Base score
  
  // Method-specific scoring
  const methodScores: Record<string, number> = {
    'explicit_marker': 0.9,
    'action_sentence': 0.8,
    'question': 0.7,
    'list_item': 0.6,
    'header': 0.5,
    'code_comment': 0.8,
    'paragraph': 0.6
  };
  
  score = methodScores[method] || 0.5;
  
  // Content quality factors
  const actionWords = ['create', 'build', 'implement', 'develop', 'design', 'write', 'generate'];
  const hasAction = actionWords.some(word => content.toLowerCase().includes(word));
  if (hasAction) score += 0.15;
  
  // Specificity indicators
  const specificityWords = ['specific', 'detailed', 'exactly', 'precisely', 'step by step'];
  const hasSpecificity = specificityWords.some(word => content.toLowerCase().includes(word));
  if (hasSpecificity) score += 0.1;
  
  // Technical context
  const techWords = ['component', 'function', 'api', 'database', 'ui', 'feature'];
  const hasTech = techWords.some(word => content.toLowerCase().includes(word));
  if (hasTech) score += 0.1;
  
  // Length penalties/bonuses
  if (content.length < 50) score -= 0.2;
  if (content.length > 100 && content.length < 500) score += 0.1;
  if (content.length > 1000) score -= 0.1;
  
  // Clarity deductions
  const vagueWords = ['something', 'anything', 'maybe', 'perhaps', 'kind of', 'sort of'];
  const vagueCount = vagueWords.filter(word => content.toLowerCase().includes(word)).length;
  score -= vagueCount * 0.1;
  
  return Math.max(0.1, Math.min(1.0, score));
}

function calculateConfidence(content: string, method: string): number {
  const baseConfidence: Record<string, number> = {
    'explicit_marker': 0.95,
    'action_sentence': 0.85,
    'question': 0.75,
    'list_item': 0.7,
    'header': 0.6,
    'code_comment': 0.9,
    'paragraph': 0.6
  };
  
  let confidence = baseConfidence[method] || 0.5;
  
  // Adjust based on content characteristics
  if (content.includes('?')) confidence += 0.1;
  if (isLikelyPrompt(content)) confidence += 0.1;
  if (content.length < 30) confidence -= 0.2;
  
  return Math.max(0.1, Math.min(1.0, confidence));
}

function extractContext(text: string, position: number, radius: number = 150): string {
  const start = Math.max(0, position - radius);
  const end = Math.min(text.length, position + radius);
  return text.substring(start, end);
}

function estimateTokenCount(text: string): number {
  // More accurate token estimation
  const words = text.split(/\s+/).length;
  const characters = text.length;
  
  // GPT-style tokenization estimate: ~0.75 tokens per word, ~4 chars per token
  const wordBasedEstimate = Math.ceil(words * 0.75);
  const charBasedEstimate = Math.ceil(characters / 4);
  
  return Math.max(wordBasedEstimate, charBasedEstimate);
}

function removeDuplicatePrompts(prompts: ExtractedPrompt[]): ExtractedPrompt[] {
  const unique: ExtractedPrompt[] = [];
  const seen = new Set<string>();
  
  for (const prompt of prompts) {
    const normalized = normalizeForComparison(prompt.content);
    
    if (!seen.has(normalized)) {
      // Check for high similarity with existing prompts
      const similarityThreshold = 0.85;
      const hasSimilar = unique.some(existing => 
        calculateTextSimilarity(normalized, normalizeForComparison(existing.content)) > similarityThreshold
      );
      
      if (!hasSimilar) {
        unique.push(prompt);
        seen.add(normalized);
      }
    }
  }
  
  return unique;
}

function normalizeForComparison(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.split(' '));
  const words2 = new Set(text2.split(' '));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

function generateOptimizationSuggestions(content: string): string[] {
  const suggestions: string[] = [];
  
  // Check for vague language
  const vagueWords = ['something', 'anything', 'stuff', 'things'];
  if (vagueWords.some(word => content.toLowerCase().includes(word))) {
    suggestions.push('Be more specific about what you want created');
  }
  
  // Check for missing context
  if (content.length < 100) {
    suggestions.push('Add more context and details to improve results');
  }
  
  // Check for missing platform specifics
  if (!content.toLowerCase().includes('component') && !content.toLowerCase().includes('function')) {
    suggestions.push('Specify if you want a component, function, or other code structure');
  }
  
  // Check for missing requirements
  if (!content.includes('should') && !content.includes('must') && !content.includes('require')) {
    suggestions.push('Include specific requirements or constraints');
  }
  
  return suggestions;
}

function generatePromptId(): string {
  return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Enhanced prompt optimization
export function optimizePrompt(originalPrompt: string): string {
  let optimized = originalPrompt;
  
  // Add specificity if missing
  if (!optimized.includes('specific') && !optimized.includes('detailed')) {
    optimized = optimized.replace(/^/, 'Create a detailed ');
  }
  
  // Ensure action words are present
  const actionWords = ['create', 'build', 'implement', 'develop', 'design'];
  const hasAction = actionWords.some(word => optimized.toLowerCase().includes(word));
  
  if (!hasAction) {
    optimized = `Create ${optimized.toLowerCase()}`;
  }
  
  // Add context for better results
  if (optimized.length < 100) {
    optimized += '. Make sure it follows modern best practices and is well-documented.';
  }
  
  return optimized;
}

// Platform-specific optimization
export function optimizeForPlatform(prompt: string, platform: string): string {
  const platformOptimizations: Record<string, (prompt: string) => string> = {
    'lovable.dev': (p) => `${p}\n\nUse React, TypeScript, and Tailwind CSS. Make it responsive and accessible.`,
    'bolt.new': (p) => `${p}\n\nInclude proper error handling and make it production-ready.`,
    'v0.dev': (p) => `${p}\n\nUse Vercel design system and modern UI patterns.`,
    'cursor.so': (p) => `${p}\n\nWrite clean, well-commented code with proper TypeScript types.`,
    'claude.ai': (p) => `${p}\n\nProvide detailed explanations and consider edge cases.`
  };
  
  const optimizer = platformOptimizations[platform];
  return optimizer ? optimizer(prompt) : prompt;
}

// Quality assessment for extracted prompts
export function assessPromptQuality(prompt: ExtractedPrompt): {
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = prompt.qualityScore;
  
  // Check for common issues
  if (prompt.content.length < 50) {
    issues.push('Prompt is too short');
    suggestions.push('Add more details and context');
    score -= 0.2;
  }
  
  if (prompt.content.length > 1500) {
    issues.push('Prompt is very long');
    suggestions.push('Consider breaking into smaller, focused prompts');
    score -= 0.1;
  }
  
  const vagueWords = ['something', 'anything', 'stuff', 'things'];
  const hasVague = vagueWords.some(word => prompt.content.toLowerCase().includes(word));
  if (hasVague) {
    issues.push('Contains vague language');
    suggestions.push('Replace vague terms with specific requirements');
    score -= 0.15;
  }
  
  return {
    score: Math.max(0.1, Math.min(1.0, score)),
    issues,
    suggestions: [...suggestions, ...(prompt.suggestions || [])]
  };
}
