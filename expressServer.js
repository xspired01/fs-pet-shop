'use strict'

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = 8000;

app.disable('x-powered-by');

app.get('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var id = Number.parseInt(req.params.id);
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

app.use(function(req, res) {
  res.sendStatus(404);
})

app.listen(port, function(){
  console.log('Listening on ', port);
});

module.exports = app;

// 'use strict'
//
// var fs = require('fs');
// var path = require('path');
// var petsPath = path.join(__dirname, 'pets.json');
// var express = require('express');
// var app = express();
// var port = 8000;
//
// app.disable('x-powered-by');
//
// app.get('/pets/:id', function(req, res){
//   fs.readFile(petPath, 'utf8', function(err, petsJSON){
//     if (err) {
//       console.error(err.stack);
//       return res.sendStatus(500);
//     }
//     var id = Number.parseInt(req.params.id);
//     var pets = JSON.parse(petsJSON);
//
//     if (id < 0 || id >= pets.length || Number.isNaN(id)){
//       res.set('Content-Type', 'text/plain');
//       return res.sendStatus(404);
//     }
//
//     res.send(pets[id]);
//   });
// });
// app.use(function(req, res){
//   res.sendStatus(404);
// });
//
// app.listen(port, function(){
//   console.log('Listening on port ' + port);
// });
