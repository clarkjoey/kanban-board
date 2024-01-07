import React from "react";
import "./App.css";
import "./Login.css"
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div className="login-screen">
        <div className="login-container">
          <img
            src="/flow-transparent-logo.png"
            alt="App Logo"
            className="app-logo"
          />
          <h5 className="welcome-text">Welcome to flow!</h5>
          <div className="login-button-container">
            <button type="button" className="btn btn-outline-dark login-button" onClick={() => loginWithRedirect()}>Login</button>
          </div>
        </div>
      </div>
    )
  );
}

export default Login;