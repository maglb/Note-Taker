// Import modules
const express = require('express');
const path = require('path');

// Import the index router
const api = require('./routes/index');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// Send all the requests that begin with /api to the index.js in the routes folder
app.use('/api', api);

// This view route is a GET route that send the user to the notes page and retrieve all notes from the database
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// This view route is a GET route for any other endpoint that direct the user to the homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
