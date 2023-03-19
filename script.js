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
let winner = '';

restartBtn.addEventListener('click', restartGame);


initGame();

function initGame(){
    for(let i = 0;i < cells.length; i++){
        cells[i].textContent = options[i];
        cells[i].addEventListener('click', cellClicked);
    }

    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    console.log('updateCell called')
    options[index] = currentPlayer;
    // console.log("options: ", options);
    // console.log("index: ", index);

    cell.textContent = currentPlayer;
}

function changePlayer(){
    console.log('change player called')
    if (currentPlayer === user) {
        //computer's turn
        currentPlayer = computer;
        aiPlayer(options);
    } else {

        currentPlayer = user;
    }


    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    console.log('checkwinner called')
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
    console.log('roundWon:', roundWon);

if(roundWon){
        winner = currentPlayer;
        minimax();
        statusText.textContent = `${winner} wins!!`;
        running = false;
    } else if(!options.includes("")){
        winner = 'tie';
        minimax();
        statusText.textContent = `It's a tie!`
    } else {
        changePlayer();
    }


}

function restartGame(){
    currentPlayer = user;
    options = Array.from({length: 9}, (_) => "");
    initGame();
}

const score = {
    O: 1,
    X: -1,
    tie: 0
};

function aiPlayer(board){
    console.log('aiplayer called')
    let bestScore = -Infinity;
    let bestMove;

    for(let i = 0; i < board.length; i++) {
        if(board[i] === '') {
            board[i] = computer;
            
            let localScore = minimax(board, 0, true);
            console.log(`localScore:`, localScore)

            //reset
            board[i] = "";
            console.log(`localMove:`, i);
            
            if(localScore > bestScore){

                bestScore = localScore;
                bestMove = i;
            }
        }
    }

    board[bestMove] = computer;
    updateCell(cells[bestMove], bestMove);
    setTimeout(() => {
        checkWinner();
    }, 0);

}

function custom(board){
    console.log('custom called')
    console.log(`winner: `, winner);

    if(winner !== '') {
       return score[winner];
    }

    return 1;
}


function minimax(board, depth, ismax){
    console.log(depth, ismax ? 'MAXIMIZING' : 'MINIMIZING', 'BOARD:', board);


    if(winner !== '') {
        console.log(`current winner:`, score[winner]);
       return score[winner];
    } else if(!board.includes("")){
        return 0;
    }




    if(ismax){
        let maxScore = -Infinity;

        for(let i=0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = computer;
                let localScore = minimax([...board], depth + 1, false);
                
                //reset
                board[i] = "";
                
                if(localScore > maxScore){
                    maxScore = localScore;
                }
            } 
        }
        console.log(depth, 'RETURNING FROM MAXIMIZING');
        return maxScore;
        
    } else {
        let minScore = Infinity;

        for(let i=0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = user;
                let localScore = minimax([...board], depth + 1, true);
                
                //reset
                board[i] = "";
                if(localScore < minScore){
                    minScore = localScore;
                }
            }
        }
        console.log(depth, 'RETURNING FROM MAXIMIZING');
        return minScore;
    }
}

