import React from "react";

const KanbanNewTask = ({
  newTaskText,
  handleNewTaskChange,
  handleCreateTask,
  columnKey,
  column,
}) => {
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
