import React, { useState, useRef, useEffect } from 'react';

const KanbanBoard = () => {
  const [data, setData] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});
  const [editableCards, setEditableCards] = useState('');
  const [editableColumnTitles, setEditableColumnTitles] = useState({});
  const inputRef = useRef(null); // Ref for the input field

  
  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks');
      const tasksData = await response.json();
      setData((prevData) => ({ ...prevData, tasks: tasksData }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  
  // Function to fetch columns from the server
  const fetchColumns = async () => {
    try {
      const columnsResponse = await fetch('/columns');
      const columnsData = await columnsResponse.json();
      setData((prevData) => ({ columns: columnsData, ...prevData }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  
  // Load data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchColumns();
        fetchTasks();
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    };

    fetchData();
  }, []);

  // // FOR DEBUGGING
  // // Log data when it changes
  // useEffect(() => {
  //   console.log('Updated data:', data);
  // }, [data]);

  
  // Function to handle the start of dragging a task
  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, columnId });
  };

  
  // Function to handle when a task is dragged into a column
  const handleDragEnter = (e, columnId) => {
    if (draggedItem) {
      const { item, columnId: sourceColumnId } = draggedItem;
      
      // Send a POST request to move the task to the destination column
      moveTaskToColumn(item.name, item.id, (parseInt(columnId)+1));

      setDraggedItem(null);
    }
  };

  
  // Function to handle drag over (prevents default behavior)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  
  // Function to handle dropping a task into a column
  const handleDrop = (e, columnId) => {
    handleDragEnter(e, columnId);
  };

  
  // Function to move a task to a different column
  const moveTaskToColumn = async (taskName, taskId, destinationColumnId) => {
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
        // Fetch tasks again to reload all tasks into the columns
        fetchTasks();
      } else {
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error moving task to column:', error);
    }
  };

  
  // Function to handle changes in the input field for creating new tasks
  const handleNewTaskChange = (e, inputId) => {
    setNewTaskText({
      ...newTaskText,
      [inputId]: e.target.value,
    });
  };

  
  // Function to handle creating a new task
  const handleCreateTask = async (columnKey, inputId) => {
    try {
      const name = newTaskText[inputId];
      const id = Date.now(); // Generate a unique ID using epoch time
      const column = parseInt(columnKey)+1;

      const response = await fetch('/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, column }),
      });

      if (response.status === 200) {
        // Clear the input field
        setNewTaskText({ ...newTaskText, [inputId]: '' });

        // Fetch tasks again to reload all tasks into the columns
        fetchTasks();
      } else {
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error creating task:', error);
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

      // Send a POST request to update the card's description
      const response = await fetch(`/tasks/description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId, description: editedDescription }),
      });

      if (response.status === 200) {
        // Call fetchTasks after a successful response to update the data state
        fetchTasks();
      } else {
        // Handle errors if necessary
        console.error('Error updating card description:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating card description:', error);
    }
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

  
  // Function to delete a task
  const handleDeleteTask = async (columnId, taskId) => {
    try {
      // Send a GET request to the server to delete the task by its ID
      const response = await fetch(`/tasks/remove/${taskId}`, {
        method: 'DELETE',
      });
  
      if (response.status === 200) {
        // Fetch tasks again to reload all tasks into the columns
        fetchTasks();
      } else {
        // Handle errors if necessary
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  
  // Function to toggle column title editing mode
  const toggleEditColumnTitle = async (columnId) => {
    // Check if inputRef exists before trying to focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  
    try {
      const newTitle = data.columns[columnId].title;
      const column = parseInt(columnId)+1;
  
      // Send a POST request to update the column's title
      const response = await fetch('/columns/title', {
        method: 'POST', // Use POST to update the title
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columnId: column, newTitle }),
      });
  
      if (response.status === 200) {
        fetchColumns();
        // Toggle the edit mode for the column title
        setEditableColumnTitles((prevEditable) => ({
          ...prevEditable,
          [columnId]: !prevEditable[columnId],
        }));
      } else {
        // Handle errors if necessary
        console.error('Error updating column title:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating column title:', error);
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

  
  // Function to handle keydown events in the input field
  const handleInputKeyDown = (e, columnId) => {
    if (e.key === 'Enter') {
      toggleEditColumnTitle(columnId);
    }
  };

  return (
    <div className="kanban-board">
      {data && data.columns && data.tasks && Object.keys(data.columns).map((columnKey) => {
        const column = data.columns[columnKey];
        const isEditableTitle = editableColumnTitles[columnKey];
        const tasks = data.tasks.filter((task) => task.column === column.column);
  
        return (
          <div key={columnKey} className="kanban-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnKey)}>
            {/* column title */}
            <h5 className={`display-7 ${isEditableTitle ? 'editable' : ''}`} onClick={() => toggleEditColumnTitle(columnKey)}>
              {isEditableTitle ? (
                <input
                  type="text"
                  value={column.title}
                  onChange={(e) => handleEditColumnTitle(e, columnKey)}
                  onKeyDown={(e) => handleInputKeyDown(e, columnKey)}
                  onBlur={() => toggleEditColumnTitle(columnKey)}
                  onClick={(e) => e.stopPropagation()}
                  ref={inputRef}
                />
              ) : (
                column.title
              )}
            </h5>
            {/* this is the input field */}
            <div className="kanban-new-task input-group input-group-sm mb-3">
              <input className='form-control' id={column.inputId} type="text" placeholder="Write a task name" value={newTaskText[column.inputId] || ''} onChange={(e) => handleNewTaskChange(e, column.inputId)}/>
              <div className="input-group-prepend">
                <button className="btn btn-outline-secondary" onClick={() => handleCreateTask(columnKey, column.inputId)}>
                  Create
                </button>
              </div>
            </div>
            {/* card container */}
            <div className="kanban-task-list">
              {tasks.map((item) => (
                // task card
                <div key={item.id} className="card" draggable onDragStart={(e) => handleDragStart(e, item, columnKey)}>
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    {editableCards[`${columnKey}-${item.id}`] ? (
                      // saving edits
                      <div>
                        <textarea className="card-text-area form-control" value={item.description} onChange={(e) => handleEditDescription(e, item.id)}/>
                        <button className="btn btn-success" onClick={() => saveDescription(columnKey, item.id)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="card-text">{item.description}</p>
                        {!editableCards[`${columnKey}-${item.id}`] && (
                          // edit or delete card
                          <div className="button-container">
                            <button className="btn btn-secondary" onClick={() => editDescription(columnKey, item.id)}>
                              Edit
                            </button>
                            <button className="btn btn-primary" onClick={() => handleDeleteTask(columnKey, item.id)}>
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
          </div>
        );
      })}
    </div>
  );  
};

export default KanbanBoard;