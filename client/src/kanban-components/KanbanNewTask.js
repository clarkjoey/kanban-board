import React from "react";

const KanbanNewTask = ({
  handleReorderAllTasks,
  setNewTaskText,
  userId,
  fetchTasks,
  newTaskText,
  columnKey,
  column
}) => {

  // Function to handle creating a new task
  const handleCreateTask = async (columnKey, inputId) => {
    try {
      const name = newTaskText[inputId];
      const id = Date.now(); // Generate a unique task ID using epoch time
      const column = parseInt(columnKey)+1;
      const response = await fetch(`/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, column, userId }),
      });
      if (response.status === 200) {
        // Clear the input field
        setNewTaskText({ ...newTaskText, [inputId]: '' });
        handleReorderAllTasks(columnKey);
      } else {
        console.error('Error creating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  // Function to handle changes in the input field for creating new tasks
  const handleNewTaskChange = (e, inputId) => {
    setNewTaskText({
      ...newTaskText,
      [inputId]: e.target.value,
    });
  };

  return (
    <div className="kanban-new-task input-group input-group-sm mb-3">
      <input
        className="form-control"
        id={column.inputId}
        type="text"
        placeholder="Write a task name"
        value={newTaskText[column.inputId] || ""}
        onChange={(e) => handleNewTaskChange(e, column.inputId)}
      />
      <div className="input-group-prepend">
        <button
          className="btn btn-outline-secondary"
          onClick={() => handleCreateTask(columnKey, column.inputId)}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default KanbanNewTask;
