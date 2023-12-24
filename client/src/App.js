import React, { useState, useEffect } from 'react';
import './App.css';
import KanbanBoard from './KanbanBoard';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the user ID after the user is authenticated
    fetch('/profile')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUserId(data.flowId); // Store the user ID in the state
      })
      .catch(error => console.error('Error fetching user profile:', error));
  }, []);

  useEffect(() => {
    // This will run whenever userId changes
    if (userId !== null) {
      console.log(`User ID is now set to: ${userId}`);
    }
  }, [userId]);

  return (
    <>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <img src="/flow-transparent-logo.png" width="64" height="auto" class="d-inline-block align-text-top" alt="App Logo" />
        </div>
      </nav>
      <div className="App">
        {userId && <KanbanBoard userId={userId} />}
      </div>
    </>
  );
}

export default App;