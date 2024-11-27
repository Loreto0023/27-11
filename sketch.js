let font;
let tSize = 150; // Text Size
let pointCount = 0.9; // Between 0 - 1 (point count)
let speed = 10; // Speed of the particles
let comebackSpeed = 100; // Lower means less interaction
let dia = 50; // Diameter of interaction
let randomPos = true; // Starting points
let pointsDirection = "general"; // Movement direction: left, right, up, down, general
let interactionDirection = -1; // Interaction direction: -1 and 1

let textPoints = [];
let words = ['welcome', 'have', 'fun', 'be', 'creative', 'music', 'love', 
             'Loreto', 'interact', 'a', 'focus', 'on', 'making','artists','designers', 'feel', 'free', 
             'and', 'enjoy', 'be', 'kind', 'is', 'free', ];

let wordCount = 15; // Number of words to display
let hue;
let position;

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf"); // Load your font
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Create canvas that adapts to window size

  // Set the text alignment to center and set the color mode to HSB.
  textAlign(CENTER);
  colorMode(HSB);

  // Define hue as a random value for the words
  hue = random(180, 360);

  // Define the random starting point for selecting the words in the array.
  position = floor(random(0, words.length - wordCount));

  background(hue, 95, 25); // Set the background color for the canvas

  // Generate particles for each word
  for (let i = 0; i < wordCount; i++) {
    let word = words[position + i];
    let wordX = random(width);
    let wordY = random(height);
    
    // Generate points from the current word
    let points = font.textToPoints(word, wordX, wordY, tSize, {
      sampleFactor: pointCount,
    });

    // Create Interact objects for each point in the word
    for (let pt of points) {
      let relativeX = pt.x / width;
      let relativeY = pt.y / height;

      // Adjust the particle position to be relative to window size
      let textPoint = new Interact(
        relativeX * width,
        relativeY * height,
        speed,
        dia,
        randomPos,
        comebackSpeed,
        pointsDirection,
        interactionDirection
      );
      textPoints.push(textPoint);
    }
  }
}

function draw() {
  background(0, 0, 0, 50); // Add a slight fading effect to the background (translucent)

  // Update and display each text point (particle)
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Draw the words randomly on the canvas (but they are only there for visualization, not for particle generation)
  for (let i = 0; i < wordCount; i++) {
    textSize(random(16, 48)); // Random text size for each word
    fill(hue, 200, random(50, 95)); // Random fill color for each word
    text(words[position + i], random(width), random(height)); // Draw the words
  }
}

// Define the particle class for text particles
function Interact(x, y, m, d, t, s, di, p) {
  // If randomPos is true, start the particles at random positions
  if (t) {
    this.home = createVector(random(width), random(height));
  } else {
    this.home = createVector(x, y); // Otherwise, use the text position
  }

  // Store current position and set target position to home
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  // Set the velocity based on the movement direction
  if (di == "general") {
    this.vel = createVector();
  } else if (di == "up") {
    this.vel = createVector(0, -y);
  } else if (di == "down") {
    this.vel = createVector(0, y);
  } else if (di == "left") {
    this.vel = createVector(-x, 0);
  } else if (di == "right") {
    this.vel = createVector(x, 0);
  }

  // Acceleration, radius, max speed, and force values
  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;

  // Asignar un color aleatorio a cada partícula
  this.color = color(random(255), random(255), random(255)); // Color aleatorio RGB
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target); // Arrive at target
  let mouse = createVector(mouseX, mouseY); // Mouse position
  let flee = this.flee(mouse); // Flee from mouse if close

  // Apply forces to the particle (arrive + flee)
  this.applyForce(arrive);
  this.applyForce(flee);
}

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
}

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
}

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  // If the mouse is within the interaction diameter, the particle flees
  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir); // Use interaction direction
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0); // No force if the mouse is too far
  }
}

Interact.prototype.update = function () {
  this.pos.add(this.vel); // Update position based on velocity
  this.vel.add(this.acc); // Update velocity based on acceleration
  this.acc.mult(0); // Reset acceleration for the next frame
}

Interact.prototype.show = function () {
  // Usar el color aleatorio generado para cada partícula
  stroke(this.color); // Establecer el color de la partícula
  strokeWeight(4);
  point(this.pos.x, this.pos.y); // Dibuja la partícula como un punto
}

/*function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas
  textPoints = []; // Clear existing particles
  // Regenerate particles based on new window size
  for (let i = 0; i < wordCount; i++) {
    let word = words[position + i];
    let wordX = random(width);
    let wordY = random(height);

    // Generate points from the current word
    let points = font.textToPoints(word, wordX, wordY, tSize, {
      sampleFactor: pointCount,
    });

    // Create Interact objects for each point in the word
  }
  for (let pt of points) {
      let relativeX = pt.x / width;
      let relativeY = pt.y / height;

      // Adjust the particle position to be relative to window size
  }
}*/