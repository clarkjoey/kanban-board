import React from "react";

const KanbanTaskCard = ({
  draggedItem,
  userId,
  handleReorderAllTasks,
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

  // Reset the drop areas on mouse release
  const handleDragEnd = (e) => {
    setDraggedItem(null);
  }

  // Function to handle mouseover on a task or drop area
  const handleMouseEnter = (e) => {
    // e.target.style.height = "20px";
  };

  // Function to handle mouseleave
  const handleMouseLeave = (e) => {
    // e.target.style.height = "10px";
  };

  // Function to handle when a task is dragged into a column
  const handleDragEnter = (e, columnId, order) => {
    if (draggedItem) {
      const { item, columnId: sourceColumnId } = draggedItem;
      // Send a POST request to move the task to the destination column
      moveTaskToColumn(e, item.name, item.id, (parseInt(columnId)+1), sourceColumnId, order);

      setDraggedItem(null);
    }
  };

  // Function to move a task to a different column
  const moveTaskToColumn = async (e, taskName, taskId, destinationColumnId, sourceColumnId, order) => {
    try {
      const response = await fetch('/tasks/column', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          id: taskId,
          column: destinationColumnId,
        }),
      });

      if (response.status === 200) {
        let position = 999; // make sure it goes to the end
        console.log(e);
        if (order) position = order; // set to order if defined
        console.log("position", position);
        // handleReorderAllTasks(sourceColumnId); // reorder origin column
        handleReorderTask(taskId, position, destinationColumnId-1, sourceColumnId);
      } else {
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error moving task to column:', error);
    }
  };

  // Function to reorder all the tasks in a column
  const handleReorderTask = async (taskId, order, columnIndex, sourceColumnId) => {
    try {
      const response = await fetch(`/${userId}/${taskId}/${order}/tasks/reorder-task`, {
        method: 'GET',
      });
      if (response.status === 200) {
        // reload all tasks into the columns
        handleReorderAllTasks(columnIndex);
        handleReorderAllTasks(sourceColumnId);
      } else {
        console.error('Error creating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  // Function to handle dropping a task into a column
  const handleDrop = (e, columnId, order) => {
    // document.querySelectorAll(".drop-area-child").forEach(e => e.style.visibility = "hidden"); // remove the drop areas again
    setTimeout(()=>{
      console.log("order", order);
      handleDragEnter(e, columnId, order);
    }, 100);
  };

  // Function to handle dropping a task into a column
  const handleDropEnd = (e, columnId) => {
    // document.querySelectorAll(".drop-area-child").forEach(e => e.style.visibility = "hidden"); // remove the drop areas again
    console.log("End");
    handleDragEnter(e, columnId);
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
      const response = await fetch(`/${userId}/${taskId}/tasks/delete-task`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        handleReorderAllTasks(columnKey);
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="kanban-task-list" onDrop={(e) => handleDropEnd(e, columnKey)}>
      {tasks.map((item) => (
        <>
          {/* drop area */}
          {/* {draggedItem && ( */}
            <div 
              className="drop-area"
              key={item.order-0.5}
              onMouseEnter={(e) => handleMouseEnter(e)}
              onMouseLeave={(e) => handleMouseLeave(e)}
              onDrop={(e) => handleDrop(e, columnKey, item.order-0.5)}
            >
              {/* <div 
                key={item.order-0.5}
                className="drop-area-child"
                onMouseEnter={(e) => handleMouseEnter(e)}
                onMouseLeave={(e) => handleMouseLeave(e)}
                onDrop={(e) => handleDrop(e, columnKey, item.order-0.5)}
              >
              </div> */}
            </div>
          {/* )} */}
          {/* card */}
          <div
            key={item.id}
            className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, item, columnKey)}
            onDragEnd={(e) => handleDragEnd(e)}
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
        </>
      ))}
    </div>
  );
};

export default KanbanTaskCard;
