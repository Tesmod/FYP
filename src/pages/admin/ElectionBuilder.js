import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import { FaPlus, FaTrash, FaSave, FaPlay, FaArrowLeft } from 'react-icons/fa';

export default function ElectionBuilder() {
  const { createElection, updateElection, getElection, startElection } = useElection();
  const navigate = useNavigate();
  const { electionId } = useParams();
  
  const [electionData, setElectionData] = useState({
    title: '',
    description: '',
    positions: [{
      id: `pos-${Date.now()}`,
      title: '',
      description: '',
      candidates: [{
        id: `cand-${Date.now()}`,
        name: '',
        bio: ''
      }]
    }]
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load election data if in edit mode
  useEffect(() => {
    if (electionId) {
      const existingElection = getElection(electionId);
      if (existingElection) {
        setElectionData(existingElection);
        setIsEditing(true);
      } else {
        navigate('/admin/create-election');
      }
    }
  }, [electionId, getElection, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElectionData({ ...electionData, [name]: value });
  };

  const handlePositionChange = (index, field, value) => {
    const newPositions = [...electionData.positions];
    newPositions[index][field] = value;
    setElectionData({ ...electionData, positions: newPositions });
  };

  const handleCandidateChange = (positionIndex, candidateIndex, field, value) => {
    const newPositions = [...electionData.positions];
    newPositions[positionIndex].candidates[candidateIndex][field] = value;
    setElectionData({ ...electionData, positions: newPositions });
  };

  const addPosition = () => {
    setElectionData({
      ...electionData,
      positions: [
        ...electionData.positions,
        {
          id: `pos-${Date.now()}`,
          title: '',
          description: '',
          candidates: [{
            id: `cand-${Date.now()}`,
            name: '',
            bio: ''
          }]
        }
      ]
    });
  };

  const removePosition = (index) => {
    if (electionData.positions.length <= 1) return;
    const newPositions = [...electionData.positions];
    newPositions.splice(index, 1);
    setElectionData({ ...electionData, positions: newPositions });
  };

  const addCandidate = (positionIndex) => {
    const newPositions = [...electionData.positions];
    newPositions[positionIndex].candidates.push({
      id: `cand-${Date.now()}`,
      name: '',
      bio: ''
    });
    setElectionData({ ...electionData, positions: newPositions });
  };

  const removeCandidate = (positionIndex, candidateIndex) => {
    const newPositions = [...electionData.positions];
    if (newPositions[positionIndex].candidates.length <= 1) return;
    newPositions[positionIndex].candidates.splice(candidateIndex, 1);
    setElectionData({ ...electionData, positions: newPositions });
  };

  const validateElection = () => {
    if (!electionData.title.trim()) {
      setError('Election title is required');
      return false;
    }
    
    for (const position of electionData.positions) {
      if (!position.title.trim()) {
        setError('All positions must have a title');
        return false;
      }
      
      for (const candidate of position.candidates) {
        if (!candidate.name.trim()) {
          setError('All candidates must have a name');
          return false;
        }
      }
    }
    
    setError('');
    return true;
  };

  const saveElection = () => {
    if (!validateElection()) return null;
    
    setIsSaving(true);
    
    try {
      let id;
      if (isEditing) {
        updateElection(electionId, electionData);
        id = electionId;
        setSuccess('Election updated successfully!');
      } else {
        id = createElection(electionData);
        setSuccess('Election saved successfully!');
      }
      
      return id;
    } catch (err) {
      setError('Failed to save election');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const saveAndStart = async () => {
    const id = saveElection();
    
    if (id) {
      // Allow state to update before starting
      setTimeout(() => {
        startElection(id);
        navigate(`/admin/live-results/${id}`);
      }, 100);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-lg">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin')}
                className="d-flex align-items-center"
              >
                <FaArrowLeft className="me-2" /> Back to Dashboard
              </Button>
              <Card.Title className="mt-3">
                <h2>{isEditing ? 'Edit Election' : 'Create New Election'}</h2>
              </Card.Title>
            </div>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form.Group className="mb-4">
            <Form.Label>Election Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title" 
              value={electionData.title}
              onChange={handleChange}
              placeholder="Student Union Elections 2023"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              name="description" 
              value={electionData.description}
              onChange={handleChange}
              placeholder="Describe the purpose and scope of this election"
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Positions</h4>
            <Button variant="outline-primary" onClick={addPosition}>
              <FaPlus /> Add Position
            </Button>
          </div>
          
          {electionData.positions.map((position, positionIndex) => (
            <Card key={position.id} className="mb-4 border-primary">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <div>Position #{positionIndex + 1}</div>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => removePosition(positionIndex)}
                  disabled={electionData.positions.length <= 1}
                >
                  <FaTrash />
                </Button>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Position Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={position.title}
                    onChange={(e) => handlePositionChange(positionIndex, 'title', e.target.value)}
                    placeholder="e.g. Student Union President"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2} 
                    value={position.description}
                    onChange={(e) => handlePositionChange(positionIndex, 'description', e.target.value)}
                    placeholder="Describe the responsibilities of this position"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Candidates</h5>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => addCandidate(positionIndex)}
                  >
                    <FaPlus /> Add Candidate
                  </Button>
                </div>
                
                <Row>
                  {position.candidates.map((candidate, candidateIndex) => (
                    <Col md={6} key={candidate.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <h6>Candidate #{candidateIndex + 1}</h6>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeCandidate(positionIndex, candidateIndex)}
                              disabled={position.candidates.length <= 1}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                          
                          <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={candidate.name}
                              onChange={(e) => handleCandidateChange(
                                positionIndex, 
                                candidateIndex, 
                                'name', 
                                e.target.value
                              )}
                              placeholder="Candidate name"
                              required
                            />
                          </Form.Group>
                          
                          <Form.Group>
                            <Form.Label>Bio</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={2} 
                              value={candidate.bio}
                              onChange={(e) => handleCandidateChange(
                                positionIndex, 
                                candidateIndex, 
                                'bio', 
                                e.target.value
                              )}
                              placeholder="Short candidate bio"
                            />
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))}
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button 
              variant="primary" 
              onClick={saveElection}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-2" /> 
                  {isEditing ? 'Update' : 'Save Draft'}
                </>
              )}
            </Button>
            <Button 
              variant="success" 
              onClick={saveAndStart}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Starting...
                </>
              ) : (
                <>
                  <FaPlay className="me-2" /> 
                  {isEditing ? 'Update & Start' : 'Save & Start Election'}
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}