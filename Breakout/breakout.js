//NEW CODE: Added Speed Increment Constants
const SPEED_SCORE = 500;
const SPEED_INCREMENT_AMOUNT = 1.09;
const PLATFORM_SPEED_INCREMENT = 1.12;
let currentSpeedThreshold = SPEED_SCORE;


//NEW CODE: Added lives to the game
let lives = 3;
let boardWidth = 500;
let boardHeight = 500;
let context;

//players
let playerWidth = 80; //500 for testing, 80 normal
let playerHeight = 10;
//NEW CODE: Sped Up the Player from 10 pixels to 16!
let playerVelocityX = 16;

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
//NEW CODE: slowed Down the Ball! from 3 to 1.8
let ballVelocityX = 1.8; //15 for testing, 3 normal
let ballVelocityY = 1; //10 for testing, 2 normal
//NEW CODE
let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

//starting block corners top left
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

// Impact audio setup
let impactAudio = new Audio('impact.mp3');
let gameOverAudio = new Audio('gameover.mp3');

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial player
    context.fillStyle="skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    //NEW CODE: added this so that the game doesnt auto start when you load it.
    gameOver = true;
    context.font = "30px 'Press Start 2P', monospace";
    
    context.fillText("Breakout", 185, 150);
    context.font = "20px sans-serif";
   
    context.fillText("Press 'Space' to Start", 150, 250);
    document.addEventListener("keydown", function startGame(e) {
        if (e.code === "Space") {
            gameOver = false;
            document.removeEventListener("keydown", startGame);
        }
    });
        

    //create blocks
    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    //stop drawing
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    
    context.fillStyle = "teal";
    //NEW CODE: Added shadow to the ball
    context.shadowBlur = 10;
    context.shadowColor = "teal";

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   // flip y direction up or down
        playImpactSound();  // Play impact sound on player collision
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   // flip x direction left or right
        playImpactSound();  // Play impact sound on player collision
    }

    if (ball.y <= 0) {
        // if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        // if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    //NEW CODE: Handle lives and game over logic
    else if (ball.y + ball.height >= boardHeight) {
        lives -= 1; // Decrease lives
        if (lives > 0) {
            //NEW CODE
            ball.x = player.x + player.width / 2 - ballWidth / 2;
            ball.y = player.y - ballHeight;
            ball.velocityY = -ballVelocityY;
        } else {
            // Game over
            lives = 3; // Reset lives
            context.font = "20px sans-serif";
            context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
            gameOverAudio.play();
            gameOver = true;
        }
    }

    //blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     // block is broken
                ball.velocityY *= -1;   // flip y direction up or down
                score += 100;
                blockCount -= 1;
                playImpactSound();  // Play impact sound on block collision
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;     // block is broken
                ball.velocityX *= -1;   // flip x direction left or right
                score += 100;
                blockCount -= 1;
                playImpactSound();  // Play impact sound on block collision
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

        //NEW CODE: Speeds up the ball and platform after reaching a certain score
        if (score >= currentSpeedThreshold) {
            ball.velocityX += SPEED_INCREMENT_AMOUNT;
            ball.velocityY += SPEED_INCREMENT_AMOUNT;
            player.velocityX += PLATFORM_SPEED_INCREMENT;

            //NEW CODE: Update the threshold for next speed increase
            currentSpeedThreshold += SPEED_SCORE;
        }




    //next level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; //bonus points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //score
    context.font = "20px sans-serif";
    //NEW CODE: Display the score divided by 100
    context.fillText("Blocks Destroyed: " + (score / 100), 10, 25);
    //NEW CODE: Display remaining lives
    context.fillText("Lives: " + lives, 400, 25);
}

//NEW CODE: Function to play the impact sound
function playImpactSound() {
    //NEW CODE: Reset the audio to play again
    impactAudio.currentTime = 0;
    impactAudio.play();
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) { //a is above b (ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) { //a is above b (ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) { //a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //clear blockArray
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //r*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };

    ball = {
        //NEW CODE
        x: player.x + player.width / 2 - ballWidth / 2,  // Centered on paddle
        y: player.y - ballHeight,  // Right above the paddle
        velocityY: -ballVelocityY, // Ensures it moves upwards
        //NEW CODE
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX
    };

    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}
