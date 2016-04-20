$(document).ready(function() {


  var squares = document.querySelectorAll('.square');
  var squaresText = document.querySelectorAll('.squareText');
  var humanPlayer = 1;
  var cpuPlayer = 2;
  var turn = 1;
  var gameArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var playerSelect = document.querySelectorAll('.playerSelect');
  var endCover = document.querySelectorAll('.endCover');
  var timer;

  var winRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  var winIndexes = [
    ["111000000"],
    ["000111000"],
    ["000000111"],
    ["100100100"],
    ["010010010"],
    ["001001001"],
    ["100010001"],
    ["001010100"]
  ];


  function refreshBoard() {
    for (i = 0; i < gameArray.length; i++) {
      if (gameArray[i] === 0) {
        squaresText[i].innerHTML = "";
      } else if (gameArray[i] === 1) {
        squaresText[i].innerHTML = "X";
      } else {
        squaresText[i].innerHTML = "O";
      }
    }
  }

  function emptySquares(){
    var empty = 0;
    for (var i = 0; i < gameArray.length; i++){
      if (gameArray[i] === 0){
        empty ++;
      }
    }
    return empty;
  }

  function changeChangetoBin(inputArray) {
    var cpuArray = [];
    var humanArray = [];
    var emptyArray = [];
    for (i = 0; i < inputArray.length; i++) {
      if (inputArray[i] === 0) {
        cpuArray.push(0);
        humanArray.push(0);
        emptyArray.push(1);
      } else if (inputArray[i] === cpuPlayer) {
        cpuArray.push(1);
        humanArray.push(0);
        emptyArray.push(0);
      } else {
        humanArray.push(1);
        cpuArray.push(0);
        emptyArray.push(0);
      }
    }
    var output = [];
    output.push(cpuArray);
    output.push(humanArray);
    output.push(emptyArray);
    return output;
  }

  function checkWinner(inputArray, player) {
    var playerPositions = changeChangetoBin(inputArray);
    playerPositions = player === cpuPlayer ? playerPositions[0].join("").toString(2) : playerPositions[1].join("").toString(2);
    for (i = 0; i < winIndexes.length; i++) {
      if ((parseInt(winIndexes[i][0], 2) & parseInt(playerPositions, 2)).toString(2) === parseInt(winIndexes[i][0], 2).toString(2)) {
        return winIndexes[i];
      }
    }
    return false;
  }

  function aiMove(array, player) {

    var board = array;
    var myplayer = player;

    var getValidMoves = function() {
      var available = [];
      if (checkWinner(board, cpuPlayer) !== false || checkWinner(board, humanPlayer) !== false) {
        return available;
      } else {
        for (i = 0; i < board.length; i++) {
          if (board[i] === 0) {
            available.push(i);
          }
        }
        return available;
      }
    };

    function scoreBoard(inputArray) {
      var score = 0;
      for (var i = 0; i < winRows.length; i++) {
        var rowScore = 0;
        if (inputArray[winRows[i][0]] === cpuPlayer) {
          rowScore = 1;
        } else if (inputArray[winRows[i][0]] === humanPlayer) {
          rowScore = -1;
        }

        if (inputArray[winRows[i][1]] === cpuPlayer) {
          if (rowScore === 1) {
            rowScore = 10;
          } else if (rowScore === 0) {
            rowScore = 1;
          } else {
            rowScore = 0;
          }
        } else if (inputArray[winRows[i][1]] === humanPlayer) {
          if (rowScore === humanPlayer);
          if (rowScore === -1) {
            rowScore = -10;
          } else if (rowScore === 0) {
            rowScore = -1;
          } else rowScore = 0;
        }

        if (inputArray[winRows[i][2]] === cpuPlayer)
          if (rowScore > 0) {
            rowScore *= 10;
          } else if (rowScore < 0) {
          rowScore = 0;
        } else {
          rowScore = 1;
        }
        if (inputArray[winRows[i][2]] === humanPlayer)
          if (rowScore < 0) {
            rowScore *= 10;
          } else if (rowScore > 0) {
          rowScore = 0;
        } else {
          rowScore = -1;
        }
        score += rowScore;
      }
      return score;
    }

    function minimax(depth, player) {
      var nextMoves = getValidMoves();
      var best = (player === cpuPlayer) ? -1e100 : 1e100,
        current,
        bestidx = -1;

      if (nextMoves.length === 0 || depth === 0) {
        best = scoreBoard(board);
      } else {
        for (var i = nextMoves.length; i--;) {
          var m = nextMoves[i];
          board[m] = player;

          if (player === cpuPlayer) {
            current = minimax(depth - 1, humanPlayer)[0];
            if (current > best) {
              best = current;
              bestidx = m;
            }
          } else {
            current = minimax(depth - 1, cpuPlayer)[0];
            if (current < best) {
              best = current;
              bestidx = m;
            }
          }

          board[m] = 0;
        }
      }
      return [best, bestidx];
    }
    x = minimax(4, myplayer);
    gameArray[x[1]] = cpuPlayer;
    refreshBoard();
    endTurn(cpuPlayer);
  }

  for (var i = 0; i < squares.length; i++) {
    (function(index) {
      squares[i].onclick = function() {
        if (turn === humanPlayer) {
          if (gameArray[index] === 0) {
            gameArray[index] = humanPlayer;
            refreshBoard();
            endTurn(humanPlayer);
          }
        }
      };
    })(i);
  }

  endCover[0].onclick = function() {
    endCover[0].classList.remove('coverOn');
    gameArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, ];
    for (var i = 0; i < squares.length; i++) {
      squares[i].classList.remove('winningSquare');
      squares[i].classList.remove('drawnSquare');
    }
    clearTimeout(timer);
    turn = 1;
    refreshBoard();
    if (cpuPlayer === 1) {
      aiMove(gameArray, cpuPlayer);
    }
  };

  function endTurn(player) {
    var won = checkWinner(gameArray, player);
    var empty = emptySquares();
    turn = (turn === 1) ? 2 : 1;
    if (!won) {
      if (player === humanPlayer) {
        aiMove(gameArray, cpuPlayer);
      } else if (empty === 0){
        gameDrawn();
      }
    } else {
      gameWon(won);
    }
  }

  function gameWon(winString) {
    var winArray = winString[0].split("");
    var toHighLight = [];
    for (var i = 0; i < winArray.length; i++) {
      if (winArray[i] === "1") {
        toHighLight.push(i);
      }
    }
    var n = 0;

    function highLight() {
      timer = setTimeout(function() {
        squares[toHighLight[n]].classList.add('winningSquare');
        n++;
        if (n < toHighLight.length) {
          highLight();
        }
      }, 150);
    }
    highLight();
    endCover[0].classList.add("coverOn");
  }

function gameDrawn(){
  var n = 0;
  function highLight() {
    timer = setTimeout(function() {
      squares[n].classList.add('drawnSquare');
      n++;
      if (n < squares.length) {
        highLight();
      }
    }, 150);
  }
  highLight();
  endCover[0].classList.add("coverOn");
}


  for (var i = 0; i < playerSelect.length; i++) {
    (function(index) {
      if (turn === humanPlayer){
      playerSelect[i].onclick = function() {
        if (humanPlayer === 1) {
          humanPlayer = 2;
          cpuPlayer = 1;
          playerSelect[1].classList.add('activePlayer');
          playerSelect[0].classList.remove('activePlayer');
        } else {
          humanPlayer = 1;
          cpuPlayer = 2;
          playerSelect[1].classList.remove('activePlayer');
          playerSelect[0].classList.add('activePlayer');
        }
        if (turn === cpuPlayer) {
          aiMove(gameArray, cpuPlayer);
        }
      };
      }
    })(i);
  }

});
