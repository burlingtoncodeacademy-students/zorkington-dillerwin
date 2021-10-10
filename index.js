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

//defining functions I'll be using

//move location function
function moveLocation(newLocation) {
  newLocation = newLocation.split(` `).slice(-1).join(``);
  if (transitions[currentLocation.name].includes(newLocation)) {
    console.log(`Moving from ${currentLocation.name} to ${newLocation}`);
    currentLocation = roomLookup[newLocation];
    console.log(currentLocation.desc);
  }
}

//function to examine items/rooms
function examine(item) {
  item = item.split(` `).slice(-1).join();
  if (itemLookup[item] !== undefined) {
    item = itemLookup[item];
    console.log(item.examine);
  } else {
    item = roomLookup[item];
    // console.log(item)
    console.log(item.examine);
  }
}

function drop(item) {
  if (item.includes(`phone`)) {
    console.log(`Can't drop that, what if you get a text?`);
  } else if (item.includes(`wallet`)) {
    console.log(`You can't drop this, it's genuine leather!`);
  } else if (item.includes(`keys`)) {
    console.log(`How would you get home without your car keys?`);
  } else {
    item = item.split(` `).splice(-1).join();
    if (itemLookup[item] !== undefined) {
      item = itemLookup[item];
      item.drop(item); // important to keep item in the parenthesis or it will return undefined and lock up program
    }
  }
}

function take(item) {
  item = item.split(` `).splice(-1).join(); //takes last word of input string (presumably the item, hope that input is right. Maybe way to compare all items in arrays and return common value? that could find any item in the input that is also in the room and return its value instead of just the last input item?)
  if (itemLookup[item] !== undefined) {
    //sanitizes input, checks for item
    item = itemLookup[item]; //sets item to it's object definition
    item.take(item); // runs useable object take function. Removes item from room inventory, adds it to player inventory
  }
}

class Character {
  constructor(name = `player`, desc = `this is me`, inventory = []) {
    this.name = name;
    this.desc = desc;
    this.inventory = inventory;
  }
  checkInventory() {
    console.log(`You currently have ${this.inventory.join(`, `)}.`);
  }
}

let player = new Character(`Player`, `This is me!`, [
  `phone`,
  `wallet`,
  `keys`,
]);

// defining Room class
class Room {
  constructor(name = "", desc = "", exits = [], inventory = [], examine = "") {
    this.name = name; //name of room
    this.desc = desc; // description of room
    this.exits = exits; // exits from this room
    this.inventory = inventory;
    this.examine = wrap(examine, 60);
  }
}

// defining rooms
let outside = new Room( //entrance room at bottom left of map
  `outside`,
  `You stand outside the old factory. It looks the way you expected, run down and abandoned. The doorway in front of you stands open, the door having been broken in long ago.`,
  [`inside`, `basement`],
  [`rebar`],
  `\nYou look around the outside of the building. There's a door that looks like it goes down into a storm cellar. You also find an old piece of rebar on the ground about 2 feet long.`
);

let mainFloor = new Room( //
  `main floor`,
  `You enter the old factory. You find yourself in a long room that spans the length of the building, taking up most this floor. Structural supports dot the area. You can see a large puddle by the southern wall, some wooden stalls by the northern wall, a brick structure in the center of the room that runs up into the ceiling, and you can see a door to a stairwell in the northwest corner. The back of the room fades into shadow. `,
  [`northwest stairwell`, `southeast stairwell`, `outside`],
  [`roof key`, `flashlight`],
  `You walk a loop around the bottom floor. The stalls appear to be plywood, set up by someone after the factory closed. They're covered in graffiti. The brick structure in the middle of the room is an old elevator lift shaft. The back wall has a large freight door, it's chained shut. There is a second stairwell in the southeast corner.`
);

let nwStair = new Room( // next room in building after room 1. Not sure what will be in here yet
  `northwest stairwell`,
  `This stairwell is in disrepair. A few steps are missing, but none that make it impossible to use. This stairwell can take to you to the second floor and the roof.`,
  [`main floor`, `second floor`, `roof`],
  [],
  `You look around the stairwell carefully, but there's nothing special to be found here.`
);

let seStair = new Room( // room after room 3. Not sure what is in here yet. Has hidden passage to room 7.
  `southeast stairwell`,
  `This stairwell is in serious disrepair. It goes up to the second floor, but you have to navigate carefully. The stairway up to roof here has totally collapsed and it impassable.`,
  [`main floor`, `second floor`],
  [`brick`],
  `You look around the stairwell and find a brick.`
);

let secondFloor = new Room( // room after room 4. Has doors to rooms 4, 6, and 8. Room 8 is a secret room behind a bookshelf
  `Second floor`,
  `This floor is as large as the first. There is a similar brick shaft in the middle of the room. In the northeastern section of the room you can see a large object.`,
  [`northwest stairwell`, `southeast stairwell`],
  [`backpack`],
  `You take a walk around the room. This floor has less large objects in it than the first, although it is scattered with pieces of the roof that have fallen in over the years. The back wall of this floor also has a set of large doors on the eastern  wall that could slide open at one point. One of the sliding doors has fallen off, leaving the side of the building open here. The large object in the northeast corner is an old textile work line.`
);

