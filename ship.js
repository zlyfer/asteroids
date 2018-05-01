class Ship {
  constructor(x, y, head, size, acceleration, isClone = false, cstrength = 0) {
    this.position = createVector(x, y);
    this.size = size;
    this.head = head;
    this.rotation = 0;
    this.velocity = createVector(0, 0);
    this.boost = false;
    this.acceleration = acceleration;
    this.clone = null;
    this.isClone = isClone;
    this.strength = cstrength;
  }

  update() {
    if (!(this.isClone)) {
      this.head += this.rotation;
      if (this.boost) {
        this.move();
      }
      this.velocity.mult(0.99);
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
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill(random(((255 / 100) * this.strength) / 5, (255 / 100) * this.strength));
    quad(-this.size - 2, this.size + 2, 0, this.size / 1.8, this.size + 2, this.size + 2, 0, (this.size / 1.8) + this.strength / (this.size / 3));
    pop();
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(2);
    stroke(220);
    fill(0)
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
    }
  }
  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill(255);
    rect(-2, 0, 4, 10);
    pop();
  }
}