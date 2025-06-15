import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FacialRecognition from '../../components/auth/FacialRecognition';
import BioDataForm from '../../components/auth/BioDataForm';

export default function VoterVerification() {
  const [step, setStep] = useState(1); // 1 = Facial, 2 = BioData
  const [verificationComplete, setVerificationComplete] = useState(false);
  const navigate = useNavigate();

  const handleFacialSuccess = () => {
    setStep(2);
  };

  const handleBioSubmit = () => {
    setVerificationComplete(true);
    setTimeout(() => {
      navigate('/voter/vote');
    }, 2000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Voter Verification</h2>
                <div className="d-flex justify-content-center mt-3 mb-3">
                  <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1</div>
                  <div className="step-divider"></div>
                  <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2</div>
                </div>
                <p className="text-muted">
                  {step === 1 
                    ? 'Facial verification required' 
                    : 'Confirm your registration details'}
                </p>
              </div>
              
              {verificationComplete ? (
                <Alert variant="success" className="text-center">
                  <h4 className="mb-3">Verification Complete!</h4>
                  <p>Redirecting to voting booth...</p>
                </Alert>
              ) : (
                <>
                  {step === 1 && (
                    <FacialRecognition onVerificationSuccess={handleFacialSuccess} />
                  )}
                  
                  {step === 2 && (
                    <BioDataForm onSubmit={handleBioSubmit} />
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}