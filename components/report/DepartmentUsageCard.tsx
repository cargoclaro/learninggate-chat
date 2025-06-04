import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3, ShoppingCart, Megaphone, Calculator } from 'lucide-react';
import { StatKV } from './types';

interface DepartmentUsageCardProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const DepartmentUsageCard: React.FC<DepartmentUsageCardProps> = ({ stats, singleValue }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Uso por Departamento
        </CardTitle>
        <p className="text-xs text-muted-foreground">% con uso avanzado de IA (puntuación 4-5)</p>
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
  );
}; 