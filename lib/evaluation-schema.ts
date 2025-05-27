import { z } from 'zod';

// Define the Zod schema for the desired evaluation output
export const IAFormSchema = z.object({
  // Basic Information
  nombre: z.string().describe("Nombre de la empresa en mayusculas y todo junto, nos servira para ponerle un nombre a la empresa en el reporte"),
  nombre_y_puesto: z.string().describe("Nombre completo y puesto laboral actual (ej: Ana López - Gerente de Ventas, Carlos Ruiz - Analista Financiero, Laura Martín - Coordinadora de Marketing)"),
  area_principal_trabajo: z.string().describe("Área principal en la que trabaja. Debe ser una de estas 4 opciones: ventas, marketing, finanzas, administracion"),
  edad: z.string().describe("Edad de la persona como un NÚMERO del 1 al 5 donde: 1=18-25 años, 2=26-35 años, 3=36-45 años, 4=46-55 años, 5=56+ años"),
  
  // AI Knowledge Assessment
  sabe_que_es_llm: z.string().describe("¿Sabe qué es un LLM (Large Language Model)? Evaluar del 1 al 5 donde: 1=No sabe nada, 2=Ha escuchado el término, 3=Conocimiento básico, 4=Buen entendimiento, 5=Conocimiento avanzado"),
  conoce_pretraining_finetuning: z.string().describe("¿Conoce los conceptos de pre-training y fine-tuning? Evaluar del 1 al 5 donde: 1=No conoce, 2=Ha escuchado los términos, 3=Conocimiento básico, 4=Buen entendimiento, 5=Conocimiento avanzado"),
  conoce_4_partes_prompt: z.string().describe("¿Conoce las 4 partes de un buen prompt (contexto, tarea, expectativa, rol)? Evaluar del 1 al 5 donde: 1=No conoce, 2=Conoce parcialmente, 3=Conocimiento básico, 4=Buen entendimiento, 5=Dominio completo"),
  
  // Department Usage
  uso_por_departamento: z.string().describe("Nivel de uso de IA en su departamento. Evaluar del 1 al 5 donde: 1=No se usa, 2=Uso muy limitado, 3=Uso moderado, 4=Uso frecuente, 5=Uso intensivo diario"),
  
  // Training and Confidence
  capacitacion_formal: z.string().describe("¿Ha recibido capacitación formal en IA? Evaluar del 1 al 5 donde: 1=Ninguna capacitación, 2=Capacitación muy básica, 3=Capacitación moderada, 4=Buena capacitación, 5=Capacitación extensiva"),
  confia_en_ia: z.string().describe("Nivel de confianza en los resultados de IA. Evaluar del 1 al 5 donde: 1=No confía, 2=Poca confianza, 3=Confianza moderada, 4=Buena confianza, 5=Confianza total"),
  curiosidad_explorar_ia: z.string().describe("Nivel de curiosidad por explorar nuevas funciones de IA. Evaluar del 1 al 5 donde: 1=Nada curioso, 2=Poco curioso, 3=Moderadamente curioso, 4=Muy curioso, 5=Extremadamente curioso"),
  
  // Devices and Tools
  dispositivos_ia: z.string().describe("Dispositivos usados para trabajar con IA. Debe ser un array con ejemplos como: ['laptop', 'celular'], ['tablet', 'laptop', 'celular'], ['laptop'], ['celular', 'tablet']"),
  uso_herramientas_ia: z.string().describe("Herramientas de IA que usa. Debe ser un array con algunas de estas opciones: ['chatgpt', 'copilot', 'gemini', 'perplexity', 'cursor', 'claude, otro']"),
  
  // Department-specific AI Usage
  uso_ia_ventas: z.string().describe("Uso de IA en ventas. Evaluar del 1 al 5 donde: 1=No usa IA, 2=Uso básico (emails), 3=Uso moderado (análisis de leads), 4=Uso avanzado (predicción de ventas), 5=Uso experto (automatización completa)"),
  uso_ia_marketing: z.string().describe("Uso de IA en marketing. Evaluar del 1 al 5 donde: 1=No usa IA, 2=Uso básico (contenido simple), 3=Uso moderado (análisis de datos), 4=Uso avanzado (segmentación), 5=Uso experto (optimización de campañas)"),
  uso_ia_finanzas: z.string().describe("Uso de IA en finanzas. Evaluar del 1 al 5 donde: 1=No usa IA, 2=Uso básico (cálculos simples), 3=Uso moderado (reportes), 4=Uso avanzado (análisis de riesgos), 5=Uso experto (predicción de flujos)"),
  uso_ia_administracion: z.string().describe("Uso de IA en administración. Evaluar del 1 al 5 donde: 1=No usa IA, 2=Uso básico (documentos), 3=Uso moderado (organización), 4=Uso avanzado (automatización), 5=Uso experto (gestión integral)"),
  
  // Impact and Challenges
  tiempo_ahorrado: z.string().describe("Tiempo ahorrado diariamente con IA. Evaluar del 1 al 5 donde: 1=0-15 minutos, 2=16-30 minutos, 3=31-60 minutos, 4=1-2 horas, 5=Más de 2 horas"),
  retos_actuales_ia: z.string().describe("Principales retos con IA. Evaluar del 1 al 5 donde: 1=Sin retos significativos, 2=Retos menores (aprendizaje), 3=Retos moderados (integración), 4=Retos importantes (seguridad), 5=Retos críticos (resistencia organizacional)")
});     