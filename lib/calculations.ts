/**
 * companyStatsByCompany.ts
 * -----------------------------------------------
 * Calcula métricas solo para UNA empresa.
 * Usa Supabase.  Devuelve { key, value }[].
 *
 * Env vars:
 *   SUPABASE_URL   https://xxx.supabase.co
 *   SUPABASE_ANON  pk_****  o  anon_****
 *
 * Uso rápido:
 *   import { computeStatsByCompany } from './lib/calculations';
 *   const stats = await computeStatsByCompany('VISIONA');
 *   console.table(stats);
 * -----------------------------------------------
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Updated Row type to match new optimized schema
type Row = {
  // Basic Information
  nombre: string;
  nombre_y_puesto: string;
  area_principal_trabajo: string;
  edad: number; // 1-5 scale
  
  // AI Knowledge Assessment (1-5 integers)
  sabe_que_es_llm: number;
  conoce_pretraining_finetuning: number;
  conoce_4_partes_prompt: number;
  
  // Department Usage (1-5 integers)
  uso_por_departamento: number;
  
  // Training and Confidence (1-5 integers)
  capacitacion_formal: number;
  confia_en_ia: number;
  curiosidad_explorar_ia: number;
  
  // Devices and Tools (JSON arrays)
  dispositivos_ia: string[] | null;
  uso_herramientas_ia: string[] | null;
  
  // Department-specific AI Usage (1-5 integers)
  uso_ia_ventas: number;
  uso_ia_marketing: number;
  uso_ia_finanzas: number;
  uso_ia_administracion: number;
  
  // Impact and Challenges (1-5 integers)
  tiempo_ahorrado: number;
  retos_actuales_ia: number;

  // New fields for complete diagnosis (1-5 integers)
  nivel_autonomia_ia: number;
  impacto_en_kpis: number;
  barreras_organizacionales: number;
  oportunidad_de_mejora: number;
  prompt_practico: number;

  // Legacy fields that might still exist
  anios_experiencia?: number;
  nivel_office?: string;
  horas_ia_semana?: number;
  objetivo_ia?: string;
  habilidad_prompts?: number;
  funciones_avanzadas_chatgpt?: string;
  usado_copilot_web?: boolean;
  usado_copilot_excel?: string;
  usado_copilot_word?: string;
  usado_copilot_outlook?: string;
  usado_copilot_power_platform?: string;
  ejemplos_mejoras_ia?: string;
  tema_a_profundizar?: string;
};

// Helper functions
const yes = (v: string | number | boolean | null | undefined) => {
  const stringValue = String(v ?? '').trim().toLowerCase();
  return ['sí', 'si', 'true', 't', '1', 'yes', 'y'].includes(stringValue);
};

const num = (v: string | number | null | undefined, d = 0) => {
  const stringValue = String(v ?? '');
  const n = Number(stringValue.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? d : n;
};

const pct = (n: number, tot: number) =>
  tot === 0 ? 0 : Math.round((n * 1000) / tot) / 10; // 1 decimal

// Helper to get average of 1-5 scale fields
const avgScale = (rows: Row[], field: keyof Row) => {
  const validRows = rows.filter(r => {
    const value = r[field];
    return typeof value === 'number' && value >= 1 && value <= 5;
  });
  if (validRows.length === 0) return 0;
  return validRows.reduce((sum, r) => sum + (r[field] as number), 0) / validRows.length;
};

// Helper to count high scores (4-5) as percentage
const pctHighScore = (rows: Row[], field: keyof Row) => {
  const validRows = rows.filter(r => {
    const value = r[field];
    return typeof value === 'number' && value >= 1 && value <= 5;
  });
  if (validRows.length === 0) return 0;
  const highScoreRows = validRows.filter(r => (r[field] as number) >= 4);
  return pct(highScoreRows.length, validRows.length);
};

// Helper to extract and count JSON array elements
const countJsonArrayElements = (rows: Row[], field: keyof Row) => {
  const elementCounts = new Map<string, number>();
  
  rows.forEach(r => {
    const arrayField = r[field];
    if (Array.isArray(arrayField)) {
      arrayField.forEach(element => {
        if (element && typeof element === 'string') {
          elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
        }
      });
    }
  });
  
  return elementCounts;
};

export async function computeStatsByCompany(company: string) {
  // Filter by company using the new 'nombre' field
  const { data: rows, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('nombre', company);

  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return [];

  const total = rows.length;

  // Helper para contar
  const countBy = <K extends string>(fn: (r: Row) => K) => {
    const m = new Map<K, number>();
    rows.forEach((r) => {
      const k = fn(r as Row);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    });
    return m;
  };

  // ----- BASIC DEMOGRAPHICS -----
  const area = Array.from(countBy(r => r.area_principal_trabajo)).map(([k, v]) => ({
    key: `area.${k}`,
    value: pct(v, total),
  }));

  // Age distribution (1-5 scale)
  const ageDistribution = Array.from(countBy(r => {
    const ageScale = r.edad;
    if (!ageScale) return '';
    switch(ageScale) {
      case 1: return '18-25';
      case 2: return '26-35';
      case 3: return '36-45';
      case 4: return '46-55';
      case 5: return '56+';
      default: return '';
    }
  })).map(([k, v]) => ({
    key: `age.${k}`,
    value: pct(v, total),
  }));

  // Average age calculation
  const avgAge = avgScale(rows, 'edad');

  // ----- AI KNOWLEDGE METRICS -----
  const avgLLMKnowledge = avgScale(rows, 'sabe_que_es_llm');
  const avgPretrainingKnowledge = avgScale(rows, 'conoce_pretraining_finetuning');
  const avgPromptKnowledge = avgScale(rows, 'conoce_4_partes_prompt');
  
  // Percentage with high knowledge (4-5 scale)
  const pctKnowLLM = pctHighScore(rows, 'sabe_que_es_llm');
  const pctKnowPretrainingFT = pctHighScore(rows, 'conoce_pretraining_finetuning');
  const pctKnowPromptParts = pctHighScore(rows, 'conoce_4_partes_prompt');

  // ----- USAGE METRICS -----
  const avgDepartmentUsage = avgScale(rows, 'uso_por_departamento');
  const avgVentasUsage = avgScale(rows, 'uso_ia_ventas');
  const avgMarketingUsage = avgScale(rows, 'uso_ia_marketing');
  const avgFinanzasUsage = avgScale(rows, 'uso_ia_finanzas');
  const avgAdminUsage = avgScale(rows, 'uso_ia_administracion');

  // Percentage with high usage (4-5 scale) by department
  const pctIAinSales = pctHighScore(rows, 'uso_ia_ventas');
  const pctIAinMarketing = pctHighScore(rows, 'uso_ia_marketing');
  const pctIAinFinance = pctHighScore(rows, 'uso_ia_finanzas');
  const pctIAinAdmin = pctHighScore(rows, 'uso_ia_administracion');

  // ----- DEVICES AND TOOLS ANALYSIS -----
  const deviceCounts = countJsonArrayElements(rows, 'dispositivos_ia');
  const devices = Array.from(deviceCounts).map(([k, v]) => ({
    key: `device.${k}`,
    value: pct(v, total),
  }));

  const toolCounts = countJsonArrayElements(rows, 'uso_herramientas_ia');
  const tools = Array.from(toolCounts).map(([k, v]) => ({
    key: `tool.${k}`,
    value: pct(v, total),
  }));

  // ----- TRAINING AND CONFIDENCE -----
  const avgFormalTraining = avgScale(rows, 'capacitacion_formal');
  const avgConfidence = avgScale(rows, 'confia_en_ia');
  const avgCuriosity = avgScale(rows, 'curiosidad_explorar_ia');

  const pctFormalTraining = pctHighScore(rows, 'capacitacion_formal');
  const pctHighConfidence = pctHighScore(rows, 'confia_en_ia');
  const pctHighCuriosity = pctHighScore(rows, 'curiosidad_explorar_ia');

  // ----- TIME SAVINGS AND CHALLENGES -----
  const avgTimeSaved = avgScale(rows, 'tiempo_ahorrado');
  const avgChallengeLevel = avgScale(rows, 'retos_actuales_ia');

  // ----- NEW DIAGNOSTIC FIELDS -----
  const avgAutonomyLevel = avgScale(rows, 'nivel_autonomia_ia');
  const avgKPIImpact = avgScale(rows, 'impacto_en_kpis');
  const avgOrganizationalBarriers = avgScale(rows, 'barreras_organizacionales');
  const avgImprovementOpportunity = avgScale(rows, 'oportunidad_de_mejora');
  const avgPromptQuality = avgScale(rows, 'prompt_practico');

  // Percentage with high scores (4-5) for new fields
  const pctHighAutonomy = pctHighScore(rows, 'nivel_autonomia_ia');
  const pctHighKPIImpact = pctHighScore(rows, 'impacto_en_kpis');
  const pctLowBarriers = 100 - pctHighScore(rows, 'barreras_organizacionales'); // Inverted: low barriers is good
  const pctHighImprovementOpportunity = pctHighScore(rows, 'oportunidad_de_mejora');
  const pctHighPromptQuality = pctHighScore(rows, 'prompt_practico');

  // Convert time saved scale to actual minutes for ROI calculation
  const convertTimeScaleToMinutes = (scale: number) => {
    switch(scale) {
      case 1: return 7.5;   // 0-15 minutes average = 7.5
      case 2: return 23;    // 16-30 minutes average = 23
      case 3: return 45;    // 31-60 minutes average = 45
      case 4: return 90;    // 1-2 hours average = 90 minutes
      case 5: return 150;   // More than 2 hours = 150 minutes
      default: return 0;
    }
  };

  const avgMinutesSaved = rows
    .filter(r => r.tiempo_ahorrado >= 1 && r.tiempo_ahorrado <= 5)
    .reduce((sum, r) => sum + convertTimeScaleToMinutes(r.tiempo_ahorrado), 0) / 
    rows.filter(r => r.tiempo_ahorrado >= 1 && r.tiempo_ahorrado <= 5).length || 0;

  // ----- LEGACY FIELDS SUPPORT -----
  // Support for fields that might still exist from old schema
  const avgYears = rows.filter(r => r.anios_experiencia).length > 0 
    ? rows.reduce((s, r) => s + num(r.anios_experiencia), 0) / rows.filter(r => r.anios_experiencia).length
    : 0;

  const avgHours = rows.filter(r => r.horas_ia_semana).length > 0
    ? rows.reduce((s, r) => s + num(r.horas_ia_semana), 0) / rows.filter(r => r.horas_ia_semana).length
    : avgDepartmentUsage * 2; // Estimate based on department usage

  const avgPromptSkill = rows.filter(r => r.habilidad_prompts).length > 0
    ? rows.reduce((s, r) => s + num(r.habilidad_prompts), 0) / rows.filter(r => r.habilidad_prompts).length
    : avgPromptKnowledge; // Use new prompt knowledge if old field doesn't exist

  // Office skills (if available)
  const office = rows.filter(r => r.nivel_office).length > 0
    ? Array.from(countBy(r => r.nivel_office || '')).map(([k, v]) => ({
        key: `office.${k}`,
        value: pct(v, total),
      }))
    : [];

  // Objectives (if available)
  const objectives = rows.filter(r => r.objetivo_ia).length > 0
    ? Array.from(countBy(r => r.objetivo_ia || '')).map(([k, v]) => ({
        key: `objective.${k}`,
        value: pct(v, total),
      }))
    : [];

  // Advanced functions (if available)
  const advFns = rows.filter(r => r.funciones_avanzadas_chatgpt).length > 0
    ? Array.from(countBy(r => r.funciones_avanzadas_chatgpt || 'ninguna')).map(
        ([k, v]) => ({ key: `advFn.${k}`, value: pct(v, total) })
      )
    : [];

  // Copilot usage (if available)
  const cp = (field: keyof Row) => rows.filter(r => r[field]).length > 0
    ? pct(rows.filter(r => yes(r[field])).length, total)
    : 0;

  const copilot = {
    web: cp('usado_copilot_web'),
    excel: cp('usado_copilot_excel'),
    word: cp('usado_copilot_word'),
    outlook: cp('usado_copilot_outlook'),
    powerPlat: cp('usado_copilot_power_platform'),
  };

  // Top challenges and topics (if available)
  const topN = (field: keyof Row) => {
    if (rows.filter(r => r[field]).length === 0) return [];
    return Array.from(countBy(r => String(r[field] || '')))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ key: k, value: pct(v, total) }));
  };

  const topChallenges = topN('retos_actuales_ia');
  const topTopics = topN('tema_a_profundizar');

  // ----- ROI CALCULATION -----
  // Simplified ROI calculation based on new logic
  const calculateROI = (
    employeeCount: number, 
    avgCurrentMinutesSavedDaily: number, // Average minutes saved per day from survey
    avgPromptQualityScale: number, // Scale 1-5 (0 if no data)
    avgDepartmentUsageScore: number // For metadata
  ) => {
    // Basic salary and time constants
    const MONTHLY_RATE_PER_EMPLOYEE = 30000; // MXN
    const WORK_HOURS_PER_DAY = 8;
    const WORK_DAYS_PER_MONTH = 20;
    
    const HOURLY_RATE_PER_EMPLOYEE = MONTHLY_RATE_PER_EMPLOYEE / (WORK_HOURS_PER_DAY * WORK_DAYS_PER_MONTH);
    const VALUE_PER_MINUTE_EMPLOYEE = HOURLY_RATE_PER_EMPLOYEE / 60;
    
    // Max potential AI can offer (e.g., 2 hours saved per day)
    const MAX_POTENTIAL_HOURS_PER_DAY = 2;
    const MAX_POTENTIAL_MINUTES_PER_DAY = MAX_POTENTIAL_HOURS_PER_DAY * 60; // 120 minutes

    // 1. Calculate Nerfed Prompt Factor
    // Treat invalid/0 scale as worst case (1 for formula), resulting in 0 factor.
    const safePromptQualityScale = (avgPromptQualityScale >= 1 && avgPromptQualityScale <= 5) 
      ? avgPromptQualityScale 
      : 1; 
    const nerfedPromptFactor = (safePromptQualityScale - 1) / 4; // Ranges from 0 to 1

    // 2. Calculate Current Value Generated (per employee, monthly)
    // These are the "effective" minutes saved daily after considering prompt quality
    const currentEffectiveMinutesSavedDaily = avgCurrentMinutesSavedDaily * nerfedPromptFactor;
    const currentValuePerEmployeeMonthly = currentEffectiveMinutesSavedDaily * VALUE_PER_MINUTE_EMPLOYEE * WORK_DAYS_PER_MONTH;

    // 3. AI Potential (Max Potential) (per employee, monthly)
    // This is the theoretical max, e.g., 7500 MXN/month based on 120 mins saved daily
    const aiPotentialPerEmployeeMonthly = MAX_POTENTIAL_MINUTES_PER_DAY * VALUE_PER_MINUTE_EMPLOYEE * WORK_DAYS_PER_MONTH;

    // 4. Opportunity Cost (per employee, monthly)
    const opportunityCostPerEmployeeMonthly = Math.max(0, aiPotentialPerEmployeeMonthly - currentValuePerEmployeeMonthly);

    // Total calculations for all employees
    const totalCurrentValue = currentValuePerEmployeeMonthly * employeeCount;
    const totalMaxPotential = aiPotentialPerEmployeeMonthly * employeeCount;
    const totalOpportunityCost = opportunityCostPerEmployeeMonthly * employeeCount;

    // Per employee yearly values
    const currentValuePerEmployeeYearly = currentValuePerEmployeeMonthly * 12;
    const aiPotentialPerEmployeeYearly = aiPotentialPerEmployeeMonthly * 12;
    const opportunityCostPerEmployeeYearly = opportunityCostPerEmployeeMonthly * 12;
    
    // Metadata calculations
    const currentEffectiveHoursSavedPerDay = currentEffectiveMinutesSavedDaily / 60;
    
    let adoptionEffectiveness = 0;
    if (MAX_POTENTIAL_HOURS_PER_DAY > 0) {
      adoptionEffectiveness = currentEffectiveHoursSavedPerDay / MAX_POTENTIAL_HOURS_PER_DAY;
    }
    adoptionEffectiveness = Math.min(1, Math.max(0, adoptionEffectiveness)); // Clamp between 0 and 1
    
    const missedHoursPerDay = Math.max(0, MAX_POTENTIAL_HOURS_PER_DAY - currentEffectiveHoursSavedPerDay);
    
    return {
      // Current value they're getting from AI with their current knowledge/adoption
      currentValue: Math.round(totalCurrentValue),
      // Maximum potential value if they used AI perfectly (100% adoption, full training)
      maxPotential: Math.round(totalMaxPotential),
      // OPPORTUNITY COST: What they're losing by not having perfect AI knowledge/adoption
      opportunityCost: Math.round(totalOpportunityCost),
      // Per employee breakdown
      perEmployee: {
        currentMonthly: Math.round(currentValuePerEmployeeMonthly),
        maxPotentialMonthly: Math.round(aiPotentialPerEmployeeMonthly),
        missedMonthly: Math.round(opportunityCostPerEmployeeMonthly),
        currentYearly: Math.round(currentValuePerEmployeeYearly),
        maxPotentialYearly: Math.round(aiPotentialPerEmployeeYearly),
        missedYearly: Math.round(opportunityCostPerEmployeeYearly)
      },
      // Metadata
      employeeCount: employeeCount,
      // This reflects the "effective" hours saved daily after prompt quality nerf
      currentHoursPerDay: +currentEffectiveHoursSavedPerDay.toFixed(2), 
      missedHoursPerDay: +missedHoursPerDay.toFixed(2),
      // This is the raw average minutes saved from survey data, before nerfing
      currentMinutesSavedPerDay: +avgCurrentMinutesSavedDaily.toFixed(1), 
      adoptionEffectiveness: +(adoptionEffectiveness * 100).toFixed(1), // As percentage
      // Keep original 1-5 score for reference
      departmentUsageScore: +avgDepartmentUsageScore.toFixed(2) 
    };
  };

  // Call the updated ROI function
  // avgHours (avgHoursIAWeek) is no longer passed to calculateROI
  // avgPromptQuality (scale 1-5, or 0) is passed as avgPromptQualityScale
  const roiData = calculateROI(total, avgMinutesSaved, avgPromptQuality, avgDepartmentUsage);

  // ----- RESULTADO PLANO -----
  return [
    // Demographics
    ...area,
    ...ageDistribution,
    { key: 'avgAge', value: +avgAge.toFixed(2) },
    { key: 'avgYearsExperience', value: +avgYears.toFixed(1) },
    ...office,
    
    // Usage metrics
    { key: 'avgHoursIAWeek', value: +avgHours.toFixed(1) },
    { key: 'avgDepartmentUsage', value: +avgDepartmentUsage.toFixed(2) },
    ...devices,
    ...tools,
    ...objectives,
    
    // Knowledge metrics
    { key: 'pctKnowLLM', value: pctKnowLLM },
    { key: 'pctKnowPretrainingFT', value: pctKnowPretrainingFT },
    { key: 'pctKnowPromptParts', value: pctKnowPromptParts },
    { key: 'avgLLMKnowledge', value: +avgLLMKnowledge.toFixed(2) },
    { key: 'avgPretrainingKnowledge', value: +avgPretrainingKnowledge.toFixed(2) },
    { key: 'avgPromptKnowledge', value: +avgPromptKnowledge.toFixed(2) },
    { key: 'avgPromptSkill', value: +avgPromptSkill.toFixed(2) },
    
    // Advanced features (legacy support)
    ...advFns,
    
    // Department usage
    { key: 'pctIAinSales', value: pctIAinSales },
    { key: 'pctIAinMarketing', value: pctIAinMarketing },
    { key: 'pctIAinFinance', value: pctIAinFinance },
    { key: 'pctIAinAdmin', value: pctIAinAdmin },
    { key: 'avgVentasUsage', value: +avgVentasUsage.toFixed(2) },
    { key: 'avgMarketingUsage', value: +avgMarketingUsage.toFixed(2) },
    { key: 'avgFinanzasUsage', value: +avgFinanzasUsage.toFixed(2) },
    { key: 'avgAdminUsage', value: +avgAdminUsage.toFixed(2) },
    
    // Copilot usage (legacy support)
    { key: 'copilot.web', value: copilot.web },
    { key: 'copilot.excel', value: copilot.excel },
    { key: 'copilot.word', value: copilot.word },
    { key: 'copilot.outlook', value: copilot.outlook },
    { key: 'copilot.powerPlat', value: copilot.powerPlat },
    
    // Time and impact
    { key: 'avgMinutesSaved', value: +avgMinutesSaved.toFixed(1) },
    { key: 'avgTimeSaved', value: +avgTimeSaved.toFixed(2) },
    { key: 'avgChallengeLevel', value: +avgChallengeLevel.toFixed(2) },
    
    // Training and confidence
    { key: 'pctFormalTraining', value: pctFormalTraining },
    { key: 'avgFormalTraining', value: +avgFormalTraining.toFixed(2) },
    { key: 'avgConfidence', value: +avgConfidence.toFixed(2) },
    { key: 'pctHighConfidence', value: pctHighConfidence },
    { key: 'avgCuriosity', value: +avgCuriosity.toFixed(2) },
    { key: 'pctHighCuriosity', value: pctHighCuriosity },
    
    // Top items (legacy support)
    ...topChallenges.map(c => ({ key: `topChallenge.${c.key}`, value: c.value })),
    ...topTopics.map(t => ({ key: `topTopic.${t.key}`, value: t.value })),
    
    // New diagnostic fields
    { key: 'avgAutonomyLevel', value: +avgAutonomyLevel.toFixed(2) },
    { key: 'avgKPIImpact', value: +avgKPIImpact.toFixed(2) },
    { key: 'avgOrganizationalBarriers', value: +avgOrganizationalBarriers.toFixed(2) },
    { key: 'avgImprovementOpportunity', value: +avgImprovementOpportunity.toFixed(2) },
    { key: 'avgPromptQuality', value: +avgPromptQuality.toFixed(2) },
    { key: 'pctHighAutonomy', value: pctHighAutonomy },
    { key: 'pctHighKPIImpact', value: pctHighKPIImpact },
    { key: 'pctLowBarriers', value: pctLowBarriers },
    { key: 'pctHighImprovementOpportunity', value: pctHighImprovementOpportunity },
    { key: 'pctHighPromptQuality', value: pctHighPromptQuality },
    
    // ROI data
    { key: 'employeeCount', value: total },
    { key: 'roi.current', value: roiData.currentValue },
    { key: 'roi.potential', value: roiData.maxPotential },
    { key: 'roi.opportunity', value: roiData.opportunityCost },
    { key: 'roi.currentHoursPerDay', value: roiData.currentHoursPerDay },
    { key: 'roi.currentMinutesSavedPerDay', value: roiData.currentMinutesSavedPerDay },
    
    // Additional detailed ROI metrics
    { key: 'roi.perEmployee.currentMonthly', value: roiData.perEmployee.currentMonthly },
    { key: 'roi.perEmployee.maxPotentialMonthly', value: roiData.perEmployee.maxPotentialMonthly },
    { key: 'roi.perEmployee.missedMonthly', value: roiData.perEmployee.missedMonthly },
    { key: 'roi.perEmployee.currentYearly', value: roiData.perEmployee.currentYearly },
    { key: 'roi.perEmployee.maxPotentialYearly', value: roiData.perEmployee.maxPotentialYearly },
    { key: 'roi.perEmployee.missedYearly', value: roiData.perEmployee.missedYearly },
    { key: 'roi.adoptionEffectiveness', value: roiData.adoptionEffectiveness },
    { key: 'roi.departmentUsageScore', value: roiData.departmentUsageScore },
  ];
} 