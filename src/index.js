import React from 'react';
import ReactDOM from 'react-dom/client';
// import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ElectionProvider } from './contexts/ElectionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <AuthProvider> */}
      <ElectionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ElectionProvider>
    {/* </AuthProvider> */}
  </React.StrictMode>
);