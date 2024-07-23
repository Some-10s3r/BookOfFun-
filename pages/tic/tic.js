var Board;

const huPlayer="O";
const aiPlayer="X";
var currentPlayer="X";
const wincombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const cells = document.querySelectorAll('.box');
const msg = document.getElementById('msg');
const versus = document.getElementById('versus');

var aiGame;


startGame();
function startGame(){
    versus.innerText="you are playing against an AI";
    aiGame = true;
    Board = Array.from(Array(9).keys());
    msg.style.display = "none";
    for(let i=0;i < 9;i++){
        cells[i].removeEventListener('click',PlayerClick,false);
        cells[i].innerText="";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false);
    }
}

function turnClick(cell){
    if(typeof Board[cell.target.id] == 'number'){
        turn(cell.target.id , huPlayer);
        if(!checkTie()){
            setTimeout(() => {
                turn(bestSpot(), aiPlayer);
            }, 150);
        };
    }
}

function turn(cellId,player){
    Board[cellId] = player;
    document.getElementById(cellId).innerText = player;
    let gameWon = checkWin(Board,player);
    if(gameWon){gameOver(gameWon)}
}

function checkWin(board,player){
    let plays = board.reduce((a,e,i)=>
        (e===player)?a.concat(i) :a,[]);
    let gameWon=null;
    for (let index = 0; index < wincombos.length; index++) {
        const win = wincombos[index];
        if(win.every(elem =>plays.indexOf(elem) > -1)){
            gameWon={index: index,player: player};
            break;
        }
    }
    return gameWon
}

function gameOver(gameWon){
    for(let index of wincombos[gameWon.index])
    document.getElementById(index).style.backgroundColor=
        gameWon.player == huPlayer ? "#ffdc0055" : "#ff767555";
    for (let i =0;i<9;i++){
        cells[i].removeEventListener('click',turnClick,false);
        cells[i].removeEventListener('click',PlayerClick,false)
    }
    declareWinner(gameWon.player)
}

function declareWinner(who){
    msg.style.display = "block";
    if(aiGame && who != "Tie!"){
        msg.innerText = who == huPlayer ? "you won!" : "you lost";
    }else if(!aiGame && who != "Tie!"){
        msg.innerText = who + " won";
    }else {
        msg.innerText = who;
    }
}

function emptySquares(){
    return Board.filter(e =>typeof e == 'number')
}

function bestSpot(){
    return minimax(Board,aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length==0){
        for(let i = 0;i<9;i++){
            cells[i].style.backgroundColor = "#55efc455"
            cells[i].removeEventListener('click',turnClick,false)
        }
        declareWinner("Tie!")
        return true
    }
    return false
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function startPlGame(){
    versus.innerText="you are in 2player mode";
    aiGame = false;
    Board = Array.from(Array(9).keys());
    msg.style.display = "none";
    for(let i=0;i < 9;i++){
        cells[i].removeEventListener('click',turnClick,false)
        cells[i].innerText="";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',PlayerClick,false);
    }
}
function PlayerClick(cell){
    if(typeof Board[cell.target.id] == 'number'){
        turn(cell.target.id , currentPlayer);
        if (!checkTie()) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }
}