import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  benchmark?: number;
  unit?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  benchmark,
  unit = ""
}) => {
  let statusColor = "#DB4437"; // Red by default
  let statusText = "Bajo";
  
  if (benchmark && typeof value === 'number' && value >= benchmark) {
    statusColor = "#0F9D58"; // Green
    statusText = "Excelente";
  } else if (benchmark && typeof value === 'number' && value >= benchmark * 0.7) {
    statusColor = "#F4B400"; // Yellow
    statusText = "Bueno";
  }

  return (
    <Card className="flex flex-col justify-between h-full border-l-4" style={{ borderLeftColor: statusColor }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <Badge style={{ backgroundColor: statusColor, color: 'white' }} className="text-xs">
          {statusText}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-primary">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {benchmark && (
          <div className="mt-2 text-xs text-muted-foreground">
            Meta: {benchmark}{unit}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 