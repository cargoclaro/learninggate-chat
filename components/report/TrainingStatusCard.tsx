import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Award, GraduationCap, Shield, Lightbulb } from 'lucide-react';
import { StatKV } from './types';

interface TrainingStatusCardProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const TrainingStatusCard: React.FC<TrainingStatusCardProps> = ({ stats, singleValue }) => {
  return (
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
  );
}; 