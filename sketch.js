let treeImg;
let carImg;
let bikeImg;
let startMillis;
let startSec;
let startMin;
let startHr;

// Load in images
function preload() {
    treeImg = loadImage('pngtree-top-view-tree-landscape-element-vector-png-image_7117841.png');
    carImg = loadImage('car-above-top-view-cute-cartoon-shadows-modern-urban-civilian-vehicle-one-collection-set-simple-icon-logo-176534546-removebg-preview.png')
    bikeImg = loadImage('man-riding-bike-view-above-cyclist-bicycle-flat-vector-illustration-man-riding-bike-view-above-cyclist-bicycle-189629477-removebg-preview.png')
    humanImg = loadImage('human.png')
}

function setup() {
    createCanvas(windowWidth, windowHeight); // make an HTML canvas element width x height pixels

    // Capture starting clock values to build continuous timers
    startMillis = millis();
    startSec = second();
    startMin = minute();
    startHr = hour();
}

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    // Continuous timers based on elapsed time since sketch start (no backward jumps)
    let elapsedSec = (millis() - startMillis) / 1000;
    let tSec = startSec + elapsedSec;                        // cumulative seconds since start
    let tMin = startMin + startSec / 60 + elapsedSec / 60;   // minutes with starting seconds
    let tHr  = startHr + startMin / 60 + startSec / 3600 + elapsedSec / 3600; // hours with fraction

    background('#E1F0FF');
    textSize(32);
    fill('#B4B4B4');
    text(hr, 10, 30);
    fill('#646464');
    text(min, 10, 60);
    fill('#000000');
    text(sec, 10, 90);

    // Green Area
    fill('#5b9f4aff');
    circle(width/2, height/2, 1000);

    // Outer Sidewalk 
    fill('#969696');
    circle(width/2, height/2, 800);

    // Road
    fill('#505050');
    circle(width/2, height/2, 650);

    // Dotted white line circles inside the road
    drawDashedCircle(width/2, height/2, 550, '#FFFFFF', 1);
    drawDashedCircle(width/2, height/2, 450, '#FFFFFF', 1);

    // Reset Stroke
    stroke('#000000');
    strokeWeight(1);

    // Bike Lane
    fill('#B4B4B4');
    circle(width/2, height/2, 350);

    // Inner Sidewalk
    fill('#969696');
    circle(width/2, height/2, 300);

    // Water Fountain Pool
    stroke('#8f8b8bff');
    strokeWeight(8);
    fill('#6496C8');
    circle(width/2, height/2, 150);

    // Fountain Water Fall
    fill('#5078B4');
    circle(width/2, height/2, 60);

    // Reset Stroke
    stroke('#000000');
    strokeWeight(1);

    // Fountain Spout
    fill('#d3ddedff');
    circle(width/2, height/2, 10);

    // Hour shadow (triangular slice rotating with hour)
    drawHourShadow(tHr);

    // Draw trees around the green area
    drawTrees();
    
    // Draw cars: one lap every 60 seconds
    drawMovingObject(tSec, carImg, 300, 60)
    drawMovingObject(tSec, carImg, 250, 60)
    drawMovingObject(tSec, carImg, 200, 60)

    // Draw human: minute progression (one lap every 60 minutes)
    drawMovingObject(tMin, humanImg, 100, 60)

    // Transparent Sunlight Area
    fill('#d8d6c514');
    circle(width/2, height/2, 1000);
}

// Draw hour shadow as a rotating triangle from center
function drawHourShadow(tHr) {
    let angle = ((tHr % 12) / 12) * TWO_PI - PI/2; // Hour angle (12-hour clock)
    let shadowWidth = 0.1; // Angular width of shadow at outer edge
    let shadowRadius = 500; // Extend to edge of green area
    
    push();
    translate(width/2, height/2);
    
    fill('#4b3b3325'); // Semi-transparent gray
    noStroke();
    
    beginShape();
    vertex(0, 0); // Vertex at fountain spout center
    // Wide base at green area edge
    vertex(cos(angle - shadowWidth) * shadowRadius, sin(angle - shadowWidth) * shadowRadius);
    vertex(cos(angle + shadowWidth) * shadowRadius, sin(angle + shadowWidth) * shadowRadius);
    endShape(CLOSE);
    
    pop();
}

// Easily draws trees
function drawTrees() {
    let treeCount = 12;
    let radius = 450; // Inside the green area
    
    for (let i = 0; i < treeCount; i++) {
        let angle = (i / treeCount) * TWO_PI; // Place around circular grass area
        let x = width/2 + cos(angle) * radius;
        let y = height/2 + sin(angle) * radius;
        
        // Draw image
        image(treeImg, x - 25, y - 25, 50, 50);
    }
}

// For object movement. time = current time value, objImage = image to draw, radius = position, period = time units per rotation
function drawMovingObject(time, objImage, radius, period) {
    // Wrap time within the period to keep motion continuous and forward
    let wrapped = time % period;
    let angle = (wrapped / period) * TWO_PI - PI/2;

    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    
    push();
    translate(x, y);
    rotate(angle + PI); // Rotate to face direction of travel
    
    // Draw car image
    imageMode(CENTER);
    image(objImage, 0, 0, 50, 50);
    imageMode(CORNER); // Reset to normal
    
    pop();
}

// For road dashes
function drawDashedCircle(x, y, diameter, color, weight) {
    let radius = diameter / 2;
    let dashLength = 15;
    let gapLength = 10;
    let circumference = TWO_PI * radius;
    let dashCount = circumference / (dashLength + gapLength);
    
    stroke(color);
    strokeWeight(weight);
    noFill();
    
    for (let i = 0; i < dashCount; i++) {
        let startAngle = (i * (dashLength + gapLength)) / radius;
        let endAngle = startAngle + dashLength / radius;
        arc(x, y, diameter, diameter, startAngle, endAngle);
    }
}