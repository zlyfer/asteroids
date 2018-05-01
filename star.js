class Star {
  constructor() {
    this.size = round(random(1, 2.2));
    this.x = round(random(-width / 2 + this.size, width / 2 - this.size));
    this.y = round(random(-height / 2 + this.size, height / 2 - this.size));
    this.brightness = random(100, 255);
    this.blinki = round(random(0, 100));
  }

  blink() {
    if (this.blinki <= 100) {
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
}