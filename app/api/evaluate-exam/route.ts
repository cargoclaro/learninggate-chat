import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IAFormSchema } from '../../../lib/evaluation-schema';

// This is a placeholder for your actual evaluation AI client
// and database logic.
// import { evaluationAI } from '@/lib/evaluation-ai-client'; 
// import { db } from '@/lib/database';

// --- Initialize Supabase client ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null; // Use SupabaseClient type
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized.');
} else {
  console.warn("Supabase URL or Anon Key is not set in environment variables. Database operations will be skipped.");
}
// --- End Supabase client initialization ---

// Schema is now imported from lib/evaluation-schema.ts

export async function POST(req: Request) {
  try {
    // Destructure conversationId along with messages from the request body
    const { messages, conversationId, userEmail /* other potential fields if any */ } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required in the request body.' },
        { status: 400 }
      );
    }
    // Validate conversationId
    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { error: 'Valid conversationId is required in the request body.' },
        { status: 400 }
      );
    }
    // Validate userEmail
    if (!userEmail || typeof userEmail !== 'string') { // Basic check, can be improved with regex for email format
      return NextResponse.json(
        { error: 'Valid userEmail is required in the request body.' },
        { status: 400 }
      );
    }

    console.log(`Received conversation for evaluation. Conversation ID: ${conversationId}, User Email: ${userEmail}`);
    console.log('Messages:', JSON.stringify(messages, null, 2));

    const conversationText = messages.map((m: { role: string; content: string; }) => `${m.role}: ${m.content}`).join('\n');
    const prompt = `Eres un experto evaluador de un examen de diagnostico de IA. 
Basado en el siguiente transcripto de la conversacion, proporciona una evaluacion estructurada del rendimiento del usuario.
Enfocate en identificar su comprension, fortalezas y areas para mejorar.

Transcript:
${conversationText}

Genera la evaluacion de acuerdo al esquema definido.`;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    
    const { object: evaluationResultStrings } = await generateObject({
      model: openai('gpt-4o'), 
      schema: IAFormSchema, // This schema expects all strings as per our current setup
      prompt: prompt,
    });

    console.log('LLM string-based evaluation result:', evaluationResultStrings);

    // --- Manual Type Conversion --- 
    // Helper function to safely parse integers from strings
    const parseIntOrNull = (value: string | undefined, allowNaNAsNull: boolean = true): number | null => {
      if (value === undefined || value === null || value.trim() === '') return null;
      const num = parseInt(value, 10);
      return isNaN(num) && allowNaNAsNull ? null : (isNaN(num) ? 0 : num); // Default to 0 if parsing fails & not allowing null for NaN
    };

    // Helper function to safely parse booleans from strings
    const parseBooleanOrNull = (value: string | undefined): boolean | null => {
      if (value === undefined || value === null || value.trim() === '') return null;
      const lowerVal = value.toLowerCase();
      if (['true', 'sí', 'si', 'yes', '1'].includes(lowerVal)) return true;
      if (['false', 'no', '0'].includes(lowerVal)) return false;
      return null; // Or a default boolean like false, depending on requirements
    };

    const typedEvaluationResult = {
      // Keep string fields as they are
      nombre_empresa_comercial: evaluationResultStrings.nombre_empresa_comercial,
      nombre_y_puesto: evaluationResultStrings.nombre_y_puesto,
      area_principal_trabajo: evaluationResultStrings.area_principal_trabajo,
      nivel_office: evaluationResultStrings.nivel_office,
      herramientas_ia_usadas: evaluationResultStrings.herramientas_ia_usadas,
      dispositivos_ia: evaluationResultStrings.dispositivos_ia,
      objetivo_ia: evaluationResultStrings.objetivo_ia,
      funciones_avanzadas_chatgpt: evaluationResultStrings.funciones_avanzadas_chatgpt,
      usos_ia_ventas: evaluationResultStrings.usos_ia_ventas,
      usos_ia_marketing: evaluationResultStrings.usos_ia_marketing,
      usos_ia_finanzas: evaluationResultStrings.usos_ia_finanzas,
      usado_copilot_excel: evaluationResultStrings.usado_copilot_excel,
      usado_copilot_word: evaluationResultStrings.usado_copilot_word,
      usado_copilot_outlook: evaluationResultStrings.usado_copilot_outlook,
      usado_copilot_power_platform: evaluationResultStrings.usado_copilot_power_platform,
      ejemplos_mejoras_ia: evaluationResultStrings.ejemplos_mejoras_ia,
      retos_actuales_ia: evaluationResultStrings.retos_actuales_ia,
      tema_a_profundizar: evaluationResultStrings.tema_a_profundizar,

      // Fields to be converted
      anios_experiencia: parseIntOrNull(evaluationResultStrings.anios_experiencia),
      horas_ia_semana: parseIntOrNull(evaluationResultStrings.horas_ia_semana),
      sabe_que_es_llm: parseBooleanOrNull(evaluationResultStrings.sabe_que_es_llm),
      conoce_pretraining_finetuning: parseBooleanOrNull(evaluationResultStrings.conoce_pretraining_finetuning),
      conoce_4_partes_prompt: parseBooleanOrNull(evaluationResultStrings.conoce_4_partes_prompt),
      habilidad_prompts: parseIntOrNull(evaluationResultStrings.habilidad_prompts),
      usado_copilot_web: parseBooleanOrNull(evaluationResultStrings.usado_copilot_web),
      tiempo_ahorrado: parseIntOrNull(evaluationResultStrings.tiempo_ahorrado),
      capacitacion_formal: parseBooleanOrNull(evaluationResultStrings.capacitacion_formal),
      confianza_resultados_ia: parseIntOrNull(evaluationResultStrings.confianza_resultados_ia),
      curiosidad_explorar_ia: parseIntOrNull(evaluationResultStrings.curiosidad_explorar_ia),
    };

    console.log('Manually typed evaluation result:', typedEvaluationResult);

    // --- End Manual Type Conversion ---

    if (supabase) {
      const insertData = {
        conversation_id: conversationId,
        user_email: userEmail,
        conversation_transcript: messages,
        
        // Use the typedEvaluationResult for insertion
        nombre_empresa_comercial: typedEvaluationResult.nombre_empresa_comercial,
        nombre_y_puesto: typedEvaluationResult.nombre_y_puesto,
        area_principal_trabajo: typedEvaluationResult.area_principal_trabajo,
        anios_experiencia: typedEvaluationResult.anios_experiencia,
        nivel_office: typedEvaluationResult.nivel_office,
        herramientas_ia_usadas: typedEvaluationResult.herramientas_ia_usadas,
        horas_ia_semana: typedEvaluationResult.horas_ia_semana,
        dispositivos_ia: typedEvaluationResult.dispositivos_ia,
        objetivo_ia: typedEvaluationResult.objetivo_ia,
        sabe_que_es_llm: typedEvaluationResult.sabe_que_es_llm,
        conoce_pretraining_finetuning: typedEvaluationResult.conoce_pretraining_finetuning,
        conoce_4_partes_prompt: typedEvaluationResult.conoce_4_partes_prompt,
        habilidad_prompts: typedEvaluationResult.habilidad_prompts,
        funciones_avanzadas_chatgpt: typedEvaluationResult.funciones_avanzadas_chatgpt,
        usos_ia_ventas: typedEvaluationResult.usos_ia_ventas,
        usos_ia_marketing: typedEvaluationResult.usos_ia_marketing,
        usos_ia_finanzas: typedEvaluationResult.usos_ia_finanzas,
        usado_copilot_web: typedEvaluationResult.usado_copilot_web,
        usado_copilot_excel: typedEvaluationResult.usado_copilot_excel,
        usado_copilot_word: typedEvaluationResult.usado_copilot_word,
        usado_copilot_outlook: typedEvaluationResult.usado_copilot_outlook,
        usado_copilot_power_platform: typedEvaluationResult.usado_copilot_power_platform,
        tiempo_ahorrado: typedEvaluationResult.tiempo_ahorrado,
        ejemplos_mejoras_ia: typedEvaluationResult.ejemplos_mejoras_ia,
        retos_actuales_ia: typedEvaluationResult.retos_actuales_ia,
        tema_a_profundizar: typedEvaluationResult.tema_a_profundizar,
        capacitacion_formal: typedEvaluationResult.capacitacion_formal,
        confianza_resultados_ia: typedEvaluationResult.confianza_resultados_ia,
        curiosidad_explorar_ia: typedEvaluationResult.curiosidad_explorar_ia,
      };

      const { data, error: dbError } = await supabase
        .from('evaluations') 
        .insert([insertData]) // Insert the prepared object
        .select();
    
      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        return NextResponse.json(
          { 
            message: 'Evaluation processed but failed to save to database.', 
            evaluation: typedEvaluationResult,
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
          evaluation: typedEvaluationResult 
        },
        { status: 200 } 
      );
    }

    return NextResponse.json(
      { 
        message: 'Evaluation processed and saved successfully.', 
        evaluation: typedEvaluationResult 
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