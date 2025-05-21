import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This is a placeholder for your actual evaluation AI client
// and database logic.
// import { evaluationAI } from '@/lib/evaluation-ai-client'; 
// import { db } from '@/lib/database';

// --- Initialize Supabase client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null; // Use SupabaseClient type
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized.');
} else {
  console.warn("Supabase URL or Anon Key is not set in environment variables. Database operations will be skipped.");
}
// --- End Supabase client initialization ---

// Define the Zod schema for the AI diagnostic form
export const aiDiagnosticSchema = z.object({
  // Personal Info
  name: z.string().min(1),
  age: z.string().describe('A number between 0 and 120'),
  gender: z.string().describe('Must be one of: male, female, other, prefer_not_to_say'),

  // Work Info
  role: z.string().optional(),
  daily_tasks: z.string().optional(),

  // AI Usage
  ai_usage_frequency: z.string().describe('Must be one of: daily, weekly, monthly, never'),
  ai_use_cases: z.string().describe('Comma-separated list of ways the user uses AI'),
  has_used_chatgpt: z.string().describe('true or false'),
  has_used_copilot: z.string().describe('true or false'),
  copilot_apps_used: z.string().describe('Comma-separated list of applications where they use Copilot'),

  // Skills & Confidence
  prompt_example: z.string().optional(),
  prompting_skill_level: z.string().describe('Must be one of: beginner, intermediate, advanced'),
  ai_confidence_level: z.string().describe('Must be one of: low, medium, high'),
  curiosity_level: z.string().describe('Must be one of: low, medium, high'),

  // Outcome & Training
  estimated_time_saved: z.string().describe('Number of minutes saved per week, between 0 and 600'),
  has_received_ai_training: z.string().describe('true or false'),

  // AI Summary
  summary_of_skills: z.string().optional(),

  // Timestamp
  submitted_at: z.string().describe('ISO datetime string')
});

// Define the Zod schema for the desired evaluation output
// CUSTOMIZE THIS SCHEMA TO YOUR NEEDS
const evaluationSchema = z.object({
  evaluationSummary: z.string().describe("A brief overall summary of the user\'s performance."),
  strengths: z.array(z.string()).describe("List of identified strengths."),
  areasForImprovement: z.array(z.string()).describe("List of areas needing improvement."),
  finalScore: z.number().optional().describe("An optional numerical score if applicable."),
  detailedFeedback: z.array(
    z.object({
      relevantQuestion: z.string().optional().describe("The key question or topic from the conversation being assessed."),
      userResponseSnippet: z.string().optional().describe("A snippet of the user\'s response related to this point."),
      assessment: z.string().describe("Specific feedback on this part of the interaction.")
    })
  ).optional().describe("Detailed feedback on specific parts of the conversation.")
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required in the request body.' },
        { status: 400 }
      );
    }

    console.log('Received conversation for evaluation:', JSON.stringify(messages, null, 2));

    const conversationText = messages.map((m: { role: string; content: string; }) => `${m.role}: ${m.content}`).join('\n');
    const prompt = `You are an expert evaluator for a diagnostic exam. 
Based on the following conversation transcript, provide a structured evaluation of the user\'s performance.
Focus on identifying their understanding, strengths, and areas for improvement.

Conversation:
${conversationText}

Please generate the evaluation according to the defined schema.`;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    
    const { object: evaluationResult } = await generateObject({
      model: openai('gpt-4o'), 
      schema: evaluationSchema, // Consistently using evaluationSchema
      prompt: prompt,
    });

    console.log('Structured evaluation result:', evaluationResult);

    // --- Save to Supabase database ---
    if (supabase) {
      const { data, error: dbError } = await supabase
        .from('evaluations') // Replace 'evaluations' with your actual table name
        .insert([
          { 
            conversation_transcript: messages, 
            evaluation_data: evaluationResult, 
          },
        ])
        .select(); 
    
      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        return NextResponse.json(
          { 
            message: 'Evaluation processed but failed to save to database.', 
            evaluation: evaluationResult,
            dbError: dbError.message
          },
          { status: 500 } 
        );
      } else {
        console.log('Evaluation saved to Supabase:', data);
      }
    } else {
      console.warn("Supabase client not initialized. Skipping database operation.");
      return NextResponse.json(
        { 
          message: 'Evaluation processed but database operation was skipped (Supabase not configured).', 
          evaluation: evaluationResult 
        },
        { status: 200 } 
      );
    }
    // --- End Supabase save ---

    return NextResponse.json(
      { 
        message: 'Evaluation processed and saved successfully.', 
        evaluation: evaluationResult 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in evaluation endpoint:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: 'Failed to process evaluation request.', details: errorMessage },
      { status: 500 }
    );
  }
} 