import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate that the environment variables are set
if (!supabaseUrl) {
  throw new Error("SupABASE URL is not set in environment variables. Please set SUPABASE_URL.");
}
if (!supabaseAnonKey) {
  throw new Error("SupABASE Anon Key is not set in environment variables. Please set SUPABASE_ANON_KEY.");
}

// Create a single Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This is an asynchronous function that handles GET requests to /api/companies
export async function GET() {
  const table_name = 'evaluations';       // The table containing company names
  const column_name = 'nombre';           // The column with the company names
  const desiredUniqueLimit = 10;
  // Fetch a slightly larger number of rows to account for potential duplicates before finding unique names.
  // Ordering by name to make the "first 10" consistent (alphabetically).
  const fetchLimit = 30; 

  try {
    // Fetch distinct company names using the Supabase client library
    // .select('column_name!inner') ensures we only get rows where column_name is not null.
    // The { distinct: true } option is not directly available in select for a single column like this to make it unique.
    // So, we fetch all, then process them to get unique names.
    // A more efficient way with Supabase for truly distinct values would be to use an RPC call to a Postgres function
    // or process the data after fetching.
    const { data, error } = await supabase
      .from(table_name)
      .select(`${column_name}`)
      .not(column_name, 'eq', '') // Ensure the column is not an empty string
      .not(column_name, 'is', null)
      .order(column_name, { ascending: true }) // Order alphabetically
      .limit(fetchLimit); // Fetch up to 30 rows
      
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ message: 'Failed to fetch companies from Supabase', details: error.message }, { status: 500 });
    }

    // Process data to get the first N unique company names, maintaining order
    const uniqueOrderedCompanyNames = new Set<string>();
    const limitedFormattedData: { [key: string]: string }[] = [];

    if (data) {
      for (const item of data) {
        const companyName = item[column_name];
        if (companyName && !uniqueOrderedCompanyNames.has(companyName)) {
          uniqueOrderedCompanyNames.add(companyName);
          limitedFormattedData.push({ [column_name]: companyName });
          if (limitedFormattedData.length === desiredUniqueLimit) {
            break; // Stop once we have the desired number of unique names
          }
        }
      }
    }
    
    return NextResponse.json(limitedFormattedData);

  } catch (err) {
    // Catch any other unexpected errors during the process
    console.error('API route error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown server error occurred';
    return NextResponse.json({ message: 'An unexpected error occurred', details: errorMessage }, { status: 500 });
  }
} 