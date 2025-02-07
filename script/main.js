const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const rulesEl = document.querySelector(".rulesList")

rulesEl.addEventListener("input", updateRules)

document.querySelector("#close").addEventListener("click", () => document.querySelector(".rulescontainer").classList.toggle("hidden"))
document.querySelector(".reset").addEventListener("click", clearGame)
document.querySelector(".rulesButton").addEventListener("click", () => document.querySelector(".rulescontainer").classList.toggle("hidden"))

let isRunning = false;

document.querySelector("#start").addEventListener("click", e => {
	isRunning = !isRunning
	e.target.innerHTML = isRunning ? "STOP" : "START";
});

/*
if (game[y][x] && (neighbours < 2 || neighbours > 3)) {
	parsedGame[y][x] = false;
}
if (!game[y][x] && neighbours == 3) parsedGame[y][x] = true;
*/

function updateRules(){
	const ruleslist = document.querySelectorAll(".rulesList > div")
	let newRules = [];
	for(let rule of ruleslist) {
		newRules.push(
			[
				rule.querySelector("input").value,
				rule.querySelectorAll("select")[0].value,
				rule.querySelectorAll("select")[1].value
			]
		)
	}
	rules = newRules;
}

let rules = [
	[
		2,
		"<",
		"death"
	],
	[
		3,
		">",
		"death"
	],
	[
		3,
		"=",
		"birth"
	]
]

document.querySelector("#newRule").addEventListener("click", () => {
	const div = document.createElement("div");
	div.innerHTML = `
<input type="number" value="3">
<select>
	<option value=">">></option>
	<option value="=" selected>=</option>
	<option value="<"}><</option>
</select>
<select>
	<option value="death">death</option>
	<option value="birth" selected>birth</option>
</select>
<button class="removeRule">Remove</button>
	`
	rulesEl.append(div)
	for(let button of document.querySelectorAll(".removeRule")) {
		button.addEventListener("click", e => {
			button.parentNode.remove()
		})
	}
	updateRules()
})

for(let rule of rules) {
	const div = document.createElement("div");
	div.innerHTML = `
<input type="number" value="${rule[0]}">
<select>
	<option value=">" ${">" == rule[1] ? "selected" : ""}>></option>
	<option value="=" ${"=" == rule[1] ? "selected" : ""}>=</option>
	<option value="<" ${"<" == rule[1] ? "selected" : ""}><</option>
</select>
<select>
	<option value="death" ${"death" == rule[2] ? "selected" : ""}>death</option>
	<option value="birth" ${"birth" == rule[2] ? "selected" : ""}>birth</option>
</select>
<button class="removeRule">Remove</button>
	`
	rulesEl.append(div)
}
updateRules()

function testCondition(rule, neighbours, currentState) {
	return {"<": (a, b) => a < b, "=": (a, b) => a == b, ">": (a, b) => a > b}[rule[1]](neighbours, rule[0]) ? rule[2] == "birth" : currentState;
}

for(let button of document.querySelectorAll(".removeRule")) {
	button.addEventListener("click", e => {
		button.parentNode.remove()
		updateRules()
	})
}

canvas.width = innerWidth;
canvas.height = innerHeight * 0.7;

ctx.imageSmoothingEnabled = false;

let game = [];
let parsedGame = [];

const WIDTH = 40;
const HEIGHT = 40;

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

function clearGame() {
	game = []
	parsedGame = []
	for (let y = 0; y < HEIGHT; y++) {
		game.push([]);
		parsedGame.push([]);
		for (let x = 0; x < WIDTH; x++) {
			game[y].push(false);
			parsedGame[y].push(false);
		}
	}
	drawGame()
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

			/*if (game[y][x] && (neighbours < 2 || neighbours > 3)) {
				parsedGame[y][x] = false;
			}
			if (!game[y][x] && neighbours == 3) parsedGame[y][x] = true;
			*/
			for(let rule of rules) {
				parsedGame[y][x] = testCondition(rule, neighbours, parsedGame[y][x])
			}
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

clearGame()
drawGame()

canvas.addEventListener("click", (e) => {
	const rx = e.clientX - canvas.getBoundingClientRect().left;
	const ry = e.clientY - canvas.getBoundingClientRect().top;
	const bx = Math.floor(rx / BUTTON_SIZE);
	const by = Math.floor(ry / BUTTON_SIZE);
	if (by <= HEIGHT && bx <= WIDTH) drawSquare(bx, by, (game[by][bx] = !game[by][bx]));
});