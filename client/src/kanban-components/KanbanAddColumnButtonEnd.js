import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const KanbanAddColumnButtonEnd = ({ handleAddColumn }) => {
  return (
    <div className="add-column-container-end">
      <button
        className="btn btn-primary ml-2 add-column-button column-button-end"
        onClick={() => handleAddColumn()}
      >
        <h5 className="display-7" style={{ margin: "0px" }}>
          Add stage
        </h5>
        <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />
      </button>
    </div>
  );
};

export default KanbanAddColumnButtonEnd;
