class Game {
  constructor() {
    this.state = "START";
  }
  end() {
    this.state = "GAMEOVER";
  }
  run() {
    this.state = "RUN";
  }
  pause() {
    this.state = "PAUSE";
  }
  start() {
    this.state = "START";
  }
  restart() {
    this.state = "RESTART";
  }

  show() {
    push();
    translate(width / 2, height / 2);
    ship.show();
    stars.forEach(star => {
      star.show();
    });
    asteroids.forEach(asteroid => {
      asteroid.edge();
      asteroid.show();
      asteroid.clones.forEach(clone => {
        clone.show();
      });
    });
    projectiles.forEach(projectile => {
      projectile.show();
    });
    pop();
  }
}