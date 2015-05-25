/* globals Grid, building, world, build, destroy giveResources, drawConstructedBuildings, drawResources, checkResources  */
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
 
var lastUpdate = 0;

function main (width, height, cells) {
  var newCells = Grid.createGrid(width, height);
  
  if (world === null) {
    world = cells;
  };
  
  
  // Codes
  // cells = new world state
  // world = old world state
  
  for(var i=0; i<width; i++) {
    for(var j=0; j<height; j++) {
      if(world[i][j] !== cells[i][j]) {
        var constructedSomething = cells[i][j]
        if (constructedSomething) {
          var buildResult = build(i, j);
          if (buildResult === false) {
            cells[i][j] = false;
          } else {
            cells[i][j] = buildResult;
          }
        } else {
          var buildingName = world[i][j]
          destroy(buildingName);
        }
      }
    }
  };

  if (lastUpdate < Date.now() - 1000) {
    giveResources();
    lastUpdate = Date.now();
  }
  
  drawConstructedBuildings();
  drawResources();
    
  checkResources();
  
  world = cells;
  

  return cells;
}