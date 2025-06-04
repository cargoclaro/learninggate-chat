import React from 'react';
import { OpportunityCard } from './OpportunityCard'; // Assuming OpportunityCard is in the same directory
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface OpportunitiesRisksSectionProps {
  getOpportunities: () => string[];
  getRisks: () => string[];
}

export const OpportunitiesRisksSection: React.FC<OpportunitiesRisksSectionProps> = ({ 
  getOpportunities, 
  getRisks 
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <OpportunityCard
        title="Oportunidades de Crecimiento"
        items={getOpportunities()}
        icon={<TrendingUp className="w-4 h-4" />}
        color="#0F9D58"
      />
      <OpportunityCard
        title="Riesgos Identificados"
        items={getRisks()}
        icon={<AlertTriangle className="w-4 h-4" />}
        color="#DB4437"
      />
    </section>
  );
}; 