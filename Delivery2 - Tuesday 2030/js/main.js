"use strict";
const MINE = '<img src="img/mines.png" class = "hide">';
const FLAG = '<img src="img/flag-red-icon.png">';
const EMPTY='';

var gBoard = [];
var isStart = false;
var gTimeInterval;
var milisec;
var sec;
var min;
var mines 
var gLives;
var smileyTime;
var gScore;

//setting the life bar
function life() {
  var elLife = document.querySelector(".lives");
  if (gLives === 3) {
    elLife.innerText = "lives: ❤ ❤ ❤";
  } else if (gLives === 2) {
    elLife.innerText = "lives: ❤ ❤";
  } else if (gLives === 1) {
    elLife.innerText = "lives: ❤";
  } else {
    elLife.innerText = "lives: 0";
  }
}

// creating and setting the board
function initGame(row = 4, col = 4) {
  gScore = 0;
  clearInterval(gTimeInterval);
  isStart = false;
  gLives = 3;
  life(gLives);

  milisec = 0;
  sec = 0;
  min = 0;
  buildBoard(row, col);
}

function buildBoard(row, col) {
  gBoard = createMat(row, col);
  printMat(gBoard, ".board");
}

// placing the mines
function placeMines(level) {
  var empties = []
  switch (level) {
    case 4:
      mines = 2;
      break;
    case 8:
      mines = 12;
      break;
    case 12:
      mines = 30;
      break;
  }

  empties = getEmptyCells(gBoard);
  empties = shuffle(empties);
  for (var count = 0; count < mines; count++) {
    renderCell(empties[count], MINE);
    gBoard[empties[count].i][empties[count].j].isMine = true;
  }
  countMinesAround();
}

//neighboring cells
function countMinesAround() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      gBoard[i][j].minseCount = countNeighbors(gBoard, i, j)
      if (!gBoard[i][j].isMine) {
        renderCell(gBoard[i][j].location, gBoard[i][j].minseCount);
      }
    }
  }
}

// checking the game events
function cellClicked(whichCell, leftOrRight) {
  if (gLives === 0) return;
  // var neighbors=[]
  var arr = whichCell.classList[1].split("-");
  var location = {
    i: Number(arr[0][4]),
    j: Number(arr[1][0]),
  };
  if (!isStart && leftOrRight.button === 0) {
    gBoard[location.i][location.j].isShown = true;    
    placeMines(gBoard.length);
    markCell(location, gBoard[location.i][location.j].minseCount);
    gTimeInterval = setInterval(function () {
      timer();
    }, 100);
    isStart = true;
  }
  if (!gBoard[location.i][location.j].isShown && leftOrRight.button===0 && !gBoard[location.i][location.j].isMarked) {
    gScore += 1;
    var elScore = document.querySelector(".score");
    elScore.innerText = gScore;
    gBoard[location.i][location.j].isShown = true;    
      markCell(location, gBoard[location.i][location.j].minseCount);
      checkMine(location);
    }

}


//checking if a mine was hit
function checkMine(location) {
  var elSmiley = document.querySelector(".smiley");
  if (gBoard[location.i][location.j].isMine === true) {
    gLives--;
    gScore--
    renderCell(location, MINE);
    life();
    elSmiley.innerText = "🤕";
    changeSmiley();

    if (gLives === 0) {
      clearTimeout(smileyTime);
      elSmiley.innerText = "😫";
      gameOver();
    }
  } else {
    elSmiley.innerText = "😮";
    changeSmiley();
  }
  checkGameWon();
}

function gameOver() {
  clearInterval(gTimeInterval);
}

//returning the smiley to original emoji
function changeSmiley() {
  smileyTime = setTimeout(function () {
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerText = "😃";
  }, 400);
}

//checkign game status
function checkGameWon() {
  if (gScore === gBoard.length ** 2 - mines) {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard.length; j++) {
        if (gBoard[i][j].isMine && (gBoard[i][j].isMarked || gBoard[i][j].isShown)) {
          continue
        } else if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
          return;
        }
      }
    }
    clearInterval(gTimeInterval)
    alert("YOU WON!!");
  } else {
    return;
  }
}
