const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isRunning = false;

document.querySelector("#start").addEventListener("click", () => isRunning = !isRunning)

canvas.width = innerWidth;
canvas.height = innerHeight * 0.8;

ctx.imageSmoothingEnabled = false;

let game = [];
let parsedGame = [];

const WIDTH = 67;
const HEIGHT = 40;

let timeout = 50;

let run = setInterval(loop, timeout)

function loop() {
    clearInterval(run)

    if(isRunning) iterate();

    run = setInterval(loop, timeout)
}

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

const arr1 = [1, 2];
const arr2 = [...arr1];

arr2[0] = 100;

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
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.rect(
		x * BUTTON_SIZE,
		y * BUTTON_SIZE,
		BUTTON_SIZE - 5,
		BUTTON_SIZE - 5
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
