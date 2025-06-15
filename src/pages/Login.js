import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import AdminLoginForm from '../components/auth/AdminLoginForm';
import VoterLoginForm from '../components/auth/VoterLoginForm';
import { FaUserShield, FaVoteYea } from 'react-icons/fa';

export default function Login() {
  const [activeForm, setActiveForm] = useState('voter');
  const [error, setError] = useState('');

  return (
    <Container className="d-flex min-vh-100">
      <Row className="m-auto align-items-center w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                  <i className="bi bi-shield-lock fs-1 text-primary"></i>
                </div>
                <h2>University Voting System</h2>
                <p className="text-muted">Secure, verifiable elections</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              
              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button
                  variant={activeForm === 'voter' ? 'primary' : 'outline-primary'}
                  className="d-flex flex-column align-items-center py-3"
                  onClick={() => setActiveForm('voter')}
                >
                  <FaVoteYea size={24} className="mb-2" />
                  <span>Voter Login</span>
                </Button>
                <Button
                  variant={activeForm === 'admin' ? 'primary' : 'outline-primary'}
                  className="d-flex flex-column align-items-center py-3"
                  onClick={() => setActiveForm('admin')}
                >
                  <FaUserShield size={24} className="mb-2" />
                  <span>Admin Login</span>
                </Button>
              </div>
              
              <div className="mt-4">
                {activeForm === 'voter' ? (
                  <VoterLoginForm setError={setError} />
                ) : (
                  <AdminLoginForm setError={setError} />
                )}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-muted small">
                  By continuing, you agree to our secure voting protocols and privacy policy.
                  Facial verification will be required for voter authentication.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}