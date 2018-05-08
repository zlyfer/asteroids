// TODO: Visualisation
// TODO: Collision / Destroy

class Asteroid {
  constructor(asteroids = false, sizeRule = false, genType = 0) {
    if (genType == 0) {
      this.isClone = false;
      this.size = random(sizeRule.min, sizeRule.max);
      this.genPos(asteroids);
      this.head = random(TAU);
      this.shape = this.genShape();
      this.rotation = random(-(TAU / 300), TAU / 300);
      this.brightness = random(30, 70);
      this.velocity = createVector(0, 0).add(p5.Vector.fromAngle(this.head).mult(random(-0.6, 0.6)));
      this.clones = [];
      for (let i = 0; i < 8; i++) {
        this.clones.push(new Asteroid(false, false, 1, this));
      }
      this.parent = false;
    } else {
      if (genType == 1) {
        this.isClone = true;
      } else {
        this.isClone = false;
      }
      this.size = 0;
      this.position = createVector(0, 0);
      this.head = 0;
      this.shape = [{
        x: 0,
        y: 0
      }];
      this.rotation = 0;
      this.brightness = 0;
      this.velocity = 0;
      this.clones = [];
      this.parent = false;
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

  genShape() {
    let shape = [];
    for (let i = 0; i < TAU; i += (TAU / 24)) {
      let angleVector = p5.Vector.fromAngle(i).mult(
        random(
          this.size * (3.3 / 4),
          this.size
        ));
      shape.push({
        x: angleVector.x,
        y: angleVector.y
      });
    }
    return shape;
  }

  update() {
    if (!this.isClone) {
      this.head += this.rotation;
      this.position.add(this.velocity);
      this.clones.forEach(clone => {
        clone.update();
      });
      this.updateClones();
    }
    if (!this.offEdge() || !this.isClone) {
      this.edge();
      this.show();
    }
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

  destroy(asteroids) {
    if (this.size >= 20) {
      for (let i = 0; i < 2; i++) {
        let nAsteroid = new Asteroid(asteroids, false, 2);
        nAsteroid.head = random(TAU);
        nAsteroid.size = this.size / 2;
        nAsteroid.shape = nAsteroid.genShape();
        nAsteroid.rotation = random(-(TAU / 150), TAU / 150);
        nAsteroid.brightness = random(30, 70);
        nAsteroid.velocity = createVector(0, 0).add(p5.Vector.fromAngle(this.head).mult(random(-0.6, 0.6)));
        let nx, ny;
        if (i == 0) {
          nx = this.position.x - random(-this.size / 2, this.size / 2);
          ny = this.position.y - this.size / 2;
        } else {
          nx = this.position.x + random(-this.size / 2, this.size / 2);
          ny = this.position.y + this.size / 2;
        }
        nAsteroid.position = createVector(nx, ny);
        nAsteroid.clones = [];
        for (let i = 0; i < 8; i++) {
          let clone = new Asteroid(false, false, 1);
          clone.parent = nAsteroid;
          nAsteroid.clones.push(clone);
        }
        asteroids.push(nAsteroid);
      }
    }
    asteroids.splice(asteroids.indexOf(this), 1);
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    push();
    stroke('rgb(200, 200, 200)');
    strokeWeight(1);
    fill(this.brightness);
    beginShape();
    this.shape.forEach(v => {
      vertex(v.x, v.y);
    });
    endShape(CLOSE);
    pop();
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
      clone.parent = this;
      clone.head = this.head;
      clone.shape = this.shape;
      clone.rotation = this.rotation;
      clone.size = this.size;
      clone.brightness = this.brightness;
    });
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
          this.destroy(asteroids);
          return true;
        } else {
          return asteroid;
        }
      }
    }
    return false;
  }

  debug() {
    if (!this.isClone) {
      this.clones.forEach(clone => {
        clone.debug();
      });
    }

    push();
    translate(this.position.x, this.position.y);
    strokeWeight(1);
    stroke('rgb(255, 0, 0)');
    line(-this.size, -this.size, this.size, -this.size);
    line(this.size, -this.size, this.size, this.size);
    line(this.size, this.size, -this.size, this.size);
    line(-this.size, this.size, -this.size, -this.size);

    rotate(this.head + PI / 2);
    strokeWeight(3);
    stroke('rgb(255, 255, 0)');
    line(0, 0, 0, this.size * 1.2);

    strokeWeight(1);
    stroke('rgb(255, 0, 255)');
    line(-this.size, -this.size, this.size, -this.size);
    line(this.size, -this.size, this.size, this.size);
    line(this.size, this.size, -this.size, this.size);
    line(-this.size, this.size, -this.size, -this.size);

    this.shape.forEach(v => {
      strokeWeight(0.5);
      stroke('rgb(0, 255, 255)');
      line(0, 0, v.x, v.y);
    });

    strokeWeight(5);
    stroke('rgb(255, 0, 0)');
    point(0, 0);
    pop();
  }
}