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
Tu tarea es calificar cada respuesta con un número del 1 al 5, donde:
	•	1 = No sabe del tema o la respuesta está muy incorrecta.
	•	2 = Muestra una idea vaga o incompleta.
	•	3 = Conoce el término pero lo explica superficialmente.
	•	4 = Tiene buen entendimiento y explica con claridad.
	•	5 = Explica con precisión, usando ejemplos correctos y lenguaje técnico adecuado.

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

    // Helper function to safely parse integers from strings (1-5 scale)
    const parseIntScale = (value: string | undefined): number | null => {
      if (!value) return null;
      const num = parseInt(value, 10);
      return (num >= 1 && num <= 5) ? num : null;
    };

    // Helper function to parse JSON arrays from strings
    const parseJsonArray = (value: string | undefined): string[] | null => {
      if (!value) return null;
      try {
        // If it's already an array string like "['laptop', 'celular']"
        const parsed = JSON.parse(value.replace(/'/g, '"')); // Replace single quotes with double quotes
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        // If parsing fails, try to split by comma and clean up
        const items = value.split(',').map(item => item.trim().replace(/[\[\]'"]/g, ''));
        return items.filter(item => item.length > 0);
      }
    };

    // Convert string responses to proper data types for database
    const typedEvaluationResult = {
      // Basic Information (text fields)
      nombre: evaluationResultStrings.nombre,
      nombre_y_puesto: evaluationResultStrings.nombre_y_puesto,
      area_principal_trabajo: evaluationResultStrings.area_principal_trabajo,
      edad: parseIntScale(evaluationResultStrings.edad),
      
      // AI Knowledge Assessment (1-5 integers)
      sabe_que_es_llm: parseIntScale(evaluationResultStrings.sabe_que_es_llm),
      conoce_pretraining_finetuning: parseIntScale(evaluationResultStrings.conoce_pretraining_finetuning),
      conoce_4_partes_prompt: parseIntScale(evaluationResultStrings.conoce_4_partes_prompt),
      
      // Department Usage (1-5 integers)
      uso_por_departamento: parseIntScale(evaluationResultStrings.uso_por_departamento),
      
      // Training and Confidence (1-5 integers)
      capacitacion_formal: parseIntScale(evaluationResultStrings.capacitacion_formal),
      confia_en_ia: parseIntScale(evaluationResultStrings.confia_en_ia),
      curiosidad_explorar_ia: parseIntScale(evaluationResultStrings.curiosidad_explorar_ia),
      
      // Devices and Tools (JSON arrays)
      dispositivos_ia: parseJsonArray(evaluationResultStrings.dispositivos_ia),
      uso_herramientas_ia: parseJsonArray(evaluationResultStrings.uso_herramientas_ia),
      
      // Department-specific AI Usage (1-5 integers)
      uso_ia_ventas: parseIntScale(evaluationResultStrings.uso_ia_ventas),
      uso_ia_marketing: parseIntScale(evaluationResultStrings.uso_ia_marketing),
      uso_ia_finanzas: parseIntScale(evaluationResultStrings.uso_ia_finanzas),
      uso_ia_administracion: parseIntScale(evaluationResultStrings.uso_ia_administracion),
      
      // Impact and Challenges (1-5 integers)
      tiempo_ahorrado: parseIntScale(evaluationResultStrings.tiempo_ahorrado),
      retos_actuales_ia: parseIntScale(evaluationResultStrings.retos_actuales_ia)
    };

    console.log('Typed evaluation result:', typedEvaluationResult);

    if (supabase) {
      const insertData = {
        conversation_id: conversationId,
        user_email: userEmail,
        conversation_transcript: messages,
        
        // Use the new schema fields
        nombre: typedEvaluationResult.nombre,
        nombre_y_puesto: typedEvaluationResult.nombre_y_puesto,
        area_principal_trabajo: typedEvaluationResult.area_principal_trabajo,
        edad: typedEvaluationResult.edad,
        sabe_que_es_llm: typedEvaluationResult.sabe_que_es_llm,
        conoce_pretraining_finetuning: typedEvaluationResult.conoce_pretraining_finetuning,
        conoce_4_partes_prompt: typedEvaluationResult.conoce_4_partes_prompt,
        uso_por_departamento: typedEvaluationResult.uso_por_departamento,
        capacitacion_formal: typedEvaluationResult.capacitacion_formal,
        confia_en_ia: typedEvaluationResult.confia_en_ia,
        curiosidad_explorar_ia: typedEvaluationResult.curiosidad_explorar_ia,
                 dispositivos_ia: typedEvaluationResult.dispositivos_ia,
         uso_herramientas_ia: typedEvaluationResult.uso_herramientas_ia,
        uso_ia_ventas: typedEvaluationResult.uso_ia_ventas,
        uso_ia_marketing: typedEvaluationResult.uso_ia_marketing,
        uso_ia_finanzas: typedEvaluationResult.uso_ia_finanzas,
        uso_ia_administracion: typedEvaluationResult.uso_ia_administracion,
        tiempo_ahorrado: typedEvaluationResult.tiempo_ahorrado,
        retos_actuales_ia: typedEvaluationResult.retos_actuales_ia,
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