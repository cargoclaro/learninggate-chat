# System Explanation: AI Diagnostic and Reporting Application

This document provides a detailed explanation of the AI Diagnostic and Reporting application, covering its architecture, workflow, and key components. The code is for a company called Learning Gate that helps companies train there workforce to use ai. The whole purpose is to provide a detailed analysis of their current ai capabilities and display the data in friendly and clear way. 

## 1. Core Technology Stack

The application leverages a modern technology stack:

*   **Frontend Framework:** Next.js (v15.3.2) with Turbopack for development.
*   **Programming Language:** TypeScript.
*   **UI Libraries & Styling:**
    *   React (v19) for building user interfaces.
    *   Tailwind CSS (v4) for utility-first styling.
    *   Custom UI components (likely from `components/ui/`, often associated with shadcn/ui, as suggested by `components.json`).
    *   Recharts for rendering charts in the web dashboard.
    *   Lucide React for icons.
*   **Artificial Intelligence (AI):**
    *   Vercel AI SDK (`@ai-sdk/react`, `ai`) for managing AI interactions on both frontend and backend.
    *   Google AI SDK (`@ai-sdk/google`) for accessing Google's AI models (e.g., `gemini-2.5-flash-preview-05-20` for the chat).
    *   OpenAI SDK (`@ai-sdk/openai`) for accessing OpenAI's models (e.g., `gpt-4o` for evaluation).
*   **Backend:** Next.js API Routes for server-side logic.
*   **Database:** Supabase for storing user evaluations and related data.
*   **PDF Generation:** `@react-pdf/renderer` for client-side generation of PDF reports.
*   **Schema Definition & Validation:** Zod for defining the structure of AI evaluation data.
*   **Utilities:** `uuid` for generating unique identifiers.

## 2. Application Workflow

The application follows a multi-stage workflow, from initial user interaction to report generation:

### 2.1. User Entry & Initial Interaction

*   **Landing Page (`app/page.tsx`):** The main entry point renders the `Chat` component (`components/chat.tsx`).
*   **Initial Data Collection (`components/chat.tsx`):**
    *   A form is displayed to collect basic user information: Name, Company, Work Area, and Age.
    *   A unique `conversationId` (using `uuidv4`) is generated upon form submission.
*   **Chat Interface:**
    *   The core chat interface is powered by the `useChat` hook from `@ai-sdk/react`.
    *   This hook communicates with the backend API endpoint `/api/chat` to send and receive messages.
    *   A `ProgressBar` component visually tracks the user's progress through a predefined number of interview steps (currently 12).

### 2.2. AI-Powered Interview

*   **Backend Chat Handling (`app/api/chat/route.ts`):**
    *   This API route uses a Google AI model (e.g., `gemini-2.5-flash-preview-05-20`).
    *   A detailed **system prompt** (`diagnosticSystemPrompt`) guides the AI to act as an "Amazon-style interviewer" with a Socratic approach.
    *   **AI Objective:** The AI's primary goal is to gather information about the user's AI knowledge, usage, experience, and organizational context. This information is aligned with the fields defined in `IAFormSchema` (`lib/evaluation-schema.ts`). The AI is instructed *not* to ask for direct ratings but to elicit responses that allow for later assessment.
    *   **Interview Flow:** The system prompt outlines a structured interview covering:
        1.  Basic user data.
        2.  Knowledge of AI concepts (LLMs, pre-training, fine-tuning, prompting).
        3.  Practical prompting exercises.
        4.  AI application in daily work.
        5.  Mindset towards AI (curiosity, confidence, autonomy).
        6.  Impact of AI and organizational context.
    *   **Critical Trigger:** The AI is specifically instructed to ask for the user's **email address** at the end of the interview, mentioning that a report will be sent. This user action is the trigger for the evaluation phase.
    *   AI responses are streamed back to the frontend for a dynamic chat experience.

### 2.3. Evaluation Submission and Processing

*   **Frontend Trigger (`components/chat.tsx`):**
    *   A `useEffect` hook in the `Chat` component monitors the conversation messages.
    *   When it detects an email address in the user's final message, it calls the `sendConversationForEvaluation` function.
*   **Backend Evaluation (`app/api/evaluate-exam/route.ts`):**
    *   The `sendConversationForEvaluation` function sends a POST request to `/api/evaluate-exam`. The request includes the full conversation transcript, the `conversationId`, and the extracted user email.
    *   This API route then:
        1.  Uses an OpenAI model (e.g., `gpt-4o`) via the `generateObject` function from the Vercel AI SDK.
        2.  Provides the conversation transcript and the `IAFormSchema` (from `lib/evaluation-schema.ts`) to `generateObject`. This schema dictates the structure of the expected JSON output from the AI.
        3.  The AI analyzes the transcript and generates a structured evaluation based on the schema. The schema includes fields for company name, user details, and various 1-5 scale ratings for AI knowledge, usage, impact, etc.
        4.  The API route parses the AI's output. Since the LLM might initially return all values as strings, helper functions convert these strings to their appropriate data types (numbers, arrays).
        5.  The processed, typed evaluation data, along with the original transcript, `conversationId`, and `userEmail`, is saved to the `evaluations` table in the Supabase database.
        6.  The structured evaluation is returned as a JSON response to the frontend.
