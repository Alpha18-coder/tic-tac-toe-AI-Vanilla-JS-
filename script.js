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
// let options = ["","","","","","","","",""];
const user = "X";
const computer = "O";
let currentPlayer = randomizeStartPlayer();
let running = false;

restartBtn.addEventListener('click', restartGame);
//CODIGO DE TIC TAC TOE 

initGame();

function initGame(){
    checkCurrentPlayer();
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    console.log('cellClicked called')
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

function changePlayer(){
    console.log('change player called')
    currentPlayer = currentPlayer === user ? computer : user;
    statusText.textContent = `${currentPlayer}'s turn`;
    checkCurrentPlayer();
}

function checkWinner() {
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const sliceCells = [
            options[winConditions[i][0]],
            options[winConditions[i][1]],
            options[winConditions[i][2]]
        ]

        if (sliceCells.includes("")) {
            continue;
        }

        if(sliceCells[0] == sliceCells[1] && sliceCells[1] == sliceCells[2]){
            roundWon = true;
            break;
        }
    }
    console.log('roundWon:', roundWon);

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!!`;
        running = false;
    } else if(!options.includes("")){
        statusText.textContent = `It's a tie!`
    } else {
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = randomizeStartPlayer();
    options = Array.from({length: 9}, (_) => "");
    initGame();
}

// CODIGO DE IA

function minimax(board, depth, ismax){
    //console.log(depth, ismax ? 'MAXIMIZING' : 'MINIMIZING', 'BOARD:', board);
    let result = aicheck(board);

    if(result !== undefined) {
        return {score: result};
    } 

    if(ismax){
        let bestScore = -Infinity;
        let bestMove;   

        for(let i=0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = "O";
                const localScore = minimax(board, depth + 1, false).score;

                //reset
                board[i] = "";
                // console.log(`local score:`, localScore)
                
                if(localScore > bestScore){
                    bestScore = localScore;
                    bestMove = i;
                }
            } 
        }
        return { score: bestScore, moveIndex: bestMove };
        
    } else {
        let bestScore = Infinity;
        let bestMove;

        for(let i=0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = "X";
                const localScore = minimax(board, depth + 1, true).score;
                
                //reset
                board[i] = "";
                // console.log(`local score:`, localScore)

                if(localScore < bestScore){
                    bestScore = localScore;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, moveIndex: bestMove };
    }
}

function aicheck(board){
    for(let i = 0; i < winConditions.length; i++){
        const sliceCells = [
            board[winConditions[i][0]],
            board[winConditions[i][1]],
            board[winConditions[i][2]]
        ]

        const userWins = sliceCells.every(cell => cell === 'X');
        const aiWins = sliceCells.every(cell => cell === 'O');

        if(userWins) {
            return -1;
        } else if(aiWins) { 
            return 1;
        } else if(!board.includes('')) {
            return 0;
        }
    }
}


//HELPER FUNCTIONS
function randomizeStartPlayer(){
    return Math.random() < 0.5 ? user : computer
}

function LockBoard(){
    for(let i = 0; i < cells.length; i++){
            cells[i].textContent = options[i];
            cells[i].removeEventListener('click', cellClicked);
    }
}

function checkCurrentPlayer() {
    if(currentPlayer === user){
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = options[i];
            cells[i].addEventListener('click', cellClicked);
        }
    } else {
        setTimeout(()=>{ 
            LockBoard();    
            let { moveIndex } = minimax(options, 0, true);
            updateCell(cells[moveIndex], moveIndex);
            checkWinner();
        },600)
    }
}
