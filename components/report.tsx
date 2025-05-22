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
import { CalendarDays, BarChart3, PieChart as PieIcon } from "lucide-react";

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

const SummaryCard: React.FC<{ title: string; value: number; icon?: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <Card className="flex flex-col justify-between h-full">
    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <span className="text-3xl font-semibold text-primary">{value}</span>
    </CardContent>
  </Card>
);

const CompanyIADashboard: React.FC<Props> = ({ companyName, stats }) => {
  // --- datasets ---
  const areaData = useGroupedStats(stats, "area.");
  const deviceData = useGroupedStats(stats, "device.");
  const objectiveData = useGroupedStats(stats, "objective.");
  const copilotData = useGroupedStats(stats, "copilot.");

  const radarData = [
    {
      metric: "Habilidad prompts",
      score: singleValue(stats, "avgPromptSkill", 2),
    },
    {
      metric: "Confianza IA",
      score: singleValue(stats, "avgConfidence", 2),
    },
    {
      metric: "Curiosidad IA",
      score: singleValue(stats, "avgCuriosity", 2),
    },
  ];

  const topChallenges = useGroupedStats(stats, "topChallenge.");
  const topTopics = useGroupedStats(stats, "topTopic.");

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

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Promedio años experiencia"
          value={singleValue(stats, "avgYearsExperience", 1)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <SummaryCard
          title="Horas IA/semana"
          value={singleValue(stats, "avgHoursIAWeek", 1)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <SummaryCard
          title="Minutos ahorrados/día"
          value={singleValue(stats, "avgMinutesSaved", 1)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area distribution pie */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Áreas de trabajo</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={4}
                  label
                >
                  {areaData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device distribution pie */}
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos IA</CardTitle>
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
                    <Cell key={`cell-${idx}`} fill={COLORS[(idx + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Objectives pie */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos IA</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={objectiveData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={4}
                  label
                >
                  {objectiveData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[(idx + 4) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Copilot adoption bar chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Adopción Copilot</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={copilotData} margin={{ left: 16, right: 16 }}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {copilotData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar skills */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Skills & Mindset</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  dataKey="score"
                  stroke="#4285F4"
                  fill="#4285F4"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Challenges & Topics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retos principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topChallenges.map((c, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-40 truncate capitalize">{c.name}</span>
                <div className="flex-1 bg-muted/40 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium">
                  {c.value}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temas a profundizar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTopics.map((t, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-40 truncate capitalize">{t.name}</span>
                <div className="flex-1 bg-muted/40 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-secondary"
                    style={{ width: `${t.value}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium">
                  {t.value}%
                </span>
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