*   **Frontend Feedback:** The `Chat` component displays a success or error message based on the API response and reloads the page on successful evaluation.

### 2.4. Report Generation and Display

*   **Report Access Page (`app/report-generator/page.tsx`):**
    *   This page serves as the entry point for viewing detailed company reports.
    *   It first renders the `CompanySelector` component (`components/CompanySelector.tsx`).
*   **Company Selection (`components/CompanySelector.tsx`):**
    *   This component fetches a unique, alphabetically sorted list of company names from the `/api/companies` endpoint.
    *   The `/api/companies` route queries the `nombre` (company name) column from the `evaluations` table in Supabase, ensuring only distinct names are returned.
    *   The user can search for and select a company from the list.
*   **Fetching Company Statistics (`components/report-generator.tsx`):**
    *   Once a company is selected, the `app/report-generator/page.tsx` renders the `ReportGeneratorForm` component, passing the chosen company name.
    *   `ReportGeneratorForm` handles fetching the detailed statistics for that company. When the "Generate Report" button is clicked:
        1.  It sends a POST request to the `/api/calculations` endpoint with the `companyName`.
        2.  The `/api/calculations` route (`app/api/calculations/route.ts`) calls the `computeStatsByCompany` function located in `lib/calculations.ts`.
*   **Statistical Computation (`lib/calculations.ts`):**
    *   The `computeStatsByCompany` function:
        1.  Fetches all evaluation records for the specified `companyName` from the Supabase `evaluations` table.
        2.  Performs a wide range of statistical calculations on this data, including averages, percentages, and distributions for all metrics defined in `IAFormSchema`.
        3.  Includes a sophisticated **ROI (Return on Investment) calculation**. This estimates the current monetary value derived from AI usage, the maximum potential value if AI were optimally used, and the opportunity cost (value being lost). This calculation considers factors like average time saved by employees and their AI prompt quality.
        4.  Gracefully handles potential legacy data fields if the database schema has evolved.
        5.  Returns a flat array of key-value pairs (e.g., `{ key: 'avgAge', value: 3.5 }`), representing all computed statistics for the company.
*   **Displaying the Report (`components/report.tsx` as `CompanyIADashboard`):**
    *   `ReportGeneratorForm` receives the array of statistics and passes it (along with the `companyName`) to the `CompanyIADashboard` component.
    *   `CompanyIADashboard` is a comprehensive component responsible for rendering a rich, multi-section visual report. Its key features include:
        *   **AI Maturity Score:** Calculated within the component based on several input stats.
        *   **ROI Analysis:** Extracted from the pre-calculated stats from the API.
        *   **Key Metrics Dashboard:** Summary cards for important figures.
        *   **Detailed Sections:** In-depth views on AI knowledge, departmental usage, training status, new diagnostic metrics (autonomy, KPI impact, organizational barriers).
        *   **Charts:** Utilizes Recharts for:
            *   Pie chart for AI device distribution.
            *   Radar chart comparing company AI skills against (currently hardcoded) industry benchmarks.
            *   Bar chart for AI tools adoption (ChatGPT, Copilot, Gemini, etc.).
        *   **Actionable Insights:** Dynamically generated lists of "Opportunities & Risks" based on the company's data.
        *   **Sales-Oriented Offers:** Two prominent sections presenting "Course Transformation Programs." These offers are styled persuasively (Hormozi style), with pricing dynamically calculated based on employee count and ROI figures, aiming to convert the diagnostic into a sale for training services.
        *   **PDF Export:** Integrates a `DropdownPDFExport` button for report download.

### 2.5. PDF Report Export

*   **Triggering PDF Export (`components/pdf-export-wrapper.tsx`):**
    *   The `CompanyIADashboard` uses the `DropdownPDFExport` component.
    *   This component provides a user-friendly dropdown with "Preview Version" and "Full Version" options for the PDF.
    *   It dynamically imports the actual PDF generation component (`PDFExportButton` from `components/report-pdf.tsx`) only on the client-side (`ssr: false`) to prevent server-side rendering issues with the PDF library. It shows a loading state while the component is being fetched.
*   **PDF Document Definition (`components/report-pdf.tsx`):**
    *   This file uses the `@react-pdf/renderer` library to define the structure and content of the PDF document.
    *   The main component, `PDFReport`, reconstructs the visual report across multiple pages, mirroring the web dashboard's layout and data presentation as closely as possible.
    *   **Styling:** A comprehensive `StyleSheet` is used to style PDF elements (text, views, cards, etc.).
    *   **Content Replication:** It re-calculates or re-extracts necessary data (like AI Maturity) from the `stats` prop. For complex charts like the radar chart, it uses direct SVG rendering within the PDF. Simpler bar charts are constructed using styled `<View>` elements.
    *   **Conditional Blurring:** It accepts an `isBlurred` prop.
        *   If `true` (for "Preview Version"), certain sections of the PDF are overlaid with a semi-transparent layer and placeholder text (e.g., "Desbloquea el análisis completo").
        *   If `false` (for "Full Version"), the complete, unobscured report is generated.
    *   **Download Mechanism:** The `PDFExportButton` (rendered by `DropdownPDFExport`) uses the `<PDFDownloadLink>` component from `@react-pdf/renderer`. This component takes the `PDFReport` instance, renders it into a PDF in the browser, and provides a clickable link for the user to download the generated file (e.g., `Diagnostico_IA_CompanyName_Completo.pdf`).

