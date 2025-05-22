'use client'; // This directive is necessary for using hooks like useState and event handlers

import React, { useState } from 'react';

// Define a type for the component props if you plan to pass any, though none for now.
// interface ReportGeneratorFormProps {}

export default function ReportGeneratorForm(/*props: ReportGeneratorFormProps*/) {
  // State to store the company name entered by the user
  const [companyName, setCompanyName] = useState('');
  // State to indicate if the report is currently being generated (for loading indicators)
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null); // Added type for error state

  // This function will be called when the "Generate Report" button is clicked
  const handleGenerateReport = async () => {
    // Basic validation: ensure company name is not empty
    if (!companyName.trim()) {
      setError('Please enter a company name.');
      return; // Stop execution if validation fails
    }

    setIsLoading(true); // Set loading to true to disable button and show loading state
    setError(null); // Clear any previous errors

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

      // Assuming the backend returns the statistics array directly as JSON
      const stats = await response.json();
      console.log('Received stats:', stats); // Log the received stats

      // Placeholder for what to do with the stats.
      // For now, just an alert, but ideally, you'd pass this to another component or state
      alert(`Statistics for ${companyName} fetched! Check the console. (Displaying stats not yet implemented)`);

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
    // Basic styling for the form container
    // You might want to move these styles to a CSS module or a global stylesheet later
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      {/* Input field for company name */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Company Name:
        </label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)} // Update companyName state on change
          placeholder="E.g., Acme Corporation"
          disabled={isLoading} // Disable input while loading
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>
      
      {/* Button to trigger report generation */}
      <button 
        onClick={handleGenerateReport} 
        disabled={isLoading} // Disable button while loading
        style={{ 
          width: '100%', 
          padding: '10px 15px', 
          backgroundColor: isLoading ? '#ccc' : '#007bff', // Change color when loading
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isLoading ? 'not-allowed' : 'pointer', // Change cursor when loading
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Generating...' : 'Generate Report'} {/* Change text when loading */}
      </button>
      
      {/* Display error message if any */}
      {error && (
        <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
