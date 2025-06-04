import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';
import {
  BarChart as RechartsBarChart, // Renamed to avoid conflict
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, Lightbulb } from 'lucide-react';

interface ToolDefinition {
  name: string;
  icon: string;
  color: string;
}

interface ToolChartDataPoint {
  name: string;
  value: number;
  icon: string;
  color: string;
  status: string;
  percentage: number;
}

interface AIToolsAdoptionChartProps {
  toolChartData: ToolChartDataPoint[];
  allPossibleTools: ToolDefinition[]; // For XAxis tickFormatter and Bar Cells
  usedToolsCount: number;
  totalToolsCount: number;
  unusedToolsCount: number;
  totalUsers: number;
}

export const AIToolsAdoptionChart: React.FC<AIToolsAdoptionChartProps> = ({
  toolChartData,
  allPossibleTools,
  usedToolsCount,
  totalToolsCount,
  unusedToolsCount,
  totalUsers
}) => {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Herramientas IA Disponibles
        </CardTitle>
        <p className="text-sm text-blue-600 mt-1">Número de empleados por herramienta</p>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            data={toolChartData} 
            margin={{ left: 16, right: 16, top: 20, bottom: 20 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                const item = allPossibleTools.find(tool => tool.name === value);
                return `${item?.icon || '🔧'} ${value}`;
              }}
            />
            <YAxis 
              domain={[0, 'dataMax']} 
              tickFormatter={(v: number) => `${v} empleados`} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip 
              formatter={(v: number, name, props) => [
                `${v} empleados (${props.payload.percentage.toFixed(1)}%)`, 
                props.payload.status === 'En uso' ? 'Empleados actuales' : 'Sin empleados'
              ]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {allPossibleTools.map((tool, index) => (
                <Cell key={`cell-${index}`} fill={tool.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 text-sm font-medium mb-2">
            <Lightbulb className="w-4 h-4" />
            Oportunidad de Descubrimiento
          </div>
          <div className="text-xs text-yellow-600">
            {`${usedToolsCount} herramientas en uso de ${totalToolsCount} disponibles. ${unusedToolsCount} herramientas sin explorar por ${totalUsers} empleados.`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 