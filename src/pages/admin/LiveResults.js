import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import { calculateResults, getLeadingCandidate } from '../../services/electionService';
import ResultsChart from '../../components/ui/ResultsChart';
import { FaArrowLeft, FaStop } from 'react-icons/fa';

export default function LiveResults() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { getElection, getVotesForElection, endElection } = useElection();
  
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [results, setResults] = useState({});
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  // Load election data
  useEffect(() => {
    if (electionId) {
      const electionData = getElection(electionId);
      setElection(electionData);
      
      if (electionData) {
        const electionVotes = getVotesForElection(electionId);
        setVotes(electionVotes);
        setResults(calculateResults(electionData, electionVotes));
      }
      setLoading(false);
    }
  }, [electionId, getElection, getVotesForElection, lastUpdated]);

  // Simulate real-time updates
  useEffect(() => {
    if (!election || election.status !== 'active') return;
    
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [election]);

  const handleEndElection = () => {
    if (window.confirm("Are you sure you want to end this election? This cannot be undone.")) {
      endElection(electionId);
      navigate('/admin');
    }
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
        <Alert variant="danger">
          <h3>Election not found</h3>
          <p>The requested election does not exist.</p>
        </Alert>
      </Container>
    );
  }

  const isActive = election.status === 'active';
  const totalVotes = Object.values(results).reduce(
    (sum, position) => sum + (position?.totalVotes || 0), 0
  );

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                {election.title} Results
                {isActive && (
                  <Badge bg="success" className="ms-2">
                    LIVE
                  </Badge>
                )}
              </h2>
              <div className="d-flex align-items-center gap-2">
                <Badge bg={isActive ? 'success' : 'secondary'}>
                  {election.status}
                </Badge>
                {isActive && (
                  <span className="text-muted">
                    <small>Live results updating every 2 seconds</small>
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button as={Link} to="/admin" variant="outline-primary">
                <FaArrowLeft className="me-2" /> Dashboard
              </Button>
              {isActive && (
                <Button variant="danger" onClick={handleEndElection}>
                  <FaStop className="me-2" /> End Election
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-muted">{election.description}</p>
          
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 bg-primary bg-opacity-10">
                <Card.Body className="text-center">
                  <h3 className="mb-0">{totalVotes}</h3>
                  <p className="mb-0">Total Votes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 bg-success bg-opacity-10">
                <Card.Body className="text-center">
                  <h3 className="mb-0">
                    {election.positions.length}
                  </h3>
                  <p className="mb-0">Positions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 bg-info bg-opacity-10">
                <Card.Body className="text-center">
                  <h3 className="mb-0">
                    {election.positions.reduce((sum, pos) => sum + pos.candidates.length, 0)}
                  </h3>
                  <p className="mb-0">Candidates</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 bg-warning bg-opacity-10">
                <Card.Body className="text-center">
                  <h3 className="mb-0">
                    {Object.keys(votes).length > 0 ? 
                      Math.round((totalVotes / 1000) * 100) / 100 + 'k' : 0}
                  </h3>
                  <p className="mb-0">Votes Today</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {election.positions.map(position => {
            const positionResults = results[position.id] || { totalVotes: 0, candidates: [] };
            const leadingCandidate = getLeadingCandidate(positionResults);
            
            return (
              <Card key={position.id} className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0">{position.title}</h5>
                  <div>
                    <Badge bg="secondary">
                      {positionResults.totalVotes} votes
                    </Badge>
                    {leadingCandidate && (
                      <Badge bg="success" className="ms-2">
                        Leading: {leadingCandidate.name}
                      </Badge>
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Table striped hover responsive>
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Votes</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positionResults.candidates.map(candidate => (
                            <tr 
                              key={candidate.id} 
                              className={leadingCandidate?.id === candidate.id ? 'table-success' : ''}
                            >
                              <td>{candidate.name}</td>
                              <td>{candidate.votes}</td>
                              <td>
                                {candidate.percentage}%
                                {candidate.percentage > 50 && (
                                  <Badge bg="success" className="ms-2">Majority</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <ResultsChart 
                        position={position}
                        results={positionResults}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
}