const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

let options = Array.from({length: 9}, (_) => "");
const user = "X";
const computer = "O";
let currentPlayer = user;
let running = false;

restartBtn.addEventListener('click', restartGame);

initGame();

function initGame() {
    cells.forEach(cell => {
        cell.textContent="";
        cell.addEventListener('click', cellClicked)
    });

    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    if (currentPlayer === user) {
        currentPlayer = computer;
    } else {
        currentPlayer = user;
    }
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;
    for(const condition of winConditions){
        const sliceCells = [
            options[condition[0]],
            options[condition[1]],
            options[condition[2]],
        ]

        if (sliceCells.includes("")) {
            continue;
        }

        if(sliceCells[0] == sliceCells[1] && sliceCells[1] == sliceCells[2]){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!!`
        running = false;
        return 'X';
    } else if(!options.includes("")){
        statusText.textContent = `It's a tie!`
        return 'tie'
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = user;
    options = Array.from({length: 9}, (_) => "");
    initGame();
}