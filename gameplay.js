// Uses the canvas as mentioned in the gameplay.html file.
const canvas = document.getElementById('board');
const canvasType = canvas.getContext('2d');

// Initializing variables.
let spaceshipImg = new Image();
spaceshipImg.src = './spaceship.png';

let asteroidImg = new Image();
asteroidImg.src = './asteroid.png';

let explodeImg = new Image();
explodeImg.src = './explosion1.png';

let bulletImage = new Image();
bulletImage.src = "./shoot.png";

let score = 0;
let timer = 0;
let playerName = '';
let gameOver = false;


let asteroids_array = [];
let shootArray = [];
let shootVelocity = -10;
let attempts = 3;
let spaceship_speedX = 10;
let spaceship_speedY = 10;


// Limit for the number of asteroids
const MAX_ASTEROIDS = 10;

// Spaceship class
class Spaceship {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        if (!gameOver) {
            canvasType.drawImage(spaceshipImg, this.x, this.y, this.width, this.height);
        } else {
            canvasType.drawImage(explodeImg, explode.x, explode.y, explode.height, explode.width);
        }
    }
}

// Asteroid class
class Asteroid {
    constructor() {
        this.x = Math.random() * (canvas.width - 40);
        this.y = 0;
        this.width = 20 + Math.random() * 40;
        this.height = 30 + Math.random() * 50;
        this.alive = true;
        this.speed = 0.5 + Math.random() * 0.7;
    }

    draw() {
        if (this.alive) {
            canvasType.drawImage(asteroidImg, this.x, this.y, this.width, this.height);
            this.y += this.speed;
        }
    }
}

// Explosion properties
let explode = { x: 0, y: 0, width: 100, height: 100 };
let showExplosion = false;
let explosionTimer = 0;


// Function to save scores 
function saveScore(playerName, score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ playerName, score });
    localStorage.setItem('scores', JSON.stringify(scores.slice(0, 10)));
}

// Function to generate asteroids
function asteroid_generation() {
    if (asteroids_array.length < MAX_ASTEROIDS) {
        asteroids_array.push(new Asteroid());
    }
}

// Function to move spaceship
function move_spaceship(e) {
    if (e.code === "ArrowLeft" && spaceship.x - spaceship_speedX >= 0) {
        spaceship.x -= spaceship_speedX;
    } else if (e.code === "ArrowRight" && spaceship.x + spaceship_speedX + spaceship.width <= canvas.width) {
        spaceship.x += spaceship_speedX;
    }
}

// Function to draw timer on canvas for keeping scores.
function draw_timer() {
    canvasType.fillStyle = "white";
    canvasType.font = "20px Arial";
    canvasType.fillText("Time: " + Math.floor(timer / 60), 10, 20);
}

// Function to display 'Game over' message along with user score.
function drawGameOver() {
    canvasType.fillStyle = "red";
    canvasType.font = "30px Arial";
    canvasType.fillText("Game Over. Score: " + Math.floor(timer / 60), canvas.width / 2 - 100, canvas.height / 2);
}

// Main game loop
function loop() {
    canvasType.clearRect(0, 0, canvas.width, canvas.height);

    spaceship.draw();
    draw_asteroids();
    draw_timer();
    draw_attempts();

    if (!gameOver) {
        timer++;

        // Move and draw bullets, then check for collisions with asteroids.
        for (let i = 0; i < shootArray.length; i++) {
            let bullet = shootArray[i];
            bullet.y += shootVelocity;
            canvasType.drawImage(bulletImage, bullet.x, bullet.y, 10, 20);

            // Remove bullets if they go out of canvas
            if (bullet.y < 0) {
                shootArray.splice(i, 1);
                i--;
                continue;
            }

            // Check for collision with each asteroid
            for (let j = 0; j < asteroids_array.length; j++) {
                let asteroid = asteroids_array[j];

                if (asteroid.alive && collision_detect(bullet, asteroid)) {
                    asteroid.alive = false; // Mark asteroid as hit
                    shootArray.splice(i, 1); 
                    i--; 
                    break; 
                }
            }
        }

        requestAnimationFrame(loop);
    } else {
        saveScore(playerName, Math.floor(timer / 60));
        drawGameOver();
    }
}

// Function to shoot bullets from the spaceship
function shoot(e) {
    if (e.code === "Space") {
        let bullet = {
            x: spaceship.x + spaceship.width / 2,
            y: spaceship.y,
            used: false
        };
        shootArray.push(bullet);
    }
}

// Start asteroid generation every second
function start_asteroids() {
    setInterval(asteroid_generation, 1000);
}

// Function to draw asteroids
function draw_asteroids() {
    for (let j = 0; j < asteroids_array.length; j++) {
        let asteroid = asteroids_array[j];

        if (asteroid.alive) {
            asteroid.draw();
            // Check for collision with spaceship
            if (collision_detect(spaceship, asteroid)) {
                gameOver = true;
                explode.x = spaceship.x;
                explode.y = spaceship.y;
            }
        }
    }
}

// Function to detect collision
function collision_detect(a, b) {
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {
        attempts--;
        showExplosion = true;
        explosionTimer = 30; // Display explosion for 30 frames
        explode.x = a.x;
        explode.y = a.y;

        if (attempts <= 0) {
            gameOver = true;
            saveScore(playerName, Math.floor(timer / 60));
        } else {
            a.x = canvas.width / 2;
            a.y = canvas.height - a.height - 10;
        }
        return true; // Collision detected
    }
    return false; // No collision
}

// Function to draw attempts as circles.
function draw_attempts() {
    canvasType.fillStyle = "yellow";
    for (let i = 0; i < attempts; i++) {
        canvasType.beginPath();
        canvasType.arc(30 + i * 30, 40, 10, 0, Math.PI * 2);
        canvasType.fill();
        canvasType.closePath();
    }
}

// Load images and start the game
spaceshipImg.onload = () => {
    asteroidImg.onload = () => {
        explodeImg.onload = () => {
            spaceship = new Spaceship(500, 250, 50, 150); // Create spaceship instance
            loop();
            start_asteroids();
        };
    };
};

// Event listeners for controls
window.addEventListener("keydown", move_spaceship);
window.addEventListener("keydown", shoot);
