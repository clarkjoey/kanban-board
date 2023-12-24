const express = require('express');
const cors = require('cors');
const path = require('path');
const dal = require('./dal');

const app = express(); // Express

const { auth, requiresAuth } = require('express-openid-connect'); // Auth0

const session = require('express-session');

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // for HTTPS use `secure: true`
}));

// auth router attaches /login, /logout, and /callback routes to the baseURL
// Local
app.use(
  auth({
    authRequired: false,
    baseURL: 'http://localhost:3000',
  })
);

// // Prod
// app.use(
//   auth({
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET,
//     baseURL: process.env.BASE_URL,
//     clientID: process.env.CLIENT_ID,
//     issuerBaseURL: process.env.ISSUER_BASE_URL
//   })
// );

// Middleware
app.use(express.json()); // JSON parsing
app.use(cors()); // Use the cors middleware

// Starting route - handles new user db storage
app.get('/', requiresAuth(), async (req, res) => {
  if (!req.session.userProcessed) {
    console.log("Processing user for the first time");
    try {
      const auth0UserId = req.oidc.user.sub;
      const email = req.oidc.user.email;
      const name = req.oidc.user.name;
  
      let user = await dal.userExists({ auth0Id: auth0UserId });
      if (!user) {
        // Create a new user in MongoDB
        let newUser = await dal.createUser({
          auth0Id: auth0UserId,
          email: email,
          name: name,
        });
        console.log(newUser);
      } else {
        console.log("user exists")
      }
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    req.session.userProcessed = true;
  } 
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/profile', requiresAuth(), async (req, res) => {
  try {
    const auth0UserId = req.oidc.user.sub;
    const user = await dal.userExists({ auth0Id: auth0UserId });
    if (user) {
      res.json({ flowId: user[0].flowId }); // Send the user ID to the frontend
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handles logout and session reset
app.get('/resetSession', (req, res) => {
  // Reset the session flag
  req.session.userProcessed = false;
  res.redirect('/logout');
});

// Find All Tasks
app.get('/tasks', async (req, res) => {
  try {
    const docs = await dal.tasks();
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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
app.get('/columns', async (req, res) => {
  try {
    const docs = await dal.columns();
    res.send(docs);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create A Task
// app.post('/tasks/create', async (req, res) => {
//   try {
//     const { name, id, column } = req.body;
//     const user = await dal.create(name, id, column);
//     res.send(user);
//   } catch (error) {
//     console.error('Error querying MongoDB:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
app.post('/tasks/create', async (req, res) => {
  try {
    const { name, id, column, userId } = req.body;
    const user = await dal.create(name, id, column, userId);
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
    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app in the 'client/build' directory
app.use(requiresAuth(), express.static(path.join(__dirname, 'client/build')));



// // Handles any requests that don't match the ones above
// app.get('*', requiresAuth(), (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build/index.html'));
// });

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