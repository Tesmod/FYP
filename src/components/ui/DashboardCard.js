// src/components/ui/DashboardCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

export default function DashboardCard({ title, value, variant, icon }) {
  const getIcon = () => {
    switch (icon) {
      case 'bi-clipboard': return '📋';
      case 'bi-people': return '👥';
      case 'bi-clock': return '⏳';
      case 'bi-person': return '👤';
      default: return '📊';
    }
  };

  return (
    <Card className={`border-0 bg-${variant}-subtle h-100`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h2 className="mb-0">{value}</h2>
          </div>
          <div className={`bg-${variant} p-3 rounded-circle`}>
            <span className="fs-3 text-white">{getIcon()}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}