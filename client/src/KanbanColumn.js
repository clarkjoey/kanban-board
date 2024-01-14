import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const KanbanColumn = ({ 
  data,
  draggedItem,
  newTaskText,
  editableCards,
  editableColumnTitles,
  inputRef,
  userId,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleNewTaskChange,
  handleCreateTask,
  editDescription,
  saveDescription,
  handleEditDescription,
  handleDeleteTask,
  toggleEditColumnTitle,
  handleEditColumnTitle,
  handleInputKeyDown,
  handleDeleteColumn,
  columnKey, 
  column, 
  isEditableTitle, 
  tasks
}) => {
  // const {  } = props;

  return (
    <>
      <div key={columnKey} className="kanban-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnKey)}>
        {/* column title */}
        <div className="kanban-column-title">
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
          <button className="btn btn-danger ml-2" onClick={() => handleDeleteColumn(column.id)}>
            <FontAwesomeIcon icon={faTrash}/>
          </button>
        </div>
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
      {/* add column in-between columns */}
      <div className="add-column-container">
        <button className="btn btn-primary ml-2 add-column-button">
          <FontAwesomeIcon icon={faPlus}/>
        </button>
      </div>
    </>
  );
};

export default KanbanColumn;