import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { VideoContextProvider } from './context/VideoContext';
import { UserContextProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <VideoContextProvider>
        <App />
      </VideoContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
