import React, { useState, useRef, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import KanbanAddColumnButtonEnd from './KanbanAddColumnButtonEnd';

const KanbanBoard = (props) => {
  const [data, setData] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});
  const [editableCards, setEditableCards] = useState('');
  const [editableColumnTitles, setEditableColumnTitles] = useState({});
  const inputRef = useRef(null);
  const { userId } = props; // current logged in user


  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/${userId}/tasks`);
      const tasksData = await response.json();
      setData((prevData) => ({ ...prevData, tasks: tasksData }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  // Function to fetch columns from the server
  const fetchColumns = async () => {
    try {
      const response = await fetch(`/${userId}/columns`);
      const columnsData = await response.json();
      setData((prevData) => ({ ...prevData, columns: columnsData }));
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

  // Uncomment this to watch the data state for debugging
  // Log data when it changes
  useEffect(() => {
    console.log('Updated data:', data);
  }, [data]);

  // // Function to handle when a task is dragged into a column
  // const handleDragEnter = (e, columnId) => {
  //   if (draggedItem) {
  //     const { item, columnId: sourceColumnId } = draggedItem;
    
  //     // Send a POST request to move the task to the destination column
  //     moveTaskToColumn(item.name, item.id, (parseInt(columnId)+1));

  //     setDraggedItem(null);
  //   }
  // };

  // // Function to handle drag over (prevents default behavior)
  // const handleDragOver = (e) => {
  //   e.preventDefault();
  // };
  
  // // Function to handle dropping a task into a column
  // const handleDrop = (e, columnId) => {
  //   handleDragEnter(e, columnId);
  // };

  // // Function to move a task to a different column
  // const moveTaskToColumn = async (taskName, taskId, destinationColumnId) => {
  //   try {
  //     const response = await fetch('/tasks/column', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name: taskName,
  //         id: taskId,
  //         column: destinationColumnId,
  //       }),
  //     });

  //     if (response.status === 200) {
  //       // Fetch tasks again to reload all tasks into the columns
  //       fetchTasks();
  //     } else {
  //       // Handle errors if necessary
  //     }
  //   } catch (error) {
  //     console.error('Error moving task to column:', error);
  //   }
  // };

  // Function to add a column
  const handleAddColumn = async () => {
    try {
      const id = Date.now(); // Generate a unique ID using epoch time
      let columnIndex = 1;
      if (data.columns.length !== 0) {
        columnIndex = data.columns[data.columns.length-1].column+1;
      }
      const column = columnIndex; // The next column in the sequence
      const inputId = `input-${columnIndex}`;

      const response = await fetch(`/columns/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, column, inputId, userId }),
      });

      if (response.status === 200) {
        // Fetch columns again to reload all tasks into the columns
        fetchColumns();
      } else {
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // <KanbanColumns />
  const kanbanColumnProps = {
    data,
    newTaskText,
    editableCards,
    inputRef,
    userId,
    draggedItem,
    setData,
    setEditableColumnTitles,
    setNewTaskText,
    setDraggedItem,
    setEditableCards,
    fetchColumns: fetchColumns,
    fetchTasks: fetchTasks,
  };

  return (
    <div className="kanban-board">
      {data && data.columns && data.tasks && Object.keys(data.columns).map((columnKey) => {
        const column = data.columns[columnKey];
        const isEditableTitle = editableColumnTitles[columnKey];
        const tasks = data.tasks.filter((task) => task.column === column.column);
  
        return (
          /* add column */
          <KanbanColumn columnKey={columnKey} column={column} isEditableTitle={isEditableTitle} tasks={tasks} {...kanbanColumnProps}/>
        );
      })}
      {/* button to add column at the end */}
      <KanbanAddColumnButtonEnd {...{handleAddColumn:handleAddColumn}}/>
    </div>
  );  
};

export default KanbanBoard;