import React from "react";

const KanbanTaskCard = ({
  tasks,
  editableCards,
  handleDragStart,
  handleEditDescription,
  saveDescription,
  columnKey,
  editDescription,
  handleDeleteTask,
}) => {
  return (
    <div className="kanban-task-list">
      {tasks.map((item) => (
        // task card
        <div
          key={item.id}
          className="card"
          draggable
          onDragStart={(e) => handleDragStart(e, item, columnKey)}
        >
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            {editableCards[`${columnKey}-${item.id}`] ? (
              // saving edits
              <div>
                <textarea
                  className="card-text-area form-control"
                  value={item.description}
                  onChange={(e) => handleEditDescription(e, item.id)}
                />
                <button
                  className="btn btn-success"
                  onClick={() => saveDescription(columnKey, item.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p className="card-text">{item.description}</p>
                {!editableCards[`${columnKey}-${item.id}`] && (
                  // edit or delete card
                  <div className="button-container">
                    <button
                      className="btn btn-secondary"
                      onClick={() => editDescription(columnKey, item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDeleteTask(columnKey, item.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanTaskCard;
