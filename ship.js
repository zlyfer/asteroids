class Ship {
  constructor(x, y, head, size, acceleration, clone) {
    this.position = createVector(x, y);
    this.size = size;
    this.head = head;
    this.rotation = 0;
    this.velocity = createVector(0, 0);
    this.boost = false;
    this.acceleration = acceleration;
    this.clone = clone;
  }

  update() {
    if (!(this.clone)) {
      this.head += this.rotation;
      if (this.boost) {
        this.move();
      }
    }
    this.position.add(this.velocity);
    this.velocity.mult(0.99);
    this.flare();
    this.show();
    if (!(this.clone)) {
      this.edge();
    }
  }

  move() {
    let force = p5.Vector.fromAngle(this.head).mult(this.acceleration);
    this.velocity.add(force);
  }

  flare() {
    let strength = abs(round((abs(this.velocity.x) + abs(this.velocity.y)) / (this.acceleration * 100) * 100));
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill(random(((255 / 100) * strength) / 5, (255 / 100) * strength));
    quad(-this.size - 2, this.size + 2, 0, this.size / 1.8, this.size + 2, this.size + 2, 0, (this.size / 1.8) + strength / (this.size / 3));
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
    let clone;
    if (this.position.y - this.size < -height / 2) {
      clone = new Ship(this.position.x, (height) + this.position.y, this.head, this.size, this.acceleration, true);
      clone.update();
    }
    if (this.position.y + this.size > height / 2) {
      clone = new Ship(this.position.x, (-height) + this.position.y, this.head, this.size, this.acceleration, true);
      clone.update();
    }
    if (this.position.x - this.size < -width / 2) {
      clone = new Ship((width) + this.position.x, this.position.y, this.head, this.size, this.acceleration, true);
      clone.update();
    }
    if (this.position.x + this.size > width / 2) {
      clone = new Ship((-width) + this.position.x, this.position.y, this.head, this.size, this.acceleration, true);
      clone.update();
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