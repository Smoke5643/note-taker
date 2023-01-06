// Bringing in all required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
// Setting port for Heroku and local use
const PORT = process.env.PORT || 3001;
// Setting variable to call express funtion
const app = express();
// Allow express to take in form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Giving access to pulic folder
app.use(express.static('public'));
// Variable to write notes to file
const writeFile = (destination, content) =>
  fs.writeFileSync(destination, JSON.stringify(content, null, 2));
// Variable to read and update file with new note
const appendFile = (content, file) => {
  const data = fs.readFileSync(file, 'utf8')
  if (data) {
    const parsedNote = JSON.parse(data);
    parsedNote.push(content);
    writeFile(file, parsedNote);
  };
};
// Serving the main homepage
app.get('/', (req, res) => {
  console.info(`${req.method} request recieved!`);
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// Serving the notes page
app.get('/notes', (req, res) => {
  console.info(`${req.method} request recieved!`);
  res.sendFile(path.join(__dirname, './public/notes.html'));
});
// Getting notes from db.json
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved!`);
  const data = fs.readFileSync('./db/db.json', 'utf8');
  res.json(JSON.parse(data));
});
// Adding notes to db.json
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved!`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    appendFile(newNote, './db/db.json');
    res.json('The new note had been added successfully.')
  } else {
    res.error('There was an error adding the note!')
  }
});
// Listening at the specified port to run application
app.listen(PORT);