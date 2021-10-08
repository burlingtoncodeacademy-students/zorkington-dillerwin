// wrap function that won't split words, found at https://stackoverflow.com/a/51506718/17080692
const wrap = (s, w) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");

// delay function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//readline
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

// beginning of actual program

class useableThing {
  //we're gonna have things. Name, description
  constructor(name, desc) {
    this.name = name;
    this.desc = desc;
  }
  read() {
    console.log(this.desc);
  }
  pickup() {
    console.log(`You pick up ${this.name}.`);
  }
  drop() {
    console.log(`You drop ${this.name}.`);
  }
}

class Room {
  constructor(name, desc = "", exits = []) {
    this.name = name;
    this.desc = desc;
    this.exits = exits;
  }
}

let roomOne = new Room( //entrance room at bottom left of map
  `Room One`,
  undefined
);

let roomTwo = new Room( //
  `Room Two`,
  `You enter the old factory. You find yourself in a long room that spans the length of the building, taking up most this floor.`
);

// console.log(roomTwo.desc());

let roomThree = new Room( // next room in building after room 1. Not sure what will be in here yet
  `Room Three`,
  `A larger room. This room has doors in the west and north walls.`
);

let roomFour = new Room( // room after room 3. Not sure what is in here yet. Has hidden passage to room 7.
  `Room Four`,
  `Another large room. This room is well lit.`
);

let roomFive = new Room( // room after room 4. Has doors to rooms 4, 6, and 8. Room 8 is a secret room behind a bookshelf
  `Room Five`,
  `a smaller room`
);

let roomSix = new Room( // final room. Not sure what will be here. Boss fight of some kind? Secret passage to/from room 7 behind a tapestry
  `Room Six`,
  `A large, well lit room. There is a suspicious amount of health and ammo by the door.`
);

let transitions = {};

// function changeRoom(newRoom) { //moves you from room to room
//   // move between rooms in game
//   if ( ) {
//   }
// }

async function start() {
  const welcomeMessage = `Hello`
  welcomeMessage = await ask(`Welcome! This text adventure is about Urban Exploration!\nYou'll be exploring an old textile factory just outside of town.`);
  let answer = await ask(welcomeMessage);
  // process.exit();
}

start();
