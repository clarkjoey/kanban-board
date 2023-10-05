import React, { useState } from 'react';

const initialData = {
  todo: {
    title: 'To Do',
    items: [
      { id: 'task-1', content: 'Task 1' },
      { id: 'task-2', content: 'Task 2' },
      { id: 'task-3', content: 'Task 3' },
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

  return (
    <div className="kanban-board">
      {Object.keys(data).map((columnId) => {
        const column = data[columnId];
        return (
          <div key={columnId} className="kanban-column">
            <h2>{column.title}</h2>
            <div
              onDragEnter={(e) => handleDragEnter(e, columnId)}
              className="kanban-task-list"
            >
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