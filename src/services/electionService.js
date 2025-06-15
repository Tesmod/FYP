// Calculate real-time results for an election
export const calculateResults = (election, votes) => {
  if (!election || !votes) return {};
  
  const results = {};
  
  election.positions.forEach(position => {
    const positionVotes = votes[position.id] || {};
    let totalVotes = 0;
    
    // Calculate votes per candidate
    position.candidates.forEach(candidate => {
      const count = positionVotes[candidate.id] || 0;
      totalVotes += count;
    });
    
    // Store results
    results[position.id] = {
      totalVotes,
      candidates: position.candidates.map(candidate => ({
        ...candidate,
        votes: positionVotes[candidate.id] || 0,
        percentage: totalVotes > 0 
          ? Math.round(((positionVotes[candidate.id] || 0) / totalVotes) * 100)
          : 0
      }))
    };
  });
  
  return results;
};

// Get voting status for a position
export const getVotingStatus = (election, positionId) => {
  if (!election || election.status !== 'active') return 'inactive';
  return election.positions.some(p => p.id === positionId) ? 'active' : 'invalid';
};

// Find leading candidate for a position
export const getLeadingCandidate = (positionResults) => {
  if (!positionResults || positionResults.candidates.length === 0) return null;
  
  return positionResults.candidates.reduce((leading, candidate) => {
    if (!leading || candidate.votes > leading.votes) return candidate;
    return leading;
  }, null);
};