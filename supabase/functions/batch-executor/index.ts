
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BatchExecutionRequest {
  batchId: string;
  action: 'execute' | 'pause' | 'resume' | 'cancel' | 'schedule';
  executionMode?: 'sequential' | 'parallel';
  scheduledTime?: string;
  maxConcurrency?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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

    const { batchId, action, executionMode = 'sequential', scheduledTime, maxConcurrency = 3 } = await req.json() as BatchExecutionRequest

    // Verify user owns the batch
    const { data: batch, error: batchError } = await supabaseClient
      .from('prompt_batches')
      .select('*')
      .eq('id', batchId)
      .eq('user_id', user.id)
      .single()

    if (batchError || !batch) {
      throw new Error('Batch not found or unauthorized')
    }

    switch (action) {
      case 'execute':
        return await executeBatch(supabaseClient, batchId, executionMode, maxConcurrency)
      case 'pause':
        return await pauseBatch(supabaseClient, batchId)
      case 'resume':
        return await resumeBatch(supabaseClient, batchId)
      case 'cancel':
        return await cancelBatch(supabaseClient, batchId)
      case 'schedule':
        return await scheduleBatch(supabaseClient, batchId, scheduledTime!)
      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function executeBatch(supabaseClient: any, batchId: string, executionMode: string, maxConcurrency: number) {
  // Get all prompts for the batch
  const { data: prompts, error: promptsError } = await supabaseClient
    .from('prompts')
    .select('*')
    .eq('batch_id', batchId)
    .order('execution_order', { ascending: true })

  if (promptsError) throw promptsError

  // Create execution state
  const { error: stateError } = await supabaseClient
    .from('batch_execution_state')
    .upsert({
      batch_id: batchId,
      execution_mode: executionMode,
      current_step: 0,
      total_steps: prompts.length,
      progress_percentage: 0,
      execution_start: new Date().toISOString(),
      state_data: { max_concurrency: maxConcurrency }
    })

  if (stateError) throw stateError

  // Create jobs for each prompt
  const jobs = prompts.map((prompt: any, index: number) => ({
    batch_id: batchId,
    prompt_id: prompt.id,
    job_type: 'execute_prompt',
    priority: executionMode === 'parallel' ? 100 : (1000 - index), // Higher priority for parallel, sequential order for sequential
    metadata: {
      platform_target: prompt.platform_target,
      execution_order: prompt.execution_order || index,
      content: prompt.content
    }
  }))

  const { error: jobsError } = await supabaseClient
    .from('job_queue')
    .insert(jobs)

  if (jobsError) throw jobsError

  // Update batch status
  await supabaseClient
    .from('prompt_batches')
    .update({ status: 'running' })
    .eq('id', batchId)

  // Start job processor
  processJobs(supabaseClient, batchId, executionMode, maxConcurrency)

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Batch execution started in ${executionMode} mode`,
      jobsCreated: jobs.length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processJobs(supabaseClient: any, batchId: string, executionMode: string, maxConcurrency: number) {
  const concurrentWorkers = executionMode === 'parallel' ? maxConcurrency : 1
  const workers = Array.from({ length: concurrentWorkers }, (_, i) => 
    jobWorker(supabaseClient, batchId, i)
  )

  await Promise.allSettled(workers)
}

async function jobWorker(supabaseClient: any, batchId: string, workerId: number) {
  console.log(`Worker ${workerId} started for batch ${batchId}`)

  while (true) {
    try {
      // Get next job
      const { data: jobs, error } = await supabaseClient.rpc('get_next_job')
      
      if (error || !jobs || jobs.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before checking again
        continue
      }

      const job = jobs[0]
      
      // Check if this job belongs to our batch or if batch is cancelled/paused
      if (job.batch_id !== batchId) continue

      const { data: executionState } = await supabaseClient
        .from('batch_execution_state')
        .select('*')
        .eq('batch_id', batchId)
        .single()

      if (executionState?.paused_at || executionState?.cancelled_at) {
        break // Stop processing if batch is paused or cancelled
      }

      console.log(`Worker ${workerId} processing job ${job.job_id}`)

      // Process the job
      await processPromptJob(supabaseClient, job)

    } catch (error) {
      console.error(`Worker ${workerId} error:`, error)
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds on error
    }
  }
}

async function processPromptJob(supabaseClient: any, job: any) {
  const startTime = Date.now()

  try {
    // Simulate platform execution (replace with actual platform integration)
    const result = await executeOnPlatform(job.metadata.platform_target, job.metadata.content)
    
    const executionTime = Date.now() - startTime

    // Mark job as completed
    await supabaseClient
      .from('job_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', job.job_id)

    // Update prompt status
    await supabaseClient
      .from('prompts')
      .update({
        status: 'completed',
        project_url: result.project_url
      })
      .eq('id', job.prompt_id)

    // Log execution metrics
    await supabaseClient
      .from('execution_metrics')
      .insert({
        batch_id: job.batch_id,
        prompt_id: job.prompt_id,
        platform_name: job.metadata.platform_target,
        execution_time_ms: executionTime,
        success_rate: 100,
        tokens_consumed: result.tokens_used || 0
      })

  } catch (error) {
    console.error('Job execution failed:', error)

    // Mark job as failed and handle retries
    const { data: currentJob } = await supabaseClient
      .from('job_queue')
      .select('retry_attempts, max_retries')
      .eq('id', job.job_id)
      .single()

    if (currentJob && currentJob.retry_attempts < currentJob.max_retries) {
      // Retry with exponential backoff
      const backoffDelay = Math.pow(2, currentJob.retry_attempts) * 1000
      
      await supabaseClient
        .from('job_queue')
        .update({
          status: 'pending',
          retry_attempts: currentJob.retry_attempts + 1,
          scheduled_at: new Date(Date.now() + backoffDelay).toISOString(),
          error_message: error.message
        })
        .eq('id', job.job_id)
    } else {
      // Max retries reached, mark as failed
      await supabaseClient
        .from('job_queue')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', job.job_id)

      await supabaseClient
        .from('prompts')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', job.prompt_id)
    }
  }
}

async function executeOnPlatform(platform: string, content: string) {
  // This is a simulation - replace with actual platform integrations
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000)) // Simulate 1-4 second execution
  
  return {
    project_url: `https://${platform}/project/${Math.random().toString(36).substring(7)}`,
    tokens_used: Math.floor(Math.random() * 1000) + 100
  }
}

async function pauseBatch(supabaseClient: any, batchId: string) {
  await supabaseClient
    .from('batch_execution_state')
    .update({ paused_at: new Date().toISOString() })
    .eq('batch_id', batchId)

  await supabaseClient
    .from('prompt_batches')
    .update({ status: 'paused' })
    .eq('id', batchId)

  return new Response(
    JSON.stringify({ success: true, message: 'Batch paused' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function resumeBatch(supabaseClient: any, batchId: string) {
  await supabaseClient
    .from('batch_execution_state')
    .update({ paused_at: null })
    .eq('batch_id', batchId)

  await supabaseClient
    .from('prompt_batches')
    .update({ status: 'running' })
    .eq('id', batchId)

  return new Response(
    JSON.stringify({ success: true, message: 'Batch resumed' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function cancelBatch(supabaseClient: any, batchId: string) {
  await supabaseClient
    .from('batch_execution_state')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('batch_id', batchId)

  await supabaseClient
    .from('job_queue')
    .update({ status: 'cancelled' })
    .eq('batch_id', batchId)
    .in('status', ['pending', 'running'])

  await supabaseClient
    .from('prompt_batches')
    .update({ status: 'cancelled' })
    .eq('id', batchId)

  return new Response(
    JSON.stringify({ success: true, message: 'Batch cancelled' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function scheduleBatch(supabaseClient: any, batchId: string, scheduledTime: string) {
  await supabaseClient
    .from('batch_schedules')
    .insert({
      batch_id: batchId,
      scheduled_time: scheduledTime,
      schedule_type: 'once'
    })

  return new Response(
    JSON.stringify({ success: true, message: 'Batch scheduled' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
