import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import KanbanBoard from './kanban-components/KanbanBoard';
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [userId, setUserId] = useState(null);
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    // This will when we are authenticated
    if (isAuthenticated) {
      handleLogin(user);
    } 
  }, [isAuthenticated, user]);

  const handleLogin = async (userData) => {
    try {
      const response = await fetch('/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 200) {
        const responseBody = await response.json();
        setUserId(responseBody.flowId);
      } else {
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  return (
    <>
      {isAuthenticated && (<nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <img src="/flow-transparent-logo.png" width="64" height="auto" className="d-inline-block align-text-top" alt="App Logo" />
          <div className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <Profile /> 
            </div>  
            <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li className="dropdown-item"><Logout/></li>
            </ul>
          </div>
        </div>
      </nav>)}
      <Login />
      <div className="App">
        {userId && <KanbanBoard userId={userId} />}
      </div>
    </>
  );
}

export default App;