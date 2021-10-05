"use strict";
const MINE = '<img src="img/mines.png" class = "hide">';
const FLAG = '<img src="img/flag-red-icon.png">';
const EMPTY = "";

var gBoard = [];
var isStart = false;
var gTimeInterval;
var gSafeInterval;
var safe
var milisec;
var sec;
var min;
var mines;
var gLives;
var smileyTime;
var gScore;
var isHint;
var gHint;
var isGame
var canHint
var empties = [];
var gSafeCount
var isSafe={}



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

function hintsLeft() {
  var elHint = document.querySelector(".hint");
  if (gHint === 3) {
    elHint.innerText = "hints: 💡 💡 💡";
  } else if (gHint === 2) {
    elHint.innerText = "hints: 💡 💡";
  } else if (gHint === 1) {
    elHint.innerText = "hints: 💡";
  } else {
    elHint.innerText = "hints: 0";
  }
}

//making the board less safe
function lessSafe(){
  clearInterval(gSafeInterval)
  var elSafe = document.querySelector(".howSafe");
  if (gSafeCount === 3) {
    elSafe.innerText = "3 Clicks Left";
  } else if (gSafeCount === 2) {
    elSafe.innerText = "2 Clicks Left";
  } else if (gSafeCount === 1) {
    elSafe.innerText = "1 Click Left";
  } else {
    elSafe.innerText = "0 Clicks Left";
  }
}

// creating and setting the board
function initGame(row = 4, col = 4) {
  gScore = 0;
  clearInterval(gTimeInterval);
  isStart = false;
  gLives = gHint = gSafeCount= 3;
  isGame=true
  lessSafe()
  life();
  hintsLeft();
  getScore();
  milisec = 0;
  sec = 0;
  min = 0;
  buildBoard(row, col);
}

function getScore(){
  if (localStorage.sec||localStorage.mili){
    var elRecord=document.querySelector(".highestScore"+4)
  elRecord.innerHTML="record time on Easy level: "+localStorage.min+":"+localStorage.sec+":"+localStorage.mili
}
if (localStorage.sec8||localStorage.mili8){
  var elRecord=document.querySelector(".highestScore"+8)
elRecord.innerHTML="record time on Hard level:  "+localStorage.min8+":"+localStorage.sec8+":"+localStorage.mili8
}
if (localStorage.sec12||localStorage.mili12){
  var elRecord=document.querySelector(".highestScore"+12)
elRecord.innerHTML="record time on Expert level: "+localStorage.min12+":"+localStorage.sec12+":"+localStorage.mili12
}
}

function buildBoard(row, col) {
  gBoard = createMat(row, col);


  printMat(gBoard, ".board");
}

// placing the mines
function placeMines(level) {
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
  for (var count = 0; count < mines; count++) {
    empties.splice(0,1);
  }
  countMinesAround();
}

//neighboring cells
function countMinesAround() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      gBoard[i][j].minesCount = countNeighbors(gBoard, i, j);
      if(gBoard[i][j].isMine){
        gBoard[i][j].minesCount=-1
      }
      if (!gBoard[i][j].isMine) {
        renderCell(gBoard[i][j].location, gBoard[i][j].minesCount);
      }
    }
  }
}

function score() {
  gScore += 1;
  var elScore = document.querySelector(".keepScore");
  elScore.innerText = gScore;
}


// checking the game events
function cellClicked(whichCell, leftOrRight) {
  if(safe&&!isHint){
    safe=false
    gSafeCount--
    lessSafe()
    var elSafeCell = document.querySelector(".cell-" + isSafe.i + "-" + isSafe.j);
   elSafeCell.style.opacity=1
        }
  if (gLives === 0 || !isGame) return;
  var arr = whichCell.classList[1].split("-");
  var location = {
    i: Number(arr[1]),
    j: Number(arr[2]),
  };
  if (isHint&&isStart) {
    showNeighbors(location.i, location.j, true);
    setTimeout(function () {
    showNeighbors(location.i, location.j, false);
    }, 1000);
    isHint=false
    gHint--
    hintsLeft()
    return;
  }else{
    isHint=false
  }
  if (!isStart) {
    gBoard[location.i][location.j].isShown = true;
    placeMines(gBoard.length);
    markCell(location, gBoard[location.i][location.j].minesCount);
    gTimeInterval = setInterval(function () {
      timer();
    }, 100);
    isStart = true;
    score();
    canHint=true
  }
  if (
    !gBoard[location.i][location.j].isShown &&
    leftOrRight.button === 0 &&
    !gBoard[location.i][location.j].isMarked
    ) {
      score();
      gBoard[location.i][location.j].isShown = true;
      markCell(location, gBoard[location.i][location.j].minesCount);
      checkMine(location);
    }
}

