import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VoterLoginForm({ setError }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginVoter } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = loginVoter(email);
      if (success) {
        navigate('/voter/verify');
      } else {
        setError('Please use a valid university email address');
      }
    } catch (err) {
      setError('Failed to log in');
    }
    
    setLoading(false);
  };

  return (
    <div className="voter-login-form">
      <h5 className="text-center mb-4">Voter Login</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>University Email</Form.Label>
          <Form.Control 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            required
          />
        </Form.Group>
        
        <div className="d-grid">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Continue as Voter'}
          </Button>
        </div>
      </Form>
    </div>
  );
}