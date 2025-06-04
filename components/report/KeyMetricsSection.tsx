import React from 'react';
import { SummaryCard } from './SummaryCard'; // Assuming SummaryCard is in the same directory
import { Users, BarChart3, Zap, Target } from 'lucide-react';
import { StatKV } from './types';

interface KeyMetricsSectionProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
  avgAgeRange: string;
}

export const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ 
  stats, 
  singleValue, 
  avgAgeRange 
}) => {
  return (
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
        title="Edad promedio"
        value={avgAgeRange}
        icon={<Users className="w-4 h-4" />}
        unit=" años"
      />
    </section>
  );
}; 