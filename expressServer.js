'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000; 
//const port = process.env.PORT || 8000;
//checks process environment to see whether a port is set
// or sets port to 8000. Useful for deployments.

app.disable('x-powered-by'); // hides/does not show what kind of server you are running
app.use(morgan('dev')); //terminal logger, set to more verbose logs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var id = Number(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    res.send(pets[id]);
  })
});

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON){
    if (err){
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);
    res.send(pets);
  });
});

app.post('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if (readErr){
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(petsJSON);
    var pet = {
      age: req.body.age,
      kind: req.body.kind,
      name: req.body.name
    };
    if (!req.body.name || !req.body.age || !req.body.kind){
      return res.sendStatus(400);
    }
    pets.push(pet);
    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr){
      if (writeErr){
        console.error(writeErr.stack);
        return res.sendStatus(400);
      }
      res.set('Content-Type', 'text/');
      res.send(pet);
    });
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('Listening on ', port);
});

module.exports = app;
