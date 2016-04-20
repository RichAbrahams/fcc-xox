function makeAiObject(board, player, depth){

    this.board = board;
    this.player = player;
    this.depth = depth;
    this.score = function(){
      var myscore = scoreBoard(this.board);
      return myscore;
    };
    this.gameOver = checkWinner(this.board, this.player);
    this.openIndexes = function(){
      var output = [];
      for (var i = 0; i < this.board.length; i++){
        if (this.board[i] === 0){
          output.push(i);
        }
      }
      return(output);
    };
    this.possibleGameState = function(){
      var gs = [];
      var open = this.openIndexes();
      for (m = 0; m < open.length; m++){
        tempgs = [];
        this.board[open[m]] = this.player;
        for (var i = 0; i < this.board.length; i++){
          tempgs.push(this.board[i]);
        }
        this.board[open[m]] = 0;
        gs.push(tempgs);
      }
      return gs;
    };
    this.bestScore = function(){
      console.log('newobject', this.board);
      console.log(this.score());
      var moves = this.possibleGameState();
      var myscore = this.score();
      var over = this.gameOver;
      var player = this.player;
      var bestScore = (player = humanPlayer) ? -1e100 : 1e100;
      if (over !== false){
        return myscore;
      } else {
        if (this.player === cpuPlayer){
          for (var i = 0; i < moves.length; i++){
            makescore = new makeAiObject(moves[i], humanPlayer, depth-1).bestScore();
            if (makescore > bestScore){
              bestScore = makescore;
            }
            return bestScore;
          }
        } else {
          for (var n = 0; n < moves.length; n++){
            makescore = new makeAiObject(moves[n], cpuPlayer, depth-1).bestScore();
            if (makescore < bestScore){
              bestScore = makescore;
            }
            return bestScore;
        }
      }
}
    };
  }
