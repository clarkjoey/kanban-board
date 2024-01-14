import React from "react";

const KanbanColumnTitleInput = ({
  data,
  setData,
  inputRef,
  toggleEditColumnTitle,
  columnKey,
  column
}) => {

  // Function to handle keydown events in the input field
  const handleInputKeyDown = (e, columnId) => {
    if (e.key === 'Enter') {
      toggleEditColumnTitle(columnId);
    }
  };

  // Function to handle editing and saving column titles
  const handleEditColumnTitle = (e, columnId) => {
    const newData = [ ...data.columns ];
    const editedTitle = e.target.value;
    const column = newData[columnId];
    if (column) {
      column.title = editedTitle;
      setData((prevData) => ({ columns: newData, ...prevData  }));
    }
  };

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