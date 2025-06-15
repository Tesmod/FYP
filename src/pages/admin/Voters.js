import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { FaSearch, FaCheck, FaTimes, FaUserClock } from 'react-icons/fa';

export default function AdminVoters() {
  const [voters, setVoters] = useState([
    { id: 1, name: 'John Smith', email: 'john@university.edu', status: 'Verified', date: '2023-09-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@university.edu', status: 'Verified', date: '2023-09-16' },
    { id: 3, name: 'Michael Brown', email: 'michael@university.edu', status: 'Pending', date: '2023-09-18' },
    { id: 4, name: 'Emily Davis', email: 'emily@university.edu', status: 'Rejected', date: '2023-09-12' },
    { id: 5, name: 'David Wilson', email: 'david@university.edu', status: 'Pending', date: '2023-09-20' }
  ]);
  
  const [filter, setFilter] = useState('all');

  const filteredVoters = voters.filter(voter => {
    if (filter === 'all') return true;
    return voter.status.toLowerCase() === filter.toLowerCase();
  });

  const approveVoter = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, status: 'Verified' } : voter
    ));
  };

  const rejectVoter = (id) => {
    setVoters(voters.map(voter => 
      voter.id === id ? { ...voter, status: 'Rejected' } : voter
    ));
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="admin-voters">
      <h2 className="mb-4">Voter Management</h2>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <Form className="w-50">
              <Form.Group>
                <div className="input-group">
                  <Form.Control type="text" placeholder="Search voters..." />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </div>
              </Form.Group>
            </Form>
            
            <div>
              <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Voters</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </div>
          </div>
          
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.map(voter => (
                <tr key={voter.id}>
                  <td>{voter.id}</td>
                  <td>{voter.name}</td>
                  <td>{voter.email}</td>
                  <td>
                    <Badge bg={getStatusVariant(voter.status)}>
                      {voter.status}
                    </Badge>
                  </td>
                  <td>{voter.date}</td>
                  <td>
                    {voter.status === 'Pending' && (
                      <div className="d-flex gap-2">
                        <Button variant="outline-success" size="sm" onClick={() => approveVoter(voter.id)}>
                          <FaCheck /> Approve
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => rejectVoter(voter.id)}>
                          <FaTimes /> Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>Showing {filteredVoters.length} of {voters.length} voters</div>
            <div>
              <Button variant="outline-primary" size="sm" className="me-2">
                Export CSV
              </Button>
              <Button variant="outline-secondary" size="sm">
                Print List
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FaUserClock size={24} className="text-warning me-3" />
            <h5 className="mb-0">Pending Approvals</h5>
            <Badge bg="warning" className="ms-2">{voters.filter(v => v.status === 'Pending').length}</Badge>
          </div>
          
          <p>
            You have {voters.filter(v => v.status === 'Pending').length} voter applications requiring approval.
            Verify their university credentials and facial registration data before approving.
          </p>
          
          <Button variant="warning">
            Review Pending Applications
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}