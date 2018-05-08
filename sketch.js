// TODO: Gamestart + Help
// TODO: Gameover
// TODO: Continue HUD
// TODO: Asteroids
// IDEA: Various Weapons
// IDEA: Gimmicks > Portal Weapon?
// IDEA: Power-Ups (Speed, Damage, Shield)

var
  ship,
  stars = [],
  projectiles = [],
  asteroids = [],
  stats,
  debuginfo,
  directions;

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
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
  init();
}

function init() {
  debuginfo = {
    enabled: false,
    fps: 0,
    brake: false,
    slowaim: false,
    speedlocked: false,
    boost: false,
    hyperboost: false,
    shipDirection1: 0,
    shipDirection2: "",
    shipX: 0,
    shipY: 0
  };
  stats = {
    enabled: false,
    shots: 0,
    missed: 0,
    score: 0,
    energy: 0,
    accuracy: 0
  };
  for (let s = 0; s < 7; s++) {
    asteroids.push(new Asteroid(asteroids, {
      min: 80,
      max: 115
    }, 0));
  }
  for (let s = 0; s < 18; s++) {
    asteroids.push(new Asteroid(asteroids, {
      min: 35,
      max: 65
    }, 0));
  }
  ship = new Ship(asteroids, random(TAU), 18, 0.1);
  for (let s = 0; s < 90; s++) {
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
    star.update();
  });
  asteroids.forEach(asteroid => {
    asteroid.update();
  });
  projectiles.forEach(projectile => {
    projectile.update(asteroids);
    stats.missed += projectile.offEdge(projectiles);
  });
  ship.update();
  controls();
  calcValues();
  showHUD();

  if (debuginfo.enabled) {
    this.debug();
    stars.forEach(star => {
      star.debug();
    });
    asteroids.forEach(asteroid => {
      asteroid.debug();
    });
    projectiles.forEach(projectile => {
      projectile.debug();
    });
    ship.debug(asteroids);
  }
  pop();
}

function controls() {
  if (keyIsDown(87)) {
    ship.brake = true;
  } else {
    ship.brake = false;
  }
  if (keyIsDown(81)) {
    ship.speedlocked = true;
  } else {
    ship.speedlocked = false;
  }
  if (keyIsDown(69)) {
    ship.slowaim = true;
  } else {
    ship.slowaim = false;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (ship.slowaim && ship.energy > 0) {
      ship.rotation = (TAU / 250);
    } else {
      ship.rotation = (TAU / 100);
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    if (ship.slowaim && ship.energy > 0) {
      ship.rotation = -(TAU / 250);
    } else {
      ship.rotation = -(TAU / 100);
    }
  } else {
    ship.rotation = 0;
  }
  if (keyIsDown(UP_ARROW)) {
    ship.boost = true;
    if (keyIsDown(SHIFT)) {
      ship.hyperboost = true;
    } else {
      ship.hyperboost = false;
    }
  } else {
    ship.boost = false;
    ship.hyperboost = false;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      let parents = [ship];
      ship.clones.forEach(clone => {
        parents.push(clone)
      });
      parents.forEach(parent => {
        let projectile = new Blaster(parent);
        if (projectile.offEdge(false) == false) {
          stats.shots++;
          projectiles.push(projectile);
        }
      });
      break;
    case 189:
      debuginfo.enabled = !debuginfo.enabled;
      break;
  }
}

function calcValues() {
  stats.score = (-stats.missed * 10);
  stats.energy = ship.energy;
  if (stats.shots > 0) {
    stats.accuracy = round((stats.shots - stats.missed) / (stats.shots / 100));
  } else {
    stats.accuracy = 0;
  }
  debuginfo.fps = getFrameRate().toFixed(0);
  debuginfo.boost = ship.boost;
  debuginfo.hyperboost = ship.hyperboost;
  debuginfo.brake = ship.brake;
  debuginfo.speedlocked = ship.speedlocked;
  debuginfo.slowaim = ship.slowaim;
  debuginfo.shipDirection1 = ship.head.toFixed(2);
  debuginfo.shipDirection2 = ship.sdir;
  debuginfo.shipX = ship.position.x.toFixed(2);
  debuginfo.shipY = ship.position.y.toFixed(2);
}

function showHUD() {
  push();
  translate(-width / 2, -height / 2);
  strokeWeight(0);

  fill(255, 50);
  rect(15, height - 30, 200, 15);

  fill(255, (80 / 100) * ship.energy);
  rect(15, height - 30, ship.energy, 15);

  pop();
}

function debug() {
  push();
  translate(-width / 2 + 15, -height / 2 + 30);
  strokeWeight(0);
  textSize(16);
  fill(255);
  let i = 0;
  for (key in stats) {
    if (key != 'enabled') {
      text(`${key}: ${stats[key]}`, 0, i * 20);
      i++;
    }
  }
  for (key in debuginfo) {
    if (key != 'enabled') {
      text(`${key}: ${debuginfo[key]}`, 0, i * 20);
      i++;
    }
  }
  pop();
}