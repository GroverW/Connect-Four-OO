/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class ConnectFourGame {
  constructor(width,height) {
    this.width = width;
    this.height = height;
 
    // array of rows, each row is array of cells  (board[y][x])
    this.board = [];

     // active player: 1 or 2
    this.currPlayer = 1;
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let row = 0; row < this.height; row++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() { 
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let col = 0; col < this.width; col++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', col);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let row = 0; row < this.height; row++) {
      const tableRow = document.createElement('tr');

      for (let col = 0; col < this.width; col++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${row}-${col}`);
        tableRow.append(cell);
      }

      htmlBoard.append(tableRow);
    }
    document.getElementById('start-button').innerHTML = 'RESTART';
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(col) {
    for (let row = this.height - 1; row >= 0; row--) {
      if (!this.board[row][col]) {
        return row;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(row, col) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (row + 2);

    const spot = document.getElementById(`${row}-${col}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const col = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const row = this.findSpotForCol(col);
    if (row === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[row][col] = this.currPlayer;
    this.placeInTable(row, col);
    
    // check for win
    if (this.checkForWin()) {
      console.log('WIMMER');
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      // console.log(this);
      return cells.every(
        ([y, x]) => {
          return y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
          
        }
      );
    }
    let checkWinner = _win.bind(this);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        //console.log(this);
        // console.log (checkWinner(vert));
        if (checkWinner(horiz) || checkWinner(vert) || checkWinner(diagDR) || checkWinner(diagDL)) {
          return true;
        }
      }
    }
  }
  startGame() {
    document.getElementById('board').innerHTML = '';
    this.board = [];
    this.currPlayer = 1;
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

let connectFourGame = new ConnectFourGame(7,6);

document.getElementById('start-button').addEventListener('click',connectFourGame.startGame.bind(connectFourGame));
