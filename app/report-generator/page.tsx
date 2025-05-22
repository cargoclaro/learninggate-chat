import ReportGeneratorForm from '../../components/report-generator'; // Adjusted path

export default function GenerateReportPage() {
  return (
    <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2em' }}>
        Company Report Generation
      </h1>
      <ReportGeneratorForm />
    </main>
  );
}
