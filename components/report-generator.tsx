'use client'; // This directive is necessary for using hooks like useState and event handlers

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react'; // Import the back arrow icon
import CompanyIADashboard from './report'; // Import the dashboard component

// Define a type for the component props
interface ReportGeneratorFormProps {
  onReportStateChange?: (hasReport: boolean) => void; // Callback to notify parent about report state
  initialCompanyName?: string; // Optional: To pre-fill the company name
}

export default function ReportGeneratorForm({ onReportStateChange, initialCompanyName }: ReportGeneratorFormProps) {
  // State to store the company name entered by the user
  const [companyName, setCompanyName] = useState(initialCompanyName || '');
  // State to indicate if the report is currently being generated (for loading indicators)
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null); // Added type for error state
  // State to store the fetched stats
  const [stats, setStats] = useState<{ key: string; value: number }[] | null>(null);

  // useEffect to update companyName if initialCompanyName prop changes
  useEffect(() => {
    if (initialCompanyName) {
      setCompanyName(initialCompanyName);
      // Automatically trigger report generation if an initial company name is provided
      // and we are not already showing a report (stats is null)
      // and it's not already loading.
      // This makes the UX smoother by directly showing the report form for the selected company.
      if (!stats && !isLoading) {
         // We won't call handleGenerateReport directly here to avoid an infinite loop
         // if the parent re-renders. Instead, we set the company name, and the user
         // can then click "Generate Report".
         // If you want to auto-generate, you'd need a more complex state management
         // to prevent re-triggering, e.g., a flag to indicate if auto-generation for the
         // current initialCompanyName has already occurred.
      }
    }
  }, [initialCompanyName, stats, isLoading]); // Rerun effect if initialCompanyName, stats, or isLoading changes

  // This function will be called when the "Generate Report" button is clicked
  const handleGenerateReport = async () => {
    // Basic validation: ensure companyName is not empty
    if (!companyName.trim()) {
      setError('Please enter a company name.');
      return; // Stop execution if validation fails
    }

    setIsLoading(true); // Set loading to true to disable button and show loading state
    setError(null); // Clear any previous errors
    setStats(null); // Clear any previous stats

    try {
      // Make the API call to our backend
      const response = await fetch('/api/calculations', { // Target the new API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }), // Send companyName in the request body
      });

      if (!response.ok) {
        // Try to parse error message from backend, or use a default
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch statistics.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Get the statistics array from the response
      const data = await response.json();
      console.log('Received stats:', data);
      
      // Store the stats in state
      setStats(data);
      // Notify parent that report is now displayed
      onReportStateChange?.(true);

    } catch (err: unknown) { // Added type for caught error
      // If an error occurs during the API call or processing
      console.error('Error in handleGenerateReport:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      // This block will always run, whether the try succeeded or failed
      setIsLoading(false); // Set loading back to false
    }
  };

  // Function to reset the form and go back to company selection
  const handleBackToForm = () => {
    setStats(null); // Clear the stats to show the form again
    setError(null); // Clear any errors
    // setCompanyName(''); // We don't want to clear company name here if it was pre-selected.
                        // The parent component will handle showing the selector again.
    // Notify parent that we're back to form view (or rather, that a report is no longer shown)
    onReportStateChange?.(false);
  };

  return (
    <div className="relative">
      {/* Back button icon - neat static design in top left when report is shown */}
      {stats && stats.length > 0 && (
        <button 
          onClick={handleBackToForm}
          className="absolute -top-2 left-2 z-10 p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 shadow-sm"
          title="Back to company selection"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
      )}

      <div className="space-y-8">
        {/* Show form only when no stats are loaded */}
        {/* Also, always show the form if an initialCompanyName is provided, allowing generation */}
        {!stats && (
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)} // Update companyName state on change
                placeholder="E.g., Acme Corporation"
                disabled={isLoading || !!initialCompanyName} // Disable if loading or if name came from selector
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button 
              onClick={handleGenerateReport} 
              disabled={isLoading || !companyName.trim()} // Disable button if loading or companyName is empty
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isLoading || !companyName.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate Report'} {/* Change text when loading */}
            </button>
            
            {/* Display error message if any */}
            {error && (
              <p className="mt-4 text-red-600 text-center">
                Error: {error}
              </p>
            )}
          </div>
        )}

        {/* Show dashboard when stats are loaded */}
        {stats && stats.length > 0 && (
          <div className="pt-4">
            <CompanyIADashboard companyName={companyName} stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
}
