
export interface ExtractedPrompt {
  id: string;
  content: string;
  originalPrompt: string;
  estimatedTokens: number;
  position: number;
}

export const extractPromptsFromText = (text: string): ExtractedPrompt[] => {
  // Remove extra whitespace and normalize line breaks
  const normalizedText = text.trim().replace(/\r\n/g, '\n');
  
  // Split by common delimiters
  const segments = splitByDelimiters(normalizedText);
  
  // Filter out empty or very short segments
  const validSegments = segments.filter(segment => 
    segment.trim().length > 10 && !isHeaderOrFooter(segment)
  );
  
  // Convert to ExtractedPrompt objects
  return validSegments.map((segment, index) => ({
    id: generateId(),
    content: segment.trim(),
    originalPrompt: segment.trim(),
    estimatedTokens: estimateTokenCount(segment),
    position: index
  }));
};

const splitByDelimiters = (text: string): string[] => {
  const delimiters = [
    /\n\s*\n\s*\n+/g, // Multiple line breaks
    /\n\s*[-=]{3,}\s*\n/g, // Horizontal lines
    /\n\s*\d+\.\s+/g, // Numbered lists
    /\n\s*[•\-*]\s+/g, // Bullet points
    /\n\s*#{1,6}\s+/g, // Markdown headers
    /\n\s*Prompt\s*\d*\s*[:]\s*/gi, // "Prompt:" labels
    /\n\s*Task\s*\d*\s*[:]\s*/gi, // "Task:" labels
    /\n\s*Request\s*\d*\s*[:]\s*/gi, // "Request:" labels
  ];
  
  let segments = [text];
  
  // Apply each delimiter
  delimiters.forEach(delimiter => {
    const newSegments: string[] = [];
    segments.forEach(segment => {
      const parts = segment.split(delimiter);
      newSegments.push(...parts);
    });
    segments = newSegments;
  });
  
  return segments;
};

const isHeaderOrFooter = (text: string): boolean => {
  const headerFooterPatterns = [
    /^\s*[-=]{3,}\s*$/,
    /^\s*\*{3,}\s*$/,
    /^\s*page\s+\d+/i,
    /^\s*table\s+of\s+contents/i,
    /^\s*index\s*$/i,
    /^\s*references?\s*$/i,
    /^\s*bibliography\s*$/i,
  ];
  
  return headerFooterPatterns.some(pattern => pattern.test(text.trim()));
};

const estimateTokenCount = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  // This is a simplified approach - in production, you'd use a proper tokenizer
  return Math.ceil(text.length / 4);
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const optimizePrompt = (prompt: string): string => {
  // Basic prompt optimization suggestions
  let optimized = prompt.trim();
  
  // Add structure if missing
  if (!optimized.includes('\n') && optimized.length > 100) {
    const sentences = optimized.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 2) {
      optimized = sentences.join('.\n\n') + '.';
    }
  }
  
  // Ensure clear instructions
  if (!hasActionWords(optimized)) {
    optimized = `Please ${optimized.toLowerCase()}`;
  }
  
  return optimized;
};

const hasActionWords = (text: string): boolean => {
  const actionWords = [
    'create', 'build', 'make', 'develop', 'design', 'implement',
    'write', 'generate', 'produce', 'construct', 'craft',
    'please', 'help', 'assist', 'can you', 'could you'
  ];
  
  const lowerText = text.toLowerCase();
  return actionWords.some(word => lowerText.includes(word));
};
