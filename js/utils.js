function printMat(mat, selector) {
  var strHTML = "<table><tbody>";
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = "cell cell" + i + "-" + j;
      strHTML +=
        '<td class="' +
        className +
        ' " onclick="cellClicked(this,event)"></td>';
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}
function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    mat[i] = [];
    for (var j = 0; j < COLS; j++) {
      mat[i][j] = {
        isShown: false,
        isMine: false,
        isMarked: false,
        location: { i: i, j: j },
      };
    }
  }
  return mat;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);
    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value

  var elCell = document.querySelector(".cell" + location.i + "-" + location.j);
  elCell.innerHTML = value;
  if (value === MINE) {
    elCell.classList.add("armed");

    if (gBoard[location.i][location.j].isShown) {
      elCell.classList.remove("armed");
    }
  }
  elCell.addEventListener(
    "contextmenu",
    function (ev) {
      ev.preventDefault();
      if (elCell.innerHTML !== FLAG &&!gBoard[location.i][location.j].isShown) {
        if (gBoard[location.i][location.j].isMine) {
          elCell.classList.remove("armed");
        }
        elCell.innerHTML = FLAG;
        gBoard[location.i][location.j].isMarked = true;
      } else {
        gBoard[location.i][location.j].isMarked = false;
        elCell.innerHTML = value;
        if (gBoard[location.i][location.j].isMine) {
          elCell.classList.add("armed");
        }
      }
      checkGameWon();
      return false;
    },
    false
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is exclusive
}

function getRandomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine && !board[i][j].isShown) {
        emptyCells.push({ i: i, j: j });
      }
    }
  }
  return emptyCells;
}

function countNeighbors(mat, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) {
        continue;
      }
      if (i === rowIdx && j === colIdx) continue;
      if (mat[i][j].isMine) count++;
    }
  }
  // console.log(count)
  return count;
}

function neighbors(mat, rowIdx, colIdx) {
  var neighbors=[{
    i:i,
    j:j
  }]
  var counter=0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) {
        continue;
      }
      if (i === rowIdx && j === colIdx) continue;
      if (!mat[i][j].isMine) {
        neighbors[counter].i;
      }
    }
  }
  return neighbors;
}
  {


}

function timer() {
  var eltime = document.querySelector(".timer");

  milisec += 1;
  if (milisec === 10) {
    milisec = 0;
    sec += 1;
  }

  if (sec === 60) {
    sec = 0;
    min += 1;
  }
  if (sec < 10) {
    eltime.innerText = min + ":0" + sec + ":" + milisec;
  } else eltime.innerText = min + ":" + sec + ":" + milisec;
}

function markCell(location, howManyMines) {
  if (howManyMines > 4) {
    howManyMines = 4;
  }
  var elCell = document.querySelector(".cell" + location.i + "-" + location.j);
  elCell.classList.add("mark" + howManyMines);
}
