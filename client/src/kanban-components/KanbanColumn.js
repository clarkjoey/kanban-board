import React from 'react';
import KanbanColumnTitle from './KanbanColumnTitle';
import KanbanNewTask from './KanbanNewTask';
import KanbanTaskCard from './KanbanTaskCard';
import KanbanAddColumnButton from './KanbanAddColumnButton';

const KanbanColumn = ({ 
  data,
  draggedItem,
  newTaskText,
  editableCards,
  inputRef,
  userId,
  setData,
  setEditableColumnTitles,
  setNewTaskText,
  setDraggedItem,
  setEditableCards,
  handleDragOver,
  handleDrop,
  columnKey, 
  column, 
  isEditableTitle, 
  tasks,
  fetchColumns,
  fetchTasks
}) => {
  
  // <KanbanColumnTitle />
  const kanbanColumnTitleProps = {
    setData,
    setEditableColumnTitles,
    fetchColumns,
    userId,
    data,
    inputRef
  };

  // <KanbanNewTask />
  const kanbanNewTaskProps = {
    setNewTaskText,
    userId,
    fetchTasks,
    newTaskText
  };

  // <KanbanTaskCard />
  const kanbanTaskCardProps = {
    fetchTasks,
    setEditableCards,
    setData,
    setDraggedItem,
    data,
    tasks,
    editableCards
  };

  return (
    <>
      <div key={columnKey} className="kanban-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnKey)}>
        {/* column title - KanbanColumnTitle */}
        <KanbanColumnTitle columnKey={columnKey} column={column} isEditableTitle={isEditableTitle} {...kanbanColumnTitleProps}/>
        {/* new task input field - KanbanNewTask */}
        <KanbanNewTask columnKey={columnKey} column={column} {...kanbanNewTaskProps}/>
        {/* card container */}
        <KanbanTaskCard columnKey={columnKey} {...kanbanTaskCardProps}/>
      </div>
      {/* add column in-between columns */}
      <KanbanAddColumnButton columnKey={columnKey}/>
    </>
  );
};

export default KanbanColumn;