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
  Link,
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
    border: '1.5 solid #e5e7eb',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#ffffff',
    breakInside: 'avoid',
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
  cardOrange: {
    borderColor: '#fed7aa',
    backgroundColor: '#fff7ed',
  },
  cardPurple: {
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
  },
  cardRed: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
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
  // Blur overlay styles
  blurOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    border: '2 solid #F5B614',
  },
  blurText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    textAlign: 'center',
  },
  blurSubtext: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
});

interface StatKV {
  key: string;
  value: number;
}

interface PDFReportProps {
  companyName: string;
  stats: StatKV[];
  isBlurred?: boolean;
}

// Helper function to get single value from stats
const getSingleValue = (stats: StatKV[], key: string, decimals = 1) => {
  const found = stats.find((s) => s.key === key);
  return found ? Number(found.value.toFixed(decimals)) : 0;
};

// Helper function to convert age scale to readable format
const convertAgeScale = (ageScale: number) => {
  switch(Math.round(ageScale)) {
    case 1: return "18-25";
    case 2: return "26-35";
    case 3: return "36-45";
    case 4: return "46-55";
    case 5: return "56+";
    default: return "N/A";
  }
};

// Helper function to calculate AI maturity - matching dashboard logic
const calculateAIMaturity = (stats: StatKV[]) => {
  const avgSkill = getSingleValue(stats, "avgPromptSkill");
  const avgConfidence = getSingleValue(stats, "avgConfidence");
  const avgHours = getSingleValue(stats, "avgHoursIAWeek");
  const avgSaved = getSingleValue(stats, "avgMinutesSaved");
  const pctKnowLLM = getSingleValue(stats, "pctKnowLLM");
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
    color = "#F4B400";
    description = "Buen progreso en la implementación de IA";
  } else if (totalScore >= 25) {
    level = "Básico";
    color = "#FF7043";
    description = "Conocimientos básicos, gran potencial de crecimiento";
  }
  
  return { score: Math.round(totalScore), level, color, description };
};

