//all functions here are borrowed from other places

// wrap function that won't split words apart, found at https://stackoverflow.com/a/51506718/17080692
const wrap = (s, w) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");

// delay function originally showed to me by Matthew Crownover
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//readline
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

//ask function to go with readline
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//defining my own functions I'll be using

function locationCatch(newLocation) {
  //input sanitization for move location inputs
  if (
    //trying to catch movement to stairways since they're multi-word
    newLocation.includes(`stairwell`) ||
    newLocation.includes(`stairs`) ||
    newLocation.includes(`stair`)
  ) {
    if (newLocation.includes(`south`) || newLocation.includes(`southern`)) {
      //specifically filtering out movement to southern stairwell
      // south stair catch
      return (newLocation = southStair.name);
    } else if (
      newLocation.includes(`north`) || //specific filter for northern stairwell
      newLocation.includes(`northern`)
    ) {
      newLocation = northStair.name;
      return newLocation;
    }
  } else if (newLocation.includes(`roof`)) {
    //specific catch for roof, intends to check for door having been unlocked. Right now can't move to roof when door is unlocked, not sure why yet
    console.log(roofDoor.useable);
    if (roofDoor.useable === false) {
      //checks for roofDoof being useable (if it's been unlocked or not)
      return console.log(`The door is locked, you can't proceed.`);
    } else {
      return (newLocation = northRoof.name);
    }
  } else if (newLocation.includes(`outside`)) {
    //checks for player wanting to move outside
    return (newLocation = outside.name);
  } else if (newLocation.includes(`basement`)) {
    //checks for player wanting to move to basement
    if (basementDoor.useable === false) {
      return console.log(`The basement door is locked tight.`);
    } else {
      return (newLocation = basement.name);
    }
  } else if (
    //check for several variations that would return to first floor room
    newLocation.includes(`inside`) ||
    newLocation.includes(`main floor`) ||
    newLocation.includes(`first floor`)
  ) {
    newLocation = mainFloor.name;
    return newLocation;
  } else if (newLocation.includes(`second floor`)) {
    //check for moving to second floor
    newLocation = secondFloor.name;
    return newLocation;
  } //need to add checks for East Roof
}

// function itemDefine //will use to define items for more accurate use as with locations

//move location function
function moveLocation(newLocation) {
  newLocation = locationCatch(newLocation); //puts location through sanitization to catch correct place
  console.log(newLocation);
  console.log(roofDoor.useable);
  console.log(transitions[currentLocation.name]);
  if (transitions[currentLocation.name].includes(newLocation)) {
    //checks that transition requested is an allowed transition
    console.log(`Moving from ${currentLocation.name} to ${newLocation}`); //tells player they're moving
    currentLocation = roomLookup[newLocation]; //sets current location to new room
    console.log(currentLocation.desc); //runs room description. Should make this so that after the first time you move into a room it changes room description slightly, at least for mainFloor room
    console.log(currentLocation.exits); //logs the places you can move to
    return currentLocation;
  } else {
    console.log(`You can't move there.`); //tells player a place isn't somewhere they can go
    return currentLocation;
  }
}

//function to examine items/rooms
function examine(item) {
  //currently relies on intended object to be last item in string
  //examine not set up for unusable things right now, need to fix
  if (item === undefined) {
    return console.log(`Sorry, I didn't understand`);
  } else {
    item = item.split(` `).slice(-1).join(); //poor catch for item, require item being last item in string. Will improve upon
    if (itemLookup[item] !== undefined) {
      //checks for item in item lookup and logs it's examine text
      item = itemLookup[item];
      console.log(item.examine);
    } else {
      if (item === `room`) {
        //checks to see if player input "examine room" then runs examine for current location
        console.log(currentLocation.examine);
      } else {
        item = roomLookup[item]; // checks to see if player input "examine" and the room name. Should fix this so it doesn't allow player to examine a room unless they're in it
        console.log(item);
        console.log(item.examine);
      }
    }
  }
}

function drop(item) {
  if (item.includes(`phone`)) {
    //phone, wallet, and key's aren't defined as objects, it's just always important to have them on you o7
    console.log(`Can't drop that, what if you get a text?`);
  } else if (item.includes(`wallet`)) {
    console.log(`You can't drop this, it's genuine leather!`);
  } else if (item.includes(`keys`)) {
    console.log(`How would you get home without your car keys?`);
  } else {
    item = item.split(` `).splice(-1).join(); //currently relies on intended items being last item in string
    if (itemLookup[item] !== undefined) {
      item = itemLookup[item];
      item.drop(item); // important to keep item in the parenthesis or it will return undefined and lock up program
    }
  }
}

