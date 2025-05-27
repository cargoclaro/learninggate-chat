import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
  Svg,
  Path,
  Circle,
  Rect,
} from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Define comprehensive styles matching the dashboard
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'Helvetica',
    fontSize: 8,
    backgroundColor: '#ffffff',
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 18,
    borderBottom: '2 solid #e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    padding: '4 10',
    borderRadius: 4,
  },
  dateText: {
    fontSize: 8,
    color: '#6b7280',
  },
  // Section styles
  section: {
    marginBottom: 18,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    keepTogether: true,
  },
  sectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  // Card styles with different variants
  card: {
    border: '1 solid #e5e7eb',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#ffffff',
    breakInside: 'avoid',
    boxShadow: '0 1 3 rgba(0, 0, 0, 0.1)',
  },
  cardBordered: {
    borderWidth: 2,
  },
  cardHighlight: {
    backgroundColor: '#f9fafb',
  },
  cardGreen: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  cardBlue: {
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
  },
  cardYellow: {
    borderColor: '#F5B614',
    backgroundColor: '#fefce8',
  },
  cardLeftBorder: {
    borderLeftWidth: 4,
  },
  // Card content styles
  cardHeader: {
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardSubtitle: {
    fontSize: 7,
    color: '#9ca3af',
    marginTop: 2,
  },
  // Metric styles
  metric: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  metricLarge: {
    fontSize: 28,
  },
  metricWithUnit: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  metricUnit: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'normal',
  },
  metricLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
  },
  // Badge styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  badgeGreen: {
    backgroundColor: '#0F9D58',
  },
  badgeRed: {
    backgroundColor: '#DB4437',
  },
  badgeYellow: {
    backgroundColor: '#F5B614',
  },
  badgeBlue: {
    backgroundColor: '#4285F4',
  },
  // List styles
  list: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    marginRight: 8,
  },
  listText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.4,
    color: '#374151',
  },
  // Row and column layouts
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  colGap: {
    marginRight: 12,
  },
  // Progress bar styles
  progressBar: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 7,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
  },
  // Special sections
  highlight: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#F5B614',
    padding: 12,
    borderRadius: 4,
    marginVertical: 12,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #e5e7eb',
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Chart placeholder styles
  chartContainer: {
    height: 150,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  chartPlaceholder: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Data visualization styles
  barChart: {
    marginTop: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    width: 80,
    fontSize: 7,
    color: '#374151',
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barValue: {
    marginLeft: 6,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
  },
});

interface StatKV {
  key: string;
  value: number;
}

interface PDFReportProps {
  companyName: string;
  stats: StatKV[];
}

// Helper function to get single value from stats
const getSingleValue = (stats: StatKV[], key: string, decimals = 1) => {
  const found = stats.find((s) => s.key === key);
  return found ? Number(found.value.toFixed(decimals)) : 0;
};

// Helper function to calculate AI maturity - matching dashboard logic
const calculateAIMaturity = (stats: StatKV[]) => {
  const avgSkill = getSingleValue(stats, "avgPromptSkill");
  const avgConfidence = getSingleValue(stats, "avgConfidence");
  const avgHours = getSingleValue(stats, "avgHoursIAWeek");
  const avgSaved = getSingleValue(stats, "avgMinutesSaved");
  const pctKnowLLM = getSingleValue(stats, "pctKnowLLM");
  // const pctKnowPromptParts = getSingleValue(stats, "pctKnowPromptParts"); // Not used in maturity calculation
  const pctFormalTraining = getSingleValue(stats, "pctFormalTraining");
  
  const skillScore = (avgSkill / 5) * 20;
  const confidenceScore = (avgConfidence / 5) * 15;
  const usageScore = Math.min((avgHours / 10) * 20, 20);
  const impactScore = Math.min((avgSaved / 120) * 15, 15);
  const knowledgeScore = (pctKnowLLM / 100) * 15;
  const trainingScore = (pctFormalTraining / 100) * 15;
  
  const totalScore = skillScore + confidenceScore + usageScore + impactScore + knowledgeScore + trainingScore;
  
  let level = "Principiante";
  let color = "#DB4437";
  let description = "La empresa está en las primeras etapas de adopción de IA";
  
  if (totalScore >= 75) {
    level = "Avanzado";
    color = "#0F9D58";
    description = "Excelente adopción y dominio de herramientas IA";
  } else if (totalScore >= 50) {
    level = "Intermedio";
    color = "#F5B614";
    description = "Buen progreso en la implementación de IA";
  } else if (totalScore >= 25) {
    level = "Básico";
    color = "#FF7043";
    description = "Conocimientos básicos, gran potencial de crecimiento";
  }
  
  return { score: Math.round(totalScore), level, color, description };
};

