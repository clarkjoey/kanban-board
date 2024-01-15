import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import KanbanColumnTitleInput from "./KanbanColumnTitleInput";

const KanbanColumnTitle = ({
  data,
  setData,
  setEditableColumnTitles,
  fetchColumns,
  userId,
  inputRef,
  columnKey,
  column,
  isEditableTitle
}) => {
  
  // Function to toggle column title editing mode
  const toggleEditColumnTitle = async (columnIndex) => {
    // Check if inputRef exists before trying to focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
    try {
      const newTitle = data.columns[columnIndex].title;
      const columnId = data.columns[columnIndex].id;
      const column = parseInt(columnIndex)+1;
      // update the column's title
      const response = await fetch('/columns/title', {
        method: 'POST', // Use POST to update the title
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, columnId, columnIndex: column, newTitle }),
      });
      if (response.status === 200) {
        fetchColumns();
        // toggle the edit mode
        setEditableColumnTitles((prevEditable) => ({
          ...prevEditable,
          [columnIndex]: !prevEditable[columnIndex],
        }));
      } else {
        console.error('Error updating column title:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating column title:', error);
    }
  };

  // Function to delete a column
  const handleDeleteColumn = async (columnId) => {
    try {
      const response = await fetch(`/${userId}/${columnId}/columns/delete-column`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        // reset column order on the backend - handles case where a column that's not at the end gets deleted
        handleReorderColumns();
      } else {
        console.error('Error deleting column:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  // Function to reorder the columns so there are no empty indexes
  const handleReorderColumns = async () => {
    try {
      const response = await fetch(`/${userId}/columns/reorder-all-columns`, {
        method: 'GET',
      });
      if (response.status === 200) {
        // show reset columns on frontend
        fetchColumns();
      } else {
        console.error('Error reordering columns:', response.statusText);
      }
    } catch (error) {
      console.error('Error reordering columns:', error);
    }
  }

  return (
    <div className="kanban-column-title">
      <h5
        className={`display-7 ${isEditableTitle ? "editable" : ""}`}
        onClick={() => toggleEditColumnTitle(columnKey)}
      >
        {isEditableTitle ? (
          /* change title input field - KanbanColumnTitleInput */
          <KanbanColumnTitleInput {...{ data, setData, inputRef, toggleEditColumnTitle, columnKey, column }}/>
        ) : (
          column.title
        )}
      </h5>
      <button
        className="btn btn-danger ml-2"
        onClick={() => handleDeleteColumn(column.id)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default KanbanColumnTitle;