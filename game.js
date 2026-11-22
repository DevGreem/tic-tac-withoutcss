

/**
 * @type {String[]}
 */
const signs = ['X', 'O'];

/**
 * @type {number}
 */
let turn = 0;

/**
 * @type {HTMLTableSectionElement}
 */
const match = document.getElementById("match")

/**
 * @type {HTMLButtonElement}
 */
const restartButton = document.getElementById("restartButton");

/**
 * @type {HTMLParagraphElement}
 */
const counter = document.getElementById("counter");

let state = "";

setup()

/**
 * @type {String[][]}
 */
const winPositions = [
	[
		'###',
		'...',
		'...'
	],
	[
		'...',
		'###',
		'...'
	],
	[
		'...',
		'...',
		'###'
	],
	[
		'#..',
		'#..',
		'#..'
	],
	[
		'.#.',
		'.#.',
		'.#.'
	],
	[
		'..#',
		'..#',
		'..#'
	],
	[
		'#..',
		'.#.',
		'..#'
	],
	[
		'..#',
		'.#.',
		'#..'
	]
]

function drawMatch() {

	match.replaceChildren()

	for (let y = 0; y < 3; y++) {

		/**
		 * @type {HTMLTableRowElement}
		 */
		const row = document.createElement("tr");
		row.id = `row${y}`

		for (let x = 0; x < 3; x++) {


			/**
			 * @type {HTMLTableCellElement}
			 */
			const cell = document.createElement("td")
			cell.id = `cell${y}${x}`
			cell.height = 50;
			cell.width = 50;
			cell.addEventListener("click", onClickCell)


			row.appendChild(cell)
		}

		match.appendChild(row)
	}
}

/**
 * 
 * @param {number} x 
 * @param {number} y
 * @returns {String} 
 */
function getCellText(x, y) {
	const cell = document.getElementById(`cell${y}${x}`);

	console.log("Cell Coords: (", x, ", ", y, ")")
	console.log("Cell element count = ", cell.childElementCount)
	if (cell.childElementCount === 0) {
		return "";
	}

	return cell.firstChild.innerText;
}

/**
 *  
 * @param {PointerEvent} event
 */
function onClickCell(event) {

	if (state != "playing") {
		return;
	}
	
	/**
	 * @type {HTMLTableCellElement}
	 */
	const element = event.currentTarget;
	console.log("Clickeado");
	console.log(event);
	console.log(element);

	if (element.childElementCount > 0) {
		return;
	}
	
	element.replaceChildren();
	
	/**
	 * @type {HTMLParagraphElement}
	 */
	const textNode = document.createElement("p");
	textNode.innerText = signs[turn % 2]
	element.appendChild(textNode)
	
	passTurn();
}

function passTurn() {
	turn += 1
	verifyWin();
	drawCounter()
}

function setup() {
	restartButton.onclick = (event) => {
		drawMatch();
		turn = 0
		state = "playing";
		drawCounter();
	} 
	state = "playing";
	drawCounter();
	
	drawMatch()
}

function drawCounter() {

	if (state === "playing" && !counter.innerText.startsWith("Turn of:")) {
		counter.innerText = "Turn of:";
	}

	if (state !== "playing") {
		counter.innerText = state;
		return;
	}

	if (counter.innerText.endsWith(signs[(turn+1) % 2])) {
		counter.innerText = counter.innerText.slice(0, counter.innerText.length-2);
	}
	counter.innerText += " " + signs[turn % 2];
}

function verifyWin() {
	
	for (let player of signs) {
		const result = verifyPlayerWin(player);

		if (result) {
			state = `winned by ${player}`
			break;
		}
	}

	console.log(state);
	
}

/**
 * 
 * @param {String} player 
 * @returns {bool}
 */
function verifyPlayerWin(player) {

	console.log(`Verifying player ${player}`)

	for (let winIdx = 0; winIdx < winPositions.length; winIdx++) {

		let isWinned = true;

		let debugMatch = ""
		const winPosition = winPositions[winIdx];

		/**
		 * @type {HTMLTableRowElement[]}
		 */
		const rows = match.children;
		let rowIdx = 0;

		console.log(`Win Position: ${winIdx}`)
		for (let row of rows) {
			/**
			 * @type {HTMLTableCellElement[]}
			 */
			const cells = row.children
			let cellIdx = 0;

			let ok = true;
	
			console.log(`Row: ${rowIdx}`)
			for (let cell of cells) {
				
				const cellText = getCellText(cellIdx, rowIdx);
				console.log(cellText);

				if (cellText === "") {
					debugMatch += ".";
				}
				else {
					debugMatch += cellText;
				}

				console.log(`Comparing ${winPosition[rowIdx][cellIdx]} with ${cellText}`)
				
				if (winPosition[rowIdx][cellIdx] === '#' && cellText !== player) {
					ok = false;
					isWinned = false;
					break;
				}
	
				cellIdx++;
			}

			
			if (!ok) {
				break;
			}
			
			debugMatch += "\n";
			rowIdx++;
		}

		console.log(debugMatch);

		if (isWinned) {
			return isWinned
		}
	}

	return false;;
}