// TODO: Help
// TODO: Improve hitboxes
// TODO: Continue HUD
// IDEA: Various Weapons
// IDEA: Gimmicks > Portal Weapon?
// IDEA: Power-Ups (Speed, Damage, Shield)

const percents = ["accuracy"];
const controls = {
	movement: "Arrow Keys",
	shoot: "SPACE",
	hyperboost: "LSHIFT",
	glide: "Q",
	brake: "W",
	slowaim: "E",
	restart: "BACKSPACE",
	debug: "-"
};

var game,
	ship,
	stars,
	projectiles,
	asteroids,
	stats,
	debuginfo,
	directions,
	currentsecond = 0;

function setup() {
	createCanvas(windowWidth, windowHeight, P2D);
	directions = {
		n: (6 / 8) * TAU,
		ne: (7 / 8) * TAU,
		e: (8 / 8) * TAU,
		se: (1 / 8) * TAU,
		s: (2 / 8) * TAU,
		sw: (3 / 8) * TAU,
		w: (4 / 8) * TAU,
		nw: (5 / 8) * TAU
	};
	game = new Game();
	init();
}

function init() {
	debuginfo = {
		enabled: false,
		fps: 0,
		brake: false,
		slowaim: false,
		speedlocked: false,
		boost: false,
		hyperboost: false,
		shipDirection1: 0,
		shipDirection2: "",
		shipX: 0,
		shipY: 0,
		energy: 0
	};
	stats = {
		enabled: false,
		time: 0,
		destroyed: 0,
		score: 0,
		damage: 0,
		shots: 0,
		missed: 0,
		accuracy: 0
	};
	projectiles = [];
	stars = [];
	asteroids = [];
	for (let i = 0; i < 3; i++) {
		asteroids.push(
			new Asteroid(
				asteroids,
				{
					min: 90,
					max: 100
				},
				0
			)
		);
	}
	for (let i = 0; i < 7; i++) {
		asteroids.push(
			new Asteroid(
				asteroids,
				{
					min: 60,
					max: 70
				},
				0
			)
		);
	}
	ship = new Ship(asteroids, random(TAU), 14, 0.1);
	for (let i = 0; i < 90; i++) {
		stars.push(new Star());
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);
	switch (game.state) {
		case "RESTART":
			init();
			game.run();
			break;
		case "START":
			game.show();
			push();
			translate(width / 2, height / 2);
			showStart();
			pop();
			break;
		case "PAUSE":
			calcValues();
			game.show();
			push();
			translate(width / 2, height / 2);
			showHUD();
			showPause();
			pop();
			break;
		case "GAMEOVER":
			calcValues();
			game.show();
			push();
			translate(width / 2, height / 2);
			showGO();
			pop();
			break;
		case "RUN":
			calcValues();
			showGame();
			push();
			translate(width / 2, height / 2);
			showHUD();
			pop();
			break;
	}
	if (asteroids.length == 0) {
		game.end();
	}
	if (debuginfo.enabled) {
		push();
		translate(width / 2, height / 2);
		this.debug();
		stars.forEach(star => {
			star.debug();
		});
		asteroids.forEach(asteroid => {
			asteroid.debug();
		});
		projectiles.forEach(projectile => {
			projectile.debug();
		});
		ship.debug(asteroids);
		pop();
	}
}

function showStart() {
	showMenu("Asteroids - by zlyfa!", "PRESS ENTER TO START");
	showControls();
}

function showPause() {
	showMenu("PAUSE", "PRESS ENTER TO CONTINUE");
	showStats();
}

function showGO() {
	showMenu("GAMEOVER!", "PRESS ENTER TO RESTART");
	showStats();
}

function showGame() {
	push();
	translate(width / 2, height / 2);
	stars.forEach(star => {
		star.update();
	});
	asteroids.forEach(asteroid => {
		asteroid.update();
	});
	projectiles.forEach(projectile => {
		projectile.update(asteroids);
		stats.missed += projectile.offEdge(projectiles);
	});
	ship.update();
	gameControls();
	pop();
}

function showMenu(title, subtitle) {
	push();
	noStroke();
	fill("rgba(0, 0, 0, 0.8)");
	rect(-width / 2, -height / 2, width, height);
	stroke("rgb(255, 255, 255)");
	textAlign(CENTER);
	fill("rgb(255, 0, 0)");
	strokeWeight(2);
	textSize(64);
	text(title, 0, -height / 2.8);
	fill("rgb(255, 255, 255)");
	textSize(32);
	noStroke();
	text("> " + subtitle + " <", 0, -height / 3.5);
	pop();
}

function showControls() {
	push();
	fill("rgb(255, 255, 255)");
	textSize(28);
	text("Controls", 0, -height / 6);
	textSize(24);
	noStroke();
	let i = 0;
	for (key in controls) {
		if (key != "enabled") {
			let name = key[0].toUpperCase() + key.substring(1);
			let val = controls[key];
			text(name + ":", -width / 2.5 + 100, -height / 10 + i * 30);
			text(val, width / 2.5 - 100, -height / 10 + i * 30);
			i++;
		}
	}
	pop();
}

