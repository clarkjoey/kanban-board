import React, { useState } from 'react';

const initialData = {
  todo: {
    title: 'To Do',
    items: [
      { id: 'task-1', name: 'Work', description: 'Make sure you get that demo done for Dell' },
      { id: 'task-2', name: 'Eat', description: 'Order Indian food with extra garlic naan' },
      { id: 'task-3', name: 'Sleep', description: 'Be in bed by 12am' },
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
  const [editableCards, setEditableCards] = useState({}); // State to track editable cards

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
    const newTask = { id: `task-${Date.now()}`, name: newTaskText[inputId], description: "-" };
    newData[columnId].items.push(newTask);
    setData(newData);

    // Clear the input field
    setNewTaskText({
      ...newTaskText,
      [inputId]: '',
    });
  };

  const toggleEditCard = (columnId, itemId) => {
    const updatedEditableCards = { ...editableCards };
    updatedEditableCards[`${columnId}-${itemId}`] = !editableCards[`${columnId}-${itemId}`];
    setEditableCards(updatedEditableCards);
  };

  const handleEditDescription = (e, columnId, itemId) => {
    const newData = { ...data };
    const editedDescription = e.target.value;
    const card = newData[columnId].items.find((item) => item.id === itemId);

    if (card) {
      card.description = editedDescription;
      setData(newData);
    }
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
                  className="card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnKey)}
                >
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    {editableCards[`${columnKey}-${item.id}`] ? (
                      <div>
                        <textarea
                          className="card-text"
                          value={item.description}
                          onChange={(e) =>
                            handleEditDescription(e, columnKey, item.id)
                          }
                        />
                        <button
                          className="btn btn-success" // Change to "Save" button
                          onClick={() => toggleEditCard(columnKey, item.id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="card-text">{item.description}</p>
                        {!editableCards[`${columnKey}-${item.id}`] && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => toggleEditCard(columnKey, item.id)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                    <button className="btn btn-primary">Delete</button>
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
