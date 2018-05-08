// TODO: Thruster on Sides
// TODO: Brake Thruster & Speedlocked visualisation

class Ship {
  constructor(asteroids, head, size, acceleration, isClone = false) {
    this.size = size;
    if (asteroids) {
      this.genPos(asteroids);
    } else {
      this.position = createVector(-height / 2 - this.size, -width / 2 - this.size);
    }
    this.head = head;
    this.rotation = 0;
    this.velocity = createVector(0, 0);
    this.boost = false;
    this.brake = false;
    this.slowaim = false;
    this.hyperboost = false;
    this.speedlocked = false;
    this.acceleration = 0;
    this.oacceleration = acceleration;
    this.isClone = isClone;
    this.strength = 0;
    this.energy = 200;
    this.sdir = this.getSDir(this.head);
    this.clones = [];
    if (!isClone) {
      for (let i = 0; i < 8; i++) {
        this.clones.push(new Ship(false, false, size, acceleration, true));
      }
    }
  }

  genPos(asteroids) {
    this.position = createVector(
      random((-width / 2) + this.size, (width / 2) - this.size),
      random((-height / 2) + this.size, (height / 2) - this.size)
    );
    while (this.collidesAsteroid(asteroids, false)) {
      this.position = createVector(
        random((-width / 2) + this.size, (width / 2) - this.size),
        random((-height / 2) + this.size, (height / 2) - this.size)
      );
    }
  }

  update() {
    this.getSDir();
    if (!this.isClone) {
      this.strength = (abs(this.velocity.x) + abs(this.velocity.y)) / (this.oacceleration * 100) * 100;

      if ((!this.speedlocked || this.boost || this.strength == 0) &&
        !this.hyperboost &&
        !this.slowaim &&
        (!this.brake || this.strength == 0) &&
        this.energy < 200
      ) {
        this.energy++;
      }
      if (
        (
          (this.strength > 0 && this.brake) ||
          this.slowaim ||
          (!this.boost && this.speedlocked && this.strength > 0) ||
          (this.hyperboost && this.boost)
        ) &&
        this.energy > 0
      ) {
        this.energy--;
      }
      this.head += this.rotation;
      if (this.boost) {
        this.acceleration = this.oacceleration;
        if (this.hyperboost && this.energy > 0) {
          this.acceleration = this.oacceleration * 2;
        }
        this.velocity.add(p5.Vector.fromAngle(this.head).mult(this.acceleration));
      }
      if (this.brake && this.energy > 0) {
        this.velocity.mult(0.95);
      } else if (this.speedlocked && !(this.boost) && this.energy > 0) {
        this.velocity.mult(0.999);
      } else {
        this.velocity.mult(0.987);
      }
      this.position.add(this.velocity);
    }
    if (!this.offEdge() || !this.isClone) {
      this.show();
      this.thrusterBack();
    }
    if (!this.isClone) {
      this.clones.forEach(clone => {
        clone.update();
      });
      this.edge();
      this.updateClones();
    }
  }

