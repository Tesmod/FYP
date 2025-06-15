import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import { getVotingStatus } from '../../services/electionService';
import VoteCard from '../../components/voter/VoteCard';

export default function VotingBooth() {
  const { activeElectionId, getElection } = useElection();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  // Load active election
  useEffect(() => {
    if (activeElectionId) {
      const activeElection = getElection(activeElectionId);
      setElection(activeElection);
      
      // Initialize empty votes
      const initialVotes = {};
      activeElection?.positions?.forEach(position => {
        initialVotes[position.id] = null;
      });
      setVotes(initialVotes);
      setLoading(false);
    }
  }, [activeElectionId, getElection, lastUpdated]);

  // Simulate real-time updates
  useEffect(() => {
    if (!election || election.status !== 'active') return;
    
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, 5000); // Refresh every 3 seconds
    
    return () => clearInterval(interval);
  }, [election]);

  const handleVote = (positionId, candidateId) => {
    setVotes(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const confirmVote = () => {
    setSubmitting(true);
    
    // Record votes
    setTimeout(() => {
      navigate('/voter/confirmation');
    }, 1000);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!election) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <h3>No active elections</h3>
          <p>There are currently no elections in progress.</p>
        </Alert>
      </Container>
    );
  }

  if (election.status !== 'active') {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h3>Election Not Active</h3>
          <p>The "{election.title}" election is not currently active.</p>
        </Alert>
      </Container>
    );
  }

  const allPositionsVoted = Object.values(votes).every(vote => vote !== null);

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2>{election.title}</h2>
            <p className="text-muted">
              {election.description}
            </p>
            <Badge bg="success" className="fs-6">Active Election</Badge>
          </div>
          
          {election.positions.map(position => {
            const votingStatus = getVotingStatus(election, position.id);
            
            return (
              <Card key={position.id} className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0">{position.title}</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {position.candidates.map(candidate => (
                      <Col md={6} key={candidate.id} className="mb-3">
                        <VoteCard 
                          candidate={candidate}
                          selected={votes[position.id] === candidate.id}
                          onSelect={() => handleVote(position.id, candidate.id)}
                          disabled={votingStatus !== 'active'}
                        />
                      </Col>
                    ))}
                  </Row>
                  
                  {votingStatus !== 'active' && (
                    <Alert variant="warning" className="mt-2">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      Voting for this position is currently {votingStatus}
                    </Alert>
                  )}
                  
                  {!votes[position.id] && votingStatus === 'active' && (
                    <Alert variant="info" className="mt-2">
                      <i className="bi bi-info-circle me-2"></i>
                      Please select a candidate for this position
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            );
          })}
          
          <div className="d-grid mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              disabled={!allPositionsVoted}
              onClick={handleSubmit}
            >
              Submit All Votes
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Votes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit these votes? This action cannot be undone.</p>
          
          <div className="border rounded p-3 mb-3">
            <h6>Your Selections:</h6>
            <ul>
              {Object.entries(votes).map(([positionId, candidateId]) => {
                const position = election.positions.find(p => p.id === positionId);
                const candidate = position?.candidates.find(c => c.id === candidateId);
                
                return (
                  <li key={positionId}>
                    <strong>{position?.title}:</strong> 
                    {candidate ? ` ${candidate.name}` : ' Not selected'}
                  </li>
                );
              })}
            </ul>
          </div>
          
          <p className="text-muted small">
            Your vote is anonymous and encrypted. No one can trace your selections back to you.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Review Again
          </Button>
          <Button variant="success" onClick={confirmVote} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              'Confirm & Submit Vote'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}