let nwRoof = new Room( // final room. Not sure what will be here. Boss fight of some kind? Secret passage to/from room 7 behind a tapestry
  `northwest roof`,
  `You open the stairwell door and stand out on the roof. Much of it is missing, fallen into the floor below. There is a solid area just around the door, and you can see one across the roof that has something on it, although you can't quite see what it is.`,

  [`northwest stairwell`],
  [],
  `You look around more carefully. You still can't quite make out what's on the other portion of the roof, but you can just see the top of a ladder over on the eastern wall. You also find a piece of paper tucked under a brick that says "You've gone the wrong way, the cool stuff is in the basement."`
);

let eastRoof = new Room(
  `eastern roof`,
  `You climb up the ladder onto the portion of roof you could just see from by the stairwell. The object you couldn't quite make out was a pair of lawn chairs, apparently set up to stargaze. The safely usable footing here is fairly small, on a little bigger than the space the chairs take up.`,
  [`second floor`],
  [`$5 bill`],
  `You look around the chairs and find a quarter someone must have dropped.`
);

let basement = new Room(
  `basement`,
  `You walk down the steps into the basement. A single naked light bulb hangs from the ceiling, lighting the small room. On the wall opposite you stands... a vending machine. It's running, humming gently as it keeps it's contents cold.`,
  [`outside`],
  [`coca-cola`],
  `You look around the room more carefully. The only thing in here is the light and the vending machine.`
);

let roomLookup = {
  outside: outside,
  "main floor": mainFloor,
  inside: mainFloor,
  "second floor": secondFloor,
  "northwest stairwell": nwStair,
  "southeast stairwell": seStair,
  "northwest roof": nwRoof,
  "eastern roof": eastRoof,
  ladder: eastRoof,
  basement: basement,
};

//defining interactable object class
class useableThing {
  //we're gonna have things. Name, description
  constructor(
    name,
    desc = ``,
    useable = false,
    addToInventory = false,
    useEntry = ``,
    examine = ``
  ) {
    this.name = name;
    this.desc = wrap(desc, 60);
    this.useable = useable;
    this.addToInventory = addToInventory;
    this.useEntry = wrap(useEntry, 60);
    this.examine = wrap(examine, 60);
  }

  take(item) {
    //take function for adding items from room to player inventory
    if (this === backpack) {
      // may move backpack later, don't really want it to be an interactable object in this version of the game. May want to use it as one in a later version though?
      console.log(`It's probably best to leave this where it is.`);
    } else {
      if (currentLocation.inventory.includes(item.name)) {
        //input is sanitized by global take(), need to use item.name to do actual check for item
        //checks for item in room's inventory
        index = currentLocation.inventory.indexOf(item); // takes index of item if it's present
        currentLocation.inventory.splice(index, index + 1); //splices item out of room's inventory
        player.inventory.push(item.name); // adds item to player's inventory
        console.log(`You pick up the ${item.name}.`); // tells player the item is in their inventory
      } else {
        console.log(`There's nothing like that here.`);
      }
    }
  }

  drop(item) {
    // very similar to take(), just in reverse. Removes item from player inventory and adds it to room inventory
    if (player.inventory.includes(item.name)) {
      index = player.inventory.indexOf(item);
      player.inventory.splice(index, index + 1);
      currentLocation.inventory.push(item.name);
      console.log(`You drop the ${item.name}.`);
    } else {
      console.log(`You aren't carrying anything like that.`);
    }
  }
  use() {
    if (this.useable === true) {
      console.log(this.useEntry);
    } else {
      console.log(`You cannot use this right now.`);
    }
  }
  examine() {
    console.log(this.examine);
  }
}

// defining useable objects. Some
let roofDoor = new useableThing(
  `roof door`,
  `This door goes up to the roof.`,
  false,
  false,
  `You open the door and step out onto the roof.`,
  `The door is locked. It looks weathered.`
);

let basementDoor = new useableThing(
  `basement door`,
  `This storm cellar door is built into the northern wall of the building.`,
  false,
  false,
  `The basement door is locked.`
);

let rebar = new useableThing(
  `rebar`,
  `a piece of rebar about 2 feet long`,
  true,
  true
);

let quarter = new useableThing(
  `quarter`,
  `a 25 cent coin`,
  false,
  true,
  `n/a`,
  `someone has drawn little devil horns on the picture of President Jackson`
);

let note = new useableThing(
  `small paper`,
  `This small piece of paper has a message written on it.`,
  false,
  true,
  "",
  `You read the message on the paper: "You've gone the wrong way, the cool stuff is in the basement. Passcode is 3264."`
);

let flashlight = new useableThing(
  `flashlight`,
  `This is small maglite someone must have dropped or forgotten. It turns on without issue.`,
  true,
  true,
  `You turn on the flashlight.`,
  `You examine the flashlight, but there's nothing special about it.`
);

