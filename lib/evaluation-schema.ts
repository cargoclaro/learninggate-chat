import { z } from 'zod';

export const IAFormSchema = z.object({
  // Basic Information
  nombre: z.string().describe("STRING. Nombre de la empresa en mayúsculas y todo junto (ej: DATASOLUTIONS)"),
  nombre_y_puesto: z.string().describe("STRING. Nombre completo y puesto laboral actual (ej: Ana López - Gerente de Ventas)"),
  area_principal_trabajo: z.string().describe("STRING. Área principal: 'ventas', 'marketing', 'finanzas' o 'administracion'"),
  edad: z.string().describe("STRING REPRESENTA NÚMERO. Edad de la persona como número del 1 al 5: 1=18-25, 2=26-35, 3=36-45, 4=46-55, 5=56+"),

  // AI Knowledge Assessment
  sabe_que_es_llm: z.string().describe("STRING REPRESENTA NÚMERO. 1=No sabe nada, 2=Ha escuchado el término, 3=Conocimiento básico, 4=Buen entendimiento, 5=Conocimiento avanzado"),
  conoce_pretraining_finetuning: z.string().describe("STRING REPRESENTA NÚMERO. 1=No conoce, 2=Ha escuchado los términos, 3=Conocimiento básico, 4=Buen entendimiento, 5=Avanzado"),
  conoce_4_partes_prompt: z.string().describe("STRING REPRESENTA NÚMERO. 1=No conoce, 2=Parcialmente, 3=Básico, 4=Buen entendimiento, 5=Dominio completo"),

  // Department Usage
  uso_por_departamento: z.string().describe("STRING REPRESENTA NÚMERO. 1=No se usa, 2=Muy limitado, 3=Moderado, 4=Frecuente, 5=Uso intensivo diario"),

  // Training and Confidence
  capacitacion_formal: z.string().describe("STRING REPRESENTA NÚMERO. 1=Ninguna, 2=Básica, 3=Moderada, 4=Buena, 5=Extensiva"),
  confia_en_ia: z.string().describe("STRING REPRESENTA NÚMERO. 1=No confía, 2=Poca, 3=Moderada, 4=Buena, 5=Total"),
  curiosidad_explorar_ia: z.string().describe("STRING REPRESENTA NÚMERO. 1=Nada curioso, 2=Poco, 3=Moderadamente, 4=Muy, 5=Extremadamente curioso"),

  // Devices and Tools
  dispositivos_ia: z.string().describe("STRING DE ARRAY. Dispositivos usados, separados por comas (ej: 'laptop, celular, tablet')"),
  uso_herramientas_ia: z.string().describe("STRING DE ARRAY. Herramientas usadas, separadas por comas (ej: 'chatgpt, copilot, gemini')"),

  // Department-specific AI Usage
  uso_ia_ventas: z.string().describe("STRING REPRESENTA NÚMERO. 1=No usa, 2=Básico, 3=Moderado, 4=Avanzado, 5=Experto"),
  uso_ia_marketing: z.string().describe("STRING REPRESENTA NÚMERO. 1=No usa, 2=Básico, 3=Moderado, 4=Avanzado, 5=Experto"),
  uso_ia_finanzas: z.string().describe("STRING REPRESENTA NÚMERO. 1=No usa, 2=Básico, 3=Moderado, 4=Avanzado, 5=Experto"),
  uso_ia_administracion: z.string().describe("STRING REPRESENTA NÚMERO. 1=No usa, 2=Básico, 3=Moderado, 4=Avanzado, 5=Experto"),

  // Impact and Challenges
  tiempo_ahorrado: z.string().describe("STRING REPRESENTA NÚMERO. 1=0-15 min, 2=16-30 min, 3=31-60 min, 4=1-2 horas, 5=Más de 2 horas"),
  retos_actuales_ia: z.string().describe("STRING REPRESENTA NÚMERO. 1=Sin retos, 2=Aprendizaje, 3=Integración, 4=Seguridad, 5=Resistencia organizacional"),

  // Nuevos campos para diagnóstico completo
  nivel_autonomia_ia: z.string().describe("STRING REPRESENTA NÚMERO. Nivel de autonomía al usar IA: 1=Siempre necesita ayuda, 5=Totalmente autónomo"),
  impacto_en_kpis: z.string().describe("STRING REPRESENTA NÚMERO. Impacto en KPIs: 1=Sin impacto, 2=Poco, 3=Moderado, 4=Alto, 5=Muy alto"),
  barreras_organizacionales: z.string().describe("STRING REPRESENTA NÚMERO. Barreras organizacionales: 1=Ninguna, 2=Pocas, 3=Moderadas, 4=Muchas, 5=Extremas"),
  oportunidad_de_mejora: z.string().describe("STRING REPRESENTA NÚMERO. Oportunidad de mejora: 1=Baja, 2=Poca, 3=Moderada, 4=Alta, 5=Muy alta"),
  prompt_practico: z.string().describe("STRING REPRESENTA NÚMERO. Calidad del prompt práctico: 1=Muy básico, 2=Básico, 3=Moderado, 4=Bueno, 5=Excelente")
});