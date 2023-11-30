import React, { useState } from 'react';

const initialData = {
  todo: {
    title: 'Do Today',
    items: [
      { id: 'task-1', name: 'Work', description: 'Make sure you get that demo done for Dell' },
      { id: 'task-2', name: 'Eat', description: 'Order Indian food with extra garlic naan' },
      { id: 'task-3', name: 'Sleep', description: 'Be in bed by 12am' },
    ],
    inputId: 'input-1',
  },
  inProgress: {
    title: 'Do This Week',
    items: [],
    inputId: 'input-2',
  },
  eventually: {
    title: 'Eventually',
    items: [],
    inputId: 'input-3',
  },
  done: {
    title: 'Follow Up On',
    items: [],
    inputId: 'input-4',
  },
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});
  const [editableCards, setEditableCards] = useState({}); // State to track editable cards

  // Function to handle the start of dragging a task
  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, columnId });
  };

  // Function to handle when a task is dragged into a column
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

  // Function to handle drag over (prevents default behavior)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle dropping a task into a column
  const handleDrop = (e, columnId) => {
    handleDragEnter(e, columnId);
  };

  // Function to handle changes in the input field for creating new tasks
  const handleNewTaskChange = (e, inputId) => {
    setNewTaskText({
      ...newTaskText,
      [inputId]: e.target.value,
    });
  };

  const handleCreateTask = (columnId, inputId) => {
    const taskText = newTaskText[inputId];
  
    if (!taskText || taskText.trim() === '') return; // Check if taskText is empty or undefined
  
    const newData = { ...data };
    const newTask = { id: `task-${Date.now()}`, name: taskText, description: "-" };
    newData[columnId].items.push(newTask);
    setData(newData);
  
    // Clear the input field
    setNewTaskText({
      ...newTaskText,
      [inputId]: '',
    });
  };

  // Function to toggle card editing mode
  const toggleEditCard = (columnId, itemId) => {
    const updatedEditableCards = { ...editableCards };
    updatedEditableCards[`${columnId}-${itemId}`] = !editableCards[`${columnId}-${itemId}`];
    setEditableCards(updatedEditableCards);
  };

  // Function to handle editing of task description
  const handleEditDescription = (e, columnId, itemId) => {
    const newData = { ...data };
    const editedDescription = e.target.value;
    const card = newData[columnId].items.find((item) => item.id === itemId);

    if (card) {
      card.description = editedDescription;
      setData(newData);
    }
  };

  // Function to delete a task
  const handleDeleteTask = (columnId, taskId) => {
    const newData = { ...data };
    const columnIndex = Object.keys(newData).findIndex((key) => key === columnId);

    if (columnIndex !== -1) {
      const taskIndex = newData[columnId].items.findIndex((item) => item.id === taskId);
      if (taskIndex !== -1) {
        newData[columnId].items.splice(taskIndex, 1);
        setData(newData);
      }
    }
  };

  return (
    <div className="kanban-board">
      {Object.keys(data).map((columnKey) => {
        const column = data[columnKey];
        return (
          <div key={columnKey} className="kanban-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnKey)}>
            {/* column title */}
            <h5 className="display-7">{column.title}</h5>
            {/* this is the input field */}
            <div className="kanban-new-task input-group input-group-sm mb-3">
              <input className='form-control' id={column.inputId} type="text" placeholder="Write a task name" value={newTaskText[column.inputId] || ''} onChange={(e) => handleNewTaskChange(e, column.inputId)}/>
              <div className="input-group-prepend">
                <button className="btn btn-outline-secondary" onClick={() => handleCreateTask(columnKey, column.inputId)}>
                  Create
                </button>
              </div>
            </div>
            {/* card container */}
            <div className="kanban-task-list">
              {column.items.map((item) => (
                // task card
                <div key={item.id} className="card" draggable onDragStart={(e) => handleDragStart(e, item, columnKey)}>
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    {editableCards[`${columnKey}-${item.id}`] ? (
                      // saving edits
                      <div>
                        <textarea className="card-text-area form-control" value={item.description} onChange={(e) => handleEditDescription(e, columnKey, item.id)}/>
                        <button className="btn btn-success" onClick={() => toggleEditCard(columnKey, item.id)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="card-text">{item.description}</p>
                        {!editableCards[`${columnKey}-${item.id}`] && (
                          // edit or delete card
                          <div className="button-container">
                            <button className="btn btn-secondary" onClick={() => toggleEditCard(columnKey, item.id)}>
                              Edit
                            </button>
                            <button className="btn btn-primary" onClick={() => handleDeleteTask(columnKey, item.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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