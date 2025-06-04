import React from "react";
// Removed Image from "next/image";
// import {
//   Card, // No longer directly used
//   CardHeader, // No longer directly used
//   CardTitle, // No longer directly used
//   CardContent, // No longer directly used
// } from "./ui/card"; // Card components are now in children
// import { Badge } from "./ui/badge"; // No longer directly used here, moved to ReportHeader

// All specific Recharts imports are removed as charts are in child components

// Lucide React Icons - Keep only those directly used in report.tsx's JSX (if any after all refactoring)
// For now, assuming none are directly used and all are in child components.
// import { 
//   CalendarDays, 
//   PieChart as PieIcon, 
//   TrendingUp,    
//   AlertTriangle, 
//   Users,         
//   BarChart3,     
//   Zap,           
//   Target         
// } from "lucide-react";

// import { DropdownPDFExport } from "./pdf-export-wrapper"; // Moved to ReportHeader
import { StatKV, MaturityData, ROIData } from "./report/types";

// Imports for all the new child components
import { MaturityCard } from "./report/MaturityCard";
import { ROICard } from "./report/ROICard";
// import { OpportunityCard } from "./report/OpportunityCard"; // Only used by OpportunitiesRisksSection
// import { SummaryCard } from "./report/SummaryCard"; // Only used by KeyMetricsSection
import { TasksByAreaSection } from "./report/TasksByAreaSection";
import { KnowledgeAssessmentCard } from "./report/KnowledgeAssessmentCard";
import { DepartmentUsageCard } from "./report/DepartmentUsageCard";
import { TrainingStatusCard } from "./report/TrainingStatusCard";
import { DiagnosticMetricsSection } from "./report/DiagnosticMetricsSection";
import { OrganizationalBarriersCard } from "./report/OrganizationalBarriersCard";
import { DeviceDistributionChart } from "./report/DeviceDistributionChart";
import { SkillsRadarChart } from "./report/SkillsRadarChart";
import { AIToolsAdoptionChart } from "./report/AIToolsAdoptionChart";
import { CourseOfferCard } from "./report/CourseOfferCard";
import { AlternativeOfferCard } from "./report/AlternativeOfferCard";
import { ReportHeader } from "./report/ReportHeader";
import { KeyMetricsSection } from "./report/KeyMetricsSection";
import { OpportunitiesRisksSection } from "./report/OpportunitiesRisksSection";
import { ReportFooter } from "./report/ReportFooter";

interface Props {
  companyName: string;
  stats: StatKV[];
}

const COLORS = [
  "#4285F4", // Google blue
  "#DB4437", // red
  "#F4B400", // yellow
  "#0F9D58", // green
  "#AB47BC", // purple
  "#00ACC1", // cyan
  "#FF7043", // orange
  "#9E9D24", // olive
];

/**
 * Utilidades para extraer subconjuntos de stats por prefijo
 */
const useGroupedStats = (stats: StatKV[], prefix: string) =>
  stats
    .filter((s) => s.key.startsWith(prefix))
    .map((s) => ({
      name: s.key.replace(prefix, ""),
      value: s.value,
    }));

const singleValue = (stats: StatKV[], key: string, decimals = 1) => {
  const found = stats.find((s) => s.key === key);
  return found ? Number(found.value.toFixed(decimals)) : 0;
};

// Helper function to convert age scale to readable format
const convertAgeScale = (ageScale: number) => {
  switch(Math.round(ageScale)) {
    case 1: return "18-25";
    case 2: return "26-35";
    case 3: return "36-45";
    case 4: return "46-55";
    case 5: return "56+";
    default: return "N/A";
  }
};