function take(item) {
  //function for adding items to inventory
  if (item.includes(`key`)) {
    //check specifically for roof key
    item = roofKey;
    item.take(item);
  } else {
    item = item.split(` `).splice(-1).join(); //takes last word of input string (presumably the item, hope that input is right. Maybe way to compare all items in arrays and return common value? that could find any item in the input that is also in the room and return its value instead of just the last input item?)
    if (itemLookup[item] !== undefined) {
      //sanitizes input, checks for item
      item = itemLookup[item]; //sets item to it's object definition
      item.take(item); // runs useable object take function. Removes item from room inventory, adds it to player inventory
    } else {
      console.log(`Sorry, I don't understand.`);
    }
  }
}

function use(item) {
  //function for using an item
  if (item === undefined) {
    //returns sorry if item is not listed on item table
    console.log(`Sorry, I don't understand.`);
  } else {
    if (item.includes(`key`)) {
      //catch for specifically roof key right now
      if (currentLocation === northRoof) {
        item = roofKey;
        roofDoor.useable = true; //sets roof door to useable
        console.log(item.useEntry);
      } else {
        console.log(`There's no where to use that right now.`);
      }
    } else {
      item = item.split(` `).slice(-1).join(); // poor catch option, relies on used item being last word in string. Will improve on as with location catches
      if (itemLookup[item] !== undefined) {
        item = itemLookup[item];
        if (item.useable === true) {
          //checks for item being useable
          console.log(item.useEntry);
        } else {
          console.log(`Sorry, you can't use that right now.`);
        }
      }
    }
  }
}

class Character {
  //just the one Character right now. Maybe add more later? Different characters can access different things?
  constructor(name = `player`, desc = `this is me`, inventory = []) {
    this.name = name; //name of player
    this.desc = desc; //description of player
    this.inventory = inventory; //player inventory
  }
  checkInventory() {
    //checks player's inventory
    console.log(`You currently have ${this.inventory.join(`, `)}.`);
  }
}

let player = new Character(`player`, `This is me!`, [
  `phone`, // shouldn't go anywhere without PWK
  `wallet`,
  `keys`,
]);

