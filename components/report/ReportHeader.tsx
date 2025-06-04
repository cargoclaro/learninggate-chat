import React from 'react';
import { Badge } from '../ui/badge';
import { PieChart as PieIcon, CalendarDays } from 'lucide-react';
import { DropdownPDFExport } from '../pdf-export-wrapper'; // Adjusted path
import { StatKV } from './types'; // For stats prop passed to DropdownPDFExport

interface ReportHeaderProps {
  companyName: string;
  stats: StatKV[]; // Needed for DropdownPDFExport
  today: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ companyName, stats, today }) => {
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
        <PieIcon className="w-8 h-8 text-primary" />
        Diagnóstico IA – {companyName}
      </h1>
      <div className="flex items-center gap-3">
        <DropdownPDFExport companyName={companyName} stats={stats} />
        <Badge className="gap-1">
          <CalendarDays className="w-4 h-4" /> {today}
        </Badge>
      </div>
    </header>
  );
}; 