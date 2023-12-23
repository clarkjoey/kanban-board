import React from 'react';
import './App.css';
import KanbanBoard from './KanbanBoard';

function App() {
  return (
    <>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <img src="/flow-transparent-logo.png" width="64" height="auto" class="d-inline-block align-text-top" alt="App Logo" />
        </div>
      </nav>
      <div className="App">
        <KanbanBoard />
      </div>
    </>
  );
}

export default App;