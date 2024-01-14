const express = require('express');
const cors = require('cors');
const path = require('path');
const dal = require('./dal');

const app = express(); // Express

// Middleware
app.use(express.json()); // JSON parsing
app.use(cors()); // Use the cors middleware

// Starting route - handles new user db storage
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Serve static files from the React app in the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Check if user exists, if not add to the DB
app.post('/user', async (req, res) => {
  try {
    const { email, email_verified, name, nickname, picture, sub, updated_at } = req.body;
    // query for user
    const user = await dal.userExists({ sub });
    if (!user) {
      console.log("creating new user");
      // create user
      const newUser = await dal.createUser(email, email_verified, name, nickname, picture, sub, updated_at);
      res.status(200).json(newUser[0]);
    } else {
      console.log("user exists");
      res.status(200).json(user[0]);
    }
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find All Tasks
app.get('/tasks/:userId', async (req, res) => {
  try {
    const docs = await dal.tasks(req.params.userId);
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find All Columns
app.get('/columns/:userId', async (req, res) => {
  try {
    const docs = await dal.columns(req.params.userId);
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder All Columns
app.get('/columns/reorder/:userId', async (req, res) => {
  try {
    const columns = await dal.reorderColumns(req.params.userId);
    res.send(columns);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create A Task
app.post('/tasks/create', async (req, res) => {
  try {
    const { name, id, column, userId } = req.body;
    const user = await dal.createTask(name, id, column, userId);
    res.send(user);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create A Column
app.post('/columns/create', async (req, res) => {
  try {
    const { id, column, inputId, userId } = req.body;
    const user = await dal.createColumn(id, column, inputId, userId);
    res.send(user);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a column
app.delete('/columns/remove/:id', async (req, res) => {
  try {
    const result = await dal.removeColumn(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add A Description To A Task
app.post('/tasks/description', async (req, res) => {
  try {
    // Extract the necessary data from the request body
    const { id, description } = req.body;

    // Call your function to add a description to a task
    const result = await dal.addDescription(id, description);

    // Send the response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding description to task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Move A Task
app.post('/tasks/column', async (req, res) => {
  try {
    const { name, id, column } = req.body;
    const result = await dal.moveTask(name, id, column);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding description to task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update A Column Title
app.post('/columns/title', async (req, res) => {
  try {
    // Extract the necessary data from the request body
    const { userId, columnId, columnIndex, newTitle } = req.body;

    // Call your function to update the column title
    const result = await dal.updateColumnTitle(userId, columnId, columnIndex, newTitle);

    // Send the response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating column title:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove A Task
app.delete('/tasks/remove/:id', async (req, res) => {
  try {
    const result = await dal.removeTask(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
dal.connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  dal.closeMongoDBConnection()
    .catch((error) => {
      console.error('Error closing MongoDB connection during server shutdown:', error);
    })
    .finally(() => {
      process.exit(0);
    });
});