let backpack = new useableThing(
  `backpack`,
  `This is a backpack in decent shape. It look like it was left here on purpose, whoever owns it will probably be back for it.`,
  false,
  false,
  `You look in the backpack. It has a change of clothes and some miscellaneous personal things in it.`
);

let cokeMachine = new useableThing(
  `vending machine`,
  `A Coca-cola branded vending machine.`,
  false,
  false,
  `You input the code and your money. A fresh coke comes out.`,
  `You look more closely at the vending machine. It has a keypad that apparently takes 4 digits and a coin slot.`
);

let itemLookup = {
  // lookup for interactable objects
  "roof door": roofDoor,
  "basement door": basementDoor,
  "cellar door": basementDoor,
  rebar: rebar,
  quarter: quarter,
  coin: quarter,
  flashlight: flashlight,
  note: note,
  backpack: backpack,
};

// defining uninteractable objects

class unusableThing {
  constructor(name, desc, examine) {
    this.name = name;
    this.desc = wrap(desc, 60);
    this.examine = wrap(examine, 60);
  }
  examine() {
    console.log(this.examine);
  }
}

let chairs = new unusableThing( //lawn chairs in eastRoof
  `lawn chairs`,
  `An old set of lawn chairs. It seems like they've been hoisted up here, maybe for stargazing.`,
  `You look more closely at the lawn chairs. You find a quarter under one. It must've been dropped by whoever used this last.`
);

let stalls = new unusableThing( //wooden stalls in second floor
  `wooden stalls`,
  `A short row of 3 wooden stalls made of out plywood. They sit flush against the walls and are covered in graffiti.`,
  `You search the stalls and find a flashlight.`
);

let puddle = new unusableThing(
  `large puddle`,
  `This is a large pool of water.`,
  `You walk over to look more closely at the puddle. It probably leaked through the roof and floors above when it rained earlier this week; it's not very deep.`
);

let oldLine = new unusableThing(
  `old textile line`,
  `this machine probably had more to it at one point, but at this point it's basically just an odd, long table.`,
  `You take a closer look at the old line. There's a backpack sitting on the east end.`
);

let building = new unusableThing(
  `old outbuilding`,
  `This rundown building stands just outside the factory. You can see the roof has fallen in.`,
  `You don't think it's a good idea to go inside.`
);

// lookup for non-interactable objects
let unusableItemLookup = {
  "wooden stalls": stalls,
  puddle: puddle,
  "textile line": oldLine,
  table: oldLine,
  "lawn chairs": chairs,
  building: building,
};

let transitions = {
  outside: [`main floor`, `inside`, `basement`],
  mainFloor: [`outside`, `northwest stairwell`, `southeast stairwell`],
  secondFloor: [`northwest stairwell`, `southeast stairwell`, `ladder`],
  nwStair: [`main floor`, `second floor`, `roof`],
  seStair: [`main floor`, `second floor`],
  nwRoof: [`northwest stairwell`],
  eastRoof: [`second floor`],
  basement: [`outside`],
};

async function start() {
  const welcomeMessage = wrap(
    `Welcome! This text adventure is about Urban Exploration! You'll be exploring an old textile factory just outside of town. To interact with the world in the game, type them right into the cmd line. We'll be using 'take', 'drop', 'examine', 'move', and 'use' to interact with this world!\n`,
    60
  );
  console.log(welcomeMessage);

  //opening message
  let message = await ask(`Are you ready to begin your exploration? `);
  if (message.toLowerCase().includes(`y`)) {
    //catches 'yes' variations 'yep' 'ya' 'yeah' etc
    message = `yes`;
  }
  while (message.toLowerCase() !== `yes`) {
    if (message.toLowerCase().includes(`n`)) {
      // catches 'no' variations 'nah' 'nope' etc
      console.log(`Okay! I'll see you when you're ready to play!`);
      process.exit();
    } else {
      message = await ask(
        //catches miskeys/nonsense inputs
        `I'm sorry, I didn't understand. Are you ready to start? `
      );
    }
  }
  if (message === `yes`) {
    console.log(`Alright! Then let's get started!\n`);
    await sleep(1000);
    gameLaunch(); //begin adventure game
  }
}
// start();
// adventure game begin
let currentLocation = outside;

let index = 0;

async function gameLaunch() {
  //the adventure game! we're here!
  console.log(
    wrap(
      `It's a warm night. You stand outside an old textile factory on the edge of town. You heard about it from a friend and have decided to look around for yourself.\n`,
      60
    )
  );
  console.log(currentLocation.desc);
  while ((reply = await ask(`\nWhat would you like to do? >_`))) {
    if (reply.includes(`move`)) {
      moveLocation(reply);
    } else if (reply.includes(`examine`) || reply.includes(`read`)) {
      examine(reply);
    } else if (reply.includes(`take`)) {
      take(reply);
    } else if (reply.includes(`drop`)) {
      drop(reply);
    } else if (reply.includes(`check`) || reply.includes(`inventory`)) {
      player.checkInventory();
    } else {
      console.log(`\nI'm sorry, I didn't understand.`);
    }
  }
}

gameLaunch();