// The PDF Document Component
export const PDFReport: React.FC<PDFReportProps> = ({ companyName, stats, isBlurred = false }) => {
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
    // currentHoursPerWeek is likely no longer directly used in PDF ROI display, but kept if other parts use it.
    currentHoursPerWeek: getSingleValue(stats, 'roi.currentHoursPerWeek', 1), 
    currentMinutesSavedPerDay: getSingleValue(stats, 'roi.currentMinutesSavedPerDay', 1),
    // Add new ROI fields
    adoptionEffectiveness: getSingleValue(stats, 'roi.adoptionEffectiveness', 1),
    missedHoursPerDay: getSingleValue(stats, 'roi.missedHoursPerDay', 2) // Assuming 2 decimal places if needed
  };

  // Corrected: roi.current, roi.potential, roi.opportunity are already monthly.
  // No need to divide by 12.
  const currentMonthly = roi.current;
  const potentialMonthly = roi.potential;
  const opportunityMonthly = roi.opportunity;

  // Get age data
  const avgAgeScale = getSingleValue(stats, "avgAge", 1);
  const avgAgeRange = convertAgeScale(avgAgeScale);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src="/temple_name.png"
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
            <View style={[styles.card, styles.cardBordered, styles.cardOrange, styles.col]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2V22M17 5H9.5C8.57 5 7.81 5.13 7.19 5.4C5.81 6 5 7.38 5 9C5 10.09 5.41 11.08 6.11 11.79C6.81 12.5 7.8 12.91 8.89 12.91H15.11C16.2 12.91 17.19 13.32 17.89 14.03C18.59 14.74 19 15.73 19 16.82C19 18.98 17.35 20.76 15.25 20.97C14.74 21.01 14.26 21 13.8 20.95" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={styles.cardTitle}>Ahorro Mensual Estimado ({roi.employeeCount} empleados)</Text>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                <View style={styles.row}>
                  <Text style={styles.listText}>Ahorro actual:</Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#16a34a' }}>
                    ${currentMonthly.toLocaleString()}/mes
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.listText}>Potencial con training:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#15803d' }}>
                    ${potentialMonthly.toLocaleString()}/mes
                  </Text>
                </View>
                <View style={{ borderTop: '1 solid #d1fae5', paddingTop: 6, marginTop: 3 }}>
                  <Text style={{ fontSize: 6, color: '#6b7280' }}>Dinero que pierdes cada mes:</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#DB4437' }}>
                    ${opportunityMonthly.toLocaleString()}/mes
                  </Text>
                  <Text style={{ fontSize: 6, color: '#6b7280', marginTop: 2 }}>
                    Por no usar IA eficientemente
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Key Metrics Section */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <View style={{ 
            marginBottom: 16, 
            paddingBottom: 12, 
            borderBottomWidth: 2, 
            borderBottomColor: '#e5e7eb',
            backgroundColor: '#f8fafc',
            padding: 12,
            borderRadius: 8
          }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: '#1f2937',
              textAlign: 'center',
              letterSpacing: 0.5
            }}>[MÉTRICAS] RENDIMIENTO CLAVE</Text>
            <Text style={{ 
              fontSize: 10, 
              color: '#6b7280', 
              textAlign: 'center',
              marginTop: 4
            }}>¿Qué tan bien usa tu empresa la Inteligencia Artificial?</Text>
          </View>
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
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'employeeCount', 0) >= 50 ? '#0F9D58' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'employeeCount', 0) >= 50 ? 'Exc' : 'Bajo'}
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
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? '#0F9D58' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                    <Path d="M8 7V11M12 5V11M16 9V11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Horas IA/semana</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? '#0F9D58' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgHoursIAWeek', 1) >= 12 ? 'Exc' : 'Bajo'}
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
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? '#0F9D58' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Minutos ahorrados/día</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? '#0F9D58' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgMinutesSaved', 1) >= 120 ? 'Exc' : 'Bajo'}
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
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? '#0F9D58' : '#DB4437', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 6V12L16 14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Habilidad para dar instrucciones a IA</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? '#0F9D58' : '#DB4437', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>
                    {getSingleValue(stats, 'avgPromptSkill', 1) >= 5 ? 'Exc' : 'Bajo'}
                  </Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{getSingleValue(stats, 'avgPromptSkill', 1)}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}>/5</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Meta: 5/5</Text>
            </View>

            {/* Edad promedio */}
            <View style={[styles.card, styles.cardLeftBorder, { width: '19%', minWidth: 90, borderLeftColor: '#6b7280', padding: 10 }]}>
              <View style={{ marginBottom: 6 }}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { fontSize: 8 }]}>Edad promedio</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: '#6b7280', paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 }]}>
                  <Text style={[styles.badgeText, { fontSize: 6 }]}>Info</Text>
                </View>
              </View>
              <View style={styles.metricWithUnit}>
                <Text style={[styles.metric, { fontSize: 18 }]}>{avgAgeRange}</Text>
                <Text style={[styles.metricUnit, { fontSize: 10 }]}> años</Text>
              </View>
              <Text style={[styles.metricLabel, { fontSize: 6, marginTop: 2 }]}>Perfil demográfico</Text>
            </View>
          </View>
        </View>

        {/* Knowledge Assessment Section - Container for blur overlay */}
        <View style={{ position: 'relative' }}>
          <View style={[styles.section, { position: 'relative' }]} wrap={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Knowledge Card */}
              <View style={[styles.card, styles.cardBordered, styles.cardBlue, { flex: 1, padding: 12, borderWidth: 1.5 }]}>
                <View style={{ marginBottom: 10 }}>
                  <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <Path d="M9 11H3M21 11h-6M12 11v6M12 5V3M9.31 5.69L8.6 5M15.69 5.69l.71-.69" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#2563eb', fontWeight: 'bold', fontSize: 11 }]}>¿Qué tanto sabe tu equipo de IA?</Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: '#6b82f6', fontSize: 7, marginTop: 3 }]}>Nivel de conocimiento (1=Básico, 5=Experto)</Text>
                </View>
                <View style={{ gap: 8 }}>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                      <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Entiende cómo funciona ChatGPT:</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'avgLLMKnowledge', 1).toFixed(1)}/5</Text>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                      <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Path d="M12 2v20m10-10H2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Entiende entrenamiento de IA:</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'avgPretrainingKnowledge', 1).toFixed(1)}/5</Text>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 8, border: '1 solid #dbeafe', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                      <View style={[styles.cardTitleWithIcon, { gap: 6, flex: 1, marginRight: 8 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                          <Circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                        </Svg>
                        <Text style={{ fontSize: 8, color: '#4b5563', flexShrink: 1 }}>Sabe dar instrucciones efectivas:</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb', flexShrink: 0 }}>{getSingleValue(stats, 'avgPromptKnowledge', 1).toFixed(1)}/5</Text>
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
          
          {/* Blur overlay for Knowledge Assessment section */}
          {isBlurred && (
            <View style={[styles.blurOverlay, { 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              width: '100%'
            }]}>
              <Text style={styles.blurText}>Motivación de tu equipo</Text>
              <Text style={styles.blurSubtext}>Desbloquea el análisis completo</Text>
            </View>
          )}
        </View>
      </Page>

      {/* Second Page - Company vs Industry and New Metrics */}
      <Page size="A4" style={styles.page}>
        {/* Page Title */}
        <View style={{ marginBottom: 20, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#F5B614' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>
            {companyName} vs Industria
          </Text>
        </View>

        {/* Container for blurred content on second page */}
        <View style={{ position: 'relative', flex: 1 }}>
          {/* New Diagnostic Metrics Section */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Autonomy and Skills */}
              <View style={[styles.card, styles.cardBordered, styles.cardPurple, { flex: 1, padding: 12 }]}>
                <View style={{ marginBottom: 10 }}>
                  <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#7c3aed', fontWeight: 'bold', fontSize: 11 }]}>Autonomía y Habilidades Prácticas</Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: '#9333ea', fontSize: 7 }]}>Nivel de independencia en el uso de IA</Text>
                </View>
                <View style={{ gap: 8 }}>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 10, border: '1 solid #e9d5ff', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                      <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Circle cx="12" cy="12" r="10" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                          <Circle cx="12" cy="12" r="4" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                        </Svg>
                        <View>
                          <Text style={{ fontSize: 8, color: '#4b5563' }}>Nivel de autonomía:</Text>
                          <Text style={{ fontSize: 6, color: '#9ca3af' }}>1=Necesita ayuda, 5=Totalmente autónomo</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7c3aed' }}>{getSingleValue(stats, 'avgAutonomyLevel', 1).toFixed(1)}</Text>
                        <Text style={{ fontSize: 10, color: '#9333ea' }}>/5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 10, border: '1 solid #e9d5ff', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                      <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                        </Svg>
                        <View>
                          <Text style={{ fontSize: 8, color: '#4b5563' }}>Calidad de prompts:</Text>
                          <Text style={{ fontSize: 6, color: '#9ca3af' }}>1=Muy básico, 5=Excelente</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7c3aed' }}>{getSingleValue(stats, 'avgPromptQuality', 1).toFixed(1)}</Text>
                        <Text style={{ fontSize: 10, color: '#9333ea' }}>/5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: '#faf5ff', padding: 8, borderRadius: 6 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#7c3aed', fontWeight: 'bold' }}>Empleados con alta autonomía (4-5):</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7c3aed', marginTop: 4 }}>{getSingleValue(stats, 'pctHighAutonomy', 0)}%</Text>
                  </View>
                </View>
              </View>

              {/* Impact and Opportunities */}
              <View style={[styles.card, styles.cardBordered, styles.cardOrange, { flex: 1, padding: 12 }]}>
                <View style={{ marginBottom: 10 }}>
                  <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <Path d="M2 20h20L12 4z" stroke="#ea580c" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#ea580c', fontWeight: 'bold', fontSize: 11 }]}>Impacto y Oportunidades</Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: '#f97316', fontSize: 7 }]}>Resultados actuales y potencial de mejora</Text>
                </View>
                <View style={{ gap: 8 }}>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 10, border: '1 solid #fed7aa', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                      <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#ea580c" strokeWidth="1.5" fill="none"/>
                          <Path d="M8 7V11M12 5V11M16 9V11" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </Svg>
                        <View>
                          <Text style={{ fontSize: 8, color: '#4b5563' }}>Impacto en KPIs:</Text>
                          <Text style={{ fontSize: 6, color: '#9ca3af' }}>1=Sin impacto, 5=Muy alto</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ea580c' }}>{getSingleValue(stats, 'avgKPIImpact', 1).toFixed(1)}</Text>
                        <Text style={{ fontSize: 10, color: '#f97316' }}>/5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: 'white', padding: 10, border: '1 solid #fed7aa', borderRadius: 6 }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                      <View style={[styles.cardTitleWithIcon, { flex: 1, gap: 6 }]}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Circle cx="12" cy="12" r="10" stroke="#ea580c" strokeWidth="1.5" fill="none"/>
                          <Path d="M12 7v5l3 3" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </Svg>
                        <View>
                          <Text style={{ fontSize: 8, color: '#4b5563' }}>Oportunidad de mejora:</Text>
                          <Text style={{ fontSize: 6, color: '#9ca3af' }}>1=Baja, 5=Muy alta</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ea580c' }}>{getSingleValue(stats, 'avgImprovementOpportunity', 1).toFixed(1)}</Text>
                        <Text style={{ fontSize: 10, color: '#f97316' }}>/5</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.card, { backgroundColor: '#fff7ed', padding: 8, borderRadius: 6 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M9 11l3 3L22 4" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 8, color: '#ea580c', fontWeight: 'bold' }}>Empleados con alto impacto en KPIs (4-5):</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ea580c', marginTop: 4 }}>{getSingleValue(stats, 'pctHighKPIImpact', 0)}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Organizational Barriers Analysis */}
          <View style={styles.section}>
            <View style={[styles.card, styles.cardBordered, styles.cardRed]}>
              <View style={{ marginBottom: 10 }}>
                <View style={[styles.cardTitleWithIcon, { gap: 6 }]}>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc2626" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 9v4M12 17h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#dc2626', fontWeight: 'bold', fontSize: 11 }]}>¿Qué impide usar IA en tu empresa?</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#ef4444', fontSize: 7 }]}>Obstáculos como políticas restrictivas, falta de capacitación, resistencia al cambio</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.card, { backgroundColor: 'white', padding: 10, flex: 1 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Obstáculos internos:</Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }}>
                    {getSingleValue(stats, 'avgOrganizationalBarriers', 1).toFixed(1)}/5
                  </Text>
                  <Text style={{ fontSize: 6, color: '#9ca3af' }}>1=Sin obstáculos, 5=Muchos obstáculos</Text>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 10, flex: 1 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <Path d="M9 11l3 3L22 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Empleados libres para usar IA:</Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#16a34a' }}>
                    {getSingleValue(stats, 'pctLowBarriers', 0)}%
                  </Text>
                  <Text style={{ fontSize: 6, color: '#9ca3af' }}>Sin obstáculos para adoptar IA</Text>
                </View>
                <View style={[styles.card, { backgroundColor: 'white', padding: 10, flex: 1 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <Path d="M2 20h20L12 4z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Empleados motivados:</Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>
                    {getSingleValue(stats, 'pctHighImprovementOpportunity', 0)}%
                  </Text>
                  <Text style={{ fontSize: 6, color: '#9ca3af' }}>Quieren mejorar en IA</Text>
                </View>
              </View>
              
              {/* Barriers Interpretation */}
              <View style={{ marginTop: 10, padding: 10, backgroundColor: '#fef3c7', border: '1 solid #fde68a', borderRadius: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 7v5l3 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={{ fontSize: 9, color: '#d97706', fontWeight: 'bold' }}>¿Qué significa esto para tu empresa?</Text>
                </View>
                <Text style={{ fontSize: 8, color: '#92400e', lineHeight: 1.4 }}>
                  {(() => {
                    const barrierLevel = getSingleValue(stats, "avgOrganizationalBarriers", 1);
                    if (barrierLevel <= 2) {
                      return "Excelente: Tu equipo puede usar IA libremente. Es momento de acelerar la adopción y obtener ventaja competitiva.";
                    } else if (barrierLevel <= 3) {
                      return "Moderado: Hay algunos obstáculos. Recomendamos crear políticas claras de IA y capacitar a los gerentes.";
                    } else if (barrierLevel <= 4) {
                      return "Preocupante: Muchos obstáculos frenan la productividad. Necesitas involucrar a los directivos para remover barreras.";
                    } else {
                      return "Crítico: Los obstáculos están bloqueando completamente la innovación. Requiere acción inmediata de la alta dirección.";
                    }
                  })()}
                </Text>
              </View>
            </View>
          </View>

          {/* Enhanced Charts Section */}
          <View style={[styles.section, { marginBottom: 20 }]} wrap={false}>
            <View style={{ 
              marginBottom: 16, 
              paddingBottom: 12, 
              borderBottomWidth: 2, 
              borderBottomColor: '#e5e7eb',
              backgroundColor: '#f0f9ff',
              padding: 12,
              borderRadius: 8
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: '#1e40af',
                textAlign: 'center',
                letterSpacing: 0.5
              }}>[COMPARACIÓN] Tu empresa vs otras empresas</Text>
              <Text style={{ 
                fontSize: 10, 
                color: '#3b82f6', 
                textAlign: 'center',
                marginTop: 4
              }}>¿Cómo se compara tu empresa con el promedio del mercado?</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Skills vs Industry - Updated with 6 metrics */}
              <View style={[styles.card, styles.cardBordered, { flex: 1, borderColor: '#9333ea' }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWithIcon}>
                    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke="#9333ea" strokeWidth="1.5" fill="none"/>
                      <Path d="M12 6V12L16 14" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#7c3aed', fontWeight: 'bold' }]}>Tus habilidades vs promedio</Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: '#9333ea' }]}>¿Estás por encima o debajo del promedio?</Text>
                </View>
                
                {/* Radar Chart using hexagon for 6 points */}
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
                    
                    {/* Grid lines for 6 points */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => {
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
                    
                    {/* Industry benchmark hexagon (background) */}
                    <Path
                      d={(() => {
                        const industryValues = [3.2, 3.5, 3.8, 3.0, 2.8, 3.1]; // Industry averages
                        const points = industryValues.map((value, i) => {
                          const angle = (i * 60 - 90) * Math.PI / 180;
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
                    
                    {/* Company values hexagon (foreground) */}
                    <Path
                      d={(() => {
                        const companyValues = [
                          getSingleValue(stats, 'avgPromptSkill', 2),
                          getSingleValue(stats, 'avgConfidence', 2),
                          getSingleValue(stats, 'avgCuriosity', 2),
                          getSingleValue(stats, 'avgAutonomyLevel', 2),
                          getSingleValue(stats, 'avgKPIImpact', 2),
                          getSingleValue(stats, 'avgPromptQuality', 2)
                        ];
                        const points = companyValues.map((value, i) => {
                          const angle = (i * 60 - 90) * Math.PI / 180;
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
                    
                    {/* Labels for 6 metrics */}
                    <Text x="100" y="10" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Habilidad prompts
                    </Text>
                    <Text x="180" y="60" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Confianza IA
                    </Text>
                    <Text x="180" y="140" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Curiosidad IA
                    </Text>
                    <Text x="100" y="190" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Autonomía IA
                    </Text>
                    <Text x="20" y="140" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Impacto KPIs
                    </Text>
                    <Text x="20" y="60" textAnchor="middle" style={{ fontSize: 9, fill: '#374151' }}>
                      Calidad prompts
                    </Text>
                  </Svg>
                  
                  {/* Enhanced Legend with Values */}
                  <View style={{ marginTop: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 20, marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 20, height: 3, backgroundColor: '#3b82f6' }} />
                        <Text style={{ fontSize: 8, color: '#374151', fontWeight: 'bold' }}>Tu empresa</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 20, height: 3, backgroundColor: '#ef4444', opacity: 0.5 }} />
                        <Text style={{ fontSize: 8, color: '#374151' }}>Promedio industria</Text>
                      </View>
                    </View>
                    
                    {/* Skill Values Summary */}
                    <View style={{ backgroundColor: '#f8fafc', padding: 8, borderRadius: 6, marginTop: 8 }}>
                      <Text style={{ fontSize: 9, color: '#374151', fontWeight: 'bold', marginBottom: 6 }}>
                        Puntuaciones detalladas (escala 1-5):
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                        {(() => {
                          const skills = [
                            { name: 'Prompts', key: 'avgPromptSkill' },
                            { name: 'Confianza', key: 'avgConfidence' },
                            { name: 'Curiosidad', key: 'avgCuriosity' },
                            { name: 'Autonomía', key: 'avgAutonomyLevel' },
                            { name: 'KPIs', key: 'avgKPIImpact' },
                            { name: 'Calidad', key: 'avgPromptQuality' }
                          ];
                          
                          return skills.map((skill, idx) => {
                            const value = getSingleValue(stats, skill.key, 1);
                            const industryValue = [3.2, 3.5, 3.8, 3.0, 2.8, 3.1][idx];
                            const isAboveAverage = value > industryValue;
                            
                            return (
                              <View key={skill.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text style={{ fontSize: 7, color: '#6b7280', width: 45 }}>{skill.name}:</Text>
                                <Text style={{ 
                                  fontSize: 8, 
                                  fontWeight: 'bold',
                                  color: isAboveAverage ? '#059669' : '#dc2626'
                                }}>
                                  {value.toFixed(1)}
                                </Text>
                                <Text style={{ fontSize: 6, color: '#9ca3af' }}>
                                  ({isAboveAverage ? '+' : ''}{(value - industryValue).toFixed(1)})
                                </Text>
                              </View>
                            );
                          });
                        })()}
                      </View>
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
                    <Text style={styles.cardTitle}>¿Dónde usa tu equipo la IA?</Text>
                  </View>
                </View>
                <View style={styles.barChart}>
                  {[
                    { name: 'Laptop', key: 'device.laptop', icon: '[L]' },
                    { name: 'Desktop', key: 'device.desktop', icon: '[D]' },
                    { name: 'Móvil', key: 'device.phone', icon: '[M]' },
                    { name: 'Tablet', key: 'device.tablet', icon: '[T]' }
                  ].map((device, idx) => {
                    const value = getSingleValue(stats, device.key, 0);
                    const maxValue = Math.max(
                      getSingleValue(stats, 'device.laptop', 0),
                      getSingleValue(stats, 'device.desktop', 0),
                      getSingleValue(stats, 'device.phone', 0),
                      getSingleValue(stats, 'device.tablet', 0)
                    );
                    const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    
                    return (
                      <View key={device.name} style={styles.bar}>
                        <View style={[styles.barLabel, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                          <Text style={{ fontSize: 8 }}>{device.icon}</Text>
                          <Text style={{ fontSize: 7 }}>{device.name}</Text>
                        </View>
                        <View style={styles.barContainer}>
                          <View style={[styles.barFill, { 
                            width: `${barWidth}%`, 
                            backgroundColor: ['#4285F4', '#DB4437', '#F5B614', '#0F9D58'][idx] 
                          }]} />
                        </View>
                        <Text style={[styles.barValue, { fontWeight: 'bold' }]}>{value}%</Text>
                      </View>
                    );
                  })}
                </View>
                
                {/* Device Usage Insights */}
                <View style={{ marginTop: 10, padding: 8, backgroundColor: '#f1f5f9', borderRadius: 6 }}>
                  <Text style={{ fontSize: 8, color: '#475569', fontWeight: 'bold', marginBottom: 4 }}>
                    [QUÉ SIGNIFICA] Para tu estrategia de capacitación:
                  </Text>
                  <Text style={{ fontSize: 7, color: '#64748b', lineHeight: 1.4 }}>
                    {(() => {
                      const laptopUsage = getSingleValue(stats, 'device.laptop', 0);
                      const mobileUsage = getSingleValue(stats, 'device.phone', 0);
                      const desktopUsage = getSingleValue(stats, 'device.desktop', 0);
                      const totalUsage = laptopUsage + mobileUsage + desktopUsage + getSingleValue(stats, 'device.tablet', 0);
                      
                      if (totalUsage === 0) {
                        return "Tu equipo no especificó dispositivos preferidos. Recomendamos capacitación en computadoras para mayor productividad.";
                      }
                      
                      if (laptopUsage > 50) {
                        return "Tu equipo prefiere laptops para trabajar con IA. Esto es ideal para productividad. Considera también entrenar en herramientas móviles.";
                      } else if (mobileUsage > 40) {
                        return "Fuerte uso móvil de IA. Capacita en apps especializadas de móvil, pero también en herramientas de escritorio para tareas complejas.";
                      } else if (desktopUsage > 40) {
                        return "Prefieren computadoras de escritorio. Perfecto para herramientas avanzadas y capacitación técnica profunda.";
                      } else {
                        return "Usan IA en diferentes dispositivos. Recomendamos capacitación que cubra todas las plataformas.";
                      }
                    })()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Opportunities and Risks - Updated with new logic */}
          <View style={styles.section} wrap={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Opportunities */}
              <View style={[styles.card, { flex: 1 }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWithIcon}>
                    <Svg width="14" height="14" viewBox="0 0 24 24" fill="transparent">
                      <Path d="M2 20h20L12 4z" stroke="#0F9D58" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#0F9D58' }]}>¿Cómo puede crecer tu empresa?</Text>
                  </View>
                </View>
                <View style={styles.list}>
                  {(() => {
                    const opportunities = [];
                    
                    // Base opportunities by maturity level
                    if (maturity.score < 25) {
                      opportunities.push("Implementar programa básico de alfabetización IA");
                      opportunities.push("Capacitación en herramientas fundamentales (ChatGPT, Copilot)");
                      opportunities.push("Establecer políticas de uso responsable de IA");
                    } else if (maturity.score < 50) {
                      opportunities.push("Desarrollar prompts especializados por área");
                      opportunities.push("Implementar workflows automatizados");
                      opportunities.push("Capacitación avanzada en herramientas específicas");
                    } else if (maturity.score < 75) {
                      opportunities.push("Desarrollar soluciones IA personalizadas");
                      opportunities.push("Implementar IA en procesos críticos");
                      opportunities.push("Crear centro de excelencia en IA");
                    } else {
                      opportunities.push("Liderar innovación en el sector");
                      opportunities.push("Desarrollar productos con IA integrada");
                      opportunities.push("Monetizar capacidades IA");
                    }

                    // Add specific opportunities based on new metrics
                    if (getSingleValue(stats, "avgAutonomyLevel") < 3) {
                      opportunities.push("Programa de mentoría para aumentar autonomía en IA");
                    }
                    if (getSingleValue(stats, "avgKPIImpact") < 3) {
                      opportunities.push("Identificar y medir KPIs específicos impactados por IA");
                    }
                    if (getSingleValue(stats, "avgPromptQuality") < 3) {
                      opportunities.push("Workshop intensivo de prompt engineering avanzado");
                    }
                    if (getSingleValue(stats, "avgImprovementOpportunity") >= 4) {
                      opportunities.push("Aprovechar alta motivación del equipo para proyectos piloto");
                    }
                    if (getSingleValue(stats, "pctLowBarriers") >= 70) {
                      opportunities.push("Acelerar adopción aprovechando baja resistencia organizacional");
                    }

                    return opportunities.slice(0, 4).map((item, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <View style={[styles.bullet, { backgroundColor: '#0F9D58' }]} />
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ));
                  })()}
                </View>
              </View>

              {/* Risks - Updated with new logic */}
              <View style={[styles.card, { flex: 1 }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWithIcon}>
                    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#DB4437" strokeWidth="1.5" fill="none"/>
                      <Path d="M12 9v4M12 17h.01" stroke="#DB4437" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </Svg>
                    <Text style={[styles.cardTitle, { color: '#DB4437' }]}>¿Qué amenaza tu competitividad?</Text>
                  </View>
                </View>
                <View style={styles.list}>
                  {(() => {
                    const risks = [];
                    
                    // Based on actual API metrics
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
                    
                    // Add risks based on new metrics
                    if (getSingleValue(stats, "avgOrganizationalBarriers") >= 4) {
                      risks.push("Barreras organizacionales extremas bloquean progreso");
                    }
                    if (getSingleValue(stats, "avgAutonomyLevel") < 2.5) {
                      risks.push("Dependencia excesiva limita escalabilidad de IA");
                    }
                    if (getSingleValue(stats, "avgKPIImpact") < 2) {
                      risks.push("Falta de impacto medible puede reducir inversión en IA");
                    }
                    if (getSingleValue(stats, "avgPromptQuality") < 2.5) {
                      risks.push("Prompts de baja calidad generan resultados inconsistentes");
                    }
                    if (getSingleValue(stats, "pctLowBarriers") < 30) {
                      risks.push("Alta resistencia organizacional frena implementación");
                    }
                    
                    if (risks.length === 0) {
                      risks.push("Riesgo de quedarse atrás sin mejora continua");
                    }
                    
                    return risks.slice(0, 4).map((item, idx) => (
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

          {/* AI Tools Adoption - Updated from Copilot */}
          <View style={styles.section} wrap={false}>
            <View style={[styles.card, styles.cardBordered, styles.cardBlue]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Rect x="3" y="11" width="18" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                    <Path d="M8 7V11M12 5V11M16 9V11" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#2563eb', fontWeight: 'bold', fontSize: 14 }]}>¿Qué herramientas de IA usa tu equipo?</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#3b82f6' }]}>Porcentaje de empleados que usa cada herramienta</Text>
              </View>
              <View style={styles.barChart}>
                {[
                  { name: 'ChatGPT', key: 'tool.chatgpt', color: '#10B981' },
                  { name: 'Copilot', key: 'tool.copilot', color: '#3B82F6' },
                  { name: 'Gemini', key: 'tool.gemini', color: '#8B5CF6' },
                  { name: 'Perplexity', key: 'tool.perplexity', color: '#F59E0B' },
                  { name: 'Cursor', key: 'tool.cursor', color: '#EF4444' },
                  { name: 'Claude', key: 'tool.claude', color: '#06B6D4' },
                  { name: 'Otro', key: 'tool.otro', color: '#6B7280' }
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
              
              {/* Discovery Summary */}
              <View style={{ marginTop: 10, padding: 8, backgroundColor: '#fef3c7', border: '1 solid #fde68a', borderRadius: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 7v5l3 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={{ fontSize: 8, color: '#d97706', fontWeight: 'bold' }}>Oportunidad de Crecimiento</Text>
                </View>
                <Text style={{ fontSize: 7, color: '#92400e' }}>
                  {(() => {
                    const toolsInUse = ['chatgpt', 'copilot', 'gemini', 'perplexity', 'cursor', 'claude', 'otro']
                      .filter(tool => getSingleValue(stats, `tool.${tool}`, 0) > 0).length;
                    const totalTools = 7;
                    const unusedTools = totalTools - toolsInUse;
                    return `Tu equipo usa ${toolsInUse} de ${totalTools} herramientas principales. Hay ${unusedTools} herramientas más que podrían aumentar su productividad.`;
                  })()}
                </Text>
              </View>
            </View>
          </View>

          {/* Tasks by Area Section */}
          <View style={styles.section} wrap={false}>
            <View style={[styles.card, styles.cardBordered, styles.cardGreen]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 17h6l3-10-3-2-6 2-3 10z" stroke="#059669" strokeWidth="1.5" fill="none"/>
                    <Path d="M12 7v10M8 11h8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </Svg>
                  <Text style={[styles.cardTitle, { color: '#059669', fontWeight: 'bold', fontSize: 14 }]}>Distribución de Tareas por Área</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: '#10b981' }]}>Tareas repetitivas identificadas por área funcional</Text>
              </View>
              
              {/* Tasks by Area Bar Chart */}
              <View style={styles.barChart}>
                {(() => {
                  const tasksByArea: { [area: string]: { count: number, tasks: string[] } } = {};
                  
                  // Process stats to extract tasks by area
                  stats.forEach((item) => {
                    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.tasks')) {
                      const area = item.key.split('.')[1];
                      if (!tasksByArea[area]) {
                        tasksByArea[area] = { count: 0, tasks: [] };
                      }
                      tasksByArea[area].tasks = item.value ? String(item.value).split(', ') : [];
                    }
                    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.count')) {
                      const area = item.key.split('.')[1];
                      if (!tasksByArea[area]) {
                        tasksByArea[area] = { count: 0, tasks: [] };
                      }
                      tasksByArea[area].count = Number(item.value) || 0;
                    }
                  });

                  const areas = [
                    { name: 'Ventas', key: 'ventas', color: '#3B82F6' },
                    { name: 'Marketing', key: 'marketing', color: '#10B981' },
                    { name: 'Finanzas', key: 'finanzas', color: '#F59E0B' },
                    { name: 'Administración', key: 'administracion', color: '#8B5CF6' },
                    { name: 'Operaciones', key: 'operaciones', color: '#EF4444' },
                    { name: 'Recursos Humanos', key: 'recursos', color: '#06B6D4' },
                    { name: 'Otro', key: 'otro', color: '#6B7280' }
                  ];

                  const maxCount = Math.max(...Object.values(tasksByArea).map(area => area.count), 1);
                  
                  return areas.map((area) => {
                    const areaData = tasksByArea[area.key] || { count: 0, tasks: [] };
                    const percentage = maxCount > 0 ? (areaData.count / maxCount) * 100 : 0;
                    
                    if (areaData.count === 0) return null;
                    
                    return (
                      <View key={area.key} style={styles.bar}>
                        <View style={[styles.barLabel, { width: 80 }]}>
                          <Text style={{ fontSize: 7 }}>{area.name}</Text>
                        </View>
                        <View style={styles.barContainer}>
                          <View style={[styles.barFill, { 
                            width: `${percentage}%`, 
                            backgroundColor: area.color 
                          }]} />
                        </View>
                        <Text style={styles.barValue}>{areaData.count}</Text>
                      </View>
                    );
                  }).filter(Boolean);
                })()}
              </View>
              
              {/* Top Tasks Summary */}
              <View style={{ marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(() => {
                  const tasksByArea: { [area: string]: { count: number, tasks: string[] } } = {};
                  
                  stats.forEach((item) => {
                    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.tasks')) {
                      const area = item.key.split('.')[1];
                      if (!tasksByArea[area]) {
                        tasksByArea[area] = { count: 0, tasks: [] };
                      }
                      tasksByArea[area].tasks = item.value ? String(item.value).split(', ') : [];
                    }
                    if (item.key.startsWith('tasksByArea.') && item.key.endsWith('.count')) {
                      const area = item.key.split('.')[1];
                      if (!tasksByArea[area]) {
                        tasksByArea[area] = { count: 0, tasks: [] };
                      }
                      tasksByArea[area].count = Number(item.value) || 0;
                    }
                  });

                  const sortedAreas = Object.entries(tasksByArea)
                    .filter(([, data]) => data.count > 0)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 3);

                  return sortedAreas.map(([area, data], index) => (
                    <View key={area} style={[styles.card, { 
                      width: '30%', 
                      padding: 8, 
                      backgroundColor: '#f8fafc',
                      borderLeftWidth: 3,
                      borderLeftColor: ['#3B82F6', '#10B981', '#F59E0B'][index] || '#6B7280'
                    }]}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#374151', marginBottom: 4 }}>
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </Text>
                      <Text style={{ fontSize: 7, color: '#059669', marginBottom: 4 }}>
                        {data.count} tarea{data.count !== 1 ? 's' : ''}
                      </Text>
                      {data.tasks.slice(0, 2).map((task, idx) => (
                        <Text key={idx} style={{ fontSize: 6, color: '#6b7280', marginBottom: 2 }}>
                          • {task.length > 40 ? task.substring(0, 40) + '...' : task}
                        </Text>
                      ))}
                    </View>
                  ));
                })()}
              </View>
              
              {/* Automation Opportunities Insight */}
              <View style={{ marginTop: 12, padding: 10, backgroundColor: '#ecfdf5', border: '1 solid #86efac', borderRadius: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#059669" strokeWidth="1.5" fill="none"/>
                  </Svg>
                  <Text style={{ fontSize: 9, color: '#059669', fontWeight: 'bold' }}>[OPORTUNIDAD] Automatización</Text>
                </View>
                <Text style={{ fontSize: 8, color: '#065f46', lineHeight: 1.4 }}>
                  {(() => {
                    const totalTasks = stats.filter(s => s.key.endsWith('.count')).reduce((sum, s) => sum + Number(s.value), 0);
                    if (totalTasks === 0) {
                      return "No se identificaron tareas repetitivas específicas. Recomendamos realizar un análisis más detallado para identificar oportunidades de automatización.";
                    } else if (totalTasks < 5) {
                      return "Pocas tareas repetitivas identificadas. Enfoque en optimizar procesos existentes y capacitar en herramientas de productividad.";
                    } else if (totalTasks < 15) {
                      return "Oportunidades moderadas de automatización identificadas. Las áreas con mayor concentración de tareas podrían beneficiarse de capacitación especializada.";
                    } else {
                      return "Excelentes oportunidades de automatización. Alta concentración de tareas repetitivas indica gran potencial de mejora con herramientas de IA.";
                    }
                  })()}
                </Text>
              </View>
            </View>
          </View>

          {/* Blur overlay for second page */}
          {isBlurred && (
            <View style={[styles.blurOverlay, { 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 40,
              width: '100%'
            }]}>
              <Text style={styles.blurText}>Análisis Avanzado</Text>
              <Text style={styles.blurSubtext}>Comparativas vs industria y métricas detalladas</Text>
            </View>
          )}
        </View>
      </Page>

      {/* Third Page - Program Offers */}
      <Page size="A4" style={styles.page}>
        {/* Header for third page */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src="/temple_name.png"
              style={{ width: 100, height: 23, marginRight: 12 }}
            />
            <Text style={[styles.title, { fontSize: 22, color: '#F5B614' }]}>Programa de Transformación IA</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{companyName}</Text>
          </View>
        </View>

        {/* Container for program content with blur overlay */}
        <View style={{ position: 'relative', flex: 1 }}>
          {/* Complete Program - Main Offer */}
          <View style={[styles.section, { marginBottom: 16 }]}>
            <View style={[styles.card, styles.cardBordered, { 
              borderColor: '#F5B614', 
              borderWidth: 3, 
              backgroundColor: '#FFFBF0', 
              padding: 20, 
              position: 'relative' // Needed for absolute positioning of the banner
            }]}>
              {/* Recommended Banner */}
              <View style={{
                position: 'absolute',
                top: -2, // Adjusted for potentially larger banner
                left: 12, // Adjusted for potentially larger banner
                backgroundColor: '#F5B614',
                paddingHorizontal: 12, // Increased padding
                paddingVertical: 5,    // Increased padding
                borderBottomLeftRadius: 6, // Slightly larger radius
                borderBottomRightRadius: 6, // Slightly larger radius
                zIndex: 1
              }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: 'white' }}> {/* Increased font size */}
                  Recomendado para {companyName}
                </Text>
              </View>

              {/* Calculate program values */}
              {(() => {
                // Use minimum 25 employees, then actual count if higher
                const actualEmployeeCount = roi.employeeCount;
                const billingEmployeeCount = Math.max(25, actualEmployeeCount);
                const price = billingEmployeeCount * 2499;

                return (
                  <>
                    {/* Program Title */}
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                      <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>PROGRAMA CHATGPT BÁSICO + MICROSOFT COPILOT IA / GOOGLE GEMINI</Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#374151' }}>
                        De {maturity.level} a Experto en 4 horas
                      </Text>
                      <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2, fontStyle: 'italic' }}>
                        (2 sesiones de 2 horas)
                      </Text>
                      <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                        Para {actualEmployeeCount} empleados — Certificación en IA aplicada
                      </Text>
                      {actualEmployeeCount < 25 && (
                        <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 4, fontStyle: 'italic' }}>
                          (Precio mínimo para 25 empleados)
                        </Text>
                      )}
                    </View>

                    {/* Value Comparison */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                      <View style={{ flex: 1, backgroundColor: '#fef2f2', borderLeftWidth: 3, borderLeftColor: '#dc2626', padding: 10, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, color: '#dc2626', fontWeight: 'bold', marginBottom: 6 }}>Sin el programa</Text>
                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Pierdes ${Math.round(roi.opportunity).toLocaleString()} / mes</Text>
                          <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Ahorro actual: {roi.currentMinutesSavedPerDay.toFixed(1)} min/día</Text>
                          <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Skill IA: {getSingleValue(stats, "avgPromptSkill", 1).toFixed(1)}/5</Text>
                        </View>
                        <View style={{ borderTop: '1 solid #fecaca', marginTop: 6, paddingTop: 6, alignItems: 'center' }}>
                          <Text style={{ fontSize: 8, color: '#dc2626' }}>Costo anual de oportunidad</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>${Math.round(roi.opportunity * 12).toLocaleString()}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 1, backgroundColor: '#f0fdf4', borderLeftWidth: 3, borderLeftColor: '#16a34a', padding: 10, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold', marginBottom: 6 }}>Con el programa</Text>
                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 8, color: '#14532d' }}>Ganas ${Math.round(roi.potential).toLocaleString()} / mes</Text>
                          <Text style={{ fontSize: 8, color: '#14532d' }}>120+ min/día ahorrados</Text>
                          <Text style={{ fontSize: 8, color: '#14532d' }}>Skill IA: 5/5 certificado</Text>
                        </View>
                        <View style={{ borderTop: '1 solid #bbf7d0', marginTop: 6, paddingTop: 6, alignItems: 'center' }}>
                          <Text style={{ fontSize: 8, color: '#16a34a' }}>Beneficio anual total</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#16a34a' }}>${Math.round(roi.potential * 12).toLocaleString()}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Price */}
                    <View style={{ backgroundColor: '#fef3c7', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ fontSize: 9, color: '#6b7280' }}>Precio del programa</Text>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#374151' }}>
                        ${price.toLocaleString()}
                        <Text style={{ fontSize: 8, color: '#6b7280', fontWeight: 'normal' }}> más IVA</Text>
                      </Text>
                    </View>

                    {/* Guarantee */}
                    <View style={{ backgroundColor: '#f0fdf4', border: '1 solid #bbf7d0', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                        <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                        </Svg>
                        <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold' }}>Garantía Triple</Text>
                      </View>
                      <View style={{ gap: 2 }}>
                        <Text style={{ fontSize: 8, color: '#15803d' }}>• Si no te gusta el programa te devolvemos el dinero</Text>
                        <Text style={{ fontSize: 8, color: '#15803d' }}>• Skill sube a 4/5 o extensión gratis</Text>
                        <Text style={{ fontSize: 8, color: '#15803d' }}>• Domina el uso de IA en tu empresa</Text>
                      </View>
                    </View>

                    {/* Urgency */}
                    <View style={{ backgroundColor: '#fef2f2', borderLeftWidth: 3, borderLeftColor: '#dc2626', padding: 8, borderRadius: 4, marginBottom: 10 }}>
                      <Text style={{ fontSize: 9, color: '#dc2626' }}>
                        Solo 20 empresas por cohorte — Próximo inicio en <Text style={{ fontWeight: 'bold' }}>15 días</Text>
                      </Text>
                    </View>

                    {/* CTA - matching web version */}
                    <View style={{ alignItems: 'center' }}>
                      <Link src="https://learninggate-ai.com" style={{ textDecoration: 'none', width: '100%' }}>
                        <View style={{ 
                          backgroundColor: '#F5B614', 
                          borderRadius: 8, 
                          paddingVertical: 12, 
                          paddingHorizontal: 16,
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <Text style={{ 
                            fontSize: 16, 
                            fontWeight: '500', 
                            color: 'white'
                          }}>RESERVAR CUPO</Text>
                        </View>
                      </Link>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>

        </View> {/* Closes the main content View of the third page (position: relative, flex: 1) */}

        {/* Footer for third page (containing the first offer) */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>
            Programa de Transformación IA • LearningGate • {today}
          </Text>
          <Text style={{ fontSize: 7, color: '#d1d5db', textAlign: 'center', marginTop: 4 }}>
            Propuesta comercial confidencial. Válida por 30 días.
          </Text>
        </View>
      </Page> {/* End of the Third Page */}

      {/* FOURTH PAGE - Starting with the second program offer */}
      <Page size="A4" style={styles.page}>
        {/* Header for fourth page (optional, can be added if needed) */}
        {/* The marginTop for the section ensures it respects the page's top padding */}
        <View style={[styles.section, { marginTop: styles.page.padding || 20, flexGrow: 1 }]}>
          {/* ChatGPT Only Program - Alternative Offer - RESTRUCTURED */}
          <View style={[styles.card, styles.cardBordered, { borderColor: '#3b82f6', borderWidth: 3, backgroundColor: '#EFF6FF', padding: 20 }]}>
            {(() => {
              const actualEmployeeCountLocal = roi.employeeCount;
              const billingEmployeeCountLocal = Math.max(25, actualEmployeeCountLocal);
              const pricePerEmployee = 1499;
              const programPrice = billingEmployeeCountLocal * pricePerEmployee;

              // opportunityMonthly is already defined outside, representing roi.opportunity (monthly)

              return (
                <>
                  {/* Program Title */}
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>PROGRAMA CHATGPT BÁSICO</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#374151' }}>
                      De {maturity.level} a Intermedio en 2 horas
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2, fontStyle: 'italic' }}>
                      (1 sesión de 2 horas)
                    </Text>
                    <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                      Para {actualEmployeeCountLocal} empleados — Certificación ChatGPT
                    </Text>
                    {actualEmployeeCountLocal < 25 && (
                      <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 4, fontStyle: 'italic' }}>
                        (Precio mínimo para 25 empleados)
                      </Text>
                    )}
                  </View>

                  {/* Value Comparison */}
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                    <View style={{ flex: 1, backgroundColor: '#fef2f2', borderLeftWidth: 3, borderLeftColor: '#dc2626', padding: 10, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, color: '#dc2626', fontWeight: 'bold', marginBottom: 6 }}>Sin el programa</Text>
                      <View style={{ gap: 4 }}>
                        <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Pierdes ${Math.round(roi.opportunity * 0.5).toLocaleString()} / mes</Text>
                        <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Ahorro actual: {roi.currentMinutesSavedPerDay.toFixed(1)} min/día</Text>
                        <Text style={{ fontSize: 8, color: '#7f1d1d' }}>Skill ChatGPT: {getSingleValue(stats, "avgPromptSkill", 1).toFixed(1)}/5</Text>
                      </View>
                      <View style={{ borderTop: '1 solid #fecaca', marginTop: 6, paddingTop: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 8, color: '#dc2626' }}>Costo anual de oportunidad</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>${Math.round(roi.opportunity * 0.5 * 12).toLocaleString()}</Text>
                      </View>
                    </View>
                    
                    <View style={{ flex: 1, backgroundColor: '#f0fdf4', borderLeftWidth: 3, borderLeftColor: '#16a34a', padding: 10, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold', marginBottom: 6 }}>Con el programa</Text>
                      <View style={{ gap: 4 }}>
                        <Text style={{ fontSize: 8, color: '#14532d' }}>Ganas ${Math.round(roi.current + (roi.potential - roi.current) * 0.5).toLocaleString()} / mes</Text>
                        <Text style={{ fontSize: 8, color: '#14532d' }}>60+ min/día ahorrados</Text>
                        <Text style={{ fontSize: 8, color: '#14532d' }}>Skill ChatGPT: 4/5 intermedio</Text>
                      </View>
                      <View style={{ borderTop: '1 solid #bbf7d0', marginTop: 6, paddingTop: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 8, color: '#16a34a' }}>Beneficio anual total</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#16a34a' }}>${Math.round((roi.current + (roi.potential - roi.current) * 0.5) * 12).toLocaleString()}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Price */}
                  <View style={{ backgroundColor: '#DBEAFE', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 9, color: '#1e3a8a' }}>Precio del programa</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#374151' }}>${programPrice.toLocaleString()}</Text>
                    <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 1 }}>${pricePerEmployee} por empleado</Text>
                  </View>

                  {/* Guarantee */}
                  <View style={{ backgroundColor: '#f0fdf4', border: '1 solid #bbf7d0', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                      </Svg>
                      <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold' }}>Garantía Doble</Text>
                    </View>
                    <View style={{ gap: 2 }}>
                      <Text style={{ fontSize: 8, color: '#15803d' }}>• Recuperas ${Math.round((roi.potential - roi.current) * 0.5).toLocaleString()} o reembolso</Text>
                      <Text style={{ fontSize: 8, color: '#15803d' }}>• Skill sube a 4/5 o extensión gratis</Text>
                    </View>
                  </View>
                  
                  <View style={{ backgroundColor: '#E0E7FF', borderLeftWidth: 3, borderLeftColor: '#4338CA', padding: 8, borderRadius: 4, marginBottom: 10 }}>
                     <Text style={{ fontSize: 9, color: '#4338CA' }}>
                      Programa de entrada — <Text style={{ fontWeight: 'bold' }}>Disponible inmediatamente</Text>
                    </Text>
                  </View>

                  {/* CTA - matching web version */}
                  <View style={{ alignItems: 'center' }}>
                    <Link src="https://learninggate-ai.com" style={{ textDecoration: 'none', width: '100%' }}>
                      <View style={{ 
                        backgroundColor: '#2563eb', 
                        borderRadius: 8, 
                        paddingVertical: 12, 
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: '500', 
                          color: 'white'
                        }}>EMPEZAR AHORA</Text>
                      </View>
                    </Link>
                  </View>
                </>
              );
            })()}
          </View>
        </View>

        {/* Footer for fourth page */}
        <View style={[styles.footer, { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: '#e5e7eb'}]}>
          <Text style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>
            Programas Adicionales • LearningGate • {today}
          </Text>
        </View>
      </Page> {/* End of the Fourth Page */}
    </Document>
  );
}; 

// Export Button Component
export const PDFExportButton: React.FC<PDFReportProps> = ({ companyName, stats, isBlurred = false }) => {
  const buttonStyle = isBlurred 
    ? "inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200"
    : "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200";
  
  const fileName = isBlurred 
    ? `diagnostico-ia-preview-${companyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    : `diagnostico-ia-${companyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<PDFReport companyName={companyName} stats={stats} isBlurred={isBlurred} />}
      fileName={fileName}
      className={buttonStyle}
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
            {isBlurred ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Vista Previa PDF
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar PDF Completo
              </>
            )}
          </>
        )}
    </PDFDownloadLink>
  );
}; 