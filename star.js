class Star {
  constructor() {
    this.size = random(2, 3);
    this.x = random(-width / 2 + this.size, width / 2 - this.size);
    this.y = random(-height / 2 + this.size, height / 2 - this.size);
    this.brightness = random(100, 255);
    this.blinki = round(random(120));
  }

  update() {
    this.blink();
    this.show();
  }

  blink() {
    if (this.blinki <= 120) {
      this.blinki++;
    } else {
      this.brightness = round(random(100, 255));
      this.blinki = 0;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    strokeWeight(this.size);
    stroke(this.brightness);
    point(0, 0);
    pop();
  }

  debug() {
    push();
    translate(this.x, this.y);
    strokeWeight(3);
    stroke('rgb(255, 255, 0)');
    point(0, 0);
    pop();
  }
}