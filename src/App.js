import React, { useState } from 'react';
import './App.css';

const initialTasks = {
  todo: [
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
  ],
  inProgress: [],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleTaskAdd = (column) => {
    if (newTask.trim() === '') return;
    const newTaskObj = { id: Date.now(), text: newTask };
    setTasks((prevState) => ({
      ...prevState,
      [column]: [...prevState[column], newTaskObj],
    }));
    setNewTask('');
  };

  const handleTaskDelete = (column, taskId) => {
    setTasks((prevState) => ({
      ...prevState,
      [column]: prevState[column].filter((task) => task.id !== taskId),
    }));
  };

  const handleTaskMove = (taskId, fromColumn, toColumn) => {
    const taskToMove = tasks[fromColumn].find((task) => task.id === taskId);
    if (taskToMove) {
      setTasks((prevState) => ({
        ...prevState,
        [fromColumn]: prevState[fromColumn].filter((task) => task.id !== taskId),
        [toColumn]: [...prevState[toColumn], taskToMove],
      }));
    }
  };

  return (
    <div className="App">
      <div className="KanbanBoard">
        <div className="Column">
          <h3>To Do</h3>
          <ul>
            {tasks.todo.map((task) => (
              <li key={task.id}>
                {task.text}
                <button onClick={() => handleTaskDelete('todo', task.id)}>Delete</button>
                <button onClick={() => handleTaskMove(task.id, 'todo', 'inProgress')}>Start</button>
              </li>
            ))}
          </ul>
          <input type="text" value={newTask} onChange={handleTaskChange} />
          <button onClick={() => handleTaskAdd('todo')}>Add Task</button>
        </div>
        <div className="Column">
          <h3>In Progress</h3>
          <ul>
            {tasks.inProgress.map((task) => (
              <li key={task.id}>
                {task.text}
                <button onClick={() => handleTaskDelete('inProgress', task.id)}>Delete</button>
                <button onClick={() => handleTaskMove(task.id, 'inProgress', 'done')}>Complete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="Column">
          <h3>Done</h3>
          <ul>
            {tasks.done.map((task) => (
              <li key={task.id}>
                {task.text}
                <button onClick={() => handleTaskDelete('done', task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;