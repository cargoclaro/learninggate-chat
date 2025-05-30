'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react'; // Import search icon

// Define a type for the company object. This helps with code clarity and prevents typos.
interface Company {
  nombre: string;
}

// Define the props for our CompanySelector component.
// onCompanySelect is a function that will be called when a company is selected.
interface CompanySelectorProps {
  onCompanySelect: (companyName: string) => void;
}

export default function CompanySelector({ onCompanySelect }: CompanySelectorProps) {
  // State to store the full list of companies fetched from the API.
  const [companies, setCompanies] = useState<Company[]>([]);
  // State to store the current filter text entered by the user.
  const [filter, setFilter] = useState('');
  // State to store any error messages during data fetching.
  const [error, setError] = useState<string | null>(null);
  // State to indicate if data is currently being loaded.
  const [loading, setLoading] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false); // To show/hide dropdown

  const wrapperRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div to detect outside clicks

  // useEffect hook to fetch company data when the component mounts.
  useEffect(() => {
    // Define an async function to fetch data.
    async function fetchCompanies() {
      try {
        // Make a GET request to our API endpoint.
        const response = await fetch('/api/companies');
        // If the response is not ok (e.g., 404 or 500 error), throw an error.
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        // Parse the JSON response.
        const data: Company[] = await response.json();
        // Update the companies state with the fetched data.
        setCompanies(data);
      } catch (err) {
        // If an error occurs, set the error state.
        // We check if err is an instance of Error to safely access err.message.
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      finally {
        // Set loading to false once data fetching is complete (either success or failure).
        setLoading(false);
      }
    }

    // Call the fetchCompanies function.
    fetchCompanies();
  }, []); // The empty dependency array [] means this effect runs only once when the component mounts.

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsInputFocused(false); // Close dropdown if click is outside
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Filter the companies based on the filter text.
  // The filter is case-insensitive.
  const filteredCompanies = companies.filter(company =>
    company.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectCompany = (companyName: string) => {
    onCompanySelect(companyName);
    setFilter(companyName); // Optionally, set the input to the selected company name
    setIsInputFocused(false); // Hide dropdown after selection
  };

  // If data is still loading, display a loading message.
  if (loading) {
    return <p style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Loading companies...</p>;
  }

  // If there was an error fetching data, display the error message.
  if (error) {
    return <p style={{ textAlign: 'center', color: '#D32F2F', fontFamily: 'Arial, sans-serif' }}>Error: {error}</p>;
  }

  // Render the component.
  return (
    <div 
      ref={wrapperRef} 
      style={{
        position: 'relative', // Needed for absolute positioning of the dropdown
        maxWidth: '500px',
        margin: '2rem auto',
        fontFamily: "'Roboto', Arial, sans-serif", // Corrected Google-like font
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Card shadow
        borderRadius: '8px', // Rounded corners for the card
        backgroundColor: '#fff' // White background for the card
      }}
    >
      {/* <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', paddingTop:'20px' }}>Select a Company</h2> */}
      {/* The h2 title might be redundant if the placeholder is clear enough */}
      
      <div style={{ padding: '20px', position: 'relative' /* For search icon positioning */ }}>
        <Search 
          style={{
            position: 'absolute',
            left: '30px', // Adjust to align with input padding
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#757575' // Icon color
          }}
          size={20}
        />
        <input
          type="text"
          placeholder="Search for a company..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            if (!isInputFocused && e.target.value) setIsInputFocused(true); // Show dropdown on typing if there is text
            else if (isInputFocused && !e.target.value) setIsInputFocused(false); // Hide if text is cleared
          }}
          onFocus={() => {
            if (filter || filteredCompanies.length > 0) setIsInputFocused(true); // Show dropdown on focus only if there's text or results
          }}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px', // Increased padding, left padding for icon
            fontSize: '16px',
            border: '1px solid #dfe1e5', // Google-like border color
            borderRadius: '24px', // Pill shape
            boxSizing: 'border-box',
            outline: 'none', // Remove default focus outline
            boxShadow: isInputFocused ? '0 1px 6px rgba(32,33,36,0.28)' : 'none', // Subtle shadow on focus
            transition: 'box-shadow 0.3s ease'
          }}
        />
      </div>

      {isInputFocused && filteredCompanies.length > 0 && (
        <ul style={{
          listStyleType: 'none',
          margin: '0 20px 20px 20px', // Adjust margin to align with input
          padding: '0',
          maxHeight: '200px', // Limit height and make scrollable
          overflowY: 'auto',
          border: '1px solid #dfe1e5', // Border for the dropdown
          borderRadius: '0 0 8px 8px', // Rounded bottom corners
          boxShadow: '0 4px 6px rgba(32,33,36,0.28)', // Dropdown shadow
          position: 'absolute', // Position dropdown below input
          width: 'calc(100% - 40px)', // Match input width considering padding
          backgroundColor: '#fff',
          zIndex: 1000 // Ensure dropdown is on top
        }}>
          {filteredCompanies.map((company, index) => (
            <li 
              key={index} 
              onClick={() => handleSelectCompany(company.nombre)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderBottom: index < filteredCompanies.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              {company.nombre}
            </li>
          ))}
        </ul>
      )}

      {isInputFocused && filter && filteredCompanies.length === 0 && !loading && (
         <p style={{ textAlign: 'center', padding: '10px 20px', color: '#555', border: '1px solid #dfe1e5', borderRadius: '0 0 8px 8px', margin: '0 20px 20px 20px', boxShadow: '0 4px 6px rgba(32,33,36,0.28)', backgroundColor: '#fff' }}>
           No companies found matching "{filter}".
         </p>
      )}
    </div>
  );
} 