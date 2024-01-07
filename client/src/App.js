import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';
import KanbanBoard from './KanbanBoard';

function App() {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  // const { logout } = useAuth0();

  useEffect(() => {
    // Fetch the user ID after the user is authenticated
    fetch('/profile')
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setUserId(data.flowId); // Store the user ID in the state
      })
      .catch(error => console.error('Error fetching user profile:', error));
  }, []);

  useEffect(() => {
    // This will run whenever userId changes
    if (userId !== null) {
      console.log(`User ID is now set to: ${name}`);
    }
  }, [userId, name]);

  // function to help logout
  const resetSession = async () => {
    try {
      await fetch('/resetSession', {
        method: 'GET'
      });
      // logout({ logoutParams: { returnTo: window.location.origin } });
      // logout();
      await fetch('/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };  

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <img src="/flow-transparent-logo.png" width="64" height="auto" className="d-inline-block align-text-top" alt="App Logo" />
          <div className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {name}
            </div>  
            <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li className="dropdown-item" onClick={() => resetSession()}>Logout</li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="App">
        {userId && <KanbanBoard userId={userId} />}
      </div>
    </>
  );
}

export default App;