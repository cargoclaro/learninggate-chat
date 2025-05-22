'use client'; // This directive is necessary for using hooks like useState and event handlers

import React, { useState } from 'react';
import CompanyIADashboard from './report'; // Import the dashboard component

// Define a type for the component props if you plan to pass any, though none for now.
// interface ReportGeneratorFormProps {}

export default function ReportGeneratorForm(/*props: ReportGeneratorFormProps*/) {
  // State to store the company name entered by the user
  const [companyName, setCompanyName] = useState('');
  // State to indicate if the report is currently being generated (for loading indicators)
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null); // Added type for error state
  // State to store the fetched stats
  const [stats, setStats] = useState<{ key: string; value: number }[] | null>(null);

  // This function will be called when the "Generate Report" button is clicked
  const handleGenerateReport = async () => {
    // Basic validation: ensure company name is not empty
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

    } catch (err: any) { // Added type for caught error
      // If an error occurs during the API call or processing
      console.error('Error in handleGenerateReport:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      // This block will always run, whether the try succeeded or failed
      setIsLoading(false); // Set loading back to false
    }
  };

  return (
    <div className="space-y-8">
      {/* Form for company name input */}
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
            disabled={isLoading} // Disable input while loading
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button 
          onClick={handleGenerateReport} 
          disabled={isLoading} // Disable button while loading
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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

      {/* Render the dashboard if we have stats */}
      {stats && stats.length > 0 && (
        <div className="mt-8">
          <CompanyIADashboard companyName={companyName} stats={stats} />
        </div>
      )}
    </div>
  );
}
