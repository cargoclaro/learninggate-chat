import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';
import {
  RadarChart as RechartsRadarChart, // Renamed to avoid conflict if any future icon is named RadarChart
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Target } from 'lucide-react';

interface RadarDataPoint {
  metric: string;
  score: number;
  industry: number;
}

interface SkillsRadarChartProps {
  radarData: RadarDataPoint[];
}

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ radarData }) => {
  return (
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
          <RechartsRadarChart data={radarData}>
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
          </RechartsRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 