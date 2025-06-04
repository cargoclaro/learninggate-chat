import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { AlertTriangle, Shield, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { StatKV } from './types';

interface OrganizationalBarriersCardProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const OrganizationalBarriersCard: React.FC<OrganizationalBarriersCardProps> = ({ stats, singleValue }) => {
  return (
    <Card className="border-2 border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Análisis de Barreras Organizacionales
        </CardTitle>
        <p className="text-xs text-red-600">Obstáculos internos para la adopción de IA</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Nivel de barreras:</span>
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">
              {singleValue(stats, "avgOrganizationalBarriers", 1).toFixed(1)}/5
            </div>
            <div className="text-xs text-muted-foreground">
              1=Ninguna, 5=Extremas
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Empleados sin barreras:</span>
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {singleValue(stats, "pctLowBarriers", 0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Puntuación 1-2 en barreras
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Potencial de mejora:</span>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {singleValue(stats, "pctHighImprovementOpportunity", 0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Alta oportunidad (4-5)
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 text-sm font-medium mb-2">
            <Lightbulb className="w-4 h-4" />
            Interpretación de Barreras
          </div>
          <div className="text-sm text-yellow-600">
            {(() => {
              const barrierLevel = singleValue(stats, "avgOrganizationalBarriers", 1);
              if (barrierLevel <= 2) {
                return "🟢 Excelente: Pocas barreras organizacionales. El equipo tiene libertad para experimentar con IA.";
              } else if (barrierLevel <= 3) {
                return "🟡 Moderado: Algunas barreras presentes. Se recomienda trabajar en políticas y comunicación interna.";
              } else if (barrierLevel <= 4) {
                return "🟠 Alto: Barreras significativas. Necesario involucrar liderazgo y crear estrategia de cambio.";
              } else {
                return "🔴 Crítico: Barreras extremas. Requiere intervención ejecutiva y plan de transformación cultural.";
              }
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 