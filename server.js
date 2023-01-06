const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) =>
   res.json(notes)
);

app.post("/api/notes", function(req, res) {
  const { title, text } = req.body

  if(title && text){
  const newNote = {
    title,
    text,
    id: uuid(),
  };

  const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
  const parsedNotes = JSON.parse(readNotes);

  parsedNotes.push(newNote);

  const noteString = JSON.stringify(parsedNotes)

  fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `New note has been written to JSON file`
          )
    );
  };
});

app.listen(PORT);