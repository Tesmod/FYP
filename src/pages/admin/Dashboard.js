import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import DashboardCard from '../../components/ui/DashboardCard';
import { FaPlus, FaEdit, FaTrash, FaChartBar, FaSync } from 'react-icons/fa';

export default function AdminDashboard() {
  const { 
    elections, 
    deleteElection, 
    startElection, 
    endElection 
  } = useElection();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Refresh data every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      title: 'Total Elections', 
      value: elections.length, 
      variant: 'primary', 
      icon: 'bi-clipboard' 
    },
    { 
      title: 'Active Elections', 
      value: elections.filter(e => e.status === 'active').length, 
      variant: 'success', 
      icon: 'bi-people' 
    },
    { 
      title: 'Draft Elections', 
      value: elections.filter(e => e.status === 'draft').length, 
      variant: 'warning', 
      icon: 'bi-clock' 
    },
    { 
      title: 'Completed Elections', 
      value: elections.filter(e => e.status === 'completed').length, 
      variant: 'info', 
      icon: 'bi-person' 
    }
  ];

  const toggleElectionStatus = (election) => {
    if (election.status === 'draft') {
      startElection(election.id);
    } else if (election.status === 'active') {
      endElection(election.id);
    }
  };

  const handleEditElection = (electionId) => {
    navigate(`/admin/edit-election/${electionId}`);
  };

  const handleDeleteElection = (electionId) => {
    if (window.confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
      deleteElection(electionId);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="text-muted small mb-0">
            Real-time updates <span className="badge bg-success">Active</span>
          </p>
        </div>
        <div>
          <Button as={Link} to="/admin/create-election" variant="primary" className="me-2">
            <FaPlus className="me-2" /> Create Election
          </Button>
          <Button variant="outline-secondary" onClick={() => setLastUpdate(Date.now())}>
            <FaSync />
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {stats.map((stat, index) => (
          <Col md={3} key={index}>
            <DashboardCard {...stat} />
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Card.Title>Your Elections</Card.Title>
            <div className="text-muted small">
              Last updated: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          </div>
          
          {elections.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h4>No Elections Created Yet</h4>
              <p>Get started by creating your first election</p>
              <Button as={Link} to="/admin/create-election" variant="primary">
                Create First Election
              </Button>
            </Alert>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Positions</th>
                  <th>Candidates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map(election => (
                  <tr key={election.id}>
                    <td>
                      <Link to={`/admin/live-results/${election.id}`}>
                        {election.title}
                      </Link>
                    </td>
                    <td>
                      <Badge bg={
                        election.status === 'active' ? 'success' : 
                        election.status === 'draft' ? 'warning' : 'secondary'
                      }>
                        {election.status}
                      </Badge>
                      {election.status === 'active' && (
                        <span className="ms-2">
                          <span className="blinking-dot bg-success"></span>
                          <span className="visually-hidden">Live</span>
                        </span>
                      )}
                    </td>
                    <td>{new Date(election.createdAt).toLocaleDateString()}</td>
                    <td>{election.positions?.length || 0}</td>
                    <td>
                      {election.positions?.reduce((sum, pos) => sum + pos.candidates.length, 0) || 0}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/admin/live-results/${election.id}`)}
                        className="me-1"
                      >
                        <FaChartBar />
                      </Button>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => handleEditElection(election.id)}
                        className="me-1"
                        disabled={election.status === 'active'}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteElection(election.id)}
                        disabled={election.status === 'active'}
                      >
                        <FaTrash />
                      </Button>
                      <Button 
                        variant={
                          election.status === 'draft' ? 'success' : 
                          election.status === 'active' ? 'danger' : 'outline-secondary'
                        }
                        size="sm"
                        className="ms-1"
                        onClick={() => toggleElectionStatus(election)}
                        disabled={election.status === 'completed'}
                      >
                        {election.status === 'draft' ? 'Start' : 
                         election.status === 'active' ? 'End' : 'Completed'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      <style jsx>{`
        .blinking-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}