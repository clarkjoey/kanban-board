const express = require('express');
const cors = require('cors');
const path = require('path'); // Don't forget to require path
const dal = require('./dal');

const app = express();

// Middleware
app.use(express.json()); // Use express for JSON parsing
app.use(cors()); // Use the cors middleware

// Find All Tasks
app.get('/tasks', async (req, res) => {
  try {
    const docs = await dal.tasks();
    console.log(docs);
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find All Columns
app.get('/columns', async (req, res) => {
  try {
    const docs = await dal.columns();
    console.log(docs);
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create A Task
app.post('/tasks/create', async (req, res) => {
  try {
    const { name, id, column } = req.body;
    const user = await dal.create(name, id, column);
    console.log(user);
    res.send(user);
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
    const { columnId, newTitle } = req.body;

    // Call your function to update the column title
    const result = await dal.updateColumnTitle(columnId, newTitle);

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
    const result = await dal.remove(req.params.id);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app in the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
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