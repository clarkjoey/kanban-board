import React, { useState } from 'react';

const initialData = {
  todo: {
    title: 'To Do',
    items: [
      { id: 'task-1', content: 'Eat Food' },
      { id: 'task-2', content: 'Commit to Git' },
      { id: 'task-3', content: 'Workout' },
    ],
  },
  inProgress: {
    title: 'In Progress',
    items: [],
  },
  done: {
    title: 'Done',
    items: [],
  },
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState(null);

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

  return (
    <div className="kanban-board">
      {Object.keys(data).map((columnId) => {
        const column = data[columnId];
        return (
          <div
            key={columnId}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId)}
          >
            <h2>{column.title}</h2>
            <div className="kanban-task-list">
              {column.items.map((item) => (
                <div
                  key={item.id}
                  className="kanban-task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnId)}
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