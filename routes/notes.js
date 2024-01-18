const notes = require('express').Router();
const uuid = require('uuid');
const fs = require('fs');

// This API route is a GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  fs.readFile('./db/db.json','utf8', (err, data) => {
    res.json(JSON.parse(data));
  })
});

// This API route is a POST Route for a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { title, text} = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid.v4(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);

          // Add a new note
          parsedNotes.push(newNote);

          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes),
            (err) =>
              err
                ? console.error(err)
                : console.info('Successfully updated notes!')
          );
        }});

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

module.exports = notes;
