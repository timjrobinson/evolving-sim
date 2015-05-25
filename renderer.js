/* globals main */
// Based on Wikipedia's description of the algorithm
// http://en.wikipedia.org/wiki/Conway's_Game_of_Life#Rules

var log;
log = console.log.bind(console);

var Grid = {};

var WIDTH       = 10,
    HEIGHT      = 10,
    GUTTERSIZE = 8,  // Amount of offscreen pixel spaces
    SPEED      = 30; // Milliseconds

Grid.calculateDimensions = function() {
  this.setup(this.widthSlider.valueAsNumber, this.heightSlider.valueAsNumber, this.hiddenRegionSize, this.canvas, true);
};

Grid.setSliderValues = function() {
  this.widthSliderValue.innerText = this.widthSlider.value;
  this.heightSliderValue.innerText = this.heightSlider.value;
  this.delaySliderValue.innerText = this.delaySlider.value;
  SPEED = this.delaySlider.valueAsNumber;
};

Grid.addListeners = function() {
  document.addEventListener("keydown", this.key.down, false);
  $(this.canvas).mousedown(this.mouse.down);
  this.canvas.addEventListener("mouseup", this.mouse.up, false);
  this.canvas.addEventListener("mousemove", this.mouse.move, false);
  this.widthSlider.addEventListener("input", this.setSliderValues.bind(this), false);
  this.heightSlider.addEventListener("input", this.setSliderValues.bind(this), false);
  this.delaySlider.addEventListener("input", this.setSliderValues.bind(this), false);
  this.widthSlider.addEventListener("change", this.calculateDimensions.bind(this), false);
  this.heightSlider.addEventListener("change", this.calculateDimensions.bind(this), false);
};

Grid.removeListeners = function() {
  document.removeEventListener("keydown", this.key.down, false);
  this.canvas.removeEventListener("mousedown", this.mouse.down, false);
  this.canvas.removeEventListener("mouseup", this.mouse.up, false);
  this.canvas.removeEventListener("mousemove", this.mouse.move, false);
  this.widthSlider.removeEventListener("input", this.setSliderValues.bind(this), false);
  this.heightSlider.removeEventListener("input", this.setSliderValues.bind(this), false);
  this.delaySlider.removeEventListner("input", this.setSliderValues.bind(this), false);
  this.widthSlider.removeEventListener("change", this.calculateDimensions.bind(this), false);
  this.heightSlider.removeEventListener("change", this.calculateDimensions.bind(this), false);
};

Grid.setup = function(width, height, gutterSize, canvas, resize) {
  this.canvas = canvas;
  this.initialWidth = width;
  this.initialHeight = height;
  this.canvas.width = width % (window.innerWidth - 2);
  this.canvas.height = height % (window.innerHeight - 40);
  this.pixelWidth = Math.floor(Math.min((window.innerWidth - 2) / width, (window.innerHeight - 40) / height));
  this.canvas.width = this.pixelWidth * width;
  this.canvas.height = this.pixelWidth * height;
  this.hiddenRegionSize = gutterSize;
  this.hiddenRegionWidth = Math.ceil(width + this.hiddenRegionSize);
  this.hiddenRegionHeight = Math.ceil(height + this.hiddenRegionSize);
  this.initialX = parseInt(this.hiddenRegionSize / 2);
  this.initialY = parseInt(this.hiddenRegionSize / 2);
  this.width = this.hiddenRegionWidth;
  this.height = this.hiddenRegionHeight;
  this.context = this.canvas.getContext("2d");
  this.pixelScaleX = this.canvas.width / this.canvas.offsetWidth;
  this.pixelScaleY = this.canvas.height / this.canvas.offsetHeight;
  this.paused = true;
  this.generationNumber = 0;
  this.generationNumberEl = document.getElementById("gen-num");
  this.widthSlider = document.getElementById("width");
  this.heightSlider = document.getElementById("height");
  this.heightSliderValue = document.getElementById("height-value");
  this.widthSliderValue = document.getElementById("width-value");
  this.delaySlider = document.getElementById("delay");
  this.delaySliderValue = document.getElementById("delay-value");
  if (!resize) {
    this.addListeners();
  }
  this.widthSliderValue.innerText = this.initialWidth;
  this.heightSliderValue.innerText = this.initialHeight;
  this.delaySliderValue.innerText = SPEED;
  this.heightSlider.value = this.initialHeight;
  this.widthSlider.value = this.initialWidth;
  this.delaySlider.value = SPEED;
  this.resetGrid();
};

Grid.drawOutLine = function() {
  this.context.beginPath();
  for (var x = 0; x < this.width; ++x) {
    this.context.moveTo(x * this.pixelWidth, 0);
    this.context.lineTo(x * this.pixelWidth, this.height * this.pixelWidth);
  }
  for (var y = 0; y < this.height; ++y) {
    this.context.moveTo(0, y * this.pixelWidth);
    this.context.lineTo(this.width * this.pixelWidth, y * this.pixelWidth);
  }
  this.context.strokeStyle = "#ddd";
  this.context.stroke();
};

