'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
// let cmdChoice = process.argv[3]; initially declared global variables for learning process
// let kind = process.argv[4];
// let name = process.argv[5];

if (cmd === 'read'){
  let index = process.argv[3];

  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err){
      throw err;
    }

    let pets = JSON.parse(data);

    if ( index ){
      if (pets[index]){
        let pet = pets[index];
        console.log(pet);
      } else {
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
        process.exit(1);
      }
    }
    else {
      console.log(pets)
    }
  })
}

else if (cmd === 'create'){
  fs.readFile(petsPath, 'utf8', function(readErr, data){
    if (readErr){
      throw readErr;
    }

    let pets = JSON.parse(data);
    let age = process.argv[3];
    let kind = process.argv[4]
    let name = process.argv[5];
    var pet = {
      age: Number(age),
      kind: kind,
      name: name
    };

    if ( !age || !kind || !name ){
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    } else {
      pets.push(pet);
      var petsJSON = JSON.stringify(pets);
    }

    fs.writeFile(petsPath, petsJSON, function(writeErr){
      if (writeErr){
        throw writeErr;
      }
      console.log(pet);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
