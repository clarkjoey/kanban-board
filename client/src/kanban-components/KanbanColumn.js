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
  editableColumnTitles,
  inputRef,
  userId,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleNewTaskChange,
  handleCreateTask,
  editDescription,
  saveDescription,
  handleEditDescription,
  handleDeleteTask,
  toggleEditColumnTitle,
  handleEditColumnTitle,
  handleInputKeyDown,
  handleDeleteColumn,
  columnKey, 
  column, 
  isEditableTitle, 
  tasks
}) => {
  // for the column title
  const kanbanColumnTitleProps = {
    inputRef,
    toggleEditColumnTitle: toggleEditColumnTitle,
    handleEditColumnTitle: handleEditColumnTitle,
    handleInputKeyDown: handleInputKeyDown,
    handleDeleteColumn: handleDeleteColumn
  };

  // for the new task
  const kanbanNewTaskProps = {
    newTaskText,
    handleNewTaskChange: handleNewTaskChange,
    handleCreateTask: handleCreateTask,
  };

  // for the task cards
  const kanbanTaskCardProps = {
    tasks,
    editableCards,
    handleDragStart: handleDragStart,
    handleEditDescription: handleEditDescription,
    saveDescription: saveDescription,
    editDescription: editDescription,
    handleDeleteTask: handleDeleteTask,
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