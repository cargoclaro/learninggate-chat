import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Zap, Target, BookOpen, Users, TrendingUp, BarChart3, Lightbulb, CheckCircle } from 'lucide-react';
import { StatKV } from './types';

interface DiagnosticMetricsSectionProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const DiagnosticMetricsSection: React.FC<DiagnosticMetricsSectionProps> = ({ stats, singleValue }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Autonomy and Skills */}
      <Card className="border-2 border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Autonomía y Habilidades Prácticas
          </CardTitle>
          <p className="text-xs text-purple-600">Nivel de independencia en el uso de IA</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <span className="text-sm font-medium">Nivel de autonomía:</span>
                <div className="text-xs text-muted-foreground">1=Necesita ayuda, 5=Totalmente autónomo</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl text-purple-700">{singleValue(stats, "avgAutonomyLevel", 1).toFixed(1)}</span>
              <span className="text-sm text-purple-600">/5</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <div>
                <span className="text-sm font-medium">Calidad de prompts:</span>
                <div className="text-xs text-muted-foreground">1=Muy básico, 5=Excelente</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl text-purple-700">{singleValue(stats, "avgPromptQuality", 1).toFixed(1)}</span>
              <span className="text-sm text-purple-600">/5</span>
            </div>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 text-sm font-medium mb-1">
              <Users className="w-4 h-4" />
              Empleados con alta autonomía (4-5):
            </div>
            <div className="text-2xl font-bold text-purple-700">{singleValue(stats, "pctHighAutonomy", 0)}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Impact and Opportunities */}
      <Card className="border-2 border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Impacto y Oportunidades
          </CardTitle>
          <p className="text-xs text-orange-600">Resultados actuales y potencial de mejora</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-sm font-medium">Impacto en KPIs:</span>
                <div className="text-xs text-muted-foreground">1=Sin impacto, 5=Muy alto</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl text-orange-700">{singleValue(stats, "avgKPIImpact", 1).toFixed(1)}</span>
              <span className="text-sm text-orange-600">/5</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-sm font-medium">Oportunidad de mejora:</span>
                <div className="text-xs text-muted-foreground">1=Baja, 5=Muy alta</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl text-orange-700">{singleValue(stats, "avgImprovementOpportunity", 1).toFixed(1)}</span>
              <span className="text-sm text-orange-600">/5</span>
            </div>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 text-sm font-medium mb-1">
              <CheckCircle className="w-4 h-4" />
              Empleados con alto impacto en KPIs (4-5):
            </div>
            <div className="text-2xl font-bold text-orange-700">{singleValue(stats, "pctHighKPIImpact", 0)}%</div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}; 