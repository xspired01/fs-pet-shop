'use strict'; //ensures you declare AND set initialization/value to variables 

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json'); //__dirname grabs current directory name you're in.
                                                    //__dirname takes place of '/directory/filename'; join joins strings
                                                    //NOTE: on Windows the slash is the other direction.
const Node = path.basename(process.argv[0]);  //set const for variables that don't change
const File = path.basename(process.argv[1]);  //using Capital for const name to designate
const Command = process.argv[2];              //Global Variables

if (Command === 'read'){
  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err){
      throw err;
    }
    let index = process.argv[3];
    let pets = JSON.parse(data);

    if ( index ){
      if (pets[index]){
        let pet = pets[index];
        console.log(pet);
      } else {
        console.error(`Usage: ${Node} ${File} ${Command} INDEX`);
        process.exit(1);
      }
    }
    else {
      console.log(pets)
    }
  })
}

else if (Command === 'create'){
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
      console.error(`Usage: ${Node} ${File} ${Command} AGE KIND NAME`);
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
  console.error(`Usage: ${Node} ${File} [read | create | update | destroy]`);
  process.exit(1);
}
