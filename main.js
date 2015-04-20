/* globals Grid */
/*
 * Main
 *
 * Add code to make the game of life work inside the main function.
 * cells is a 2D array of every square you see on the board.
 * Each cell has a value of true or false, which represents whether the cell is alive or not.
 *
 * Your job is to calculate what cells should be alive or dead after 1 turn.
 * Put the result into newCells and return it at the end of the function.
 * newCells is currently a 2D array of width * height where every value is false.
 *
 * newCells = [
    [0, 0, 0], 
    [0, 1, 0], 
    [0, 1, 0]
  ]
 */
function main (width, height, cells) {
  var newCells = Grid.createGrid(width, height);
  
  // cells = [0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0];
  // width = cells.length;
  
  for (var i = 0; i < width; i = i + 1) {
    for (var j = 0; j < height; j = j + 1) {
      var cell = cells[i][j];
      
      var topLeft = cells[i-1] ? cells[i-1][j-1] : 0;
      var topCenter = cells[i][j-1] || 0;
      var topRight = cells[i+1] ? cells[i+1][j-1] : 0;
      var middleLeft = cells[i-1] ? cells[i-1][j] : 0; 
      var middleRight = cells[i+1] ? cells[i+1][j] : 0;
      var bottomLeft = cells[i-1] ? cells[i-1][j+1] : 0;
      var bottomCenter = cells[i][j+1] || 0;
      var bottomRight = cells[i+1] ? cells[i+1][j+1] : 0
      
      var isAlive = cell;
      var numberOfNeighborsNeededToLive = 2;
      var totalAliveNeighbors = 0;  
      
      totalAliveNeighbors = topLeft + topCenter + topRight + middleLeft + middleRight + bottomLeft + bottomCenter + bottomRight
      
      if (totalAliveNeighbors < 2){
        isAlive = false;
      }
      
      if (totalAliveNeighbors > 3) {
        isAlive = false;
      }
      
      if (totalAliveNeighbors == 3) {
        isAlive = true;
      }
      
      
        
      newCells[i][j] = isAlive;
    }
  }
  


  return newCells;
}