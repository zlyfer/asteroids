// jshint esversion: 6

class Blaster {
  constructor(parent, size) {
    this.parent = parent;
    this.head = parent.head;
    this.size = 5;
    this.position = createVector(parent.position.x, parent.position.y).add(
      p5.Vector.fromAngle(this.head).mult(parent.size)
    );
  }

  update() {
    this.collidesAsteroid(asteroids);
    this.position.add(p5.Vector.fromAngle(this.head).mult(15));
    this.show();
  }

  remove(projectiles) {
    let index = projectiles.indexOf(this);
    projectiles.splice(index, 1);
  }

  offEdge(projectiles) {
    if (
      this.position.x > width / 2 ||
      this.position.x < -width / 2 ||
      this.position.y > height / 2 ||
      this.position.y < -height / 2
    ) {
      if (projectiles) {
        this.remove(projectiles);
      }
      return true;
    }
    return false;
  }

  collidesAsteroid(asteroids) {
    let list;
    let removed = false;
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];
      list = [asteroid];
      asteroid.clones.forEach((clone) => {
        list.push(clone);
      });
      list.forEach((asteroid) => {
        if (
          this.position.x + this.size > asteroid.position.x - asteroid.size &&
          this.position.x - this.size < asteroid.position.x + asteroid.size &&
          this.position.y + this.size > asteroid.position.y - asteroid.size &&
          this.position.y - this.size < asteroid.position.y + asteroid.size &&
          !removed
        ) {
          this.remove(projectiles);
          removed = true;
          if (asteroid.isClone) {
            asteroid.parent.destroy(asteroids);
          } else {
            asteroid.destroy(asteroids);
          }
        }
      });
    }
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.head + PI / 2);
    strokeWeight(this.size);
    stroke("rgb(255, 255, 255)");
    point(0, 0);
    pop();
  }

  debug() {
    push();
    translate(this.position.x, this.position.y);
    strokeWeight(5);
    stroke("rgb(255, 0, 0)");
    point(0, 0);
    pop();
  }
}
