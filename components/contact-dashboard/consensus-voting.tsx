export default function ConsensusVoting({ 
  escalatedFlags, 
  onVote, 
  onContactMember 
}: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Consensus Voting</h2>
      {escalatedFlags.map((flag: any) => (
        <div key={flag.id} className="border rounded-lg p-4">
          <h3>{flag.creatorName} - {flag.description}</h3>
          <p>Votes: {flag.votes.approve}/{flag.votes.total}</p>
        </div>
      ))}
    </div>
  );
} 