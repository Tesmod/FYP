import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaUserGraduate, FaCheck } from 'react-icons/fa';

export default function VoteCard({ candidate, selected, onSelect }) {
  return (
    <Card 
      className={`h-100 cursor-pointer ${selected ? 'border-primary border-2' : ''}`}
      onClick={onSelect}
    >
      <Card.Body>
        <div className="d-flex">
          <div className="me-3">
            <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '70px', height: '70px' }}>
              {candidate.image ? (
                <img 
                  src={candidate.image} 
                  alt={candidate.name} 
                  className="rounded-circle" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <FaUserGraduate size={32} className="text-muted" />
              )}
            </div>
          </div>
          <div className="flex-grow-1">
            <Card.Title className="mb-1">{candidate.name}</Card.Title>
            <Card.Text className="text-muted mb-2">
              <small>{candidate.department}</small>
            </Card.Text>
            <div className="d-flex align-items-center">
              {selected ? (
                <span className="text-primary fw-bold">
                  <FaCheck className="me-1" /> Selected
                </span>
              ) : (
                <Button variant="outline-primary" size="sm">
                  Select Candidate
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}