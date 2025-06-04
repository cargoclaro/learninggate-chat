import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Brain, BookOpen, Target, GraduationCap } from 'lucide-react';
import { StatKV } from './types';

interface KnowledgeAssessmentCardProps {
  stats: StatKV[];
  singleValue: (stats: StatKV[], key: string, decimals?: number) => number;
}

export const KnowledgeAssessmentCard: React.FC<KnowledgeAssessmentCardProps> = ({ stats, singleValue }) => {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Conocimiento Básico IA
        </CardTitle>
        <p className="text-xs text-blue-600">Promedio en escala 1-5 (donde 5 = excelente)</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Sabe qué es un LLM:</span>
          </div>
          <span className="font-bold text-lg text-blue-700">{singleValue(stats, "avgLLMKnowledge", 1).toFixed(1)}/5</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Conoce pretraining/finetuning:</span>
          </div>
          <span className="font-bold text-lg text-blue-700">{singleValue(stats, "avgPretrainingKnowledge", 1).toFixed(1)}/5</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Conoce 4 partes del prompt:</span>
          </div>
          <span className="font-bold text-lg text-blue-700">{singleValue(stats, "avgPromptKnowledge", 1).toFixed(1)}/5</span>
        </div>
      </CardContent>
    </Card>
  );
}; 