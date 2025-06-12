
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TextExtractionRequest {
  text: string;
  extractionType: 'auto' | 'manual' | 'intelligent';
  options?: {
    minPromptLength?: number;
    maxPromptLength?: number;
    preserveContext?: boolean;
    removeDuplicates?: boolean;
    qualityThreshold?: number;
  };
}

interface BatchCreationRequest {
  batchName: string;
  description?: string;
  prompts: Array<{
    content: string;
    platform_target: string;
    execution_order: number;
  }>;
  tags?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (path.includes('/parse-text')) {
      const request = await req.json() as TextExtractionRequest
      return await parseText(request)
    } else if (path.includes('/create-batch')) {
      const request = await req.json() as BatchCreationRequest
      return await createBatchFromExtracted(supabaseClient, user.id, request)
    }

    throw new Error('Invalid endpoint')

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function parseText(request: TextExtractionRequest) {
  const { text, extractionType, options = {} } = request
  const {
    minPromptLength = 50,
    maxPromptLength = 5000,
    preserveContext = true,
    removeDuplicates = true,
    qualityThreshold = 0.7
  } = options

  let extractedPrompts: any[] = []

  switch (extractionType) {
    case 'intelligent':
      extractedPrompts = await intelligentExtraction(text, options)
      break
    case 'auto':
      extractedPrompts = await automaticExtraction(text, options)
      break
    case 'manual':
      extractedPrompts = await manualExtraction(text, options)
      break
  }

  // Filter by length
  extractedPrompts = extractedPrompts.filter(prompt => 
    prompt.content.length >= minPromptLength && 
    prompt.content.length <= maxPromptLength
  )

  // Remove duplicates if requested
  if (removeDuplicates) {
    extractedPrompts = await removeDuplicatePrompts(extractedPrompts)
  }

  // Assess quality and filter
  extractedPrompts = await assessPromptQuality(extractedPrompts, qualityThreshold)

  // Add metadata
  extractedPrompts = extractedPrompts.map((prompt, index) => ({
    ...prompt,
    id: `extracted_${Date.now()}_${index}`,
    extractedAt: new Date().toISOString(),
    estimatedTokens: estimateTokenCount(prompt.content),
    qualityScore: prompt.qualityScore || 0.8
  }))

  return new Response(
    JSON.stringify({ 
      success: true, 
      extractedPrompts,
      totalCount: extractedPrompts.length,
      extractionType,
      processingTime: Date.now()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function intelligentExtraction(text: string, options: any) {
  // Advanced NLP-based extraction using pattern recognition
  const prompts: any[] = []
  
  // Split by common delimiters and patterns
  const patterns = [
    /(?:^|\n)(?:\d+\.|[-*]|\w+\))\s*(.+?)(?=\n(?:\d+\.|[-*]|\w+\))|$)/gms, // Numbered/bulleted lists
    /(?:^|\n)#{1,6}\s*(.+?)(?=\n#|$)/gms, // Markdown headers
    /(?:^|\n)(.+?(?:create|build|make|develop|implement|design|write|generate).+?)(?=\n|$)/gims, // Action-oriented sentences
    /(?:^|\n)(.+?\?)/gm, // Questions
    /(?:^|\n)(?:prompt|task|instruction|request):\s*(.+?)(?=\n(?:prompt|task|instruction|request):|$)/gims // Explicit prompt markers
  ]

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 20) {
        const content = match[1].trim()
        const context = extractContext(text, match.index || 0, 200)
        
        prompts.push({
          content,
          context,
          extractionMethod: 'intelligent',
          confidence: calculateConfidence(content)
        })
      }
    }
  }

  return prompts
}

async function automaticExtraction(text: string, options: any) {
  // Basic automatic extraction using simple heuristics
  const prompts: any[] = []
  
  // Split by paragraphs and sentences
  const paragraphs = text.split(/\n\s*\n/)
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim()
    
    if (paragraph.length > 30 && isLikelyPrompt(paragraph)) {
      prompts.push({
        content: paragraph,
        extractionMethod: 'automatic',
        confidence: 0.7,
        position: i
      })
    }
  }

  return prompts
}

async function manualExtraction(text: string, options: any) {
  // Simple line-by-line or paragraph extraction
  const prompts: any[] = []
  const lines = text.split('\n').filter(line => line.trim().length > 20)
  
  lines.forEach((line, index) => {
    prompts.push({
      content: line.trim(),
      extractionMethod: 'manual',
      confidence: 1.0,
      position: index
    })
  })

  return prompts
}

function extractContext(text: string, position: number, radius: number = 100) {
  const start = Math.max(0, position - radius)
  const end = Math.min(text.length, position + radius)
  return text.substring(start, end)
}

