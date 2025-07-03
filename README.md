# LearningGate AI Diagnostic & Reporting Platform

## Overview

LearningGate AI Diagnostic & Reporting Platform is a sophisticated web application designed to assess and analyze companies' AI readiness, knowledge, and implementation maturity. The platform conducts AI-powered interviews to evaluate organizations' current AI capabilities and provides comprehensive reports with actionable insights and ROI calculations.

## Key Features

- **AI-Powered Diagnostic Interviews**: Socratic-style interviews conducted by AI to assess organizational AI maturity
- **Comprehensive Analytics**: Detailed statistical analysis of company-wide AI adoption and usage patterns
- **Visual Reporting Dashboard**: Rich, interactive reports with charts, metrics, and insights
- **PDF Export**: Full and preview versions of reports available for download
- **ROI Calculations**: Sophisticated return on investment analysis for AI implementation
- **Multi-Company Support**: Track and analyze multiple organizations' AI journey

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.2 with Turbopack
- **Language**: TypeScript
- **UI Components**: React 19, Tailwind CSS v4, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **PDF Generation**: @react-pdf/renderer for client-side PDF creation

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: 
  - Google Gemini (gemini-2.5-flash-preview) for chat interviews
  - OpenAI GPT-4o for evaluation processing
  - Vercel AI SDK for AI orchestration

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode
- **Bundle Analysis**: Next.js Bundle Analyzer

## Project Structure

```
learninggate-chat/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── calculations/         # Company statistics computation
│   │   ├── chat/                 # AI chat interview endpoint
│   │   ├── companies/            # Company list management
│   │   └── evaluate-exam/        # Interview evaluation processing
│   ├── report-generator/         # Report generation page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage (chat interface)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── report/                   # Report-specific components
│   │   ├── AIToolsAdoptionChart.tsx
│   │   ├── CourseOfferCard.tsx
│   │   ├── KeyMetricsSection.tsx
│   │   ├── MaturityCard.tsx
│   │   ├── ROICard.tsx
│   │   └── ... (15+ specialized components)
│   ├── ui/                       # Base UI components
│   ├── chat.tsx                  # Main chat interface
│   ├── report-generator.tsx      # Report generation form
│   ├── report.tsx                # Dashboard orchestrator
│   └── report-pdf.tsx            # PDF export functionality
├── lib/                          # Utilities and business logic
│   ├── calculations.ts           # Statistical computations
│   ├── evaluation-schema.ts      # Zod schema for AI evaluation
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
│   ├── logo.png
│   └── ctawomanmodel1.png
└── configuration files

```

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Google AI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-repo/learninggate-chat.git
cd learninggate-chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Supabase database:
   - Create a new Supabase project
   - Create an `evaluations` table with columns matching the schema in `lib/evaluation-schema.ts`
   - Update your `.env.local` with Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run analyze      # Analyze bundle size
npm run security-check # Run security audit
npm run vercel-check # Check Vercel deployment
npm run vercel-push  # Deploy to Vercel
```

## Application Workflow

### 1. Initial Interview (Chat Interface)
- Users enter basic information (name, company, work area, age)
- AI conducts a Socratic-style interview to assess:
  - Knowledge of AI concepts (LLMs, pre-training, fine-tuning)
  - Practical prompting abilities
  - AI usage in daily work
  - Organizational AI maturity
- Interview concludes with email collection for report delivery

### 2. Evaluation Processing
- Conversation transcript is analyzed by GPT-4o
- Structured data is extracted according to the evaluation schema
- Results are stored in Supabase with ratings on 1-5 scales

### 3. Report Generation
- Company statistics are computed from all evaluations
- Comprehensive analytics include:
  - AI Maturity Score
  - ROI Analysis (current value, potential value, opportunity cost)
  - Department usage patterns
  - Skills assessment
  - Organizational barriers
  - Training recommendations

### 4. Report Display & Export
- Interactive web dashboard with visualizations
- PDF export options (preview and full versions)
- Tailored training program offers

## Key Components

### Chat Component (`components/chat.tsx`)
- Manages the interview flow
- Tracks progress through 12 interview steps
- Handles form submission and conversation state
- Triggers evaluation when email is provided

### Report Dashboard (`components/report.tsx`)
- Orchestrates all report components
- Processes statistical data
- Manages data flow to child components
- Handles PDF export functionality

### Calculations Module (`lib/calculations.ts`)
- Fetches company data from Supabase
- Performs statistical analysis
- Calculates ROI metrics
- Handles legacy data gracefully

### Evaluation Schema (`lib/evaluation-schema.ts`)
- Defines the structure for AI evaluation data
- Uses Zod for validation
- Includes 20+ metrics across multiple categories

## API Endpoints

### POST `/api/chat`
- Handles AI chat conversations
- Uses Google Gemini model
- Implements streaming responses

### POST `/api/evaluate-exam`
- Processes interview transcripts
- Uses OpenAI GPT-4o for analysis
- Saves structured data to Supabase

### POST `/api/calculations`
- Computes company statistics
- Returns formatted metrics array

### GET `/api/companies`
- Retrieves unique company names
- Returns alphabetically sorted list

## Database Schema

The `evaluations` table includes:
- Basic Information (company, user, area, age)
- AI Knowledge Metrics (LLM understanding, concepts)
- Usage Patterns (by department, tools, devices)
- Impact Metrics (time saved, KPIs, barriers)
- Task Analysis (repetitive tasks by functional area)

## Security Considerations

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) recommended
- API key protection
- Input validation with Zod schemas

## Performance Optimization

- Turbopack for faster development builds
- Image optimization with Next.js
- Bundle analysis for size monitoring
- Streaming AI responses for better UX
- Client-side PDF generation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Learning Gate. All rights reserved.

## Support

For support, email support@learninggate.com or open an issue in the repository.

## Acknowledgments

- Built with Next.js and React
- Powered by Google Gemini and OpenAI
- Database by Supabase
- UI components from shadcn/ui