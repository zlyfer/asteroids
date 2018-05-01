var
  ship,
  stars = [],
  projectiles = [];

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
  projectiles.forEach(projectile => {
    for (i = 0; i < 20; i++) {
      projectile.fly();
    }
    projectile.show();
    projectile.edge(projectiles);
  });
  ship.update();
  controls();
  console.log(frameCount / (millis() / 1000));
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

function keyPressed() {
  if (keyCode == 32) {
    projectiles.push(new Projectile(ship));
    if (ship.clone) {
      projectiles.push(new Projectile(ship.clone));
    }
  }
}