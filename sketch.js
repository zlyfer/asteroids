var
  ship,
  stars = [],
  projectiles = [],
  shots = 0,
  missed = 0,
  statsE = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship(0, 0, -TAU / 4, 18, 0.1);
  for (let s = 0; s < round((width + height) / 10); s++) {
    stars.push(new Star());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  if (statsE) {
    showStats();
  }
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
    missed += projectile.edge(projectiles);
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

function keyPressed() {
  switch (keyCode) {
    case 32:
      shots++;
      projectiles.push(new Projectile(ship));
      if (ship.clone) {
        projectiles.push(new Projectile(ship.clone));
      }
      break;
    case 49:
      statsE = !statsE;
      break;
  }
}

function showStats() {
  let accuracy, score, speed;
  stats = ['score', 'accuracy', 'speed'];

  score = (-shots * 10);
  speed = ship.strength;
  if (shots > 0) {
    accuracy = round((shots - missed) / (shots / 100)) + "%";
  } else {
    accuracy = '0%';
  }

  push();
  translate(15, 30);
  strokeWeight(0);
  textSize(16);
  fill(244, 67, 54);
  stats.forEach(key => {
    text(`${key} ${eval(key)}`, 0, stats.indexOf(key) * 20);
  });
  pop();
}