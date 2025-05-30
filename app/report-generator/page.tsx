'use client';

import React, { useState } from 'react';
import ReportGeneratorForm from '../../components/report-generator'; // Adjusted path
import CompanySelector from '../../components/CompanySelector'; // Import the new component

export default function GenerateReportPage() {
  const [showingReport, setShowingReport] = useState(false);
  // New state to store the name of the company selected from the CompanySelector
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);

  // Handler for when a company is selected from the CompanySelector
  const handleCompanySelected = (companyName: string) => {
    setSelectedCompanyName(companyName);
    // When a company is selected, we are about to show the form, not a report yet.
    setShowingReport(false); 
  };

  // Handler for when the report state changes in ReportGeneratorForm
  // This will also be used to reset to the company selector view when user clicks "Back" from a report
  const handleReportStateChange = (hasReport: boolean) => {
    setShowingReport(hasReport);
    if (!hasReport && selectedCompanyName) {
      // If we are navigating "back" from a report (hasReport is false)
      // and a company was previously selected, we should clear the selected company
      // to show the CompanySelector again.
      // However, if `onReportStateChange(false)` is called just because the form is shown
      // (before a report is generated for the selectedCompany), we don't want to clear selectedCompanyName.
      // The current ReportGeneratorForm calls onReportStateChange(false) in handleBackToForm.
      // It also calls onReportStateChange(true) when a report is successfully generated.
      // So, if hasReport is false, it means either the form is initially shown (no company selected yet, or company just selected)
      // OR the user clicked "Back" from the report view.
      // We only want to go back to selector if a report *was* showing and now it is not.
      // This logic is a bit tricky. Let's simplify: when the back button in ReportGeneratorForm is clicked,
      // it calls onReportStateChange(false). We can use that to go back to the selector.
      setSelectedCompanyName(null); // Go back to company selector view
    }
  };

  return (
    <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Show title only if no specific company is selected yet AND no report is being shown */} 
      {!selectedCompanyName && !showingReport && (
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2em' }}>
          Company Report Generation
        </h1>
      )}

      {/* If no company is selected yet, show the CompanySelector */} 
      {!selectedCompanyName ? (
        <CompanySelector onCompanySelect={handleCompanySelected} />
      ) : (
        /* Once a company is selected, show the ReportGeneratorForm with the selected company */
        <ReportGeneratorForm 
          initialCompanyName={selectedCompanyName} 
          onReportStateChange={handleReportStateChange} 
        />
      )}
    </main>
  );
}
