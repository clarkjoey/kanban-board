import React, { useState } from 'react';

const initialData = {
  todo: {
    title: 'To Do',
    items: [
      { id: 'task-1', content: 'Work' },
      { id: 'task-2', content: 'Eat' },
      { id: 'task-3', content: 'Sleep' },
    ],
    inputId: 'input-1',
  },
  inProgress: {
    title: 'In Progress',
    items: [],
    inputId: 'input-2',
  },
  done: {
    title: 'Done',
    items: [],
    inputId: 'input-3',
  },
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});

  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, columnId });
  };

  const handleDragEnter = (e, columnId) => {
    if (draggedItem) {
      const newData = { ...data };
      const { item, columnId: sourceColumnId } = draggedItem;

      // Remove the item from the source column
      const sourceColumn = newData[sourceColumnId];
      const sourceIndex = sourceColumn.items.findIndex(
        (i) => i.id === item.id
      );
      if (sourceIndex !== -1) {
        sourceColumn.items.splice(sourceIndex, 1);

        // Add the item to the destination column
        const destColumn = newData[columnId];
        destColumn.items.push(item);

        setData(newData);
      }

      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    handleDragEnter(e, columnId);
  };

  const handleNewTaskChange = (e, inputId) => {
    setNewTaskText({
      ...newTaskText,
      [inputId]: e.target.value,
    });
  };

  const handleCreateTask = (columnId, inputId) => {
    if (newTaskText[inputId].trim() === '') return;

    const newData = { ...data };
    const newTask = { id: `task-${Date.now()}`, content: newTaskText[inputId] };
    newData[columnId].items.push(newTask);
    setData(newData);

    // Clear the input field
    setNewTaskText({
      ...newTaskText,
      [inputId]: '',
    });
  };

  return (
    <div className="kanban-board">
      {Object.keys(data).map((columnKey) => {
        const column = data[columnKey];
        return (
          <div
            key={columnKey}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnKey)}
          >
            <h2>{column.title}</h2>
            <div className="kanban-new-task">
              <input
                id={column.inputId}
                type="text"
                placeholder="New task..."
                value={newTaskText[column.inputId] || ''}
                onChange={(e) => handleNewTaskChange(e, column.inputId)}
              />
              <button
                onClick={() => handleCreateTask(columnKey, column.inputId)}
              >
                Create
              </button>
            </div>
            <div className="kanban-task-list">
              {column.items.map((item) => (
                <div
                  key={item.id}
                  className="kanban-task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnKey)}
                >
                  {item.content}
                </div>
              ))}
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
