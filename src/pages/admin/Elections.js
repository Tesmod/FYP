import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';

import { Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCog } from 'react-icons/fa';

export default function AdminElections() {
  const [elections, setElections] = useState([
    { id: 1, title: 'Student Union Elections', status: 'Active', start: '2023-10-01', end: '2023-10-10', voters: 2451 },
    { id: 2, title: 'Department Representatives', status: 'Upcoming', start: '2023-10-15', end: '2023-10-25', voters: 0 },
    { id: 3, title: 'Faculty Senate', status: 'Completed', start: '2023-09-10', end: '2023-09-20', voters: 1872 }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newElection = {
      id: elections.length + 1,
      ...formData,
      status: 'Upcoming',
      voters: 0
    };
    setElections([...elections, newElection]);
    setShowModal(false);
    setFormData({ title: '', start: '', end: '', description: '' });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'warning';
      case 'Completed': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="admin-elections">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Elections</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Create Election
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Voters</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map(election => (
                <tr key={election.id}>
                  <td>{election.title}</td>
                  <td>
                    <Badge bg={getStatusVariant(election.status)}>
                      {election.status}
                    </Badge>
                  </td>
                  <td>{election.start} to {election.end}</td>
                  <td>{election.voters}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="outline-info" size="sm" className="me-2">
                      <FaCog />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Create Election Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Election</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Election Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title" 
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Student Union Elections 2023"
                required 
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Start Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="start" 
                  value={formData.start}
                  onChange={handleInputChange}
                  required 
                />
              </Form.Group>
              
              <Form.Group as={Col}>
                <Form.Label>End Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="end" 
                  value={formData.end}
                  onChange={handleInputChange}
                  required 
                />
              </Form.Group>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the purpose and scope of this election"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Election Type</Form.Label>
              <Form.Select>
                <option>Single Choice (Select one candidate)</option>
                <option>Ranked Choice (Rank candidates)</option>
                <option>Multi-choice (Select multiple candidates)</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Election
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}