function showStats() {
	push();
	fill("rgb(255, 255, 255)");
	textSize(28);
	text("Stats", 0, -height / 6);
	textSize(24);
	noStroke();
	let i = 0;
	for (key in stats) {
		if (key != "enabled") {
			let name = key[0].toUpperCase() + key.substring(1);
			let val = stats[key];
			if (percents.indexOf(key) != -1) {
				val += "%";
			}
			text(name + ":", -width / 2.5 + 100, -height / 10 + i * 30);
			text(val, width / 2.5 - 100, -height / 10 + i * 30);
			i++;
		}
	}
	pop();
}

function keyPressed() {
	switch (game.state) {
		case "START":
			switch (keyCode) {
				case 13:
					game.run();
					break;
			}
			break;
		case "PAUSE":
			switch (keyCode) {
				case 13:
					game.run();
					break;
				case 8:
					game.restart();
					break;
				case 189:
					debuginfo.enabled = !debuginfo.enabled;
					break;
			}
			break;
		case "GAMEOVER":
			switch (keyCode) {
				case 13:
					game.restart();
					break;
				case 8:
					game.restart();
					break;
			}
			break;
		case "RUN":
			switch (keyCode) {
				case 13:
					game.pause();
					break;
				case 8:
					game.restart();
					break;
				case 32:
					let parents = [ship];
					ship.clones.forEach(clone => {
						parents.push(clone);
					});
					parents.forEach(parent => {
						let projectile = new Blaster(parent);
						if (projectile.offEdge(false) == false) {
							stats.shots++;
							projectiles.push(projectile);
						}
					});
					break;
				case 189:
					debuginfo.enabled = !debuginfo.enabled;
					break;
			}
			break;
	}
}

function calcValues() {
	stats.score = stats.destroyed * 10 + stats.damage + -stats.missed * 10;
	if (second() != currentsecond && game.state == "RUN") {
		currentsecond = second();
		stats.time++;
	}
	if (stats.shots > 0) {
		stats.accuracy = round((stats.shots - stats.missed) / (stats.shots / 100));
	} else {
		stats.accuracy = 0;
	}
	debuginfo.energy = ship.energy;
	debuginfo.fps = getFrameRate().toFixed(0);
	debuginfo.boost = ship.boost;
	debuginfo.hyperboost = ship.hyperboost;
	debuginfo.brake = ship.brake;
	debuginfo.speedlocked = ship.speedlocked;
	debuginfo.slowaim = ship.slowaim;
	debuginfo.shipDirection1 = ship.head.toFixed(2);
	debuginfo.shipDirection2 = ship.sdir;
	debuginfo.shipX = ship.position.x.toFixed(2);
	debuginfo.shipY = ship.position.y.toFixed(2);
}

function showHUD() {
	if (!debuginfo.enabled) {
		push();
		translate(-width / 2, -height / 2);
		strokeWeight(0);

		fill("rgba(255, 255, 255, 0.1)");
		rect(15, height - 30, 200, 15);

		fill(255, (80 / 100) * ship.energy);
		rect(15, height - 30, ship.energy, 15);

		textSize(24);
		textAlign(LEFT);
		fill("rgb(255, 255, 255)");
		text("Time: " + stats.time, 15, 35);
		text("Score: " + stats.score, 15, 60);

		pop();
	}
}

function debug() {
	push();
	translate(-width / 2 + 15, -height / 2 + 30);
	strokeWeight(0);
	textSize(16);
	fill(255);
	let i = 0;
	for (key in stats) {
		if (key != "enabled") {
			text(`${key}: ${stats[key]}`, 0, i * 20);
			i++;
		}
	}
	for (key in debuginfo) {
		if (key != "enabled") {
			text(`${key}: ${debuginfo[key]}`, 0, i * 20);
			i++;
		}
	}
	pop();
}

function gameControls() {
	if (keyIsDown(87)) {
		ship.brake = true;
	} else {
		ship.brake = false;
	}
	if (keyIsDown(81)) {
		ship.speedlocked = true;
	} else {
		ship.speedlocked = false;
	}
	if (keyIsDown(69)) {
		ship.slowaim = true;
	} else {
		ship.slowaim = false;
	}
	if (keyIsDown(RIGHT_ARROW)) {
		if (ship.slowaim && ship.energy > 0) {
			ship.rotation = TAU / 250;
		} else {
			ship.rotation = TAU / 100;
		}
	} else if (keyIsDown(LEFT_ARROW)) {
		if (ship.slowaim && ship.energy > 0) {
			ship.rotation = -(TAU / 250);
		} else {
			ship.rotation = -(TAU / 100);
		}
	} else {
		ship.rotation = 0;
	}
	if (keyIsDown(UP_ARROW)) {
		ship.boost = true;
		if (keyIsDown(SHIFT)) {
			ship.hyperboost = true;
		} else {
			ship.hyperboost = false;
		}
	} else {
		ship.boost = false;
		ship.hyperboost = false;
	}
}
