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

// Define the Zod schema for the desired evaluation output
export const IAFormSchema = z.object({
  nombre_empresa_comercial: z.string().describe("Nombre comercial de la EMPRESA en MAYÚSCULAS, no incluir sa de cv o esas cosas, solamente el nombre comercial junto en mayusculas"), 
  nombre_y_puesto: z.string().describe("Nombre completo y puesto laboral actual"),
  area_principal_trabajo: z.string().describe("Área principal en la que trabaja (solamente debe de haber 4 opciones: ventas, marketing, finanzas, administracion, categorizalas en esas 4 opciones)"),
  
  // Numeric fields - descriptions updated to explicitly ask for numbers
  anios_experiencia: z.string().describe("Años de experiencia laboral total, como un NÚMERO (ej: 5)"),
  nivel_office: z.string().describe("Nivel de dominio de Office (básico, intermedio, avanzado) - si es posible cuantificar o mantener como texto claro"), // This might be harder to quantify purely numerically, an option is to keep as string or map later
  herramientas_ia_usadas: z.string().describe("Herramientas de IA que usa actualmente, puede ser un de las siguientes: ChatGPT, Claude, Gemini, o cualquier otra herramienta de IA que no esté en la lista, si no está en la lista, escribe 'otra'"),
  horas_ia_semana: z.string().describe("Horas PROMEDIO de uso de IA por semana, como un NÚMERO (ej: 8)"),
  dispositivos_ia: z.string().describe("Dispositivos usados para trabajar con IA (solamente puede ser laptop, celular, tablet, o cualquier otro dispositivo que no esté en la lista, si no está en la lista, escribe 'otro')"),
  objetivo_ia: z.string().describe("Objetivo principal al usar IA (solamente puede ser ahorrar tiempo, mejorar calidad, aumentar ventas, aumentar productividad, o cualquier otro objetivo que no esté en la lista, si no está en la lista, escribe 'otro')"),
  
  sabe_que_es_llm: z.string().describe("¿Sabe qué es un LLM? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no sabe."),
  conoce_pretraining_finetuning: z.string().describe("¿Conoce los conceptos de pre-training y fine-tuning? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no conoce."),
  conoce_4_partes_prompt: z.string().describe("¿Conoce las 4 partes de un buen prompt? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no conoce."),
  habilidad_prompts: z.string().describe("Evaluación de su habilidad para crear prompts, como un NÚMERO del 1 al 5 (ej: 4)"),
  
  funciones_avanzadas_chatgpt: z.string().describe("Funciones avanzadas de ChatGPT usadas (ej. search, imágenes, subir docs, canvas, deep research agent)"),
  usos_ia_ventas: z.string().describe("Usos actuales o posibles de IA en el área de ventas. Debe ser una de estas categorías: 1) Análisis de leads y prospectos, 2) Automatización de seguimiento a clientes, 3) Predicción de ventas, 4) Generación de propuestas comerciales, 5) Otro (especificar)"),
  usos_ia_marketing: z.string().describe("Usos actuales o posibles de IA en el área de marketing. Debe ser una de estas categorías: 1) Generación de contenido, 2) Análisis de datos y tendencias, 3) Segmentación de audiencias, 4) Optimización de campañas, 5) Otro (especificar)"),
  usos_ia_finanzas: z.string().describe("Usos actuales o posibles de IA en el área de finanzas. Debe ser una de estas categorías: 1) Análisis de riesgos, 2) Predicción de flujos de caja, 3) Automatización de reportes, 4) Detección de fraudes, 5) Otro (especificar)"),
  
  usado_copilot_web: z.string().describe("¿Ha usado Copilot en versión web? Responder con 'sí' o 'no' preferentemente."),
  usado_copilot_excel: z.string().describe("¿Ha usado Copilot en Excel? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_word: z.string().describe("¿Ha usado Copilot en Word? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_outlook: z.string().describe("¿Ha usado Copilot en Outlook? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_power_platform: z.string().describe("¿Ha usado Copilot en Power BI, Power Apps o Power Automate? Enumere. Indicar 'sí' o 'no' sobre el uso general."),
  
  tiempo_ahorrado: z.string().describe("TOTAL de minutos u horas que ahorra al día con IA, preferiblemente como un NÚMERO de minutos (ej: 120 para 2 horas)"),
  ejemplos_mejoras_ia: z.string().describe("Ejemplos concretos de decisiones mejoradas o errores evitados gracias a la IA. Formato de testimonio. "),
  retos_actuales_ia: z.string().describe("Principales retos o barreras actuales. Debe ser una de estas categorías: 1) Seguridad y privacidad de datos, 2) Falta de conocimientos técnicos, 3) Costos de implementación y licencias, 4) Resistencia al cambio organizacional, 5) Integración con sistemas existentes, 6) Calidad y confiabilidad de resultados, 7) Limitaciones técnicas o de infraestructura, 8) Aspectos éticos y regulatorios, 9) Gestión del cambio y capacitación, 10) Otro (especificar)"),
  tema_a_profundizar: z.string().describe("Tema relacionado con IA que más desea profundizar. Debe ser una de estas categorías: 1) Generación de contenido, 2) Análisis de datos y tendencias, 3) Segmentación de audiencias, 4) Optimización de campañas, 5) Otro (especificar)"),
  
  capacitacion_formal: z.string().describe("¿Ha recibido capacitación formal en IA? Responder con 'sí' o 'no' preferentemente."),
  confianza_resultados_ia: z.string().describe("Nivel de confianza en resultados de IA, como un NÚMERO del 1 al 5 (ej: 3)"),
  curiosidad_explorar_ia: z.string().describe("Nivel de curiosidad por explorar nuevas funciones de IA, como un NÚMERO del 1 al 5 (ej: 5)")
});

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