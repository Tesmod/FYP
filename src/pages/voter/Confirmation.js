import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaEnvelope } from 'react-icons/fa';

export default function Confirmation() {
  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-4 text-center">
          <div className="mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-4">
              <FaCheckCircle size={48} className="text-success" />
            </div>
          </div>
          
          <h2 className="mb-3">Vote Submitted Successfully!</h2>
          
          <Alert variant="success" className="d-inline-block">
            <p className="mb-0">
              Your vote has been recorded in the blockchain-based voting ledger.
              <br />
              <strong>Transaction ID:</strong> VOTE-5X8A2B9C1D
            </p>
          </Alert>
          
          <div className="my-4 p-4 border rounded bg-light">
            <h5 className="mb-3">Your Voting Receipt</h5>
            <div className="d-flex justify-content-center gap-3 mb-3">
              <Button variant="outline-primary">
                <FaDownload className="me-2" /> Download PDF
              </Button>
              <Button variant="outline-primary">
                <FaEnvelope className="me-2" /> Email Receipt
              </Button>
            </div>
            <p className="text-muted small mb-0">
              This receipt contains your voting confirmation without revealing your selections.
            </p>
          </div>
          
          <div className="d-grid gap-2 mt-4">
            <Button as={Link} to="/" variant="outline-secondary" size="lg">
              Exit Voting System
            </Button>
          </div>
          
          <div className="mt-4 text-muted small">
            <p>
              Election results will be published on the university portal 48 hours after voting closes.
              <br />
              <a href="#help">Contact election committee</a> if you need assistance.
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}