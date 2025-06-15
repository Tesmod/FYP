import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { Form, Button, Alert } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

export default function BioDataForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    department: '',
    level: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentId || !formData.fullName || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      onSubmit();
    }, 500);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <FaCheckCircle size={48} className="text-success mb-3" />
        <h4>Identity Confirmed!</h4>
        <p>Your registration details match our records</p>
      </div>
    );
  }

  return (
    <div className="bio-data-form">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Student ID</Form.Label>
          <Form.Control 
            type="text" 
            name="studentId" 
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter your student ID"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control 
            type="text" 
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange}
            placeholder="As registered with the university"
            required
          />
        </Form.Group>
        
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Department</Form.Label>
            <Form.Control 
              type="text" 
              name="department" 
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              required
            />
          </Form.Group>
          
          <Form.Group as={Col}>
            <Form.Label>Level</Form.Label>
            <Form.Select 
              name="level" 
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              <option value="postgrad">Postgraduate</option>
            </Form.Select>
          </Form.Group>
        </Row>
        
        <div className="d-grid mt-4">
          <Button variant="primary" type="submit" size="lg">
            Confirm Identity
          </Button>
        </div>
      </Form>
      
      <div className="mt-4 text-center text-muted small">
        <p>
          Your information is verified against university records. 
          Only authorized election officials can access this data.
        </p>
      </div>
    </div>
  );
}