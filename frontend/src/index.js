import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { VideoContextProvider } from './context/VideoContext';
import { UserContextProvider } from './context/UserContext';
import { PlaylistContextProvider } from './context/PlaylistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <PlaylistContextProvider>
        <VideoContextProvider>
          <App />
        </VideoContextProvider>
      </PlaylistContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
