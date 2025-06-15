import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ElectionContext = createContext();

export function useElection() {
  return useContext(ElectionContext);
}

export function ElectionProvider({ children }) {
  // Load elections from localStorage
  const [elections, setElections] = useState(() => {
    const saved = localStorage.getItem('elections');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Track active election
  const [activeElectionId, setActiveElectionId] = useState(
    localStorage.getItem('activeElectionId') || null
  );
  
  // Track votes in real-time
  const [votes, setVotes] = useState(() => {
    const saved = localStorage.getItem('votes');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('elections', JSON.stringify(elections));
    localStorage.setItem('activeElectionId', activeElectionId);
    localStorage.setItem('votes', JSON.stringify(votes));
  }, [elections, activeElectionId, votes]);

  // Sync across tabs using storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'elections') {
        setElections(JSON.parse(e.newValue));
      }
      if (e.key === 'activeElectionId') {
        setActiveElectionId(e.newValue);
      }
      if (e.key === 'votes') {
        setVotes(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Create new election
  const createElection = useCallback((electionData) => {
    const newElection = {
      ...electionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setElections(prev => [...prev, newElection]);
    return newElection.id;
  }, []);

  // Update existing election
  const updateElection = useCallback((electionId, electionData) => {
    setElections(prev => 
      prev.map(e => e.id === electionId ? { ...electionData, id: electionId } : e)
    );
  }, []);

  // Start an election
  const startElection = useCallback((electionId) => {
    setElections(prev => {
      // End any currently active elections
      const endedElections = prev.map(e => {
        if (e.status === 'active') {
          return { ...e, status: 'completed' };
        }
        return e;
      });
      
      // Start the new election
      return endedElections.map(e => {
        if (e.id === electionId) {
          return { ...e, status: 'active' };
        }
        return e;
      });
    });
    
    setActiveElectionId(electionId);
  }, []);

  // End an election
  const endElection = useCallback((electionId) => {
    setElections(prev => 
      prev.map(e => e.id === electionId ? { ...e, status: 'completed' } : e)
    );
    setActiveElectionId(null);
  }, []);
  
  // Delete an election
  const deleteElection = useCallback((electionId) => {
    setElections(prev => prev.filter(e => e.id !== electionId));
    if (activeElectionId === electionId) {
      setActiveElectionId(null);
    }
  }, [activeElectionId]);

  // Cast a vote
  const castVote = useCallback((electionId, positionId, candidateId) => {
    setVotes(prev => {
      const newVotes = { ...prev };
      
      // Initialize if needed
      if (!newVotes[electionId]) newVotes[electionId] = {};
      if (!newVotes[electionId][positionId]) newVotes[electionId][positionId] = {};
      
      // Update vote count
      const currentCount = newVotes[electionId][positionId][candidateId] || 0;
      newVotes[electionId][positionId][candidateId] = currentCount + 1;
      
      return newVotes;
    });
  }, []);

  // Get active election
  const getActiveElection = useCallback(() => {
    return elections.find(e => e.id === activeElectionId) || null;
  }, [elections, activeElectionId]);

  // Get election by ID
  const getElection = useCallback((id) => {
    return elections.find(e => e.id === id) || null;
  }, [elections]);

  // Get votes for an election
  const getVotesForElection = useCallback((electionId) => {
    return votes[electionId] || {};
  }, [votes]);

  const value = {
    elections,
    activeElectionId,
    createElection,
    updateElection,
    startElection,
    endElection,
    deleteElection,
    castVote,
    getActiveElection,
    getElection,
    getVotesForElection
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
}