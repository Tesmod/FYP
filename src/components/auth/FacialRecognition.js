import React, { useRef, useState } from 'react';
import { Button, ProgressBar, Alert } from 'react-bootstrap';
import { FaCamera, FaCheckCircle } from 'react-icons/fa';

export default function FacialRecognition({ onVerificationSuccess }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, capturing, verifying, verified
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const startCamera = async () => {
    setStatus('capturing');
    setError('');
    
    try {
      // Simulate camera access
      // In a real app: 
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // videoRef.current.srcObject = stream;
      
      // For demo purposes, we'll simulate the camera
      setTimeout(() => {
        setStatus('capturing');
      }, 500);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      setStatus('idle');
      console.error("Camera error:", err);
    }
  };

  const captureFace = () => {
    setStatus('verifying');
    setError('');
    
    // Simulate verification process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('verified');
          onVerificationSuccess();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="facial-auth">
      <div className="text-center mb-4">
        <h3>Identity Verification</h3>
        <p className="text-muted">
          {status === 'idle' 
            ? 'Position your face in the frame and start camera' 
            : status === 'capturing' 
              ? 'Center your face and click verify' 
              : status === 'verifying' 
                ? 'Verifying your identity...' 
                : 'Identity verified successfully!'}
        </p>
      </div>
      
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <div className="camera-preview mb-4">
        {status !== 'idle' ? (
          <div className="border rounded bg-light position-relative" style={{ height: '300px' }}>
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="face-outline position-relative">
                <div className="scan-animation"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
            <div className="text-center text-muted">
              <FaCamera size={48} />
              <p className="mt-2">Camera inactive</p>
            </div>
          </div>
        )}
      </div>
      
      {status === 'verified' ? (
        <Alert variant="success" className="d-flex align-items-center">
          <FaCheckCircle className="me-2" size={24} />
          <span>Identity verified successfully!</span>
        </Alert>
      ) : (
        <>
          {status === 'verifying' && (
            <ProgressBar 
              now={progress} 
              label={`${progress}%`} 
              animated 
              variant="primary"
              className="mb-3"
            />
          )}
          
          <div className="d-grid gap-2">
            {status === 'idle' && (
              <Button variant="primary" onClick={startCamera} size="lg">
                Start Camera
              </Button>
            )}
            
            {status === 'capturing' && (
              <Button variant="success" onClick={captureFace} size="lg">
                Verify Identity
              </Button>
            )}
          </div>
        </>
      )}
      
      <div className="mt-4 text-center text-muted small">
        <p>
          Your facial data is encrypted and used solely for identity verification. 
          No biometric data is stored permanently after verification.
        </p>
      </div>
    </div>
  );
}