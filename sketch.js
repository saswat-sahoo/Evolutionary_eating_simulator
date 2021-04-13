let vehicles = [];
let food = [];
let poison = [];
let debug
let button;
let population=100;
let foodSize=200;
let poisonSize=30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < population; i++) {
    let x = random(width);
    let y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

  for (let i = 0; i < foodSize; i++) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  for (let i = 0; i < poisonSize; i++) {
    let x_ = random(width);
    let y_ = random(height);
    poison.push(createVector(x_, y_));
  }

  frameRate(30);
  button = createButton("on");
  button.position(10, 10);
  button.mousePressed(toggle);
  // debug = true;
}

function toggle() {
  if (debug == true) {
    debug = false;
  } else {
    debug = true;
  }
}

function draw() {


  if (random(1) < 0.5) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  if (random(1) < 0.01) {
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }
  background(51);



  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8);
  }
  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8);
  }
  // Call the appropriate steering behaviors for our agents
  for (let i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].behaviours(food, poison);
    vehicles[i].boundaries();
    vehicles[i].update();
    vehicles[i].display();

    let newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    if (vehicles[i].dead()) {
      let x=vehicles[i].position.x;
      let y=vehicles[i].position.y;
      food.push(createVector(x,y));
      vehicles.splice(i, 1);
    }
  }
}