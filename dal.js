const { MongoClient } = require('mongodb');

// const uri = 'mongodb+srv://joeclark3516:kanban123@kanbancluster.vvfr88g.mongodb.net/';
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

// all tasks
// path: /tasks
async function tasks(){
    try {
        const collection = db.collection('Tasks');
        const result = await collection.find({}).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

// all columns
// path: /columns
async function columns(){
    try {
        const collection = db.collection('Columns');
        const result = await collection.find({}).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

// create a task
// path: /tasks/create
// payload: { name, id, column }
async function create(name, id, column) {
    try {
        const doc = { name, id: parseInt(id), description: "-", column: parseInt(column) };
        const collection = db.collection('Tasks');
        // add to the DB
        const insertResult = await collection.insertOne(doc);
        // return the account info
        if (insertResult.acknowledged) {
            const findResult = await collection.find({ "name": name }).toArray();
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
// payload: { columnId, newTitle }
async function updateColumnTitle(columnId, newTitle) {
    try {
      const collection = db.collection('Columns');
      const query = { 'column': columnId }; // Match documents with the specified columnId
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
async function remove(id) {
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

module.exports = {
    tasks,
    columns,
    create,
    addDescription,
    moveTask,
    updateColumnTitle,
    remove,
    client, // Export the MongoDB client
    connectToMongoDB, // Export the connectToMongoDB function
    closeMongoDBConnection, // Export the closeMongoDBConnection function
};