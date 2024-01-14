import React from "react";

const KanbanTaskCard = ({
  fetchTasks,
  setEditableCards,
  setData,
  setDraggedItem,
  data,
  tasks,
  editableCards,
  columnKey,
}) => {

  // Function to handle the start of dragging a task
  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, columnId });
  };

  // Function to handle editing of task description
  const handleEditDescription = (e, itemId) => {
    const newData = [ ...data.tasks ];
    const editedDescription = e.target.value;
    const card = newData.find((item) => item.id === itemId);
    if (card) {
      card.description = editedDescription;
      setData((prevData) => ({ ...prevData, tasks: newData }));
    }
  };

  // Function to toggle card editing mode
  const editDescription = (columnId, itemId) => {
    const updatedEditableCards = { ...editableCards };
    updatedEditableCards[`${columnId}-${itemId}`] = !editableCards[`${columnId}-${itemId}`];
    setEditableCards(updatedEditableCards);
  };

  // Function to save edited description
  const saveDescription = async (columnId, itemId) => {
    try {
      const updatedEditableCards = { ...editableCards };
      updatedEditableCards[`${columnId}-${itemId}`] = !editableCards[`${columnId}-${itemId}`];
      setEditableCards(updatedEditableCards);
      // Get the edited description from the data state
      const editedDescription = data.tasks.find((item) => item.id === itemId)?.description;
      // update the card's description
      const response = await fetch(`/tasks/description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId, description: editedDescription }),
      });
      if (response.status === 200) {
        fetchTasks();
      } else {
        console.error('Error updating card description:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating card description:', error);
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (columnId, taskId) => {
    try {
      const response = await fetch(`/tasks/remove/${taskId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        fetchTasks();
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
