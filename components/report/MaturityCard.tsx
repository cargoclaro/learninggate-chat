import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Target } from 'lucide-react';
import { MaturityData } from './types';

interface MaturityCardProps {
  maturity: MaturityData;
}

export const MaturityCard: React.FC<MaturityCardProps> = ({ maturity }) => (
  <Card className="border-2" style={{ borderColor: maturity.color }}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Target className="w-4 h-4" />
        Nivel de Madurez IA
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold" style={{ color: maturity.color }}>
          {maturity.score}
        </div>
        <div>
          <Badge style={{ backgroundColor: maturity.color, color: 'white' }}>
            {maturity.level}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            {maturity.description}
          </p>
        </div>
      </div>
      <div className="mt-3 bg-muted/40 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ 
            width: `${maturity.score}%`, 
            backgroundColor: maturity.color 
          }}
        />
      </div>
    </CardContent>
  </Card>
); 