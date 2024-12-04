class Pacman{
    constructor(x, y, width, height, speed){
        this.x = x; // x position
        this.y = y; // y position top left  corner
        this.width = width; 
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT; //current direction
        this.nextDirection = this.direction; //next requested direction
        this.currentFrame = 1;
        this.frameCount = 7; //7 pacman frames to look like he is biting

        setInterval(() => {
            this.changeAnimation(); //change between frames to look like he is biting
        }, 100);
    }


    moveProcess(){
        this.changeDirectionIfPossible();
        this.moveForwards();
        if(this.checkCollision() || this.checkGhostSpaceCollision()){
            this.moveBackwards();
            return;
        }

     }
     

    


    //moving backwards
    moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break;

        }
      }

      //moving forwards
    moveForwards(){ 
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed;
                break;

        }
     }

     //check wall collision so it doesn't move across the wall
    checkCollision(){ 
        let isCollided = false;
       
        if(map[this.getMapY()][this.getMapX()] == 1 ||
        map[this.getMapYRightSide()][this.getMapX()] == 1 ||
        map[this.getMapY()][this.getMapXRightSide()] == 1 ||
        map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
    ){
        isCollided = true;
    }
    return isCollided;
    }

    //Check ghosts space so it doesn't enter inside it
    checkGhostSpaceCollision(){ 
        let isGhostSpace = false;
       
        if(map[this.getMapY()][this.getMapX()] == 5 ||
        map[this.getMapYRightSide()][this.getMapX()] == 5 ||
        map[this.getMapY()][this.getMapXRightSide()] == 5 ||
        map[this.getMapYRightSide()][this.getMapXRightSide()] == 5
    ){
        isGhostSpace = true;
    }
    return isGhostSpace;
    }

    //check ghosts collision with pacman to reset the game
    checkGhostCollision(ghosts){ 
        for(let i = 0; i < ghosts.length; i++){
            let ghost = ghosts[i];
            if(ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()){
                return true;
            }
        }
        return false;
     }

    changeDirectionIfPossible(){ 
        if(this.direction == this.nextDirection) return;

        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if(this.checkCollision() || this.checkGhostSpaceCollision()){
            this.moveBackwards();
            this.direction = tempDirection;
        }else{
            this.moveBackwards();
        }

     }

    //change between frames to look like he is biting
    changeAnimation(){
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
      }

    //draw pacman
    draw(){
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );

        canvasContext.rotate( (this.direction * 90 * Math.PI) / 180);

        canvasContext.translate(
            - this.x - oneBlockSize / 2,
            - this.y - oneBlockSize / 2
        );

        
    // Draw the current animation frame, scaling to oneBlockSize
    canvasContext.drawImage(
        pacmanFrames,
        (this.currentFrame - 1) * 20, // Source x (20px per frame)
        0,                           // Source y
        20,                          // Source width (frame width in the sprite sheet)
        20,                          // Source height (frame height in the sprite sheet)
        this.x,                      // Destination x
        this.y,                      // Destination y
        oneBlockSize,               // Scale to oneBlockSize (30px)
        oneBlockSize              // Scale to oneBlockSize (30px)
    );

        canvasContext.restore();
    }


    getMapX(){
        return parseInt(this.x / oneBlockSize);
    }

    getMapY(){
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide(){
        return parseInt((this.x + 0.9999 * oneBlockSize)/ oneBlockSize);
    }

    getMapYRightSide(){
        return parseInt((this.y + 0.9999 * oneBlockSize)/ oneBlockSize);
    }
} 