Grid.createGrid = function() {
  return Array.apply(null, new Array(this.width + this.hiddenRegionSize))
    .map(Boolean.prototype.valueOf, false)
    .map(function() {
      return Array.apply(null, new Array(this.height + this.hiddenRegionSize))
        .map(Boolean.prototype.valueOf, false);
    }.bind(this));
};

Grid.clearPixels = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawOutLine();
};

Grid.resetGrid = function() {
  delete this.pixels;
  this.clearPixels();
  this.pixels = this.createGrid();
};

Grid.putPixel = function(x, y) {
  if (this.pixels[x + this.initialX][y + this.initialY] == false) {
    this.pixels[x + this.initialX][y + this.initialY] = true;
  }
  this.context.rect(x * this.pixelWidth + 1, y * this.pixelWidth + 1, this.pixelWidth - 2, this.pixelWidth - 2);
};

Grid.delPixel = function(x, y) {
  this.pixels[x + this.initialX][y + this.initialY] = false;
  this.context.clearRect(x * this.pixelWidth + 1, y * this.pixelWidth + 1, this.pixelWidth - 2, this.pixelWidth - 2);
};

Grid.cloneDeep = function(array) {
  var cloned = [];
  for (var x = 0; x < array.length; x++) {
    cloned[x] = [];
    for (var y = 0; y < array[x].length; y++) {
      cloned[x][y] = array[x][y];
    }
  }
  return cloned;
}

Grid.nextGeneration = function() {
  var x, y;
  this.genStep = this.createGrid();
  this.clearPixels();
  this.context.beginPath();
  this.genStep = main(this.width, this.height, this.cloneDeep(this.pixels));
  if (!this.genStep) {
    return alert("Please return newCells from the main function.");
  }
  for (x = 0; x < this.width; ++x) {
    for (y = 0; y < this.height; ++y) {
      if (this.genStep[x] && this.genStep[x][y]) {
        this.putPixel(x - this.initialX, y - this.initialY);
        this.pixels[x][y] = this.genStep[x][y];
      } else {
        this.pixels[x][y] = false;
      }
    }
  }
  this.context.closePath();
  this.context.fill();
};

Grid.mouse = {
  move: function(ev) {
    if (this.mouseHeld) {
      var x = Math.floor((ev.offsetX || ev.clientX - Grid.canvas.offsetLeft) * Grid.pixelScaleX / Grid.pixelWidth),
          y = Math.floor((ev.offsetY || ev.clientY - Grid.canvas.offsetTop) * Grid.pixelScaleY / Grid.pixelWidth);
      if (this.oldX === x && this.oldY === y) {
        return false;
      }
      this.oldX = x;
      this.oldY = y;
      Grid.context.beginPath();
      if (this.rightClick) {
        Grid.delPixel(x, y);
      } else {
        Grid.putPixel(x, y);
      }
      Grid.context.closePath();
      Grid.context.fill();
    }
  },
  down: function(ev) {
    this.mouseHeld = true;
    var x = Math.floor((ev.offsetX || ev.clientX - Grid.canvas.offsetLeft) * Grid.pixelScaleX / Grid.pixelWidth),
        y = Math.floor((ev.offsetY || ev.clientY - Grid.canvas.offsetTop) * Grid.pixelScaleY / Grid.pixelWidth);
    this.oldX = x;
    this.oldY = y;
    this.rightClick = (ev.which === 2 || ev.which === 3);
    Grid.context.beginPath();
    if (this.rightClick) {
      Grid.delPixel(x, y);
    } else {
      Grid.putPixel(x, y);
    }
    Grid.context.closePath();
    Grid.context.fill();
  },
  up: function() {
    this.mouseHeld = false;
  }
};

Grid.generationLoop = function(start) {
  Grid.generationNumberEl.innerText = Grid.generationNumber;
  this.loop = function() {
    Grid.nextGeneration();
    Grid.generationNumber += 1;
    if (!Grid.paused) {
      window.setTimeout(Grid.loop, SPEED);
    }
  };
  if (start) {
    this.loop();
  }
};

Grid.key = {
  down: function(ev) {
    if (ev.which === 190 && Grid.presets.random) {
      Grid.applyPreset("random");
      Grid.generationNumber = 0;
      document.getElementById("gen-num").innerText = Grid.generationNumber;
    } else if (ev.which === 32) {
      ev.preventDefault();
      Grid.nextGeneration();
      Grid.generationNumber += 1;
      document.getElementById("gen-num").innerText = Grid.generationNumber;
    } else if (ev.which === 13) {
      Grid.paused = !Grid.paused;
      if (Grid.paused) {
        Grid.generationLoop(false);
      } else {
        Grid.generationLoop(true);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  Grid.setup(WIDTH, HEIGHT, GUTTERSIZE, document.getElementById("grid"));
  Grid.appendPresets();
  Grid.paused = false;
  Grid.generationLoop(true);
}, false);
