// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ElectionProvider } from './contexts/ElectionContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ElectionBuilder from './pages/admin/ElectionBuilder';
import LiveResults from './pages/admin/LiveResults';
import VoterVerification from './pages/voter/Verification';
import VotingBooth from './pages/voter/VotingBooth';
import Confirmation from './pages/voter/Confirmation';

function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="create-election" element={<ElectionBuilder />} />
            <Route path="edit-election/:electionId" element={<ElectionBuilder />} />
            <Route path="live-results/:electionId" element={<LiveResults />} />
          </Route>
          
          {/* Voter routes */}
          <Route path="/voter" element={<ProtectedRoute role="voter" />}>
            <Route path="verify" element={<VoterVerification />} />
            <Route path="vote" element={<VotingBooth />} />
            <Route path="confirmation" element={<Confirmation />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ElectionProvider>
    </AuthProvider>
  );
}

export default App;