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
  LineChart,
  Line,
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
  Heart,
  ShoppingCart,
  Megaphone,
  Calculator,
  GraduationCap,
  Lightbulb,
  Shield
} from "lucide-react";

interface StatKV {
  key: string;
  value: number;
}

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

// AI Maturity Calculator - Based on actual API calculations
const calculateAIMaturity = (stats: StatKV[]) => {
  const avgSkill = singleValue(stats, "avgPromptSkill"); // 1-5 scale from API
  const avgConfidence = singleValue(stats, "avgConfidence"); // 1-5 scale from API
  const avgHours = singleValue(stats, "avgHoursIAWeek"); // Hours per week from API
  const avgSaved = singleValue(stats, "avgMinutesSaved"); // Minutes saved per day from API
  
  // Additional knowledge metrics from API
  const pctKnowLLM = singleValue(stats, "pctKnowLLM"); // Percentage who know what LLM is
  const pctKnowPromptParts = singleValue(stats, "pctKnowPromptParts"); // Know 4 parts of prompt
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

const MaturityCard: React.FC<{ maturity: any }> = ({ maturity }) => (
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

const ROICard: React.FC<{ roi: any }> = ({ roi }) => (
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
  trend?: string;
  benchmark?: number;
  unit?: string;
}> = ({
  title,
  value,
  icon,
  trend,
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
  const areaData = useGroupedStats(stats, "area.");
  const deviceData = useGroupedStats(stats, "device.");
  const objectiveData = useGroupedStats(stats, "objective.");
  
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

  const topChallenges = useGroupedStats(stats, "topChallenge.");
  const topTopics = useGroupedStats(stats, "topTopic.");

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
        <Badge className="gap-1">
          <CalendarDays className="w-4 h-4" /> {today}
        </Badge>
      </header>

      {/* Executive Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturityCard maturity={maturity} />
        <ROICard roi={roi} />
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SummaryCard
          title="Años experiencia con IA"
          value={singleValue(stats, "avgYearsExperience", 1)}
          icon={<Users className="w-4 h-4" />}
          benchmark={2}
          unit=" años"
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
          benchmark={4}
          unit="/5"
        />
        <SummaryCard
          title="% Conoce LLMs"
          value={singleValue(stats, "pctKnowLLM", 0)}
          icon={<Brain className="w-4 h-4" />}
          benchmark={80}
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

      {/* Charts Grid */}
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
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Tu empresa"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Radar
                  name="Promedio industria"
                  dataKey="industry"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Copilot Adoption */}
      <section>
        <Card className="border-2 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Adopción Microsoft Copilot
            </CardTitle>
            <p className="text-xs text-orange-600">Uso de herramientas Copilot en Office 365</p>
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
                  <Cell fill="#0078d4" /> {/* Microsoft Blue */}
                  <Cell fill="#107c10" /> {/* Excel Green */}
                  <Cell fill="#2b579a" /> {/* Word Blue */}
                  <Cell fill="#0078d4" /> {/* Outlook Blue */}
                  <Cell fill="#742774" /> {/* Power Platform Purple */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Main Challenges */}
      <section>
        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Principales Retos Identificados
            </CardTitle>
            <p className="text-xs text-red-600">Obstáculos que limitan el potencial de IA en la empresa</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topChallenges.map((c, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">#{idx + 1}</span>
                    </div>
                    <span className="font-medium capitalize text-gray-800">{c.name}</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{c.value}%</span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
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