// defining Room class
class Room {
  constructor(name = "", desc = "", exits = [], inventory = [], examine = "") {
    this.name = name; //name of room
    this.desc = wrap(desc, 60); // description of room
    this.exits = exits; // exits from this room
    this.inventory = inventory; //inventory of rooms
    this.examine = wrap(examine, 60); //more in-depth description of room
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
  `You enter the old factory. You find yourself in a long room that spans the length of the building, taking up most this floor. Structural supports dot the area. You can see a large puddle by the southern wall, some wooden stalls by the northern wall, a brick structure in the center of the room that runs up into the ceiling, and you can see a door to a stairwell on the north wall. The back of the room fades into shadow. `,
  [`north stairwell`, `south stairwell`, `outside`],
  [`roof key`, `flashlight`],
  `You walk a loop around the bottom floor. The stalls appear to be plywood, set up by someone after the factory closed. They're covered in graffiti. The brick structure in the middle of the room is an old elevator lift shaft. The back wall has a large freight door, it's chained shut. There is a second stairwell on the southern wall.`
);

let northStair = new Room( // next room in building after room 1. Not sure what will be in here yet
  `north stairwell`,
  `This stairwell is in disrepair. A few steps are missing, but none that make it impossible to use. This stairwell can take to you to the second floor and the roof.`,
  [`main floor`, `second floor`, `roof`, `north roof`],
  [`roof door`],
  `You look around the stairwell carefully, but there's nothing special to be found here.`
);

let southStair = new Room( // room after room 3. Not sure what is in here yet. Has hidden passage to room 7.
  `south stairwell`,
  `This stairwell is in serious disrepair. It goes up to the second floor, but you have to navigate carefully. The stairway up to roof here has totally collapsed and it impassable.`,
  [`main floor`, `second floor`],
  [`brick`],
  `You look around the stairwell and find a brick.`
);

let secondFloor = new Room( // room after room 4. Has doors to rooms 4, 6, and 8. Room 8 is a secret room behind a bookshelf
  `second floor`,
  `This floor is as large as the first. There is a similar brick shaft in the middle of the room. In the northeastern section of the room you can see a large object.`,
  [`north stairwell`, `south stairwell`],
  [`backpack`],
  `You take a walk around the room. This floor has less large objects in it than the first, although it is scattered with pieces of the roof that have fallen in over the years. The back wall of this floor also has a set of large doors on the eastern  wall that could slide open at one point. One of the sliding doors has fallen off, leaving the side of the building open here. The large object in the northeast corner is an old textile work line.`
);

let northRoof = new Room( // final room. Not sure what will be here. Boss fight of some kind? Secret passage to/from room 7 behind a tapestry
  `north roof`,
  `You open the stairwell door and stand out on the roof. Much of it is missing, fallen into the floor below. There is a solid area just around the door, and you can see another stretch of stable foot on the eastern side that has something on it, although you can't quite see what it is.`,
  [`north stairwell`],
  [],
  `You look around more carefully. You still can't quite make out what's on the other portion of the roof, but you can just see the top of an old fire escape over on the eastern wall. You also find a piece of paper tucked under a brick that says "You've gone the wrong way, the cool stuff is in the basement."`
);

let eastRoof = new Room(
  `eastern roof`,
  `You climb up the fire escape onto the portion of roof you could just see from by the stairwell. The object you couldn't quite make out was a pair of lawn chairs, apparently set up to stargaze. The safely usable footing here is fairly small, only a little bigger than the space the chairs take up.`,
  [`second floor`],
  [`quarter`],
  `You look around the chairs and find a quarter someone must have dropped.`
);

let basement = new Room( // the basement. Unfinished in program as yet
  `basement`,
  `You walk down the steps into the basement. A single naked light bulb hangs from the ceiling, lighting the small room. On the wall opposite you stands... a vending machine. It's running, humming gently as it keeps it's contents cold.`,
  [`outside`],
  [`coca-cola`],
  `You look around the room more carefully. The only thing in here is the light and the vending machine.`
);

let roomLookup = {
  //lookup table for room, included other name that might be used
  outside: outside,
  "main floor": mainFloor,
  inside: mainFloor,
  "second floor": secondFloor,
  "north stairwell": northStair,
  "northern stairwell": northStair,
  "south stairwell": southStair,
  "southern stairwell": southStair,
  "north roof": northRoof,
  roof: northRoof,
  "eastern roof": eastRoof,
  "fire escape": eastRoof,
  basement: basement,
};

//defining interactable object class
class useableThing {
  //we're gonna have things
  constructor(
    name, //name for item
    desc = ``, // description of items
    useable = false, // can this thing be used?
    addToInventory = false, //can this thing be added to inventory? prefer false default here
    useEntry = ``, //text for when an item is used
    examine = `` //more in depth description
  ) {
    this.name = name;
    this.desc = wrap(desc, 60); //wraps all descriptions at 60 characters
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
      if (
        currentLocation.inventory.includes(item.name) &&
        item.useable === true // checks that an item is in the current location and if it can be added to inventory
      ) {
        //input is sanitized by global take(), need to use item.name to do actual check for item
        //checks for item in room's inventory
        index = currentLocation.inventory.indexOf(item); // takes index of item if it's present
        currentLocation.inventory.splice(index, index + 1); //splices item out of room's inventory
        player.inventory.push(item.name); // adds item to player's inventory
        console.log(`You pick up the ${item.name}.`); // tells player the item is in their inventory
      } else {
        console.log(`There's nothing like that here.`); //lets player know there isn't anything like that to pick up
      }
    }
  }

  drop(item) {
    // very similar to take(), just in reverse. Removes item from player inventory and adds it to room inventory
    if (player.inventory.includes(item.name)) {
      index = player.inventory.indexOf(item); // find item index in array
      player.inventory.splice(index, index + 1); //removes item from player inventory
      currentLocation.inventory.push(item.name); //adds item to location inventory
      console.log(`You drop the ${item.name}.`); //tells player they dropped it
    } else {
      console.log(`You aren't carrying anything like that.`); //lets player know they aren't carrying anything
    }
  }
  use() {
    //let user use an item
    if (this.useable === true) {
      //will eventually let me put in things to be used
      if (this === roofKey && currentLocation === northStair) {
        //checks for key and north stairwell before unlocking the door
        roofDoor.useable = true;
        return console.log(`You use the key to unlock the door.`);
      }
      console.log(`You cannot use this here.`);
    } else {
      console.log(`You cannot use this right now.`);
    }
  }
  examine() {
    // lets user take closer look at item
    console.log(this.examine);
  }
}

// defining useable objects. Some
let roofDoor = new useableThing( //is locked. Opens with roof key on first floor in elevator shaft
  `roof door`,
  `This door goes up to the roof.`,
  false,
  false,
  `You open the door and step out onto the roof.`,
  `The door is locked. It looks weathered.`
);

let basementDoor = new useableThing( // opens. Doesn't unlock, must be pried open with something.
  `basement door`,
  `This storm cellar door is built into the northern wall of the building.`,
  false,
  false,
  `The basement door is locked.`
);

let rebar = new useableThing( // rebar is a steel rod usually used to reinforce concrete. In this instance, it could potentially be used as a makeshift crowbar. Haven't put that in yet.
  `rebar`,
  `a piece of rebar`,
  true,
  true,
  ``,
  `This rebar is about 2 feet long. It could maybe be used to leverage something.`
);

