const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const writeFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nNote written to ${destination}`)
  );

const appendFile = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNote = JSON.parse(data);
      parsedNote.push(content);
      writeFile(file, parsedNote);
    }
  });
};

const deleteFile = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNote = JSON.parse(data);
      parsedNote.splice(content, 1);
      writeFile(file, parsedNote);
    }
  });
};

app.get('/', (req, res) => {
  console.info(`${req.method} request recieved!`);
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  console.info(`${req.method} request recieved!`);
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved!`);
  const data = fs.readFileSync('./db/db.json', 'utf8');
  res.json(JSON.parse(data));
});

app.post('/api/notes', function (req, res) {
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

app.delete ('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request recieved!`);
  deleteFile(req.params.id, './db/db.json')
});

app.listen(PORT);