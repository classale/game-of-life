const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isRunning = false;

document.querySelector("#start").addEventListener("click", e => {
	isRunning = !isRunning
	e.target.innerHTML = isRunning ? "STOP" : "START";
});


canvas.width = innerWidth;
canvas.height = innerHeight * 0.7;

ctx.imageSmoothingEnabled = false;

let game = [];
let parsedGame = [];

const WIDTH = 30;
const HEIGHT = 30;

if(canvas.width > ((WIDTH / HEIGHT) * canvas.height)) canvas.width = ((WIDTH / HEIGHT) * canvas.height)

let timeout = (1 / document.querySelector("input[type=range]").value) * 5000;

document.querySelector("input[type=range]").addEventListener("input", e => {
	timeout = (1 / e.target.value) * 5000;
	console.log(timeout);
});

(function loop() {
    if(isRunning) iterate();
    setTimeout(loop, timeout)
})();

function printGame(inputgame) {
	let out = "";
	for (let y = 0; y < inputgame.length; y++) {
		for (let x = 0; x < inputgame[y].length; x++) {
			if (inputgame[y][x]) {
				out += "#";
			} else if (inputgame[y][x] != true && inputgame[y][x] != false) {
				out += "?";
			} else {
				out += "-";
			}
		}
		out += "\n";
	}
	console.log(out);
}

for (let y = 0; y < HEIGHT; y++) {
	game.push([]);
	parsedGame.push([]);
	for (let x = 0; x < WIDTH; x++) {
		game[y].push(false);
		parsedGame[y].push(false);
	}
}

function drawSquare(x, y, selected = false) {
	ctx.fillStyle = selected ? "#4C4C4C" : "#B2B2B2";
	ctx.strokeStyle = selected ? "#4C4C4C" : "#666666";
	ctx.lineWidth = BUTTON_SIZE / 5;
	ctx.beginPath();
	ctx.rect(
		x * BUTTON_SIZE,
		y * BUTTON_SIZE,
		BUTTON_SIZE - (BUTTON_SIZE / 3),
		BUTTON_SIZE - (BUTTON_SIZE / 3)
	);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function gametoparsedgame() {
	for (let y = 0; y < game.length; y++) {
		for (let x = 0; x < game[y].length; x++) {
			game[y][x] = parsedGame[y][x];
		}
	}
}

function parsedgametogame() {
	for (let y = 0; y < game.length; y++) {
		for (let x = 0; x < game[y].length; x++) {
			parsedGame[y][x] = game[y][x];
		}
	}
}

function countNeighbors(x, y, inputGame) {
	let neighbours = 0;
	for (let yi = -1; yi <= 1; yi++) {
		for (let xi = -1; xi <= 1; xi++) {
			try {
				let value = inputGame[y + yi][x + xi] && (xi != 0 || yi != 0);
				neighbours += value == undefined ? 0 : value;
			} catch {}
		}
	}
	return neighbours;
}

function iterate() {
    parsedgametogame()
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let neighbours = countNeighbors(x, y, game);

			if (game[y][x] && (neighbours < 2 || neighbours > 3)) {
				parsedGame[y][x] = false;
			}
			if (!game[y][x] && neighbours == 3) parsedGame[y][x] = true;
		}
	}
	gametoparsedgame()
    drawGame()
}

let BUTTON_SIZE = canvas.width < canvas.height ? canvas.width : canvas.height;
BUTTON_SIZE /= WIDTH > HEIGHT ? HEIGHT : WIDTH;

function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            drawSquare(x, y, game[y][x]);
        }
    }
}

drawGame()

canvas.addEventListener("click", (e) => {
	const rx = e.clientX - canvas.getBoundingClientRect().left;
	const ry = e.clientY - canvas.getBoundingClientRect().top;
	const bx = Math.floor(rx / BUTTON_SIZE);
	const by = Math.floor(ry / BUTTON_SIZE);
	if (by <= HEIGHT && bx <= WIDTH) drawSquare(bx, by, (game[by][bx] = !game[by][bx]));
});