// Import modules
const notes = require('express').Router();
const uuid = require('uuid');
const fs = require('fs');
const short = require('short-uuid');

// This API route is a GET Route for retrieving all the notes from the database
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    res.json(JSON.parse(data));
  })
});

// This API route is a POST Route to save a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: short.generate(),
    };

    // Read the database file to retrieve all existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note into the data object
        parsedNotes.push(newNote);

        // Write updated notes back into the file db.json
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes),
          (err) =>
            err
              ? console.error(err)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

// This API route is a DELETE Route for deleting a note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;

  // Get the saved notes from database
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const retrievedNotes = JSON.parse(data);

      // filter notes to remove the note we want to delete
      const newNotesDb = retrievedNotes.filter((note) => note.id !== noteId);

      // Save the new notes database file
      fs.writeFile('./db/db.json', JSON.stringify(newNotesDb), (err) =>
      err
        ? console.error(err)
        : console.info('Successfully deleted note!'));
    }
  })
  res.send(`Item ${noteId} has been deleted 🗑️`);
});

module.exports = notes;
