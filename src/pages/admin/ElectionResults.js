import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import { calculateResults } from '../../services/electionService';
import ResultsChart from '../../components/ui/ResultsChart';

export default function ElectionResults() {
  const { electionId } = useParams();
  const { getElection } = useElection();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState({});
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Load election data
  useEffect(() => {
    const electionData = getElection(electionId);
    setElection(electionData);
    setResults(calculateResults(electionData));
  }, [electionId, getElection, lastUpdated]);

  // Simulate real-time updates
  useEffect(() => {
    if (!election || election.status !== 'active') return;
    
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [election]);

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

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>{election.title} Results</h2>
              <div className="d-flex align-items-center gap-2">
                <Badge bg={isActive ? 'success' : 'secondary'}>
                  {election.status}
                </Badge>
                {isActive && (
                  <span className="text-muted">
                    <small>Live results updating every 5 seconds</small>
                  </span>
                )}
              </div>
            </div>
            <Button as={Link} to="/admin/elections" variant="outline-primary">
              Back to Elections
            </Button>
          </div>
          
          <p className="text-muted">{election.description}</p>
          
          {election.positions.map(position => {
            const positionResults = results[position.id];
            const totalVotes = positionResults?.totalVotes || 0;
            
            return (
              <Card key={position.id} className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0">{position.title}</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="mb-3">Vote Breakdown</h6>
                      <Table striped hover responsive>
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Votes</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {position.candidates.map(candidate => {
                            const candidateResults = positionResults?.candidates[candidate.id];
                            return (
                              <tr key={candidate.id}>
                                <td>{candidate.name}</td>
                                <td>{candidateResults?.votes || 0}</td>
                                <td>
                                  {candidateResults?.percentage || 0}%
                                  {candidateResults && candidateResults.percentage > 50 && (
                                    <Badge bg="success" className="ms-2">Leading</Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="fw-bold">
                            <td>Total Votes</td>
                            <td colSpan="2">{totalVotes}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-3">Results Visualization</h6>
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