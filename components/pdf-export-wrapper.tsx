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
  isBlurred?: boolean;
}

// Single PDF Export (original functionality)
export const PDFExportWrapper: React.FC<Props> = ({ companyName, stats, isBlurred = false }) => {
  return <PDFExportButton companyName={companyName} stats={stats} isBlurred={isBlurred} />;
};

// Dual PDF Export Options (new functionality)
export const PDFExportDual: React.FC<Omit<Props, 'isBlurred'>> = ({ companyName, stats }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Preview/Blurred Version */}
      <PDFExportButton 
        companyName={companyName} 
        stats={stats} 
        isBlurred={true}
      />
      
      {/* Full Version */}
      <div className="relative group">
        <PDFExportButton 
          companyName={companyName} 
          stats={stats} 
          isBlurred={false}
        />
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Versión completa
        </div>
      </div>
    </div>
  );
}; 