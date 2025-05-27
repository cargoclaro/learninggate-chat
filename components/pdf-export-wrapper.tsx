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

// Dropdown PDF Export (single button with options)
export const DropdownPDFExport: React.FC<Omit<Props, 'isBlurred'>> = ({ companyName, stats }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const blurredButtonRef = React.useRef<HTMLDivElement>(null);
  const fullButtonRef = React.useRef<HTMLDivElement>(null);
  
  const handleBlurredExport = () => {
    if (blurredButtonRef.current) {
      const link = blurredButtonRef.current.querySelector('a');
      if (link) {
        link.click();
      }
    }
    setIsOpen(false);
  };

  const handleFullExport = () => {
    if (fullButtonRef.current) {
      const link = fullButtonRef.current.querySelector('a');
      if (link) {
        link.click();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Hidden PDF Export Buttons */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={blurredButtonRef}>
          <PDFExportButton companyName={companyName} stats={stats} isBlurred={true} />
        </div>
        <div ref={fullButtonRef}>
          <PDFExportButton companyName={companyName} stats={stats} isBlurred={false} />
        </div>
      </div>

      {/* Main Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Exportar PDF
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
          {/* Blurred/Preview Option */}
          <button 
            onClick={handleBlurredExport}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Versión preliminar
          </button>
          
          {/* Full Version Option */}
          <button 
            onClick={handleFullExport}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Versión completa
          </button>
        </div>
      )}
    </div>
  );
}; 