import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-42nhciwkn0dhfls6.us.auth0.com"
      clientId="asAVtpimRJQZGxnytykHRyBkhD2iofbu"
      authorizationParams={{
        redirect_uri: "https://flowdaily.app"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);

reportWebVitals();