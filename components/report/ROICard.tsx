import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { DollarSign } from "lucide-react";
import type { ROIData } from "./types";

const ROICard: React.FC<{ roi: ROIData }> = ({ roi }) => {
  const currentMonthlyTotal = roi.current;
  const potentialMonthlyTotal = roi.potential;
  const opportunityMonthlyTotal = roi.opportunity;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Análisis ROI Mensual ({roi.employeeCount} empleados)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Current Value */}
        <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
          <span className="text-sm font-medium text-blue-700">💰 Valor actual generado (total):</span>
          <span className="font-bold text-blue-700">${currentMonthlyTotal.toLocaleString()}/mes</span>
        </div>

        {/* Opportunity Cost */}
        <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
          <span className="text-sm font-medium text-red-700">⚠️ Dinero que pierden (total):</span>
          <span className="font-bold text-red-700">${opportunityMonthlyTotal.toLocaleString()}/mes</span>
        </div>

        {/* Maximum Potential */}
        <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
          <span className="text-sm font-medium text-green-700">🎯 Potencial con training (total):</span>
          <span className="font-bold text-green-700">${potentialMonthlyTotal.toLocaleString()}/mes</span>
        </div>

        {/* Context */}
        <div className="border-t pt-2 text-xs text-muted-foreground space-y-1">
          <div><strong>Tiempo ahorrado (reportado):</strong> {roi.currentMinutesSavedPerDay.toFixed(1)} min/día por empleado.</div>
          <div><strong>Eficiencia de Adopción IA (real):</strong> {roi.adoptionEffectiveness.toFixed(1)}%.</div>
          {roi.adoptionEffectiveness < 99.9 && typeof roi.missedHoursPerDay === 'number' && (
            <div className="text-gray-600">
              ↳ Potencial no alcanzado: {roi.missedHoursPerDay.toFixed(2)} hrs/día por empleado.
            </div>
          )}
          {roi.current > 0 && roi.opportunity > 0 && (
            <div className="font-medium text-red-600">
              El costo de oportunidad (${opportunityMonthlyTotal.toLocaleString()}/mes) es un {Math.round((roi.opportunity / roi.current) * 100)}% del valor que ya generan.
            </div>
          )}
          {roi.current === 0 && roi.opportunity > 0 && (
            <div className="font-medium text-red-700">
              Actualmente no se está capitalizando el valor de la IA, perdiendo el potencial de ${opportunityMonthlyTotal.toLocaleString()}/mes.
            </div>
          )}
          <div>(Potencial máx. ahorro: 2 hrs/día/empleado con IA optimizada).</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard;