## 3. Key Files and Components Overview

*   **Configuration:**
    *   `package.json`: Manages project dependencies and scripts.
    *   `next.config.ts`: Next.js specific configurations (e.g., image optimization).
    *   `tsconfig.json`: TypeScript compiler options.
    *   `eslint.config.mjs`: ESLint configuration for code linting.
    *   `postcss.config.mjs`: PostCSS configuration (used with Tailwind CSS).
    *   `components.json`: Typically for shadcn/ui configuration, managing UI component dependencies.
*   **Core Application Logic (App Router):**
    *   `app/layout.tsx`: Root layout, applies global styles and fonts (Geist).
    *   `app/page.tsx`: Homepage, renders the `Chat` component.
    *   `app/report-generator/page.tsx`: Page for initiating report generation, manages `CompanySelector` and `ReportGeneratorForm`.
*   **API Routes (`app/api/.../route.ts`):**
    *   `chat/route.ts`: Handles the AI chat conversation using Google's Gemini model.
    *   `evaluate-exam/route.ts`: Processes the chat transcript using OpenAI's GPT-4o, validates against `IAFormSchema`, and saves to Supabase.
    *   `calculations/route.ts`: Endpoint to trigger company statistics calculation via `lib/calculations.ts`.
    *   `companies/route.ts`: Fetches a unique list of company names from Supabase.
*   **Libraries/Modules (`lib/`):**
    *   `evaluation-schema.ts`: Defines the Zod schema for the structured AI evaluation. This is central to the data extraction process.
    *   `calculations.ts`: Contains the core logic for fetching company data from Supabase and performing detailed statistical analysis and ROI calculations.
    *   `utils.ts`: (Not deeply analyzed) Likely contains general utility functions for the application.
*   **Reusable UI Components (`components/`):**
    *   `chat.tsx`: Manages the entire chat interview flow, including form input, AI interaction, progress tracking, and triggering evaluation.
    *   `CompanySelector.tsx`: UI for fetching and selecting a company.
    *   `report-generator.tsx`: Form and logic for fetching and then displaying a specific company's report via `CompanyIADashboard`.
    *   `report.tsx` (exports `CompanyIADashboard`): The main dashboard component that visually presents all statistics, charts, and insights for a company. It now imports several subcomponents from `components/report/` for better organization.
    *   `report/`: Holds `MaturityCard.tsx`, `ROICard.tsx`, `OpportunityCard.tsx`, `SummaryCard.tsx`, `TasksByAreaSection.tsx`, and shared `types.ts`.
    *   `pdf-export-wrapper.tsx`: Provides UI options (like a dropdown) for PDF export and dynamically loads the PDF button.
    *   `report-pdf.tsx` (exports `PDFReport` and `PDFExportButton`): Defines the actual PDF document structure and content using `@react-pdf/renderer`.
    *   `ProgressBar.tsx`: A simple visual component to show progress during the chat.
    *   `ui/`: Directory for base UI components like `Badge` and `Card`, essential for the consistent look and feel of the dashboard.
*   **Static Assets (`public/`):**
    *   Contains images like `logo.png` and `ctawomanmodel1.png` used throughout the application.

## 4. Overall System Design Insights

*   **Lead Generation & Diagnostic Tool:** The application is strategically designed to engage potential clients (companies) with an AI-driven diagnostic, provide them with valuable insights, and then seamlessly present tailored training solutions.
*   **Data-Centric:** The entire process revolves around collecting (interview), structuring (AI evaluation + Zod schema), storing (Supabase), processing (statistical calculations), and presenting (web dashboard, PDF report) data.
*   **Modular Architecture:** Clear separation of concerns between frontend (React components), backend (Next.js API routes), data processing logic (`lib/calculations.ts`), and presentation layers.
*   **Modern Tooling:** Employs a contemporary stack with Next.js, TypeScript, Tailwind CSS, Supabase, and Vercel AI SDK, enabling efficient development and a good user experience.
*   **User Experience:** Features like streaming chat responses, progress indicators, dynamic report generation, and client-side PDF export contribute to a responsive and interactive experience. The "blur" feature for PDF previews is a thoughtful touch for potentially tiered access or encouraging engagement.
*   **Business Value Focus:** The reporting, especially the ROI calculations and the direct integration of training program offers within the report, underscores a strong focus on demonstrating and capturing business value.

This detailed explanation should provide a solid understanding of how the various parts of the application work together to deliver its core functionality. 