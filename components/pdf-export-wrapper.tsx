import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PDF button to avoid SSR issues
// react-pdf doesn't work well with server-side rendering
const PDFExportButton = dynamic(
  () => import('./report-pdf').then((mod) => mod.PDFExportButton),
  {
    ssr: false,
    loading: () => (
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Cargando...
      </button>
    ),
  }
);

interface StatKV {
  key: string;
  value: number;
}

interface Props {
  companyName: string;
  stats: StatKV[];
}

export const PDFExportWrapper: React.FC<Props> = ({ companyName, stats }) => {
  return <PDFExportButton companyName={companyName} stats={stats} />;
}; 