// bonus hint task
function hint() {
  if (gHint){
    isHint = true;
  }
}

function showNeighbors(rowIdx, colIdx, isShow) {
  var loc = {};
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > gBoard.length - 1) {
        continue;
      }
      loc = {
        i: i,
        j: j,
      };
      if (isShow){
      markCell(loc, gBoard[i][j].minesCount);
      }else if(!gBoard[i][j].isShown){
      removeCellMark(loc, gBoard[i][j].minesCount);
      }  
    }
  }
}

//checking if a mine was hit
function checkMine(location) {
  var elSmiley = document.querySelector(".smiley");
  if (gBoard[location.i][location.j].isMine === true) {
    gLives--;
    gScore--;
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
  alert("game over");
  isGame=false
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
        if (
          gBoard[i][j].isMine &&
          (gBoard[i][j].isMarked || gBoard[i][j].isShown)
        ) {
          continue;
        } else if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
          return;
        }
      }
    }
    clearInterval(gTimeInterval);
  checkRecord()
    alert("YOU WON!!");
    initGame()
} else {
  return;
}
}

function checkRecord(){
  if (gBoard.length===4){
if (localStorage.sec||localStorage.mili){
if (localStorage.min>=min && localStorage.sec>sec || (Number(localStorage.sec)===sec&&localStorage.mili>milisec)){
localStorage.min=min
localStorage.sec=sec
localStorage.mili=milisec
}
}else {
    localStorage.min=min
    localStorage.sec=sec
    localStorage.mili=milisec
  }
}else if(gBoard.length===8){
  if (localStorage.sec8||localStorage.mili8){
    if((localStorage.min8>=min&&localStorage.sec8>sec)||(Number(localStorage.sec8)===sec&&localStorage.mili8>milisec)){
    localStorage.min8=min
    localStorage.sec8=sec
    localStorage.mili8=milisec
    }
    }else {
        localStorage.min8=min
        localStorage.sec8=sec
        localStorage.mili8=milisec
      }
}else if(gBoard.length===12){
  if (localStorage.sec12||localStorage.mili12){
    if((localStorage.min12>=min&&localStorage.sec12>sec) ||(Number(localStorage.sec12)===sec&&localStorage.mili12>milisec)){
    localStorage.min12=min
    localStorage.sec12=sec
    localStorage.mili12=milisec
    }
    }else {
        localStorage.min12=min
        localStorage.sec12=sec
        localStorage.mili12=milisec
      }
}
    var elRecord=document.querySelector(".highestScore"+gBoard.length)
    if (gBoard.length===4){
    elRecord.innerHTML="record time on Easy level: "+localStorage.min+":"+localStorage.sec+":"+localStorage.mili
    }else if (gBoard.length===8){
      elRecord.innerHTML="record time on Hard level: "+Number(localStorage.min8)+":"+Number(localStorage.sec8)+":"+Number(localStorage.mili8)
    }else if (gBoard.length===12){
      elRecord.innerHTML="record time on Expert level: "+Number(localStorage.min12)+":"+Number(localStorage.sec12)+":"+Number(localStorage.mili12)
    }

  }

  function safeClick(){
    if(isStart&&isGame&&!safe){
      for (var i=0;i<empties.length;i++){
        if (!gBoard[empties[i].i][empties[i].j].isShown){
          safe=true
        }
        break
      }
      isSafe=empties[i]
      gSafeInterval=setInterval(function(){
        var elCell = document.querySelector(".cell-" + empties[i].i + "-" + empties[i].j);
        if (Number(elCell.style.opacity)===0.5){
   elCell.style.opacity=1
  }else{
  elCell.style.opacity=0.5
}
          },700)
        }
        
      }
    

  