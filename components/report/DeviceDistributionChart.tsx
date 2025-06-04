import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';
import {
  PieChart as RechartsPieChart, // Renamed to avoid conflict with lucide-react icon
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react'; // lucide-react icon

interface DeviceDataPoint {
  name: string;
  value: number;
}

interface DeviceDistributionChartProps {
  deviceData: DeviceDataPoint[];
  colors: string[];
}

export const DeviceDistributionChart: React.FC<DeviceDistributionChartProps> = ({ deviceData, colors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="w-5 h-5" />
          Dispositivos donde usan IA
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
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
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 