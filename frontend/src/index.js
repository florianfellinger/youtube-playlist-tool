import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { VideoContextProvider } from './context/VideoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <VideoContextProvider>
      <App />
    </VideoContextProvider>
  </React.StrictMode>
);