let quarter = new useableThing( //this is an American 25 cent coin
  `quarter`,
  `a 25 cent coin`,
  false,
  true,
  `n/a`,
  `It's just a regular quarter.`
);

let note = new useableThing( //it's a note, you can read it
  `small paper`,
  `This small piece of paper has a message written on it.`,
  false,
  true,
  "",
  `You read the message on the paper: "You've gone the wrong way, the cool stuff is in the basement. Passcode is 3264."`
);

let flashlight = new useableThing( //it's a flashlight, it lights things up
  `flashlight`,
  `This is small maglite someone must have dropped or forgotten. It turns on without issue.`,
  true,
  true,
  `You turn on the flashlight.`,
  `You examine the flashlight, but there's nothing special about it.`
);

let backpack = new useableThing( // it's a backpack. At present it's just a set piece
  `backpack`,
  `This is a backpack in decent shape. It look like it was left here on purpose, whoever owns it will probably be back for it.`,
  false,
  false,
  `You look in the backpack. It has a change of clothes and some miscellaneous personal things in it.`
);

let cokeMachine = new useableThing( // will eventually give you an ice cold coke for only a quarter!
  `vending machine`,
  `A Coca-cola branded vending machine.`,
  false,
  false,
  `You input the code and your money. A fresh coke comes out.`,
  `You look more closely at the vending machine. It has a keypad that apparently takes 4 digits and a coin slot.`
);

let fireEscape = new useableThing( //fire escape is Used to move from second floor to East Roof
  `fire escape`,
  `an old fire `,
  true,
  false,
  `You take the fire escape up to the roof.`,
  `You look out onto the fire escape. It only goes from the second floor to the roof, the rest has fallen away. It's rickety, but seems sturdy enough you could use it.`
);

let roofKey = new useableThing( //key for the door that goes to the roof
  `roof key`,
  `a key`,
  true,
  true,
  `You insert the key into the lock.`,
  `It's an old key. Any branding or label it may have had have come off.`
);

let elevator = new useableThing( //set as useable thing for now, will probably be moved to unusable things later
  `elevator shaft`,
  `An old brick elevator shaft. It isn't large, probably only meant for sending small loads, not people. Closer to a dumbwaiter, really.`,
  false,
  false,
  ``,
  `You see a glint in the dirt at the bottom. There's a key sitting there.`
);

let itemLookup = {
  // lookup for interactable objects
  elevator: elevator,
  "old elevator": elevator,
  "old lift": elevator,
  "roof key": roofKey,
  "roof door": roofDoor,
  "basement door": basementDoor,
  "cellar door": basementDoor,
  rebar: rebar,
  quarter: quarter,
  coin: quarter,
  flashlight: flashlight,
  note: note,
  backpack: backpack,
  "fire escape": fireEscape,
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
  // haven't used this, but I'm sure it'll come in handy
  shaft: elevator,
  elevator: elevator,
  "wooden stalls": stalls,
  puddle: puddle,
  "old textile line": oldLine,
  "textile line": oldLine,
  table: oldLine,
  "lawn chairs": chairs,
  building: building,
};

let transitions = {
  // array table for allowable transitions
  outside: [`main floor`, `inside`, `basement`],
  "main floor": [`outside`, `north stairwell`, `south stairwell`],
  "second floor": [`north stairwell`, `south stairwell`, `fire escape`],
  "north stairwell": [`main floor`, `second floor`, `roof`, `north roof`],
  "south stairwell": [`main floor`, `second floor`],
  "north roof": [`north stairwell`],
  "east roof": [`second floor`],
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
  message = message.toLowerCase();
  if (message.includes(`y`)) {
    //catches 'yes' variations 'yep' 'ya' 'yeah' etc
    message = `yes`;
  }
  while (message !== `yes`) {
    if (message.includes(`n`)) {
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
    await sleep(500);
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
    //the Big While Loop
    reply = reply.toLowerCase(); // sanitize input to lowercase
    console.log(reply);
    if (reply.includes(`move`)) {
      //check to see if user is trying to move
      moveLocation(reply);
    } else if (reply.includes(`examine`) || reply.includes(`read`)) {
      //checks to see if they want to examine
      examine(reply);
    } else if (reply.includes(`take`)) {
      // checks to see if they want to add something to their inventory
      take(reply);
    } else if (reply.includes(`drop`)) {
      // checks to see if they want to remove something from their inventory
      drop(reply);
    } else if (reply.includes(`check`) || reply.includes(`inventory`)) {
      //checks character's inventory
      player.checkInventory();
    } else if (reply.includes(`use`)) {
      use(reply);
    } else {
      console.log(`\nI'm sorry, I didn't understand.`); //
    }
  }
}

gameLaunch();