// AI Maturity Calculator - Based on actual API calculations
const calculateAIMaturity = (stats: StatKV[]) => {
  const avgSkill = singleValue(stats, "avgPromptSkill"); // 1-5 scale from API
  const avgConfidence = singleValue(stats, "avgConfidence"); // 1-5 scale from API
  const avgHours = singleValue(stats, "avgHoursIAWeek"); // Hours per week from API
  const avgSaved = singleValue(stats, "avgMinutesSaved"); // Minutes saved per day from API
  
  // Additional knowledge metrics from API
  const pctKnowLLM = singleValue(stats, "pctKnowLLM"); // Percentage who know what LLM is
  const pctFormalTraining = singleValue(stats, "pctFormalTraining"); // Have formal training
  
  // Calculate maturity score (0-100) based on actual API metrics
  const skillScore = (avgSkill / 5) * 20; // 20% weight - prompt skill level
  const confidenceScore = (avgConfidence / 5) * 15; // 15% weight - confidence in AI results
  const usageScore = Math.min((avgHours / 10) * 20, 20); // 20% weight - actual usage hours
  const impactScore = Math.min((avgSaved / 120) * 15, 15); // 15% weight - time saved
  const knowledgeScore = (pctKnowLLM / 100) * 15; // 15% weight - basic AI knowledge
  const trainingScore = (pctFormalTraining / 100) * 15; // 15% weight - formal training
  
  const totalScore = skillScore + confidenceScore + usageScore + impactScore + knowledgeScore + trainingScore;
  
  let level = "Principiante";
  let color = "#DB4437";
  let description = "La empresa está en las primeras etapas de adopción de IA";
  
  if (totalScore >= 75) {
    level = "Avanzado";
    color = "#0F9D58";
    description = "Excelente adopción y dominio de herramientas IA";
  } else if (totalScore >= 50) {
    level = "Intermedio";
    color = "#F4B400";
    description = "Buen progreso en la implementación de IA";
  } else if (totalScore >= 25) {
    level = "Básico";
    color = "#FF7043";
    description = "Conocimientos básicos, gran potencial de crecimiento";
  }
  
  return { score: Math.round(totalScore), level, color, description };
};

// ROI Calculator - now gets data from API instead of calculating locally
const getROIFromStats = (stats: StatKV[]) => {
  return {
    current: singleValue(stats, "roi.current", 0),
    potential: singleValue(stats, "roi.potential", 0), 
    opportunity: singleValue(stats, "roi.opportunity", 0),
    employeeCount: singleValue(stats, "employeeCount", 0),
    currentHoursPerWeek: singleValue(stats, "roi.currentHoursPerWeek", 1),
    currentMinutesSavedPerDay: singleValue(stats, "roi.currentMinutesSavedPerDay", 1),
    adoptionEffectiveness: singleValue(stats, "roi.adoptionEffectiveness", 1),
    missedHoursPerDay: singleValue(stats, "roi.missedHoursPerDay", 2)
  };
};

