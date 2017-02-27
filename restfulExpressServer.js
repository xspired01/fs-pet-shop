'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.disable('x-powered-by');  //does not show what kind of server you are running
app.use(morgan('dev'));  //logger for terminal
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

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

app.get('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, newPetsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var id = Number(req.params.id);
    var pets = JSON.parse(newPetsJSON);

    if (id < 0 || id >= pets.length || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    res.send(pets[id]);
  });
});

app.post('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
    if (readErr){
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(petsJSON);
    let name = req.body.name;
    let age = req.body.age;
    let kind = req.body.kind;
    let pet = {
      name: name,
      age: Number(age),
      kind: kind
    };

    if ( !name || age < 0 || isNaN(age) || !kind) {
      return res.sendStatus(400);}

      pets.push(pet);
      var newPetsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, newPetsJSON, function(writeErr){
        if (writeErr){
          console.error(writeErr.stack);
          return res.sendStatus(500);
        }
        res.send(pet);
      });
    });
  });

  app.patch('/pets/:id', function(req, res){
    const id = Number(req.params.id); //converts id to a number
    if (id < 0 || isNaN(id)){      //check if id is a valid number, if not throw error
      return res.sendStatus(404);   //do not open file, security check.
    }
    //if id is a number, then read file
    fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
      if (readErr){
        console.error(readErr.stack);
        return res.sendStatus(500);
      }

      var pets = JSON.parse(petsJSON);  //pets array

      if (id >= pets.length){   //check if id is a pet (valid index in pets array)
        return res.sendStatus(404);
      }

      var pet = pets[id];
      const name = req.body.name;
      const age = req.body.age;
      const kind = req.body.kind;

      if ( age < 0 || isNaN(age)) { //check if age is a valid number
        return res.sendStatus(400);
      }

      if (name){
        pets[id].name = name;
      }
      if (kind){
        pets[id].kind = kind;
      }
      pets[id].age = age;

      var newPetsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, newPetsJSON, function(writeErr){
        if (writeErr){
          console.error(writeErr.stack);
          return res.sendStatus(500);
        }
        res.send(pet);
      });
    });
  });

  app.delete('/pets/:id', function(req, res){
    const id = Number(req.params.id);
    if( id < 0 || isNaN(id)){
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    fs.readFile(petsPath, 'utf8', function(readErr, petsJSON){
      if (readErr){
        console.error(readErr.stack);
        return res.sendStatus(500);
      }

      var pets = JSON.parse(petsJSON);

      if (id >= pets.length){ //check if the number entered is a valid index for pets array
        return res.sendStatus(404);
      }
      var pet = pets[id];
      pets.splice(id, 1);
      var newPetsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, newPetsJSON, function(writeErr){
        if (writeErr){
          console.error(writeErr.stack);
          return res.sendStatus(500);
        }
        res.send(pet);
      });
    });
  });

  app.use(function(req, res){
    res.sendStatus(404);
  });

  app.listen(port, function(){
    console.log('Listening intently on port', port);
  });

  module.exports = app;
