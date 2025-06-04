import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface OpportunityProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: string;
}

const OpportunityCard: React.FC<OpportunityProps> = ({ title, items, icon, color }) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color }}>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
            {item}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default OpportunityCard;
