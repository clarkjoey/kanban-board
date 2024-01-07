const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = 'KanbanDB';

let client; // Declare a single MongoDB client instance

let isConnected = false; // Add a flag to track the connection status
let db; // Declare the 'db' variable here to make it accessible

async function connectToMongoDB() {
    try {
        if (!isConnected) { // Only connect if not already connected
            // Create a new MongoClient if it doesn't exist
            if (!client) {
                client = new MongoClient(uri);
            }

            // Connect to the MongoDB server
            await client.connect();
            console.log('Connected successfully to MongoDB server');

            // Set up the database
            db = client.db(dbName);
            isConnected = true; // Set the flag to true
        }

        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

async function closeMongoDBConnection() {
    try {
        if (isConnected) { // Only close if connected
            await client.close();
            console.log('Disconnected from MongoDB Atlas');
            isConnected = false; // Reset the flag
        }
    } catch (error) {
        console.error('Error closing MongoDB Atlas connection:', error);
    }
}

// check if user exists
async function userExists({auth0Id}) {
  try {
    const collection = db.collection('Users');
    const result = await collection.find({ "auth0Id": auth0Id }).toArray();
    if (result.length === 0) {
      return false;
    }
    return result;
  } catch (error) {
      throw error;
  }
}

// add a user
async function createUser({ auth0Id, email, name }) {
  try {
    // generate id based on epoch time
    const flowId = new Date().getTime();
    const doc = { auth0Id, email, name, flowId: flowId };
    const collection = db.collection('Users');
    // add to the DB
    const insertResult = await collection.insertOne(doc);
    // return the account info
    if (insertResult.acknowledged) {
      const findResult = await collection.find({ "email": email }).toArray();
      return findResult;
    } else {
        return { error: "No documents inserted" }; // no documents were inserted
    }
  } catch (error) {
      throw error;
  }
}

// all tasks
// path: /tasks/:userId
async function tasks(userId) {
  try {
    const collection = db.collection('Tasks');
    const result = await collection.find({ "userId": userId }).toArray();
    return result;
  } catch (error) {
    throw error;
  }
}

// all columns
// path: /columns/:userId
async function columns(userId){
    try {
        const collection = db.collection('Columns');
        const result = await collection.find({ "userId": userId }).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

// reorder columns
// path: /columns/reorder/:userId
async function reorderColumns(userId) {
  try {
    const collection = db.collection('Columns');
    const result = await collection.find({ userId: userId }).toArray();

    // Sort the array by the 'column' property in ascending order (low to high)
    result.sort((a, b) => a.column - b.column);

    // Prepare an array of update operations
    const updateOperations = result.map((column, index) => ({
      updateOne: {
        filter: { userId: userId, id: column.id },
        update: {
          $set: {
            column: index + 1,
            inputId: `input-${index + 1}`
          }
        }
      }
    }));

    // Use bulkWrite to execute multiple update operations in a single request
    const bulkWriteResult = await collection.bulkWrite(updateOperations);
    if (bulkWriteResult.modifiedCount > 0) {
      const updateColumns = await collection.find({ "userId": userId }).toArray();
      return updateColumns;
    } else {
      return { error: "Columns already in sequence" }; // No matching task was found
    }
  } catch (error) {
    throw error;
  }
}

// create a task
// path: /tasks/create
// payload: { name, id, column }
async function createTask(name, id, column, userId) {
    try {
        const doc = { 
          name, 
          id: parseInt(id), 
          description: "-", 
          column: parseInt(column), 
          userId: userId.toString() 
        };
        const collection = db.collection('Tasks');
        // add to the DB
        const insertResult = await collection.insertOne(doc);
        // return the account info
        if (insertResult.acknowledged) {
            const findResult = await collection.find({ "id": id }).toArray();
            return findResult;
        } else {
            return { error: "No documents inserted" }; // no documents were inserted
        }
    } catch (error) {
        throw error;
    }
}

// create a column
// path: /columns/create
// payload: { column, inputId, userId }
async function createColumn(id, column, inputId, userId) {
  try {
      const doc = { 
        id: parseInt(id),
        column: parseInt(column),
        inputId, 
        items: [], 
        title: "Write a stage name", 
        userId: userId.toString() 
      };
      const collection = db.collection('Columns');
      // add to the DB
      const insertResult = await collection.insertOne(doc);
      // return the account info
      if (insertResult.acknowledged) {
          const findResult = await collection.find({ "column": parseInt(column), userId: userId.toString() }).toArray();
          return findResult;
      } else {
          return { error: "No documents inserted" }; // no documents were inserted
      }
  } catch (error) {
      throw error;
  }
}

// move a task
// path: /tasks/column
// payload: { name, id, column }
async function moveTask(name, id, column) {
    try {
      const collection = db.collection('Tasks');
      const query = { name, id: parseInt(id) };
      column = parseInt(column);
      const update = { $set: { column } };
      
      // Update the task in the DB with the new column
      const updateResult = await collection.updateOne(query, update);
      
      if (updateResult.modifiedCount === 1) {
        const updatedTask = await collection.findOne(query);
        return updatedTask;
      } else {
        return { error: "Task not found" }; // No matching task was found
      }
    } catch (error) {
      throw error;
    }
  }

// update a column title
// path: /columns/title
// payload: { userId, columnId, columnIndex, newTitle }
async function updateColumnTitle(userId, columnId, columnIndex, newTitle) {
    try {
      const collection = db.collection('Columns');
      const query = { 
        'userId': userId.toString(), 
        'id': parseInt(columnId), 
        'column': parseInt(columnIndex) 
      };
      const update = { $set: { 'title': newTitle } }; // Update the 'title' field
      // Update the column in the DB with the new title
      const updateResult = await collection.updateOne(query, update);
      if (updateResult.modifiedCount === 1) {
        const updatedColumn = await collection.findOne(query);
        return updatedColumn;
      } else {
        return { error: "Column not found" }; // No matching column was found
      }
    } catch (error) {
      throw error;
    }
}

// add a description to a task
// path: /tasks/description
// payload: { id, description }
async function addDescription(id, description) {
    try {
      const collection = db.collection('Tasks');
      const query = { id: parseInt(id) };
      const update = { $set: { description } };
      // Update the task in the DB with the new description
      const updateResult = await collection.updateOne(query, update);
      if (updateResult.modifiedCount === 1) {
        const updatedTask = await collection.findOne(query);
        return updatedTask;
      } else {
        return { error: "Task not found" }; // No matching task was found
      }
    } catch (error) {
      throw error;
    }
}

// delete a task
// path: /tasks/remove/:id
async function removeTask(id) {
    try {
      const collection = db.collection('Tasks');
      const query = { id: parseInt(id) }; // Match documents with the specified id
      // delete from the DB
      const deleteResult = await collection.deleteOne(query);
      // return the result of the delete operation
      if (deleteResult.deletedCount === 1) {
        return { message: "Task deleted successfully" };
      } else {
        return { error: "Task not found" }; // No matching task was found
      }
    } catch (error) {
      throw error;
    }
}

// delete a column
// path: /columns/remove/:id
async function removeColumn(id) {
  try {
    const collection = db.collection('Columns');
    const query = { id: parseInt(id) }; // Match documents with the specified id
    // delete from the DB
    const deleteResult = await collection.deleteOne(query);
    // return the result of the delete operation
    if (deleteResult.deletedCount === 1) {
      return { message: "Task deleted successfully" };
    } else {
      return { error: "Task not found" }; // No matching task was found
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
    tasks,
    columns,
    reorderColumns,
    createTask,
    createColumn,
    addDescription,
    moveTask,
    updateColumnTitle,
    removeTask,
    removeColumn,
    client, // Export the MongoDB client
    connectToMongoDB, // Export the connectToMongoDB function
    closeMongoDBConnection, // Export the closeMongoDBConnection function
    createUser,
    userExists,
};