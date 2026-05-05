import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './index.css';
import '@neondatabase/neon-js/ui/css';

import { BrowserRouter } from 'react-router-dom';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from './libs/auth.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NeonAuthUIProvider
      emailOTP={true}
      authClient={authClient}
      social={{
        providers: ['google']
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>,
)
