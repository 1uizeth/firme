export default function FlagReviewSection({ 
  flags, 
  onEscalateFlag, 
  onInvestigateFlag, 
  onDismissFlag, 
  onContactMesh 
}: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Flag Review</h2>
      {flags.map((flag: any) => (
        <div key={flag.id} className="border rounded-lg p-4">
          <h3>{flag.creatorName} - {flag.description}</h3>
          <p>Status: {flag.status}</p>
        </div>
      ))}
    </div>
  );
} 