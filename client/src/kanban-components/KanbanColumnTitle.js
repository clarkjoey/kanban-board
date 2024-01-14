import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import KanbanColumnTitleInput from "./KanbanColumnTitleInput";

const KanbanColumnTitle = ({
  inputRef,
  toggleEditColumnTitle,
  handleEditColumnTitle,
  handleInputKeyDown,
  handleDeleteColumn,
  columnKey,
  column,
  isEditableTitle,
}) => {
  // for changing title input field
  const kanbanColumnTitleInputProps = {
    inputRef,
    toggleEditColumnTitle: toggleEditColumnTitle,
    handleEditColumnTitle: handleEditColumnTitle,
    handleInputKeyDown: handleInputKeyDown,
  };

  return (
    <div className="kanban-column-title">
      <h5
        className={`display-7 ${isEditableTitle ? "editable" : ""}`}
        onClick={() => toggleEditColumnTitle(columnKey)}
      >
        {isEditableTitle ? (
          /* change title input field - KanbanColumnTitleInput */
          <KanbanColumnTitleInput columnKey={columnKey} column={column} {...kanbanColumnTitleInputProps}/>
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