  thrusterBack() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    if (this.boost) {
      fill(random(((240 / 100) * this.strength) / 5, (255 / 100) * this.strength));
    } else {
      fill((255 / 100) * this.strength);
    }
    strokeWeight(0);
    quad(-this.size - 2, this.size + 1, 0, (this.size / 1.8) + 1, this.size + 2, this.size + 1, 0, (this.size / 1.8) + this.strength / 2.8);
    pop();
  }

  getSDir() {
    let d = abs(((this.head + PI / 2) % TAU) / (TAU / 8)).toFixed(1);
    if ((d > 0 && d <= 0.5) || (d <= 0 && d > 7.5) || d == 0) {
      this.sdir = 'N';
    } else if (d > 0.5 && d <= 1.5) {
      this.sdir = 'NW';
    } else if (d > 1.5 && d <= 2.5) {
      this.sdir = 'W';
    } else if (d > 2.5 && d <= 3.5) {
      this.sdir = 'SW';
    } else if (d > 3.5 && d <= 4.5) {
      this.sdir = 'S';
    } else if (d > 4.5 && d <= 5.5) {
      this.sdir = 'SE';
    } else if (d > 5.5 && d <= 6.5) {
      this.sdir = 'E';
    } else if (d > 6.5 && d <= 7.5) {
      this.sdir = 'NE';
    }
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(1.8);
    stroke('rgb(200, 200, 200)');
    fill('rgb(90, 90, 90)');
    quad(0, -this.size, -this.size, this.size, 0, this.size / 1.8, this.size, this.size);
    pop();
  }

  updateClones() {
    let clones = this.clones;
    clones[0].position.x = this.position.x;
    clones[0].position.y = (height) + this.position.y;
    clones[1].position.x = this.position.x;
    clones[1].position.y = (-height) + this.position.y;
    clones[2].position.x = (width) + this.position.x;
    clones[2].position.y = this.position.y;
    clones[3].position.x = (-width) + this.position.x;
    clones[3].position.y = this.position.y;
    clones[4].position.x = (-width) + this.position.x;
    clones[4].position.y = (-height) + this.position.y;
    clones[5].position.x = (-width) + this.position.x;
    clones[5].position.y = (height) + this.position.y;
    clones[6].position.x = (width) + this.position.x;
    clones[6].position.y = (-height) + this.position.y;
    clones[7].position.x = (width) + this.position.x;
    clones[7].position.y = (height) + this.position.y;
    clones.forEach(clone => {
      clone.head = this.head;
      clone.strength = this.strength
    });
  }

  edge() {
    if (this.position.y + this.size < -height / 2) {
      this.position.y = height / 2 - this.size;
    }
    if (this.position.y - this.size > height / 2) {
      this.position.y = -(height / 2) + this.size;
    }
    if (this.position.x + this.size < -width / 2) {
      this.position.x = width / 2 - this.size;
    }
    if (this.position.x - this.size > width / 2) {
      this.position.x = -(width / 2) + this.size;
    }
  }

  offEdge() {
    if (
      this.position.x - this.size > width / 2 ||
      this.position.x + this.size < -width / 2 ||
      this.position.y - this.size > height / 2 ||
      this.position.y + this.size < -height / 2
    ) {
      return true;
    }
    return false;
  }

  collidesAsteroid(asteroids, destroy) {
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];
      if (
        (this.position.x + this.size > asteroid.position.x - asteroid.size) &&
        (this.position.x - this.size < asteroid.position.x + asteroid.size) &&
        (this.position.y + this.size > asteroid.position.y - asteroid.size) &&
        (this.position.y - this.size < asteroid.position.y + asteroid.size)
      ) {
        if (destroy) {
          // game.gameover;
          return true;
        } else {
          return asteroid;
        }
      }
    }
    return false;
  }

  debug(asteroids) {
    if (!this.isClone) {
      this.clones.forEach(clone => {
        clone.debug(asteroids);
      });

      push();
      translate(this.position.x, this.position.y);
      fill(180);
      textSize(16);
      text((this.head).toFixed(2) + ' ≈ ' + this.sdir, -50, 50);
      strokeWeight(2);

      push();
      rotate(directions.n);
      stroke('rgba(100,100,100,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.ne);
      stroke('rgba(255,255,0,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.e);
      stroke('rgba(255,0,0,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.se);
      stroke('rgba(255,255,255,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.s);
      stroke('rgba(0,255,0,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.sw);
      stroke('rgba(0,255,255,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.w);
      stroke('rgba(0,0,255,1)');
      line(0, 5, 0, 30);
      pop();
      push();
      rotate(directions.nw);
      stroke('rgba(255,0,255,1)');
      line(0, 5, 0, 30);
      pop();

      push();
      rotate((this.head + PI / 2) % TAU);
      strokeWeight(3)
      stroke('rgba(255, 255, 255,0.7)');
      line(-0.5, 0, -0.5, -50);
      pop();
      pop();
    }

    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2)
    strokeWeight(5);
    stroke('rgb(255, 0, 0)');
    point(0, 0);
    stroke('rgb(0, 255, 0)');
    point(0, this.size);
    stroke('rgb(0, 0, 255)');
    point(0, -this.size);
    stroke('rgb(255, 0, 255)');
    point(this.size, 0);
    stroke('rgb(0, 255, 255)');
    point(-this.size, 0);
    pop();

    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = this.collidesAsteroid(asteroids);
      if (asteroid) {
        push();
        translate(asteroid.position.x, asteroid.position.y);
        strokeWeight(3);
        stroke('rgb(255, 0, 0)');
        line(-asteroid.size, asteroid.size, -asteroid.size, -asteroid.size);
        line(asteroid.size, asteroid.size, asteroid.size, -asteroid.size);
        line(-asteroid.size, -asteroid.size, asteroid.size, -asteroid.size);
        line(-asteroid.size, asteroid.size, asteroid.size, asteroid.size);
        pop();
      }
    }
  }
}