function calculateConfidence(content: string): number {
  let score = 0.5 // Base score
  
  // Increase score for action words
  const actionWords = ['create', 'build', 'make', 'develop', 'implement', 'design', 'write', 'generate', 'add', 'remove', 'update', 'modify']
  const actionCount = actionWords.filter(word => content.toLowerCase().includes(word)).length
  score += Math.min(actionCount * 0.1, 0.3)
  
  // Increase score for questions
  if (content.includes('?')) score += 0.1
  
  // Increase score for specific technical terms
  const techTerms = ['component', 'function', 'api', 'database', 'ui', 'interface', 'feature', 'button', 'form']
  const techCount = techTerms.filter(term => content.toLowerCase().includes(term)).length
  score += Math.min(techCount * 0.05, 0.2)
  
  // Decrease score for very short or very long content
  if (content.length < 30) score -= 0.2
  if (content.length > 1000) score -= 0.1
  
  return Math.max(0, Math.min(1, score))
}

function isLikelyPrompt(text: string): boolean {
  const indicators = [
    /\b(?:create|build|make|develop|implement|design|write|generate|add|remove|update|modify)\b/i,
    /\b(?:component|function|api|database|ui|interface|feature|button|form|page|screen)\b/i,
    /\?$/,
    /^(?:can you|please|would you|i need|help me)/i
  ]
  
  return indicators.some(pattern => pattern.test(text))
}

async function removeDuplicatePrompts(prompts: any[]): Promise<any[]> {
  const unique: any[] = []
  const seen = new Set<string>()
  
  for (const prompt of prompts) {
    const normalized = normalizeText(prompt.content)
    const similarity = await findMostSimilar(normalized, Array.from(seen))
    
    if (similarity < 0.8) { // 80% similarity threshold
      unique.push(prompt)
      seen.add(normalized)
    }
  }
  
  return unique
}

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function findMostSimilar(text: string, existing: string[]): Promise<number> {
  if (existing.length === 0) return 0
  
  let maxSimilarity = 0
  for (const existingText of existing) {
    const similarity = calculateSimilarity(text, existingText)
    maxSimilarity = Math.max(maxSimilarity, similarity)
  }
  
  return maxSimilarity
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(' ')
  const words2 = text2.split(' ')
  const intersection = words1.filter(word => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]
  
  return intersection.length / union.length
}

async function assessPromptQuality(prompts: any[], threshold: number): Promise<any[]> {
  return prompts.map(prompt => {
    const qualityScore = calculateQualityScore(prompt.content)
    return {
      ...prompt,
      qualityScore,
      qualityPassed: qualityScore >= threshold
    }
  }).filter(prompt => prompt.qualityPassed)
}

function calculateQualityScore(content: string): number {
  let score = 0.5
  
  // Check for completeness
  if (content.length > 100) score += 0.2
  if (content.length > 200) score += 0.1
  
  // Check for clarity (presence of specific terms)
  const clarityIndicators = ['specifically', 'exactly', 'precisely', 'detailed', 'step by step']
  if (clarityIndicators.some(indicator => content.toLowerCase().includes(indicator))) {
    score += 0.2
  }
  
  // Check for actionability
  const actionVerbs = ['create', 'build', 'implement', 'design', 'develop']
  if (actionVerbs.some(verb => content.toLowerCase().includes(verb))) {
    score += 0.2
  }
  
  // Penalize vague content
  const vagueWords = ['something', 'anything', 'maybe', 'perhaps', 'might']
  const vagueCount = vagueWords.filter(word => content.toLowerCase().includes(word)).length
  score -= vagueCount * 0.1
  
  return Math.max(0, Math.min(1, score))
}

function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

async function createBatchFromExtracted(supabaseClient: any, userId: string, request: BatchCreationRequest) {
  const { batchName, description, prompts, tags = [] } = request

  // Create the batch
  const { data: batch, error: batchError } = await supabaseClient
    .from('prompt_batches')
    .insert({
      user_id: userId,
      batch_name: batchName,
      description,
      tags,
      status: 'pending',
      platform_targets: [...new Set(prompts.map(p => p.platform_target))]
    })
    .select()
    .single()

  if (batchError) throw batchError

  // Create prompts
  const promptsToInsert = prompts.map((prompt, index) => ({
    batch_id: batch.id,
    content: prompt.content,
    original_prompt: prompt.content,
    platform_target: prompt.platform_target,
    execution_order: prompt.execution_order || index,
    status: 'pending'
  }))

  const { error: promptsError } = await supabaseClient
    .from('prompts')
    .insert(promptsToInsert)

  if (promptsError) throw promptsError

  return new Response(
    JSON.stringify({ 
      success: true, 
      batch,
      promptsCreated: prompts.length,
      message: 'Batch created successfully from extracted prompts'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
