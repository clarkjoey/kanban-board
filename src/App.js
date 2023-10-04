import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = {
  todo: [
    { id: '1', text: 'Go to the Gym' },
    { id: '2', text: 'Eat Dinner' },
  ],
  inProgress: [
    { id: '3', text: 'Finish Kanban' }
  ],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleTaskAdd = () => {
    if (newTask.trim() === '') return;
    const newTaskObj = { id: Date.now().toString(), text: newTask };
    setTasks((prevState) => ({
      ...prevState,
      todo: [...prevState.todo, newTaskObj],
    }));
    setNewTask('');
  };

  const handleTaskDelete = (column, taskId) => {
    setTasks((prevState) => ({
      ...prevState,
      [column]: prevState[column].filter((task) => task.id !== taskId),
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const updatedTasks = [...tasks[source.droppableId]];
      const [removedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: updatedTasks,
      });
    } else {
      const sourceList = [...tasks[source.droppableId]];
      const destinationList = [...tasks[destination.droppableId]];

      const [movedTask] = sourceList.splice(source.index, 1);
      destinationList.splice(destination.index, 0, movedTask);

      setTasks((prevState) => ({
        ...prevState,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destinationList,
      }));
    }
  };

  return (
    <div className="App">
      <div className="KanbanBoard">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(initialTasks).map((columnId) => (
            <div className="Column" key={columnId}>
              <h3>{columnId}</h3>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tasks[columnId].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {task.text}
                            <button
                              onClick={() =>
                                handleTaskDelete(columnId, task.id)
                              }
                            >
                              Delete
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
              {columnId === 'todo' && (
                <div className="AddTask">
                  <input
                    type="text"
                    value={newTask}
                    onChange={handleTaskChange}
                  />
                  <button onClick={handleTaskAdd}>
                    Add Task
                  </button>
                </div>
              )}
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;