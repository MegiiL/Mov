const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations"); //7 pacman frames to look like he is biting


// Global variables to store canvas dimensions and block size
let canvasWidth, canvasHeight, oneBlockSize;
// Maximum canvas width constraint
const maxCanvasWidth = 600;
//Variables to mofidy the wall setting and create blocks
let wallSpaceWidth;
let wallOffset;

let wallColor = "#342DCA"; // blue wall
let fps = 30; //number of frames to draw per second
let wallInnerColor = "black"; //making blocks black in the middle

// wall, food 
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

//moving directions
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

// if 1- wall
// if 2- food 
// if 4- cherry power-up = 4 total
// when pacman eats food/power-up tile = 3, empty tile
// if 5 - ghost space
// Map definition (20 columns × 22 rows)
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 4, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 5, 5, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 5, 5, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



//gameloop to draw and update the elements
let gameLoop = () => {
    draw();
    update();
};


//game logic
let update = () => {
    pacman.moveProcess();

};



//draw the game elements: wall, food, power-up, pacman, ghosts, score, lives
let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black"); 
    drawWalls();

    pacman.draw();

};

let gameInterval = setInterval(gameLoop, 1000 / fps);

// draw wall with blue borders and black within
let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );

               if( j > 0 && map[i][j -1] == 1){
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor,
                    );
                }
                if(j < map[0].length - 1 && map[i][j+1] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor,
                    );
                }
                
                if( i > 0 && map[i - 1][j] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor,
                    );
                }
                if(i < map.length - 1 && map[i + 1][j] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset,
                        wallSpaceWidth ,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor,
                    );
                }
            }
        }
    }
};

// pacman properties
let createNewPacman = () => {
    pacman = new Pacman(
      oneBlockSize, // x position 
      oneBlockSize, // y position 
      oneBlockSize, // pacman width
      oneBlockSize, // pacman height
      oneBlockSize / 5 //pacman speed
  
     );
  };
  


// Function to calculate canvas size
let calculateCanvasSize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < maxCanvasWidth) {  //if screen is smaller than 600px, find the biggest number up to screenwidth which divided by 20 is 0 , set it as canvas width
        canvasWidth = Math.floor(screenWidth / 20) * 20;
    } else {
        canvasWidth = maxCanvasWidth; //else if screen is bigger than 600px or equal to it, set it as canvas width
    }

    oneBlockSize = canvasWidth / 20; //one block will be canvas width divided by 20 columns
    canvasHeight = oneBlockSize * 22; // canvas height will be one block time 22 rows

    // Calculate wall-related properties after oneBlockSize is determined
    wallSpaceWidth = oneBlockSize / 1.5;
    wallOffset = (oneBlockSize - wallSpaceWidth) / 2;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};

// Initialize the canvas size on load
calculateCanvasSize();



// Add an event listener to recalculate canvas size when the window is resized
window.addEventListener("resize", calculateCanvasSize);


  createNewPacman();
  gameLoop(); 

// pacman movement on desktop using A/D W/S or arrow keys
  window.addEventListener("keydown", (event) =>{
    let k = event.keyCode;

    setTimeout(() =>{
        if(k == 37 || k == 65){ //left
            pacman.nextDirection = DIRECTION_LEFT;

        }else if(k == 38 || k == 87) { //up
            pacman.nextDirection = DIRECTION_UP;

        }else if(k == 39 || k == 68){ //right
            pacman.nextDirection = DIRECTION_RIGHT;

        }else if(k == 40 || k == 83){ //bottom
            pacman.nextDirection = DIRECTION_BOTTOM;

        }
     
    }, 1)
  } )
