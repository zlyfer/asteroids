var
  ship,
  stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship(0, 0, -TAU / 4, 15, 0.1);
  for (let s = 0; s < round((width + height) / 10); s++) {
    stars.push(new Star());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  stars.forEach(star => {
    star.blink();
    star.show();
  });
  ship.update();
  controls();

}

function controls() {
  if (keyIsDown(RIGHT_ARROW)) {
    ship.rotation = 0.08;
  } else if (keyIsDown(LEFT_ARROW)) {
    ship.rotation = -0.08;
  } else {
    ship.rotation = 0;
  }
  if (keyIsDown(UP_ARROW)) {
    ship.boost = true;
  } else {
    ship.boost = false;
  }
}