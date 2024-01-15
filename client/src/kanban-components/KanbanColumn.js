import React from 'react';
import KanbanColumnTitle from './KanbanColumnTitle';
import KanbanNewTask from './KanbanNewTask';
import KanbanTaskCard from './KanbanTaskCard';
import KanbanAddColumnButton from './KanbanAddColumnButton';

const KanbanColumn = ({ 
  data,
  newTaskText,
  editableCards,
  inputRef,
  userId,
  draggedItem,
  setData,
  setEditableColumnTitles, // Shortened prop name
  setNewTaskText,
  setDraggedItem,
  setEditableCards,
  columnKey, 
  column, 
  isEditableTitle, 
  tasks,
  fetchColumns,
  fetchTasks
}) => {

  // Function to handle drag over (prevents default behavior)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to reorder all the tasks in a column
  const handleReorderAllTasks = async (columnIndex) => {
    try {
      const columnPosition = parseInt(columnIndex)+1;
      const response = await fetch(`/${userId}/${columnPosition}/tasks/reorder-all-tasks`, {
        method: 'GET',
      });
      if (response.status === 200) {
        // reload all tasks into the columns
        fetchTasks();
      } else {
        console.error('Error creating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  return (
    <>
      <div key={columnKey} className="kanban-column" onDragOver={handleDragOver}>
        {/* column title - KanbanColumnTitle */}
        <KanbanColumnTitle {...{ data, setData, setEditableColumnTitles, fetchColumns, userId, inputRef, columnKey, column, isEditableTitle }} />
        {/* new task input field - KanbanNewTask */}
        <KanbanNewTask {...{ setNewTaskText, userId, fetchTasks, newTaskText, columnKey, column, handleReorderAllTasks }} />
        {/* card container */}
        <KanbanTaskCard {...{ fetchTasks, setEditableCards, setData, setDraggedItem, data, tasks, editableCards, columnKey, handleReorderAllTasks, userId, draggedItem }} />
      </div>
      {/* button to add column in-between columns */}
      <KanbanAddColumnButton columnKey={columnKey} />
    </>
  );
};

export default KanbanColumn;