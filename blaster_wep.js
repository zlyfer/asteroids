class Blaster {
  constructor(parent, size) {
    this.parent = parent; // Might be useful in future.
    this.head = parent.head;
    this.size = 15;
    this.position = createVector(parent.position.x, parent.position.y).add(p5.Vector.fromAngle(this.head).mult(parent.size));
  }

  update() {
    this.fly();
    this.show();
  }

  fly() {
    let force = p5.Vector.fromAngle(this.head).mult(10);
    this.position.add(force);
  }

  offEdge(projectiles) {
    if (
      this.position.x > width / 2 ||
      this.position.x < -width / 2 ||
      this.position.y > height / 2 ||
      this.position.y < -height / 2
    ) {
      if (projectiles) {
        let index = projectiles.indexOf(this);
        projectiles.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(0);
    fill('rgb(255, 255, 255)');
    rect(-2, 0, 4, this.size);
    pop();
  }

  debug() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(5);
    stroke('rgb(0, 0, 255)');
    point(0, 0);
    stroke('rgb(255, 0, 0)');
    point(0, this.size);
    pop();
  }
}