import React from "react";

const KanbanColumnTitleInput = ({
  inputRef,
  toggleEditColumnTitle,
  handleEditColumnTitle,
  handleInputKeyDown,
  columnKey,
  column
}) => {
  return (
    <input
      type="text"
      value={column.title}
      onChange={(e) => handleEditColumnTitle(e, columnKey)}
      onKeyDown={(e) => handleInputKeyDown(e, columnKey)}
      onBlur={() => toggleEditColumnTitle(columnKey)}
      onClick={(e) => e.stopPropagation()}
      ref={inputRef}
    />
  );
};

export default KanbanColumnTitleInput;