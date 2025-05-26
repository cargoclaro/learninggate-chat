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

type Row = {
  area_principal_trabajo: string;
  anios_experiencia: string;
  nivel_office: string;
  horas_ia_semana: string;
  dispositivos_ia: string;
  objetivo_ia: string;
  sabe_que_es_llm: string;
  conoce_pretraining_finetuning: string;
  conoce_4_partes_prompt: string;
  habilidad_prompts: string;
  funciones_avanzadas_chatgpt: string;
  usos_ia_ventas: string;
  usos_ia_marketing: string;
  usos_ia_finanzas: string;
  usado_copilot_web: string;
  usado_copilot_excel: string;
  usado_copilot_word: string;
  usado_copilot_outlook: string;
  usado_copilot_power_platform: string;
  tiempo_ahorrado: string;
  retos_actuales_ia: string;
  tema_a_profundizar: string;
  capacitacion_formal: string;
  confianza_resultados_ia: string;
  curiosidad_explorar_ia: string;
};

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

export async function computeStatsByCompany(company: string) {
  // 1 ▸ Filtra por empresa
  const { data: rows, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('nombre_empresa_comercial', company);

  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return [];

  const total = rows.length;

  // helper para contar
  const countBy = <K extends string>(fn: (r: Row) => K) => {
    const m = new Map<K, number>();
    rows.forEach((r) => {
      const k = fn(r as Row);
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return m;
  };

  // ----- métricas -----
  const area = [...countBy(r => r.area_principal_trabajo)].map(([k, v]) => ({
    key: `area.${k}`,
    value: pct(v, total),
  }));

  const avgYears =
    rows.reduce((s, r) => s + num((r as Row).anios_experiencia), 0) / total;

  const office = [...countBy(r => r.nivel_office)].map(([k, v]) => ({
    key: `office.${k}`,
    value: pct(v, total),
  }));

  const avgHours =
    rows.reduce((s, r) => s + num((r as Row).horas_ia_semana), 0) / total;

  const devices = [...countBy(r => r.dispositivos_ia)].map(([k, v]) => ({
    key: `device.${k}`,
    value: pct(v, total),
  }));

  const objectives = [...countBy(r => r.objetivo_ia)].map(([k, v]) => ({
    key: `objective.${k}`,
    value: pct(v, total),
  }));

  const pctKnowLLM = pct(rows.filter(r => yes((r as Row).sabe_que_es_llm)).length, total);
  const pctPreFT   = pct(rows.filter(r => yes((r as Row).conoce_pretraining_finetuning)).length, total);
  const pctPrompt  = pct(rows.filter(r => yes((r as Row).conoce_4_partes_prompt)).length, total);
  const avgPromptSkill =
    rows.reduce((s, r) => s + num((r as Row).habilidad_prompts), 0) / total;

  const advFns = [...countBy(r => r.funciones_avanzadas_chatgpt || 'ninguna')].map(
    ([k, v]) => ({ key: `advFn.${k}`, value: pct(v, total) })
  );

  const pctIAventas   = pct(rows.filter(r => (r as Row).usos_ia_ventas   !== 'Otro').length, total);
  const pctIAmarketing= pct(rows.filter(r => (r as Row).usos_ia_marketing!== 'Otro').length, total);
  const pctIAfinanzas = pct(rows.filter(r => (r as Row).usos_ia_finanzas !== 'Otro').length, total);

  const cp = (field: keyof Row) => pct(rows.filter(r => yes((r as any)[field])).length, total);
  const copilot = {
    web: cp('usado_copilot_web'),
    excel: cp('usado_copilot_excel'),
    word: cp('usado_copilot_word'),
    outlook: cp('usado_copilot_outlook'),
    powerPlat: cp('usado_copilot_power_platform'),
  };

  const avgSaved =
    rows.reduce((s, r) => s + num((r as Row).tiempo_ahorrado), 0) / total;

  const topN = (field: keyof Row) =>
    [...countBy(r => (r as any)[field])]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ key: k, value: pct(v, total) }));

  const topChallenges = topN('retos_actuales_ia');
  const topTopics     = topN('tema_a_profundizar');

  const pctTraining  = pct(rows.filter(r => yes((r as Row).capacitacion_formal)).length, total);
  const avgConfidence= rows.reduce((s, r) => s + num((r as Row).confianza_resultados_ia), 0) / total;
  const avgCuriosity = rows.reduce((s, r) => s + num((r as Row).curiosidad_explorar_ia), 0) / total;

  // ----- ROI Calculation based on actual employee count and current AI usage -----
  const calculateROI = (employeeCount: number, avgCurrentHoursPerWeek: number, avgCurrentMinutesSaved: number) => {
    // Base salary is 30,000 MXN per month per employee
    const monthlyRatePerEmployee = 30000; // MXN
    const workHoursPerDay = 8;
    const workDaysPerMonth = 20;
    const workDaysPerWeek = 5;
    
    // Calculate hourly rate in MXN per employee
    const hourlyRatePerEmployee = monthlyRatePerEmployee / (workHoursPerDay * workDaysPerMonth);
    
    // Current AI usage: Convert weekly hours to daily hours
    const currentHoursPerDay = avgCurrentHoursPerWeek / workDaysPerWeek;
    
    // Current savings: Convert minutes to hours per day
    const currentSavingsHoursPerDay = avgCurrentMinutesSaved / 60;
    
    // Potential with proper training: AI can save up to 2 hours per day per employee
    const maxPotentialHoursPerDay = 2;
    
    // Additional savings opportunity = max potential - current savings
    const additionalSavingsHoursPerDay = Math.max(0, maxPotentialHoursPerDay - currentSavingsHoursPerDay);
    
    // Calculate current savings (what they're already getting)
    const currentDailySavingsPerEmployee = currentSavingsHoursPerDay * hourlyRatePerEmployee;
    const currentMonthlySavingsPerEmployee = currentDailySavingsPerEmployee * workDaysPerMonth;
    const currentYearlySavingsPerEmployee = currentMonthlySavingsPerEmployee * 12;
    const totalCurrentSavings = currentYearlySavingsPerEmployee * employeeCount;
    
    // Calculate potential additional savings with training
    const additionalDailySavingsPerEmployee = additionalSavingsHoursPerDay * hourlyRatePerEmployee;
    const additionalMonthlySavingsPerEmployee = additionalDailySavingsPerEmployee * workDaysPerMonth;
    const additionalYearlySavingsPerEmployee = additionalMonthlySavingsPerEmployee * 12;
    const totalAdditionalSavings = additionalYearlySavingsPerEmployee * employeeCount;
    
    // Total potential = current + additional
    const totalPotentialSavings = totalCurrentSavings + totalAdditionalSavings;
    
    return {
      current: Math.round(totalCurrentSavings),
      potential: Math.round(totalPotentialSavings), 
      opportunity: Math.round(totalAdditionalSavings),
      employeeCount: employeeCount,
      currentHoursPerWeek: +avgCurrentHoursPerWeek.toFixed(1),
      currentMinutesSavedPerDay: +avgCurrentMinutesSaved.toFixed(1)
    };
  };

  const roiData = calculateROI(total, avgHours, avgSaved); // Use actual usage data from database

  // ----- resultado plano -----
  return [
    ...area,
    { key: 'avgYearsExperience', value: +avgYears.toFixed(1) },
    ...office,
    { key: 'avgHoursIAWeek', value: +avgHours.toFixed(1) },
    ...devices,
    ...objectives,
    { key: 'pctKnowLLM', value: pctKnowLLM },
    { key: 'pctKnowPretrainingFT', value: pctPreFT },
    { key: 'pctKnowPromptParts', value: pctPrompt },
    { key: 'avgPromptSkill', value: +avgPromptSkill.toFixed(2) },
    ...advFns,
    { key: 'pctIAinSales', value: pctIAventas },
    { key: 'pctIAinMarketing', value: pctIAmarketing },
    { key: 'pctIAinFinance', value: pctIAfinanzas },
    { key: 'copilot.web', value: copilot.web },
    { key: 'copilot.excel', value: copilot.excel },
    { key: 'copilot.word', value: copilot.word },
    { key: 'copilot.outlook', value: copilot.outlook },
    { key: 'copilot.powerPlat', value: copilot.powerPlat },
    { key: 'avgMinutesSaved', value: +avgSaved.toFixed(1) },
    ...topChallenges.map(c => ({ key: `topChallenge.${c.key}`, value: c.value })),
    ...topTopics.map(t => ({ key: `topTopic.${t.key}`, value: t.value })),
    { key: 'pctFormalTraining', value: pctTraining },
    { key: 'avgConfidence', value: +avgConfidence.toFixed(2) },
    { key: 'avgCuriosity', value: +avgCuriosity.toFixed(2) },
    // ROI data based on actual employee count and current usage
    { key: 'employeeCount', value: total },
    { key: 'roi.current', value: roiData.current },
    { key: 'roi.potential', value: roiData.potential },
    { key: 'roi.opportunity', value: roiData.opportunity },
    { key: 'roi.currentHoursPerWeek', value: roiData.currentHoursPerWeek },
    { key: 'roi.currentMinutesSavedPerDay', value: roiData.currentMinutesSavedPerDay },
  ];
} 