window.onload = function() {
  init();
};

// INPUT
document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // LEFT
      Snake.moveLeft();
      break;

    case 40: // DOWN
      Snake.moveDown();
      break;

    case 39: // RIGHT
      Snake.moveRight();
      break;

    case 38: // UP
      Snake.moveUp();
      break;
  }
};

var canvas = document.getElementById("playgroundCanvas");
canvas.width = 480;
canvas.height = 480;

var size = 20,
    score = 0,
    blockCount = 0,
    ctx = canvas.getContext('2d');

var Snake = {
  x: 0,
  y: 0,
  movingX: 0,
  movingY: 0,
  canChange: true,
  body: [{x: this.x, y: this.y}],

  moveLeft: function() {
    if (this.canChange && this.movingX != 1) {
      this.movingX = -1;
      this.movingY = 0;
      this.canChange = false;
    }
  },

  moveRight: function() {
    if (this.canChange && this.movingX != -1) {
      this.movingX = 1;
      this.movingY = 0;
      this.canChange = false;
    }
  },

  moveUp: function() {
    if (this.canChange && this.movingY != 1) {
      this.movingY = -1;
      this.movingX = 0;
      this.canChange = false;
    }
  },

  moveDown: function() {
    if (this.canChange && this.movingY != -1) {
      this.movingY = 1;
      this.movingX = 0;
      this.canChange = false;
    }
  },

  isOnMe: function(x, y, includeHead) {
    for (var i in this.body) {
      if (!(i == 0 && !includeHead) && this.body[i].x == x && this.body[i].y == y) {
        return true;
      }
    }

    return false;
  }
};

var Block = {
  x: null,
  y: null
};

var SpecialBlock = {
  x: null,
  y: null,
  lifespan: 0
};

function init() {
  // Center playground
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + 20 + "px";
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
  overlay.style.top = (window.innerHeight - canvas.height) / 2 + 20 + "px";
  overlay.style.left = (window.innerWidth - canvas.width) / 2 + "px";

  // Display overlay
	overlay.className = "";
	overlay.innerHTML = "Get ready";

  // Start game after timeout
	setTimeout(function() {
		overlay.className = "hidden";
    Snake.movingX = 1;
		createBlock();
	}, 500);
}

function gameOver() {
  // Stop the game
  clearTimeout(Draw);
  clearTimeout(update);

  // Display Game Over message
  document.getElementById("overlay").innerHTML = "Game Over!";
  document.getElementById("overlay").className = "";
}

function getRandomFreeSpot() {
  var randomX,
      randomY;

  do {
    randomX = Math.floor(Math.random() * ((canvas.width - size) / size)) + 1; // create random number between 1 and 24
    randomY = Math.floor(Math.random() * ((canvas.height - size) / size)) + 1; // create random number between 1 and 24
  } while (Snake.isOnMe(randomX * size, randomY * size, true))

  return {x: randomX, y: randomY};
}

function createBlock() {
  var pos = getRandomFreeSpot();
  Block = {x: pos.x * size, y: pos.y * size};
  blockCount++;
  if (blockCount % 2 == 0) {
    createSpecialBlock();
  }
}

function createSpecialBlock() {
  var pos = getRandomFreeSpot();
  SpecialBlock = {x: pos.x * size, y: pos.y * size, lifespan: 100};
}

var update = setInterval(function() {
  // Check if head is on body
  if (Snake.isOnMe(Snake.x, Snake.y, false)) {
    gameOver();
    return;
  }

  Snake.x += size * Snake.movingX;
  Snake.y += size * Snake.movingY;

  if (Snake.x == canvas.width) {
    Snake.x = 0;
  }
  if (Snake.x < 0) {
    Snake.x = canvas.width - size;
  }
  if (Snake.y < 0) {
    Snake.y = canvas.height - size;
  }
  if (Snake.y == canvas.height) {
    Snake.y = 0;
  }

  if (Snake.x == Block.x && Snake.y == Block.y) {
    createBlock();
    score++;
  }
  else if (SpecialBlock.lifespan > 0 && Snake.x == SpecialBlock.x && Snake.y == SpecialBlock.y) {
    score += SpecialBlock.lifespan;
    SpecialBlock.lifespan = 0;
  }
  else {
    Snake.body.pop();
  }

  if (SpecialBlock.lifespan > 0) {
    SpecialBlock.lifespan--;
  }

  Snake.body.unshift({x: Snake.x, y: Snake.y});
  Snake.canChange = true;
}, 100);

// DRAW
var Draw = setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Score
  document.getElementById("scorediv").innerHTML = score;

  // Special block lifespan
  document.getElementById("lifespan").innerHTML = (SpecialBlock.lifespan > 0) ? SpecialBlock.lifespan : "";

  // Snake
  for (elem of Snake.body) {
    ctx.fillStyle = 'grey';
    ctx.fillRect(elem.x + 1, elem.y + 1, size - 2, size - 2);
  }

  // Block
  ctx.fillStyle = 'red';
  ctx.fillRect(Block.x + 1, Block.y + 1, size - 2, size - 2);

  // Special block
  if (SpecialBlock.lifespan > 0) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(SpecialBlock.x + 1, SpecialBlock.y + 1, size - 2, size - 2);
  }
}, 30);
