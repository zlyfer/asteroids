var
  ship,
  stars = [],
  projectiles = [];
var
  hyperboost = 100;
var
  stats = {
    enabled: false,
    shots: 0,
    missed: 0,
    score: 0,
    speed: 0,
    accuracy: 0,
    hyperboost: 100
  };
var directions;


function setup() {
  createCanvas(windowWidth, windowHeight);
  directions = {
    n: (6 / 8) * TAU,
    ne: (7 / 8) * TAU,
    e: (8 / 8) * TAU,
    se: (1 / 8) * TAU,
    s: (2 / 8) * TAU,
    sw: (3 / 8) * TAU,
    w: (4 / 8) * TAU,
    nw: (5 / 8) * TAU
  };
  ship = new Ship(0, 0, directions.n, 18, 0.1);
  for (let s = 0; s < round((width + height) / 10); s++) {
    stars.push(new Star());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  push();
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
    stats.missed += projectile.edge(projectiles);
  });
  ship.update();
  controls();
  pop();
  if (stats.enabled) {
    showStats();
  }
  showHUD();
}

function controls() {
  if (keyIsDown(RIGHT_ARROW)) {
    ship.rotation = (TAU / 75);
    ship.rotation = (TAU / 250);
  } else if (keyIsDown(LEFT_ARROW)) {
    ship.rotation = -(TAU / 75);
  } else {
    ship.rotation = 0;
  }
  if (keyIsDown(UP_ARROW)) {
    ship.boost = true;
    if (keyIsDown(SHIFT)) {
      if (stats.hyperboost > 0) {
        ship.hyperboost = true;
        stats.hyperboost--;
      } else {
        ship.hyperboost = false;
      }
    }
  } else {
    ship.boost = false;
  }
  if (!keyIsDown(SHIFT) || !keyIsDown(UP_ARROW)) {
    ship.hyperboost = false;
    if (stats.hyperboost < 100) {
      stats.hyperboost++;
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      stats.shots++;
      if (ship.shootedge()) {
        projectiles.push(new Projectile(ship));
      }
      if (ship.clone) {
        if (ship.clone.shootedge()) {
          projectiles.push(new Projectile(ship.clone));
        }
      }
      break;
    case 49:
      stats.enabled = !stats.enabled;
      break;
  }
}

function showStats() {
  let i = 0;
  stats.score = (-stats.shots * 10);
  stats.speed = ship.strength;
  if (stats.shots > 0) {
    stats.accuracy = round((stats.shots - stats.missed) / (stats.shots / 100));
  } else {
    stats.accuracy = 0;
  }
  push();
  translate(15, 30);
  strokeWeight(0);
  textSize(16);
  fill(244, 67, 54);
  for (key in stats) {
    if (key != 'enabled') {
      text(`${key}: ${stats[key]}`, 0, i * 20);
      i++;
    }
  }
  pop();
}

function showHUD() {
  push();
  fill(255, (230 / 100) * stats.hyperboost);
  strokeWeight(0);
  rect(15, height - 30, stats.hyperboost * 1.5, 15);
  pop();
}