// The PDF Document Component
export const PDFReport: React.FC<PDFReportProps> = ({ companyName, stats }) => {
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate maturity and get ROI values
  const maturity = calculateAIMaturity(stats);
  const roi = {
    current: getSingleValue(stats, 'roi.current', 0),
    potential: getSingleValue(stats, 'roi.potential', 0),
    opportunity: getSingleValue(stats, 'roi.opportunity', 0),
    employeeCount: getSingleValue(stats, 'employeeCount', 0),
    currentHoursPerWeek: getSingleValue(stats, 'roi.currentHoursPerWeek', 1),
    currentMinutesSavedPerDay: getSingleValue(stats, 'roi.currentMinutesSavedPerDay', 1)
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              src="/logo.png"
              style={{ width: 100, height: 23, marginRight: 12 }}
            />
          </View>
          <View style={styles.dateContainer}>
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <Path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </Svg>
            <Text style={styles.dateText}>{today}</Text>
          </View>
        </View>

        {/* Centered Title */}
        <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          <Text style={[styles.title, { fontSize: 24, textAlign: 'center' }]}>
            Diagnóstico IA – {companyName}
          </Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <View style={styles.sectionGrid}>
            {/* Maturity Card */}
            <View style={[styles.card, styles.cardBordered, styles.col, styles.colGap, { borderColor: maturity.color }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                    <Circle cx="12" cy="12" r="4" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                  </Svg>
                  <Text style={styles.cardTitle}>Nivel de Madurez IA</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.metric, styles.metricLarge, { color: maturity.color }]}>
                  {maturity.score}
                </Text>
                <View>
                  <View style={[styles.badge, { backgroundColor: maturity.color }]}>
                    <Text style={styles.badgeText}>{maturity.level}</Text>
                  </View>
                  <Text style={[styles.metricLabel, { marginTop: 2, fontSize: 6 }]}>
                    {maturity.description}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${maturity.score}%`, backgroundColor: maturity.color }]} />
              </View>
            </View>
            
            {/* ROI Card */}
            <View style={[styles.card, styles.cardBordered, styles.cardGreen, styles.col]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2V22M17 5H9.5C8.57 5 7.81 5.13 7.19 5.4C5.81 6 5 7.38 5 9C5 10.09 5.41 11.08 6.11 11.79C6.81 12.5 7.8 12.91 8.89 12.91H15.11C16.2 12.91 17.19 13.32 17.89 14.03C18.59 14.74 19 15.73 19 16.82C19 18.98 17.35 20.76 15.25 20.97C14.74 21.01 14.26 21 13.8 20.95" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={styles.cardTitle}>Potencial ROI Anual ({roi.employeeCount} empleados)</Text>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                <View style={styles.row}>
                  <Text style={styles.listText}>Ahorro actual:</Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#16a34a' }}>
                    ${roi.current.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.listText}>Potencial con training:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#15803d' }}>
                    ${roi.potential.toLocaleString()}
                  </Text>
                </View>
                <View style={{ borderTop: '1 solid #d1fae5', paddingTop: 6, marginTop: 3 }}>
                  <View style={styles.row}>
                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Oportunidad adicional:</Text>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#dc2626' }}>
                      ${roi.opportunity.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={{ borderTop: '1 solid #d1fae5', paddingTop: 6, marginTop: 3 }}>
                  <Text style={{ fontSize: 6, color: '#6b7280', lineHeight: 1.3 }}>
                    Uso actual: {roi.currentHoursPerWeek}h/semana, {roi.currentMinutesSavedPerDay} min/día ahorrados
                  </Text>
                  <Text style={{ fontSize: 6, color: '#6b7280', lineHeight: 1.3 }}>
                    Basado en 30,000 MXN/mes por empleado y potencial de 2h/día con IA optimizada
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {/* Empleados */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'employeeCount', 0) >= 50 ? '#0F9D58' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Empleados evaluados</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'employeeCount', 0) >= 50 ? '#0F9D58' : getSingleValue(stats, 'employeeCount', 0) >= 35 ? '#F5B614' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'employeeCount', 0) >= 50 ? 'Exc' : getSingleValue(stats, 'employeeCount', 0) >= 35 ? 'Bien' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'employeeCount', 0)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>empleados</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 50 empleados</Text>
            </View>

            {/* Horas IA */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? '#0F9D58' : getSingleValue(stats, 'avgHoursIAWeek', 1) >= 8.4 ? '#F5B614' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                    <Path d="M8 7V11M12 5V11M16 9V11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Horas IA/semana</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? '#0F9D58' : getSingleValue(stats, 'avgHoursIAWeek', 1) >= 8.4 ? '#F5B614' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? 'Exc' : getSingleValue(stats, 'avgHoursIAWeek', 1) >= 8.4 ? 'Bien' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'avgHoursIAWeek', 1)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>hrs</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 12 hrs</Text>
            </View>

            {/* Minutos ahorrados */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? '#0F9D58' : getSingleValue(stats, 'avgMinutesSaved', 1) >= 84 ? '#F5B614' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Minutos ahorrados/día</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? '#0F9D58' : getSingleValue(stats, 'avgMinutesSaved', 1) >= 84 ? '#F5B614' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? 'Exc' : getSingleValue(stats, 'avgMinutesSaved', 1) >= 84 ? 'Bien' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'avgMinutesSaved', 1)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>min</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 120 min</Text>
            </View>

            {/* Skill prompting */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? '#0F9D58' : getSingleValue(stats, 'avgPromptSkill', 1) >= 3.5 ? '#F5B614' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 6V12L16 14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Skill prompting</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? '#0F9D58' : getSingleValue(stats, 'avgPromptSkill', 1) >= 3.5 ? '#F5B614' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? 'Exc' : getSingleValue(stats, 'avgPromptSkill', 1) >= 3.5 ? 'Bien' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'avgPromptSkill', 1)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>/5</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 5/5</Text>
            </View>

            {/* % Conoce LLMs */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'pctKnowLLM', 0) >= 100 ? '#0F9D58' : getSingleValue(stats, 'pctKnowLLM', 0) >= 70 ? '#F5B614' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>% Conoce LLMs</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'pctKnowLLM', 0) >= 100 ? '#0F9D58' : getSingleValue(stats, 'pctKnowLLM', 0) >= 70 ? '#F5B614' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'pctKnowLLM', 0) >= 100 ? 'Exc' : getSingleValue(stats, 'pctKnowLLM', 0) >= 70 ? 'Bien' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'pctKnowLLM', 0)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>%</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 100%</Text>
            </View>
          </View>
        </View>

        {/* Knowledge Assessment Section */}
        <View style={styles.section} wrap={false}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Knowledge Card */}
            <View style={[styles.card, styles.cardBordered, styles.cardBlue, { flex: 1, padding: 12, borderWidth: 1.5 }]}>
              <View style={{ marginBottom: 10 }}>
                <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 11H3M21 11h-6M12 11v6M12 5V3M9.31 5.69L8.6 5M15.69 5.69l.71-.69" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#2563eb', fontWeight: 'bold', fontSize: 11 }]}>Conocimiento Básico IA</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#6b82f6', fontSize: 7, marginTop: 3 }]}>Oportunidad de capacitación fundamental</Text>
              </View>
              <View style={{ gap: 8 }}>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Sabe qué es un LLM:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'pctKnowLLM', 0)}%</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M12 2v20m10-10H2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Pretraining/finetuning:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'pctKnowPretrainingFT', 0)}%</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                        <Circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Conoce 4 partes del prompt:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'pctKnowPromptParts', 0)}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Department Usage */}
            <View style={[styles.card, { flex: 1, padding: 12 }]}>
              <View style={{ marginBottom: 10 }}>
                <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#374151" strokeWidth="1.5" fill="none"/>
                    <Path d="M8 7V11M12 5V11M16 9V11" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 11, fontWeight: 'bold', color: '#1f2937' }]}>Uso por Departamento</Text>
                </View>
              </View>
              <View style={{ gap: 8, marginTop: 6 }}>
                <View style={[styles.card, { backgroundColor: '#f9fafb', padding: 8, border: '1 solid #e5e7eb', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Ventas:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#16a34a' }}>{getSingleValue(stats, 'pctIAinSales', 0)}%</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: '#f9fafb', padding: 8, border: '1 solid #e5e7eb', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Marketing:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#9333ea' }}>{getSingleValue(stats, 'pctIAinMarketing', 0)}%</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: '#f9fafb', padding: 8, border: '1 solid #e5e7eb', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Rect x="2" y="7" width="20" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>Finanzas:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#3b82f6' }}>{getSingleValue(stats, 'pctIAinFinance', 0)}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Training Status */}
            <View style={[styles.card, styles.cardBordered, styles.cardGreen, { flex: 1, padding: 12, borderWidth: 1.5 }]}>
              <View style={{ marginBottom: 10 }}>
                <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <Path d="M6 12v5c0 1.7 3.1 3 6 3s6-1.3 6-3v-5" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#15803d', fontWeight: 'bold', fontSize: 11 }]}>Estado de Capacitación</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#16a34a', fontSize: 7, marginTop: 3 }]}>Potencial de desarrollo del equipo</Text>
              </View>
              <View style={{ gap: 8 }}>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #bbf7d0', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 0.7, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563' }}>Capacitación formal de IA:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#15803d' }}>{getSingleValue(stats, 'pctFormalTraining', 0)}%</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #bbf7d0', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 0.7, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M9 11l3 3L22 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#16a34a" strokeWidth="2" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563' }}>Confianza en resultados IA:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#15803d' }}>{getSingleValue(stats, 'avgConfidence', 1)}/5</Text>
                  </View>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #bbf7d0', borderRadius: 6 }]}>
                  <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[styles.cardTitleWithIcon, { flex: 0.7, gap: 6 }]}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="6" r="4" stroke="#F5B614" strokeWidth="1.5" fill="none"/>
                        <Path d="M20 21a8 8 0 10-16 0" stroke="#F5B614" strokeWidth="2" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#4b5563' }}>Curiosidad por explorar IA:</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#15803d' }}>{getSingleValue(stats, 'avgCuriosity', 1)}/5</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Second Page - Company vs Industry - Data Visualizations */}
        <Page size="A4" style={styles.page}>
          {/* Page Title */}
          <View style={{ marginBottom: 20, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#F5B614' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>
              {companyName} vs Industria
            </Text>
          </View>

        {/* Charts Section - Data Visualizations */}
        <View style={styles.section} wrap={false}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Skills vs Industry */}
            <View style={[styles.card, styles.cardBordered, { flex: 1, borderColor: '#9333ea' }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 6V12L16 14" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#7c3aed', fontWeight: 'bold' }]}>Skills vs Industria</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#9333ea' }]}>Comparación con benchmarks del mercado</Text>
              </View>
              
              {/* Radar Chart using overlapping triangles */}
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Svg width="180" height="180" viewBox="0 0 200 200">
                  {/* Grid circles */}
                  {[20, 40, 60, 80, 100].map((radius) => (
                    <Circle
                      key={radius}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Grid lines */}
                  {[0, 120, 240].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 100 + 100 * Math.cos(rad - Math.PI/2);
                    const y = 100 + 100 * Math.sin(rad - Math.PI/2);
                    return (
                      <Path
                        key={angle}
                        d={`M 100 100 L ${x} ${y}`}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        fill="none"
                      />
                    );
                  })}
                  
                  {/* Industry benchmark triangle (background) */}
                  <Path
                    d={(() => {
                      const industryValues = [3.2, 3.5, 3.8]; // Industry averages for skill, confidence, curiosity
                      const points = industryValues.map((value, i) => {
                        const angle = (i * 120 - 90) * Math.PI / 180;
                        const radius = (value / 5) * 100;
                        const x = 100 + radius * Math.cos(angle);
                        const y = 100 + radius * Math.sin(angle);
                        return `${x},${y}`;
                      });
                      return `M ${points.join(' L ')} Z`;
                    })()}
                    fill="#ef4444"
                    fillOpacity="0.1"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Company values triangle (foreground) */}
                  <Path
                    d={(() => {
                      const companyValues = [
                        getSingleValue(stats, 'avgPromptSkill', 2),
                        getSingleValue(stats, 'avgConfidence', 2),
                        getSingleValue(stats, 'avgCuriosity', 2)
                      ];
                      const points = companyValues.map((value, i) => {
                        const angle = (i * 120 - 90) * Math.PI / 180;
                        const radius = (value / 5) * 100;
                        const x = 100 + radius * Math.cos(angle);
                        const y = 100 + radius * Math.sin(angle);
                        return `${x},${y}`;
                      });
                      return `M ${points.join(' L ')} Z`;
                    })()}
                    fill="#3b82f6"
                    fillOpacity="0.3"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  
                  {/* Labels */}
                  <Text x="100" y="10" textAnchor="middle" style={{ fontSize: 10, fill: '#374151' }}>
                    Habilidad prompts
                  </Text>
                  <Text x="180" y="180" textAnchor="middle" style={{ fontSize: 10, fill: '#374151' }}>
                    Confianza IA
                  </Text>
                  <Text x="20" y="180" textAnchor="middle" style={{ fontSize: 10, fill: '#374151' }}>
                    Curiosidad IA
                  </Text>
                  
                  {/* Value labels */}
                  <Text x="100" y="30" textAnchor="middle" style={{ fontSize: 9, fill: '#3b82f6', fontWeight: 'bold' }}>
                    {getSingleValue(stats, 'avgPromptSkill', 1)}/5
                  </Text>
                  <Text x="160" y="160" textAnchor="middle" style={{ fontSize: 9, fill: '#3b82f6', fontWeight: 'bold' }}>
                    {getSingleValue(stats, 'avgConfidence', 1)}/5
                  </Text>
                  <Text x="40" y="160" textAnchor="middle" style={{ fontSize: 9, fill: '#3b82f6', fontWeight: 'bold' }}>
                    {getSingleValue(stats, 'avgCuriosity', 1)}/5
                  </Text>
                </Svg>
                
                {/* Legend */}
                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 20, height: 3, backgroundColor: '#3b82f6' }} />
                    <Text style={{ fontSize: 8, color: '#374151' }}>Tu empresa</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 20, height: 3, backgroundColor: '#ef4444', opacity: 0.5 }} />
                    <Text style={{ fontSize: 8, color: '#374151' }}>Promedio industria</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Device Distribution - Fixed */}
            <View style={[styles.card, { flex: 1 }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                  </Svg>
                  <Text style={styles.cardTitle}>Dispositivos donde usan IA</Text>
                </View>
              </View>
              <View style={styles.barChart}>
                {[
                  { name: 'Laptop', key: 'device.laptop' },
                  { name: 'Desktop', key: 'device.desktop' },
                  { name: 'Móvil', key: 'device.phone' },
                  { name: 'Tablet', key: 'device.tablet' }
                ].map((device, idx) => {
                  const value = getSingleValue(stats, device.key, 0);
                  return (
                    <View key={device.name} style={styles.bar}>
                      <Text style={styles.barLabel}>{device.name}</Text>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, { 
                          width: `${value}%`, 
                          backgroundColor: ['#4285F4', '#DB4437', '#F5B614', '#0F9D58'][idx] 
                        }]} />
                      </View>
                      <Text style={styles.barValue}>{value}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Opportunities and Risks */}
        <View style={styles.section} wrap={false}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Opportunities */}
            <View style={[styles.card, { flex: 1 }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="transparent">
                    <Path d="M2 20h20L12 4z" stroke="#0F9D58" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#0F9D58' }]}>Oportunidades de Crecimiento</Text>
                </View>
              </View>
              <View style={styles.list}>
                {(() => {
                  const opportunities = maturity.score < 25 ? [
                    "Implementar programa básico de alfabetización IA",
                    "Capacitación en herramientas fundamentales (ChatGPT, Copilot)",
                    "Establecer políticas de uso responsable de IA",
                    "Identificar casos de uso de alto impacto"
                  ] : maturity.score < 50 ? [
                    "Desarrollar prompts especializados por área",
                    "Implementar workflows automatizados",
                    "Capacitación avanzada en herramientas específicas",
                    "Medir y optimizar ROI de herramientas IA"
                  ] : maturity.score < 75 ? [
                    "Desarrollar soluciones IA personalizadas",
                    "Implementar IA en procesos críticos",
                    "Crear centro de excelencia en IA",
                    "Explorar IA generativa avanzada"
                  ] : [
                    "Liderar innovación en el sector",
                    "Desarrollar productos con IA integrada",
                    "Monetizar capacidades IA",
                    "Establecer partnerships tecnológicos"
                  ];
                  
                  return opportunities.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <View style={[styles.bullet, { backgroundColor: '#0F9D58' }]} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ));
                })()}
              </View>
            </View>

            {/* Risks */}
            <View style={[styles.card, { flex: 1 }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#DB4437" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 9v4M12 17h.01" stroke="#DB4437" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#DB4437' }]}>Riesgos Identificados</Text>
                </View>
              </View>
              <View style={styles.list}>
                {(() => {
                  const risks = [];
                  
                  if (getSingleValue(stats, "avgPromptSkill") < 3) {
                    risks.push("Baja competencia en prompting limita resultados");
                  }
                  if (getSingleValue(stats, "avgHoursIAWeek") < 2) {
                    risks.push("Subutilización de herramientas disponibles");
                  }
                  if (getSingleValue(stats, "avgConfidence") < 3) {
                    risks.push("Resistencia al cambio puede frenar adopción");
                  }
                  if (getSingleValue(stats, "pctKnowLLM") < 50) {
                    risks.push("Falta conocimiento básico sobre IA generativa");
                  }
                  if (getSingleValue(stats, "pctFormalTraining") < 30) {
                    risks.push("Ausencia de capacitación formal estructurada");
                  }
                  
                  if (risks.length === 0) {
                    risks.push("Riesgo de quedarse atrás sin mejora continua");
                  }
                  
                  return risks.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <View style={[styles.bullet, { backgroundColor: '#DB4437' }]} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ));
                })()}
              </View>
            </View>
          </View>
        </View>

        {/* Copilot Adoption */}
        <View style={styles.section} wrap={false}>
          <View style={[styles.card, styles.cardBordered, styles.cardBlue]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleWithIcon}>
                <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                  <Path d="M8 7V11M12 5V11M16 9V11" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </Svg>
                <Text style={[styles.cardTitle, { color: '#2563eb', fontWeight: 'bold', fontSize: 14 }]}>Adopción Microsoft Copilot</Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: '#3b82f6' }]}>Porcentaje de uso por herramienta</Text>
            </View>
            <View style={styles.barChart}>
              {[
                { name: 'Web', key: 'copilot.web', color: '#1f77b4' },
                { name: 'Excel', key: 'copilot.excel', color: '#2ca02c' },
                { name: 'Word', key: 'copilot.word', color: '#ff7f0e' },
                { name: 'Outlook', key: 'copilot.outlook', color: '#d62728' },
                { name: 'Power Platform', key: 'copilot.powerPlat', color: '#9467bd' }
              ].map((tool) => (
                <View key={tool.key} style={styles.bar}>
                  <View style={[styles.barLabel, { width: 120 }]}>
                    <Text>{tool.name}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { 
                      width: `${getSingleValue(stats, tool.key, 0)}%`, 
                      backgroundColor: tool.color 
                    }]} />
                  </View>
                  <Text style={styles.barValue}>{getSingleValue(stats, tool.key, 0)}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer for second page */}
        <View style={[styles.footer, { marginTop: 15, paddingTop: 8 }]}>
          <Text style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>
            Reporte generado por LearningGate • {today} • Confidencial
          </Text>
          <Text style={{ fontSize: 7, color: '#d1d5db', textAlign: 'center', marginTop: 4 }}>
            Este reporte contiene información propietaria y confidencial. Prohibida su distribución sin autorización.
          </Text>
        </View>
      </Page>

      {/* Third Page - Program Offer */}
      <Page size="A4" style={styles.page}>
        {/* Header for third page */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              src="/logo.png"
              style={{ width: 100, height: 23, marginRight: 12 }}
            />
            <Text style={[styles.title, { fontSize: 22, color: '#F5B614' }]}>Programa de Transformación IA</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{companyName}</Text>
          </View>
        </View>

        {/* Program Hero Section - Simplified */}
        <View style={[styles.section, { marginBottom: 16 }]}>
          <View style={[styles.card, styles.cardBordered, { borderColor: '#F5B614', borderWidth: 3, backgroundColor: '#FFFBF0', padding: 20 }]}>
            {/* Alert Icon and Opening */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#374151', lineHeight: 1.5 }}>
                Ya conoces la brecha. La pregunta es: ¿qué harás al respecto?
              </Text>
            </View>

            {/* Main Message */}
            <View style={{ gap: 18 }}>
              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                Basado en tu nivel de madurez actual y el ROI perdido de{' '}
                <Text style={{ fontWeight: 'bold', color: '#DC2626', fontSize: 12 }}>
                  ${roi.opportunity.toLocaleString()}
                </Text>
                , tu equipo está sentado sobre una mina de oro de productividad sin explotar.
              </Text>

              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                Por eso creamos el{' '}
                <Text style={{ fontWeight: 'bold', color: '#F5B614', fontSize: 12 }}>
                  Programa de Transformación IA
                </Text>
                {' '}— un sprint de 90 días para convertir equipos como el tuyo en usuarios expertos certificados de ChatGPT + Copilot.
              </Text>

              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                Lo diseñamos para que{' '}
                <Text style={{ fontWeight: 'bold', color: '#059669', fontSize: 12 }}>
                  se pague solo en menos de 30 días
                </Text>
                {' '}— y garantizamos resultados, o seguimos trabajando contigo gratis.
              </Text>

              {/* Urgency Section */}
              <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, marginTop: 8 }}>
                <Text style={{ fontSize: 11, color: '#374151', marginBottom: 16 }}>
                  Solo 20 empresas por cohorte. El próximo grupo inicia en 15 días.
                </Text>
              </View>

              {/* CTA Button */}
              <View style={{ backgroundColor: '#F5B614', borderRadius: 8, padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 6 }}>
                  Agenda tu llamada estratégica ahora
                </Text>
                <Text style={{ fontSize: 11, color: 'white', textAlign: 'center', lineHeight: 1.4 }}>
                  y construyamos la ventaja competitiva IA de tu equipo, empezando hoy.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer for third page */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>
            Programa de Transformación IA • LearningGate • {today}
          </Text>
          <Text style={{ fontSize: 7, color: '#d1d5db', textAlign: 'center', marginTop: 4 }}>
            Propuesta comercial confidencial. Válida por 30 días.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Export Button Component
export const PDFExportButton: React.FC<PDFReportProps> = ({ companyName, stats }) => {
  return (
    <PDFDownloadLink
      document={<PDFReport companyName={companyName} stats={stats} />}
      fileName={`diagnostico-ia-${companyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
    >
      {({ loading }) =>
        loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generando PDF...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}; 