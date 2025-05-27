import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,

} from "recharts";
import { 
  CalendarDays, 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  DollarSign,
  Users,
  Zap,
  Brain,
  BookOpen,
  Award,

  ShoppingCart,
  Megaphone,
  Calculator,
  GraduationCap,
  Lightbulb,
  Shield
} from "lucide-react";
import { PDFExportDual } from "./pdf-export-wrapper";

interface StatKV {
  key: string;
  value: number;
}

interface Props {
  companyName: string;
  stats: StatKV[];
}

interface MaturityData {
  score: number;
  level: string;
  color: string;
  description: string;
}

interface ROIData {
  current: number;
  potential: number;
  opportunity: number;
  employeeCount: number;
  currentHoursPerWeek: number;
  currentMinutesSavedPerDay: number;
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
    currentMinutesSavedPerDay: singleValue(stats, "roi.currentMinutesSavedPerDay", 1)
  };
};

const MaturityCard: React.FC<{ maturity: MaturityData }> = ({ maturity }) => (
  <Card className="border-2" style={{ borderColor: maturity.color }}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Target className="w-4 h-4" />
        Nivel de Madurez IA
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold" style={{ color: maturity.color }}>
          {maturity.score}
        </div>
        <div>
          <Badge style={{ backgroundColor: maturity.color, color: 'white' }}>
            {maturity.level}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            {maturity.description}
          </p>
        </div>
      </div>
      <div className="mt-3 bg-muted/40 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ 
            width: `${maturity.score}%`, 
            backgroundColor: maturity.color 
          }}
        />
      </div>
    </CardContent>
  </Card>
);