const CompanyIADashboard: React.FC<Props> = ({ companyName, stats }) => {
  // --- datasets ---
  const deviceData = useGroupedStats(stats, "device.");
  
  // AI Tools data - Updated to use the new uso_herramientas_ia data
  // Removed unused variable: const aiToolsData = useGroupedStats(stats, "tool.");
  
  // Get tool stats for use in the BarChart
  const toolStats = useGroupedStats(stats, "tool.");

  // Calculate average age from the 1-5 scale
  const avgAgeScale = singleValue(stats, "avgAge", 1); // This should come from your calculations
  const avgAgeRange = convertAgeScale(avgAgeScale);

  // Calculate AI maturity and ROI with explicit types
  const maturity: MaturityData = calculateAIMaturity(stats);
  const roi: ROIData = getROIFromStats(stats);

  const radarData = [
    {
      metric: "Habilidad prompts",
      score: singleValue(stats, "avgPromptSkill", 2),
      industry: 3.2, // Industry benchmark
    },
    {
      metric: "Confianza IA",
      score: singleValue(stats, "avgConfidence", 2),
      industry: 3.5,
    },
    {
      metric: "Curiosidad IA",
      score: singleValue(stats, "avgCuriosity", 2),
      industry: 3.8,
    },
    {
      metric: "Autonomía IA",
      score: singleValue(stats, "avgAutonomyLevel", 2),
      industry: 3.0,
    },
    {
      metric: "Impacto KPIs",
      score: singleValue(stats, "avgKPIImpact", 2),
      industry: 2.8,
    },
    {
      metric: "Calidad prompts",
      score: singleValue(stats, "avgPromptQuality", 2),
      industry: 3.1,
    },
  ];



  // Generate opportunities based on maturity level
  const getOpportunities = () => {
    const opportunities = [];
    
    // Base opportunities by maturity level
    if (maturity.score < 25) {
      opportunities.push("Implementar programa básico de alfabetización IA");
      opportunities.push("Capacitación en herramientas fundamentales (ChatGPT, Copilot)");
      opportunities.push("Establecer políticas de uso responsable de IA");
    } else if (maturity.score < 50) {
      opportunities.push("Desarrollar prompts especializados por área");
      opportunities.push("Implementar workflows automatizados");
      opportunities.push("Capacitación avanzada en herramientas específicas");
    } else if (maturity.score < 75) {
      opportunities.push("Desarrollar soluciones IA personalizadas");
      opportunities.push("Implementar IA en procesos críticos");
      opportunities.push("Crear centro de excelencia en IA");
    } else {
      opportunities.push("Liderar innovación en el sector");
      opportunities.push("Desarrollar productos con IA integrada");
      opportunities.push("Monetizar capacidades IA");
    }

    // Add specific opportunities based on new metrics
    if (singleValue(stats, "avgAutonomyLevel") < 3) {
      opportunities.push("Programa de mentoría para aumentar autonomía en IA");
    }
    if (singleValue(stats, "avgKPIImpact") < 3) {
      opportunities.push("Identificar y medir KPIs específicos impactados por IA");
    }
    if (singleValue(stats, "avgPromptQuality") < 3) {
      opportunities.push("Workshop intensivo de prompt engineering avanzado");
    }
    if (singleValue(stats, "avgImprovementOpportunity") >= 4) {
      opportunities.push("Aprovechar alta motivación del equipo para proyectos piloto");
    }
    if (singleValue(stats, "pctLowBarriers") >= 70) {
      opportunities.push("Acelerar adopción aprovechando baja resistencia organizacional");
    }

    return opportunities.slice(0, 4); // Return top 4 opportunities
  };

  const getRisks = () => {
    const risks = [];
    
    // Based on actual API metrics
    if (singleValue(stats, "avgPromptSkill") < 3) {
      risks.push("Baja competencia en prompting limita resultados");
    }
    if (singleValue(stats, "avgHoursIAWeek") < 2) {
      risks.push("Subutilización de herramientas disponibles");
    }
    if (singleValue(stats, "avgConfidence") < 3) {
      risks.push("Resistencia al cambio puede frenar adopción");
    }
    if (singleValue(stats, "pctKnowLLM") < 50) {
      risks.push("Falta conocimiento básico sobre IA generativa");
    }
    if (singleValue(stats, "pctFormalTraining") < 30) {
      risks.push("Ausencia de capacitación formal estructurada");
    }
    
    // Add risks based on new metrics
    if (singleValue(stats, "avgOrganizationalBarriers") >= 4) {
      risks.push("Barreras organizacionales extremas bloquean progreso");
    }
    if (singleValue(stats, "avgAutonomyLevel") < 2.5) {
      risks.push("Dependencia excesiva limita escalabilidad de IA");
    }
    if (singleValue(stats, "avgKPIImpact") < 2) {
      risks.push("Falta de impacto medible puede reducir inversión en IA");
    }
    if (singleValue(stats, "avgPromptQuality") < 2.5) {
      risks.push("Prompts de baja calidad generan resultados inconsistentes");
    }
    if (singleValue(stats, "pctLowBarriers") < 30) {
      risks.push("Alta resistencia organizacional frena implementación");
    }
    
    if (risks.length === 0) {
      risks.push("Riesgo de quedarse atrás sin mejora continua");
    }
    return risks.slice(0, 4); // Return top 4 risks
  };

  // fecha generada
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get employee count and tool data for charts
  const totalUsers = singleValue(stats, "employeeCount", 0);
  
  // Define all possible tools for the bar chart
  const allPossibleTools = [
    { name: 'ChatGPT', icon: '🤖', color: '#10B981' },
    { name: 'Copilot', icon: '🔧', color: '#3B82F6' },
    { name: 'Gemini', icon: '💎', color: '#8B5CF6' },
    { name: 'Perplexity', icon: '🔍', color: '#F59E0B' },
    { name: 'Cursor', icon: '⚡', color: '#EF4444' },
    { name: 'Claude', icon: '🧠', color: '#06B6D4' },
    { name: 'Otro', icon: '🔧', color: '#6B7280' }
  ];

  // Create tool usage data for the bar chart
  const usageMap = new Map(toolStats.map(item => [
    item.name.toLowerCase(), 
    Math.round((item.value / 100) * totalUsers) // Convert percentage to user count
  ]));
  
  const toolChartData = allPossibleTools.map(tool => ({
    name: tool.name,
    value: usageMap.get(tool.name.toLowerCase()) || 0,
    icon: tool.icon,
    color: tool.color,
    status: (usageMap.get(tool.name.toLowerCase()) || 0) > 0 ? 'En uso' : 'Sin explorar',
    percentage: toolStats.find(item => item.name.toLowerCase() === tool.name.toLowerCase())?.value || 0
  }));

  // Calculate tool discovery summary
  const usedToolsCount = toolStats.filter(tool => tool.value > 0).length;
  const totalToolsCount = 7;
  const unusedToolsCount = totalToolsCount - usedToolsCount;

  return (
    <div className="w-full p-6 space-y-8 font-sans">
      {/* Header - This will be replaced */}
      <ReportHeader companyName={companyName} stats={stats} today={today} />

      {/* Executive Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturityCard maturity={maturity} />
        <ROICard roi={roi} />
      </section>

      {/* Key Metrics - This will be replaced */}
      <KeyMetricsSection stats={stats} singleValue={singleValue} avgAgeRange={avgAgeRange} />

      {/* Knowledge Assessment */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KnowledgeAssessmentCard stats={stats} singleValue={singleValue} />
        <DepartmentUsageCard stats={stats} singleValue={singleValue} />
        <TrainingStatusCard stats={stats} singleValue={singleValue} />
      </section>

      {/* New Section: Tasks by Area */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Tareas Repetitivas por Área</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <TasksByAreaSection data={stats} />
        </div>
      </section>

      {/* New Diagnostic Metrics Section */}
      <DiagnosticMetricsSection stats={stats} singleValue={singleValue} />

      {/* Organizational Barriers Analysis - This will be replaced */}
      <section>
        <OrganizationalBarriersCard stats={stats} singleValue={singleValue} />
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceDistributionChart deviceData={deviceData} colors={COLORS} />
        <SkillsRadarChart radarData={radarData} />
      </section>

      {/* AI Tools Adoption - This section will be replaced by the new component */}
      <section>
        <AIToolsAdoptionChart 
          toolChartData={toolChartData} 
          allPossibleTools={allPossibleTools}
          usedToolsCount={usedToolsCount}
          totalToolsCount={totalToolsCount}
          unusedToolsCount={unusedToolsCount}
          totalUsers={totalUsers}
        />
      </section>

      {/* Opportunities & Risks - This will be replaced */}
      <OpportunitiesRisksSection 
        getOpportunities={getOpportunities} 
        getRisks={getRisks} 
      />

      {/* Course Transformation Offer */}
      <section className="mt-8">
        <CourseOfferCard 
          companyName={companyName}
          stats={stats}
          roi={roi}
          maturity={maturity}
          singleValue={singleValue}
        />
      </section>

      {/* ChatGPT Only Program - Alternative Offer - This will be replaced */}
      <section className="mt-6">
        <AlternativeOfferCard 
          companyName={companyName}
          stats={stats}
          roi={roi}
          maturity={maturity}
          singleValue={singleValue}
        />
      </section>

      {/* Footer - This will be replaced */}
      <ReportFooter companyName={companyName} today={today} />
    </div>
  );
};

export default CompanyIADashboard;
