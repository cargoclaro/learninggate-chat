'use client';

import React, { useState } from 'react';
import ReportGeneratorForm from '../../components/report-generator'; // Adjusted path

export default function GenerateReportPage() {
  const [showingReport, setShowingReport] = useState(false);

  return (
    <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Only show title when not displaying a report */}
      {!showingReport && (
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2em' }}>
          Company Report Generation
        </h1>
      )}
      <ReportGeneratorForm onReportStateChange={setShowingReport} />
    </main>
  );
}
