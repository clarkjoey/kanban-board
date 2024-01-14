import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const KanbanAddColumnButton = ({
  columnKey
}) => {
  return (
    <div className="add-column-container">
      <button className="btn btn-primary ml-2 add-column-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default KanbanAddColumnButton;