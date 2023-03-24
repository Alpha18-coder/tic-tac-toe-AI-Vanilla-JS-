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

//let options = Array.from({length: 9}, (_) => "");
let options = ["X","O","X","O","","","","",""];
const user = "X";
const computer = "O";
let currentPlayer = user;
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
    checkWinner(options, true);
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    console.log('change player called')
    currentPlayer = currentPlayer === user ? computer : user;
    statusText.textContent = `${currentPlayer}'s turn`;
    checkCurrentPlayer();
}

function checkWinner(board){
    console.log('checkwinner called')
    let roundWon = false;
    //console.log(board)

    for(let i = 0; i < winConditions.length; i++){
        const sliceCells = [
            board[winConditions[i][0]],
            board[winConditions[i][1]],
            board[winConditions[i][2]]
        ]

        if(sliceCells.every(cell => cell === currentPlayer)) {
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!!`;
        running = false;
        //return currentPlayer;
        return currentPlayer === 'X' ? -1 : 1;
    } else if(!options.includes("")){
        statusText.textContent = `It's a tie!`;
        return 0;
    } else {
        if(currentPlayer === user){
            changePlayer();
        } 

        return null;
    }
}

function restartGame(){
    currentPlayer = randomizeStartPlayer();
    console.log(options)
    options = Array.from({length: 9}, (_) => "");
    console.log(options)
    initGame();
}

// CODIGO DE IA

function minimax(board, depth, ismax){
    console.log(depth, ismax ? 'MAXIMIZING' : 'MINIMIZING', 'BOARD:', board);
    let result = checkWinner(board);

    if(result !== null) {
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
                    //console.log(`best score:`, bestScore, `best move:`, bestMove)
                }
            } 
        }
        //console.log(depth, 'RETURNING FROM MAXIMIZING');
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
                    //console.log(`best score:`, bestScore, `best move:`, bestMove)
                }
            }
        }
        //console.log(depth, 'RETURNING FROM MINIMIZING');
        return { score: bestScore, moveIndex: bestMove };
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
            let { moveIndex } = minimax(options, 0, 'O');
            updateCell(cells[moveIndex], moveIndex);
            //checkWinner();
            currentPlayer = user;   
        },600)
    }
}


