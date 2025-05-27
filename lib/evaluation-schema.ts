import { z } from 'zod';

// Define the Zod schema for the desired evaluation output
export const IAFormSchema = z.object({
  nombre_empresa_comercial: z.string().describe("Nombre comercial de la EMPRESA en MAYÚSCULAS, no incluir sa de cv o esas cosas, solamente el nombre comercial junto en mayusculas"), 
  nombre_y_puesto: z.string().describe("Nombre completo y puesto laboral actual"),
  area_principal_trabajo: z.string().describe("Área principal en la que trabaja (solamente debe de haber 4 opciones: ventas, marketing, finanzas, administracion, categorizalas en esas 4 opciones)"),
  
  // Numeric fields - descriptions updated to explicitly ask for numbers
  anios_experiencia: z.string().describe("Años de experiencia laboral total, como un NÚMERO (ej: 5)"),
  nivel_office: z.string().describe("Nivel de dominio de Office (básico, intermedio, avanzado) - si es posible cuantificar o mantener como texto claro"), 
  herramientas_ia_usadas: z.string().describe("Herramientas de IA que usa actualmente, puede ser una de las siguientes: ChatGPT, Claude, Gemini, Bard, Midjourney"),
  horas_ia_semana: z.string().describe("Horas PROMEDIO de uso de IA por semana, como un NÚMERO (ej: 8)"),
  dispositivos_ia: z.string().describe("Dispositivos usados para trabajar con IA (solamente puede ser laptop, celular, tablet)"),
  objetivo_ia: z.string().describe("Objetivo principal al usar IA (solamente puede ser ahorrar tiempo, mejorar calidad, aumentar ventas, aumentar productividad)"),
  
  sabe_que_es_llm: z.string().describe("¿Sabe qué es un LLM? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no sabe."),
  conoce_pretraining_finetuning: z.string().describe("¿Conoce los conceptos de pre-training y fine-tuning? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no conoce."),
  conoce_4_partes_prompt: z.string().describe("¿Conoce las 4 partes de un buen prompt? Responder con 'sí' o 'no' preferentemente. Si la respuesta no es clara, considera que no conoce."),
  habilidad_prompts: z.string().describe("Evaluación de su habilidad para crear prompts, como un NÚMERO del 1 al 5 (ej: 4)"),
  
  funciones_avanzadas_chatgpt: z.string().describe("Funciones avanzadas de ChatGPT usadas (ej. search, imágenes, subir docs, canvas, deep research agent)"),
  usos_ia_ventas: z.string().describe("Usos actuales o posibles de IA en el área de ventas. Debe ser una de estas categorías: 1) Análisis de leads y prospectos, 2) Automatización de seguimiento a clientes, 3) Predicción de ventas, 4) Generación de propuestas comerciales"),
  usos_ia_marketing: z.string().describe("Usos actuales o posibles de IA en el área de marketing. Debe ser una de estas categorías: 1) Generación de contenido, 2) Análisis de datos y tendencias, 3) Segmentación de audiencias, 4) Optimización de campañas"),
  usos_ia_finanzas: z.string().describe("Usos actuales o posibles de IA en el área de finanzas. Debe ser una de estas categorías: 1) Análisis de riesgos, 2) Predicción de flujos de caja, 3) Automatización de reportes, 4) Detección de fraudes"),
  
  usado_copilot_web: z.string().describe("¿Ha usado Copilot en versión web? Responder con 'sí' o 'no' preferentemente."),
  usado_copilot_excel: z.string().describe("¿Ha usado Copilot en Excel? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_word: z.string().describe("¿Ha usado Copilot en Word? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_outlook: z.string().describe("¿Ha usado Copilot en Outlook? Incluir ejemplos si es posible. Indicar 'sí' o 'no' sobre el uso."),
  usado_copilot_power_platform: z.string().describe("¿Ha usado Copilot en Power BI, Power Apps o Power Automate? Enumere. Indicar 'sí' o 'no' sobre el uso general."),
  
  tiempo_ahorrado: z.string().describe("TOTAL de minutos u horas que ahorra al día con IA, preferiblemente como un NÚMERO de minutos (ej: 120 para 2 horas)"),
  ejemplos_mejoras_ia: z.string().describe("Ejemplos concretos de decisiones mejoradas o errores evitados gracias a la IA. Formato de testimonio."),
  retos_actuales_ia: z.string().describe("Principales retos o barreras actuales. Debe ser una de estas categorías: 1) Seguridad y privacidad de datos, 2) Falta de conocimientos técnicos, 3) Costos de implementación y licencias, 4) Resistencia al cambio organizacional, 5) Integración con sistemas existentes, 6) Calidad y confiabilidad de resultados, 7) Limitaciones técnicas o de infraestructura, 8) Aspectos éticos y regulatorios, 9) Gestión del cambio y capacitación"),
  tema_a_profundizar: z.string().describe("Tema relacionado con IA que más desea profundizar. Debe ser una de estas categorías: 1) Generación de contenido, 2) Análisis de datos y tendencias, 3) Segmentación de audiencias, 4) Optimización de campañas "),
  
  capacitacion_formal: z.string().describe("¿Ha recibido capacitación formal en IA? Responder con 'sí' o 'no' preferentemente."),
  confianza_resultados_ia: z.string().describe("Nivel de confianza en resultados de IA, como un NÚMERO del 1 al 5 (ej: 3)"),
  curiosidad_explorar_ia: z.string().describe("Nivel de curiosidad por explorar nuevas funciones de IA, como un NÚMERO del 1 al 5 (ej: 5)")
}); 