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
const IAFormSchema = z.object({
  nombre_y_puesto: z.string().describe("Nombre completo y puesto laboral actual"),
  area_principal_trabajo: z.string().describe("Área principal en la que trabaja (ej. ventas, marketing, finanzas)"),
  anios_experiencia: z.string().describe("Años de experiencia laboral total"),
  nivel_office: z.string().describe("Nivel de dominio de Office (básico, intermedio, avanzado)"),
  herramientas_ia_usadas: z.string().describe("Herramientas de IA que usa actualmente"),
  horas_ia_semana: z.string().describe("Horas de uso de IA por semana"),
  dispositivos_ia: z.string().describe("Dispositivos usados para trabajar con IA (ej. laptop, celular)"),
  objetivo_ia: z.string().describe("Objetivo principal al usar IA (ej. ahorrar tiempo, mejorar calidad)"),
  sabe_que_es_llm: z.string().describe("¿Sabe qué es un LLM? (sí/no o breve explicación)"),
  conoce_pretraining_finetuning: z.string().describe("¿Conoce los conceptos de pre-training y fine-tuning?"),
  conoce_4_partes_prompt: z.string().describe("¿Conoce las 4 partes de un buen prompt?"),
  habilidad_prompts: z.string().describe("Autoevaluación de su habilidad para crear prompts (1-5)"),
  funciones_avanzadas_chatgpt: z.string().describe("Funciones avanzadas de ChatGPT usadas (ej. search, imágenes, subir docs, canvas, agentes)"),
  usos_ia_ventas: z.string().describe("Usos actuales o posibles de IA en el área de ventas"),
  usos_ia_marketing: z.string().describe("Usos actuales o posibles de IA en el área de marketing"),
  usos_ia_finanzas: z.string().describe("Usos actuales o posibles de IA en el área de finanzas"),
  usado_copilot_web: z.string().describe("¿Ha usado Copilot en versión web?"),
  usado_copilot_excel: z.string().describe("¿Ha usado Copilot en Excel? Incluir ejemplos si es posible"),
  usado_copilot_word: z.string().describe("¿Ha usado Copilot en Word? Incluir ejemplos si es posible"),
  usado_copilot_outlook: z.string().describe("¿Ha usado Copilot en Outlook? Incluir ejemplos si es posible"),
  usado_copilot_power_platform: z.string().describe("¿Ha usado Copilot en Power BI, Power Apps o Power Automate? Enumere"),
  tiempo_ahorrado: z.string().describe("Minutos u horas que ahorra al día con IA"),
  ejemplos_mejoras_ia: z.string().describe("Ejemplos concretos de decisiones mejoradas o errores evitados gracias a la IA"),
  retos_actuales_ia: z.string().describe("Principales retos o barreras actuales (ej. seguridad, ideas, costos)"),
  tema_a_profundizar: z.string().describe("Tema relacionado con IA que más desea profundizar"),
  capacitacion_formal: z.string().describe("¿Ha recibido capacitación formal en IA?"),
  confianza_resultados_ia: z.string().describe("Nivel de confianza en resultados de IA (1-5)"),
  curiosidad_explorar_ia: z.string().describe("Nivel de curiosidad por explorar nuevas funciones de IA (1-5)")
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
      schema: IAFormSchema, // Use the new IAFormSchema here
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