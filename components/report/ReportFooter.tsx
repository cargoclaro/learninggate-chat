import React from 'react';

interface ReportFooterProps {
  companyName: string;
  today: string;
}

export const ReportFooter: React.FC<ReportFooterProps> = ({ companyName, today }) => {
  return (
    <footer className="text-xs text-muted-foreground text-center pt-8">
      Fuente: Encuesta interna · {companyName} · {today}
    </footer>
  );
}; 