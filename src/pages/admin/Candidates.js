import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { Card, Button, Table, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Alex Johnson', position: 'President', department: 'Computer Science', status: 'Approved' },
    { id: 2, name: 'Maria Garcia', position: 'President', department: 'Political Science', status: 'Approved' },
    { id: 3, name: 'Jamal Williams', position: 'Vice President', department: 'Business Admin', status: 'Pending' },
    { id: 4, name: 'Sophia Kim', position: 'Secretary', department: 'Biochemistry', status: 'Approved' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCandidate = {
      id: candidates.length + 1,
      ...formData,
      status: 'Pending'
    };
    setCandidates([...candidates, newCandidate]);
    setShowModal(false);
    setFormData({ name: '', position: '', department: '', bio: '' });
  };

  return (
    <div className="admin-candidates">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Candidates</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Add Candidate
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <Form className="w-50">
              <Form.Group>
                <div className="input-group">
                  <Form.Control type="text" placeholder="Search candidates..." />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </div>
              </Form.Group>
            </Form>
            <div>
              <Form.Select>
                <option>All Positions</option>
                <option>President</option>
                <option>Vice President</option>
                <option>Secretary</option>
              </Form.Select>
            </div>
          </div>
          
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.position}</td>
                  <td>{candidate.department}</td>
                  <td>
                    <span className={`badge ${
                      candidate.status === 'Approved' ? 'bg-success' : 
                      candidate.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>Showing 1 to {candidates.length} of {candidates.length} entries</div>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                Previous
              </Button>
              <Button variant="outline-secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Add Candidate Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </Form.Group>
              
              <Form.Group as={Col} controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Select 
                  name="position" 
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select position</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="PRO">PRO</option>
                </Form.Select>
              </Form.Group>
            </Row>
            
            <Row className="mb-3">
              <Form.Group as={Col} controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control 
                  type="text" 
                  name="department" 
                  value={formData.department}
                  onChange={handleInputChange}
                  required 
                />
              </Form.Group>
              
              <Form.Group as={Col} controlId="email">
                <Form.Label>University Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@university.edu" 
                  required 
                />
              </Form.Group>
            </Row>
            
            <Form.Group className="mb-3" controlId="bio">
              <Form.Label>Candidate Biography</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="bio" 
                value={formData.bio}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Candidate Photo</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Candidate
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}