const ROICard: React.FC<{ roi: ROIData }> = ({ roi }) => (
  <Card className="border-2 border-green-200 bg-green-50/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        Potencial ROI Anual ({roi.employeeCount} empleados)
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm">Ahorro actual:</span>
        <span className="font-semibold text-green-600">${roi.current.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Potencial con training:</span>
        <span className="font-bold text-green-700">${roi.potential.toLocaleString()}</span>
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Oportunidad adicional:</span>
          <span className="font-bold text-red-600">${roi.opportunity.toLocaleString()}</span>
        </div>
      </div>
      <div className="border-t pt-2 text-xs text-muted-foreground space-y-1">
        <div>Uso actual: {roi.currentHoursPerWeek}h/semana, {roi.currentMinutesSavedPerDay} min/día ahorrados</div>
        <div>Basado en 30,000 MXN/mes por empleado y potencial de 2h/día con IA optimizada</div>
      </div>
    </CardContent>
  </Card>
);

const OpportunityCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({
  title,
  items,
  icon,
  color
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color }}>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
            {item}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const SummaryCard: React.FC<{ 
  title: string; 
  value: number; 
  icon?: React.ReactNode; 
  benchmark?: number;
  unit?: string;
}> = ({
  title,
  value,
  icon,
  benchmark,
  unit = ""
}) => {
  // Determine status based on benchmark
  let statusColor = "#DB4437"; // Red by default
  let statusText = "Bajo";
  
  if (benchmark && value >= benchmark) {
    statusColor = "#0F9D58"; // Green
    statusText = "Excelente";
  } else if (benchmark && value >= benchmark * 0.7) {
    statusColor = "#F4B400"; // Yellow
    statusText = "Bueno";
  }

  return (
    <Card className="flex flex-col justify-between h-full border-l-4" style={{ borderLeftColor: statusColor }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <Badge style={{ backgroundColor: statusColor, color: 'white' }} className="text-xs">
          {statusText}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-primary">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {benchmark && (
          <div className="mt-2 text-xs text-muted-foreground">
            Meta: {benchmark}{unit}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CompanyIADashboard: React.FC<Props> = ({ companyName, stats }) => {
  // --- datasets ---
  const deviceData = useGroupedStats(stats, "device.");
  
  // Copilot data - based on exact API structure
  const copilotData = [
    { name: "Web", value: singleValue(stats, "copilot.web") },
    { name: "Excel", value: singleValue(stats, "copilot.excel") },
    { name: "Word", value: singleValue(stats, "copilot.word") },
    { name: "Outlook", value: singleValue(stats, "copilot.outlook") },
    { name: "Power Platform", value: singleValue(stats, "copilot.powerPlat") },
  ];

  // Calculate AI maturity and ROI
  const maturity = calculateAIMaturity(stats);
  const roi = getROIFromStats(stats);

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
  ];



  // Generate opportunities based on maturity level
  const getOpportunities = () => {
    if (maturity.score < 25) {
      return [
        "Implementar programa básico de alfabetización IA",
        "Capacitación en herramientas fundamentales (ChatGPT, Copilot)",
        "Establecer políticas de uso responsable de IA",
        "Identificar casos de uso de alto impacto"
      ];
    } else if (maturity.score < 50) {
      return [
        "Desarrollar prompts especializados por área",
        "Implementar workflows automatizados",
        "Capacitación avanzada en herramientas específicas",
        "Medir y optimizar ROI de herramientas IA"
      ];
    } else if (maturity.score < 75) {
      return [
        "Desarrollar soluciones IA personalizadas",
        "Implementar IA en procesos críticos",
        "Crear centro de excelencia en IA",
        "Explorar IA generativa avanzada"
      ];
    } else {
      return [
        "Liderar innovación en el sector",
        "Desarrollar productos con IA integrada",
        "Monetizar capacidades IA",
        "Establecer partnerships tecnológicos"
      ];
    }
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
    if (singleValue(stats, "pctKnowPromptParts") < 40) {
      risks.push("Desconocimiento de técnicas avanzadas de prompting");
    }
    
    if (risks.length === 0) {
      risks.push("Riesgo de quedarse atrás sin mejora continua");
    }
    return risks;
  };

  // fecha generada
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full p-6 space-y-8 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <PieIcon className="w-8 h-8 text-primary" />
          Diagnóstico IA – {companyName}
        </h1>
        <div className="flex items-center gap-3">
          {/* Option 1: Single button (original) */}
          {/* <PDFExportWrapper companyName={companyName} stats={stats} /> */}
          
          {/* Option 2: Dual buttons (preview + full) */}
          <PDFExportDual companyName={companyName} stats={stats} />
          
          <Badge className="gap-1">
            <CalendarDays className="w-4 h-4" /> {today}
          </Badge>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturityCard maturity={maturity} />
        <ROICard roi={roi} />
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SummaryCard
          title="Empleados evaluados"
          value={singleValue(stats, "employeeCount", 0)}
          icon={<Users className="w-4 h-4" />}
          benchmark={50}
          unit=" empleados"
        />
        <SummaryCard
          title="Horas IA/semana"
          value={singleValue(stats, "avgHoursIAWeek", 1)}
          icon={<BarChart3 className="w-4 h-4" />}
          benchmark={12}
          unit=" hrs"
        />
        <SummaryCard
          title="Minutos ahorrados/día"
          value={singleValue(stats, "avgMinutesSaved", 1)}
          icon={<Zap className="w-4 h-4" />}
          benchmark={120}
          unit=" min"
        />
        <SummaryCard
          title="Skill prompting"
          value={singleValue(stats, "avgPromptSkill", 1)}
          icon={<Target className="w-4 h-4" />}
          benchmark={5}
          unit="/5"
        />
        <SummaryCard
          title="% Conoce LLMs"
          value={singleValue(stats, "pctKnowLLM", 0)}
          icon={<Brain className="w-4 h-4" />}
          benchmark={100}
          unit="%"
        />
      </section>

      {/* Knowledge Assessment */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Conocimiento Básico IA
            </CardTitle>
            <p className="text-xs text-blue-600">Oportunidad de capacitación fundamental</p>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Sabe qué es un LLM:</span>
              </div>
              <span className="font-bold text-lg text-blue-700">{singleValue(stats, "pctKnowLLM", 0)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Conoce pretraining/finetuning:</span>
              </div>
              <span className="font-bold text-lg text-blue-700">{singleValue(stats, "pctKnowPretrainingFT", 0)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Conoce 4 partes del prompt:</span>
              </div>
              <span className="font-bold text-lg text-blue-700">{singleValue(stats, "pctKnowPromptParts", 0)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Uso por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-500" />
                <span className="text-sm">Ventas:</span>
              </div>
              <span className="font-semibold">{singleValue(stats, "pctIAinSales", 0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Marketing:</span>
              </div>
              <span className="font-semibold">{singleValue(stats, "pctIAinMarketing", 0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Finanzas:</span>
              </div>
              <span className="font-semibold">{singleValue(stats, "pctIAinFinance", 0)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Estado de Capacitación
            </CardTitle>
            <p className="text-xs text-green-600">Potencial de desarrollo del equipo</p>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-green-500" />
                <span className="text-sm">Capacitación formal recibida:</span>
              </div>
              <span className="font-bold text-lg text-green-700">{singleValue(stats, "pctFormalTraining", 0)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">Confianza en resultados IA:</span>
              </div>
              <span className="font-bold text-lg text-green-700">{singleValue(stats, "avgConfidence", 1)}/5</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Curiosidad por explorar IA:</span>
              </div>
              <span className="font-bold text-lg text-green-700">{singleValue(stats, "avgCuriosity", 1)}/5</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Charts Grid - Moved up for better visibility */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device distribution pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="w-5 h-5" />
              Dispositivos donde usan IA
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={4}
                  label
                >
                  {deviceData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar skills with benchmark */}
        <Card className="border-2 border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skills vs Industria
            </CardTitle>
            <p className="text-xs text-purple-600">Comparación con benchmarks del mercado</p>
          </CardHeader>
          <CardContent className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d1d5db" strokeWidth={1} />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "#374151" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Radar
                  name="Tu empresa"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Radar
                  name="Promedio industria"
                  dataKey="industry"
                  stroke="#dc2626"
                  fill="#ef4444"
                  fillOpacity={0.1}
                  strokeWidth={3}
                  strokeDasharray="8 4"
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Copilot Adoption - Moved up for better visibility */}
      <section>
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Adopción Microsoft Copilot
            </CardTitle>
            <p className="text-sm text-blue-600 mt-1">Porcentaje de uso por herramienta</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={copilotData} margin={{ left: 16, right: 16, top: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const icons = {
                      "Web": "🌐",
                      "Excel": "📊", 
                      "Word": "📝",
                      "Outlook": "📧",
                      "Power Platform": "⚡"
                    };
                    return `${icons[value as keyof typeof icons] || ""} ${value}`;
                  }}
                />
                <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(v: number) => [`${v}%`, "Adopción"]}
                  labelFormatter={(label) => `Microsoft Copilot ${label}`}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  <Cell fill="#1f77b4" /> {/* Bright Blue */}
                  <Cell fill="#2ca02c" /> {/* Bright Green */}
                  <Cell fill="#ff7f0e" /> {/* Bright Orange */}
                  <Cell fill="#d62728" /> {/* Bright Red */}
                  <Cell fill="#9467bd" /> {/* Bright Purple */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Opportunities & Risks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OpportunityCard
          title="Oportunidades de Crecimiento"
          items={getOpportunities()}
          icon={<TrendingUp className="w-4 h-4" />}
          color="#0F9D58"
        />
        <OpportunityCard
          title="Riesgos Identificados"
          items={getRisks()}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="#DB4437"
        />
      </section>

      {/* Course Transformation Offer - Based on Real Calculated Values */}
      <section>
        <Card className="border-2 border-[#F5B614] bg-gradient-to-br from-white via-[#FFFBF0] to-white shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#F5B614] to-[#E5A604] text-white p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5" />
              <span className="text-xs font-medium tracking-wide">PROGRAMA EXCLUSIVO</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">
              De Nivel {maturity.level} a Experto IA en 90 Días
            </h2>
            <p className="text-sm opacity-95 max-w-xl mx-auto">
              Transforma a tus {Math.max(25, roi.employeeCount)} empleados en expertos de ChatGPT y Copilot
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            {(() => {
              // Ensure minimum 25 employees for program calculations
              const programEmployeeCount = Math.max(25, roi.employeeCount);
              const isMinimumTeam = roi.employeeCount < 25;
              
              // Calculate program value based on potential savings and employee count
              const baseProgramValue = 50000; // Minimum $50k
              const potentialSavingsValue = Math.max(roi.potential - roi.current, 0);
              
              // Value scales with team size and potential savings
              // Base: $50k for 25 employees, then $1.5k per additional employee
              const employeeScalingValue = programEmployeeCount > 25 
                ? (programEmployeeCount - 25) * 1500 
                : 0;
              
              // Add 15% of potential annual savings as value component
              const savingsBasedValue = potentialSavingsValue * 0.15;
              
              const totalProgramValue = Math.max(
                baseProgramValue + employeeScalingValue + savingsBasedValue,
                baseProgramValue
              );
              
              // Program price is 50% of total value (good value proposition)
              const programPrice = Math.round(totalProgramValue * 0.5);
              
              return (
                <>
                  {/* Minimum Team Size Notice */}
                  {isMinimumTeam && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-yellow-600" />
                        <span className="font-bold text-yellow-700 text-sm">Programa Empresarial</span>
                      </div>
                      <div className="text-xs text-yellow-600">
                        Programa diseñado para equipos de mínimo 25 empleados.
                        <span className="font-semibold"> Cotización basada en 25 empleados.</span>
                      </div>
                    </div>
                  )}

                  {/* Problem/Solution - Based on Real Data */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <h3 className="text-base font-bold text-red-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Sin el programa
                      </h3>
                      <div className="space-y-2 text-xs text-red-600">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          <span>Pierdes ${Math.round(roi.opportunity/12).toLocaleString()}/mes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          <span>Solo {roi.currentMinutesSavedPerDay} min/día ahorrados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          <span>Skill: {singleValue(stats, "avgPromptSkill", 1)}/5 ({maturity.level})</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <h3 className="text-base font-bold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Con el programa
                      </h3>
                      <div className="space-y-2 text-xs text-green-600">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span>Generas ${Math.round(roi.potential/12).toLocaleString()}/mes adicionales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span>120+ min/día ahorrados (2+ horas)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span>Skill: 5/5 (Experto certificado)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROI Calculation - Real Numbers */}
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-center mb-3 text-black">
                      ROI para {companyName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xl font-bold text-red-700">${Math.round(roi.opportunity).toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Oportunidad perdida</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xl font-bold text-emerald-700">${Math.round(roi.potential).toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Potencial anual</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xl font-bold text-indigo-700">{Math.round((roi.potential - roi.current) / programPrice * 100)}%</div>
                        <div className="text-xs text-gray-600">ROI programa</div>
                      </div>
                    </div>
                  </div>

                  {/* Value Stack - Dynamic Based on Team Size & Potential */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
                      Programa ({programEmployeeCount} empleados)
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">8 semanas entrenamiento</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Certificación oficial</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Prompts personalizados</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Soporte 90 días</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Comunidad expertos</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Templates listos</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Seguimiento ROI</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-6 h-6 bg-[#F5B614] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">Garantía resultados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Value Summary - Dynamic Calculation */}
                    <div className="border-t mt-4 pt-3 text-center">
                      <div className="text-sm text-gray-700 font-medium">Valor total:</div>
                      <div className="text-xl font-bold text-gray-800 line-through">${totalProgramValue.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Pricing - Dynamic Based on Value */}
                  <div className="text-center">
                    <div className="bg-[#F5B614] rounded-lg p-4 text-white mb-3">
                      <div className="text-xs mb-1">Tu inversión ({programEmployeeCount} empleados):</div>
                      <div className="text-3xl font-bold mb-1">${programPrice.toLocaleString()}</div>
                      <div className="text-sm">Se paga en {Math.round(programPrice / (roi.potential - roi.current) * 12)} días</div>
                    </div>
                    
                    {/* Risk Reversal */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-700 text-sm">Garantía Triple</span>
                      </div>
                      <div className="text-xs text-green-600 space-y-1">
                        <div>✓ ${Math.round(roi.potential - roi.current).toLocaleString()} adicionales en 90 días o devolución completa</div>
                        <div>✓ Mejora de {singleValue(stats, "avgPromptSkill", 1)}/5 a 5/5 o extensión gratis</div>
                        <div>✓ Satisfacción garantizada</div>
                      </div>
                    </div>
                  </div>

                  {/* Urgency & Scarcity - Personalized */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">Disponibilidad Limitada</span>
                    </div>
                    <div className="text-xs text-red-600">
                      Solo 20 empresas por trimestre. 
                      <span className="font-semibold">Siguiente cohorte en 15 días.</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center space-y-3">
                    <button className="w-full bg-gradient-to-r from-[#F5B614] to-[#E5A604] hover:from-[#E5A604] hover:to-[#D4950A] text-white font-bold text-lg py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                      RESERVAR CUPO - ${programPrice.toLocaleString()}
                    </button>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>✓ Llamada estratégica gratuita</div>
                      <div>✓ Análisis ROI personalizado</div>
                      <div>✓ Sin compromiso inicial</div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Social Proof */}
            <div className="border-t pt-4 text-center">
              <div className="text-xs text-gray-600 mb-2">
                <span className="font-bold text-[#F5B614]">+500 empleados</span> transformados en <span className="font-bold">+50 empresas</span>
              </div>
              <div className="flex justify-center items-center gap-4 text-gray-400 text-xs font-medium">
                <span>VISIONA</span>
                <span>TECH CORP</span>
                <span>INNOVATE SA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="text-xs text-muted-foreground text-center pt-8">
        Fuente: Encuesta interna · {companyName} · {today}
      </footer>
    </div>
  );
};

export default CompanyIADashboard;
