class Ship {
  constructor(x, y, head, size, acceleration, isClone = false, cstrength = 0) {
    this.position = createVector(x, y);
    this.size = size;
    this.head = head;
    this.rotation = 0;
    this.velocity = createVector(0, 0);
    this.boost = false;
    this.hyperboost = false;
    this.acceleration = acceleration;
    this.oacceleration = acceleration;
    this.clone = null;
    this.isClone = isClone;
    this.strength = cstrength;
    this.sdir = this.getSDir(this.head);
  }

  update() {
    if (!(this.isClone)) {
      this.head += this.rotation;
      if (this.boost) {
        if (this.hyperboost) {
          this.acceleration = this.oacceleration * 2;
        } else {
          this.acceleration = this.oacceleration;
        }
        this.move();
      }
      if (!(this.hyperboost) && this.strength > 100) {
        this.velocity.mult(0.96);
      } else {
        this.velocity.mult(0.99);
      }
      this.position.add(this.velocity);
      this.edge();
    }
    this.thruster();
    this.show();
  }

  move() {
    let force = p5.Vector.fromAngle(this.head).mult(this.acceleration);
    this.velocity.add(force);
  }

  thruster() {
    if (!(this.isClone)) {
      this.strength = abs(round((abs(this.velocity.x) + abs(this.velocity.y)) / (this.acceleration * 100) * 100));
    }
    if (this.hyperboost) {
      this.strength = this.strength * 2;
    }
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    fill(random(((240 / 100) * this.strength) / 5, (255 / 100) * this.strength));
    strokeWeight(0);
    quad(-this.size, this.size, 0, this.size / 1.8, this.size, this.size, 0, (this.size / 1.8) + this.strength / 2.8);
    pop();
  }

  getSDir() {
    let d = round(((this.head + PI / 2) % TAU) / (TAU / 8));
    switch (d) {
      case 0:
        this.sdir = "N";
        break;
      case 1:
        this.sdir = "NW";
        break;
      case 2:
        this.sdir = "W";
        break;
      case 3:
        this.sdir = "SW";
        break;
      case 4:
        this.sdir = "S";
        break;
      case 5:
        this.sdir = "SE";
        break;
      case 6:
        this.sdir = "E";
        break;
      case 7:
        this.sdir = "NE";
        break;
    }


    // fill(180);
    // text(d, -50, 50);
    // strokeWeight(2);
    //
    // push();
    // rotate(directions.n);
    // stroke('rgba(100,100,100,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.ne);
    // stroke('rgba(255,0,0,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.e);
    // stroke('rgba(255,255,0,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.se);
    // stroke('rgba(255,255,255,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.s);
    // stroke('rgba(0,255,0,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.sw);
    // stroke('rgba(0,255,255,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.w);
    // stroke('rgba(0,0,255,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate(directions.nw);
    // stroke('rgba(255,0,255,0.5)');
    // line(0, 5, 0, 10);
    // pop();
    //
    // push();
    // rotate((this.head + PI / 2) % TAU);
    // strokeWeight(1)
    // stroke('rgba(255, 255, 255,0.5)');
    // line(-0.5, 0, -0.5, -10);
    // pop();

  }

  show() {
    this.getSDir();
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill(180);
    quad(0, -this.size, -this.size, this.size, 0, this.size / 1.8, this.size, this.size);
    pop();

  }

  edge() {
    if (this.position.y - this.size < -height / 2) {
      this.clone = new Ship(this.position.x, (height) + this.position.y, this.head, this.size, this.acceleration, true, this.strength);
      this.clone.update();
    }
    if (this.position.y + this.size > height / 2) {
      this.clone = new Ship(this.position.x, (-height) + this.position.y, this.head, this.size, this.acceleration, true, this.strength);
      this.clone.update();
    }
    if (this.position.x - this.size < -width / 2) {
      this.clone = new Ship((width) + this.position.x, this.position.y, this.head, this.size, this.acceleration, true, this.strength);
      this.clone.update();
    }
    if (this.position.x + this.size > width / 2) {
      this.clone = new Ship((-width) + this.position.x, this.position.y, this.head, this.size, this.acceleration, true, this.strength);
      this.clone.update();
    }
    if (!(this.position.y - this.size < -height / 2) &&
      !(this.position.y + this.size > height / 2) &&
      !(this.position.x - this.size < -width / 2) &&
      !(this.position.x + this.size > width / 2)) {
      this.clone = null;
    }
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
  shootedge() {
    let m = abs(this.head) % TAU;
    if (
      (
        this.position.y - this.size < -height / 2 &&
        1
      ) ||
      (
        this.position.y + this.size > height / 2 &&
        true
      ) ||
      (
        this.position.x - this.size < -width / 2 &&
        true
      ) ||
      (
        this.position.x + this.size > width / 2 &&
        true
      )
    ) {
      return false;
    } else {
      return true;
    }
  }
}

class Projectile {
  constructor(ship) {
    this.head = ship.head;
    this.position = createVector(ship.position.x, ship.position.y);
  }
  fly() {
    let force = p5.Vector.fromAngle(this.head).mult(1);
    this.position.add(force);
  }
  edge(projectiles) {
    let index = projectiles.indexOf(this);
    if (
      this.position.x > width / 2 ||
      this.position.x < -width / 2 ||
      this.position.y > height / 2 ||
      this.position.y < -height / 2
    ) {
      projectiles.splice(index, 1);
      return 1;
    }
    return 0;
  }
  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill(255);
    rect(-2, -10, 4, 10);
    pop();
  }
}