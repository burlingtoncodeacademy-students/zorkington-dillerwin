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
start();

class useableThing {
  //we're gonna have things. Name, description
  constructor(name, desc) {
    this.name = name;
    this.desc = desc;
  }
  read() {
    console.log(this.desc);
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
  roomOne,
  `entrance. A well lit room with door in the north and east walls.`,
  [`Room Two`, `Room Three`]
);

let roomTwo = new Room( // courtyard space, north of room 1. Has fountain with magic lights that can be taken. Has secret passage to Room 7
  roomTwo,
  `A small courtyard with a fountain in the center. Small glass globes filled with steady magical light ring the outer bench of the fountain.`, //has hidden passage to room 7
  [`Room One`, `Room Seven`]
);

let roomThree = new Room( // next room in building after room 1. Not sure what will be in here yet
  roomThree,
  `A larger room. This room has doors in the west and north walls.`,
  [`Room One`, `Room Four`]
);
let roomFour = new Room( // room after room 3. Not sure what is in here yet. Has hidden passage to room 7.
  roomFour,
  `Another large room. This room is well lit.`,
  [`Room Three`, `Room Five`, `Room Seven`]
);
let roomFive = new Room( // room after room 4. Has doors to rooms 4, 6, and 8. Room 8 is a secret room behind a bookshelf
  roomFive,
  `a smaller room`,
  [`Room Four`, `Room Six`, `Room Eight`]
);
let roomSix = new Room( // final room. Not sure what will be here. Boss fight of some kind? Secret passage to/from room 7 behind a tapestry
  roomSix,
  `A large, well lit room. There is a suspicious amount of health and ammo by the door.`,
  [`Room Five`, `Room Seven`]
);

let roomSeven = new Room(roomSeven, `A brief crossing in a narrow passage.`, [
  `Room Two`,
  `Room Four`,
  `Room Six`,
]);

let transitions = {
  roomOne: [`exit`, `Room 2`, `Room 3`],
  roomTwo: [`Room 7`, `Room 1`],
  roomThree: [`Room 1`, `Room 4`],
  roomFour: [`Room 3`, `Room 7`, `Room 5`],
  roomFive: [`Room 4`, `Room 6`, `Room 8`],
  roomSix: [`Room 7`, `Room 5`],
  roomSeven: [`Room 2`, `Room 6`],
  roomEight: [`Room 5`],
};

// function changeRoom(newRoom) { //moves you from room to room
//   // move between rooms in game
//   if ( ) {
//   }
// }

async function start() {
  const welcomeMessage = `You have just entered the dungeon. `;
  let answer = await ask(welcomeMessage);
  console.log("Now write your code to make this work!");
  process.exit();
}
