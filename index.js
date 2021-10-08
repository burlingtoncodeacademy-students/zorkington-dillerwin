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

// defining Room class
class Room {
  constructor(name, desc = "", exits = [], inventory = [], examine = "") {
    this.name = name; //name of room
    this.desc = desc; // description of room
    this.exits = exits; // exits from this room
    this.inventory = inventory;
    this.examine = examine;
  }
}

//defining interactable object class
class useableThing {
  //we're gonna have things. Name, description
  constructor(name, desc, use) {
    this.name = name;
    this.desc = desc;
    this.use = use;
  }
  examine() {
    console.log(this.desc);
  }
  use() {
    console.log(`You use ${this.name}.`);
  }
  take() {
    console.log(`You pick up ${this.name}.`);
  }
  drop() {
    console.log(`You drop ${this.name}.`);
  }
}

// things to add: flashlight, backpack, door, wooden stalls

// defining uninteractable objects
class unusableThing {
  constructor(name, desc, examine) {
    this.name = name;
    this.desc = desc;
    this.examine = examine;
  }
  interact() {
    console.log(`There's nothing you can do with this object.`);
  }
  inspect() {
    console.log(this.examine);
  }
}

//defining unusable items
let puddle = new unusableThing(
  `large puddle`,
  `This is a large pool of water.`,
  wrap(
    `Looking closer, this puddle probably leaked through the roof and floors above when it rained earlier this week. It's not very deep.`,
    60
  )
);

let oldLine = new unusableThing(
  `old textile line`,
  wrap(
    `this machine probably had more to it at one point, but at this point it's basically just an odd table.`,
    60
  )
);

// defining rooms
let roomOne = new Room( //entrance room at bottom left of map
  `outside`,
  `You stand outside the old factory. It looks the way you expected, run down and abandoned.`,
  [`Inside`],
  [`metal pole`],
  wrap(
    `You look around the outside of the building. There's a smaller building off to the side you've been told to stay out of, the floor isn't safe. You also find an old metal pole about three feet long.`,
    60
  )
);

let roomTwo = new Room( //
  `Floor One Main Room`,
  wrap(
    `You enter the old factory. You find yourself in a long room that spans the length of the building, taking up most this floor. Structural supports dot the area. You can see a large puddle by the southern wall, some wooden stalls by the northern wall, a brick structure in the center of the room that runs up into the ceiling, and you can see a door to a stairwell in the northwest corner. The back of the room fades into shadow. `,
    60
  ),
  [`northwest stairwell`, `southeast stairwell`, `outside`],
  [`roof key`, `flashlight`],
  wrap(
    `You walk a loop around the bottom floor. The stalls appear to be plywood, set up by someone after the factory closed. They're covered in graffiti. The brick structure in the middle of the room is an old elevator lift shaft. The back wall has a large freight door, it's chained shut. There is a second stairwell in the southeast corner.`,
    60
  )
);

let roomThree = new Room( // next room in building after room 1. Not sure what will be in here yet
  `Northwest Stairwell`,
  wrap(
    `This stairwell is in disrepair. A few steps are missing, but none that make it impossible to use.`,
    60
  ),
  [`Main floor`, `Floor 2`],
  [],
  wrap(
    `You look around the stairwell carefully, but there's nothing special to be found here.`,
    60
  )
);

let roomFour = new Room( // room after room 3. Not sure what is in here yet. Has hidden passage to room 7.
  `South Stairwell`,
  `Another large room. This room is well lit.`
);

let roomFive = new Room( // room after room 4. Has doors to rooms 4, 6, and 8. Room 8 is a secret room behind a bookshelf
  `Floor Two Main Room`,
  `a smaller room`
);

let roomSix = new Room( // final room. Not sure what will be here. Boss fight of some kind? Secret passage to/from room 7 behind a tapestry
  `Roof`,
  `A large, well lit room. There is a suspicious amount of health and ammo by the door.`
);

let transitions = {
  roomOne: [`room two`],
  roomTwo: [`room one`],
  roomThree: [],
  roomFour: [],
  roomFive: [],
  roomSix: [],
};

// function changeRoom(newRoom) { //moves you from room to room
//   // move between rooms in game
//   if ( ) {
//   }
// }

async function start() {
  const welcomeMessage = `Welcome! This text adventure is about Urban Exploration!\nYou'll be exploring an old textile factory just outside of town.\nTo interact with the world in the game, type them right into the cmd line.\nWe'll be using 'take', 'drop', 'examine', 'move',\nand a few others to be decided later.`;
  console.log(welcomeMessage);
  let message = await ask(`Are you read to begin your exploration? `);
  // process.exit();
}

// start();
