const tiles = document.querySelectorAll(".tile");
const levelEl = document.getElementById("level");
const bestEl = document.getElementById("best");
const livesEl = document.getElementById("lives");
const forestEl = document.getElementById("forest");
const messageEl = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let sequence = [];
let playerSequence = [];
let level = 0;
let lives = 3;
let canClick = false;

let bestScore =
    Number(localStorage.getItem("memoryBest")) || 0;

bestEl.textContent = bestScore;

const audioCtx =
    new (window.AudioContext || window.webkitAudioContext)();

const frequencies = [220, 330, 440, 550];

function playSound(freq){

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.value = 0.15;

    osc.start();

    setTimeout(()=>{
        osc.stop();
    },150);
}

function updateForest(){

    if(level < 5){
        forestEl.textContent = "🌱";
    }
    else if(level < 10){
        forestEl.textContent = "🌿";
    }
    else if(level < 15){
        forestEl.textContent = "🌳";
    }
    else if(level < 25){
        forestEl.textContent = "🌲";
    }
    else{
        forestEl.textContent = "👑";
    }
}

function flashTile(index){

    const tile = tiles[index];

    tile.classList.add("active");

    playSound(frequencies[index]);

    setTimeout(()=>{
        tile.classList.remove("active");
    },350);
}

function playSequence(){

    canClick = false;

    let i = 0;

    const interval = setInterval(()=>{

        flashTile(sequence[i]);

        i++;

        if(i >= sequence.length){

            clearInterval(interval);

            setTimeout(()=>{
                canClick = true;
                messageEl.textContent = "Your Turn!";
            },500);
        }

    },700);
}

function nextLevel(){

    playerSequence = [];

    level++;

    levelEl.textContent = level;

    updateForest();

    sequence.push(
        Math.floor(Math.random() * 4)
    );

    messageEl.textContent =
        "Watch Carefully...";

    setTimeout(()=>{
        playSequence();
    },500);
}

function startGame(){

    sequence = [];
    playerSequence = [];
    level = 0;
    lives = 3;

    livesEl.textContent = "❤️❤️❤️";

    forestEl.classList.remove("gameover");

    nextLevel();
}

function gameOver(){

    canClick = false;

    if(level > bestScore){

        bestScore = level;

        localStorage.setItem(
            "memoryBest",
            bestScore
        );

        bestEl.textContent = bestScore;

        messageEl.textContent =
            "🏆 New High Score!";
    }
    else{

        messageEl.textContent =
            `Game Over! Reached Level ${level}`;
    }

    forestEl.classList.add("gameover");
}

tiles.forEach(tile=>{

    tile.addEventListener("click",()=>{

        if(!canClick) return;

        const id =
            Number(tile.dataset.id);

        flashTile(id);

        playerSequence.push(id);

        const current =
            playerSequence.length - 1;

        if(
            playerSequence[current] !==
            sequence[current]
        ){

            lives--;

            livesEl.textContent =
                "❤️".repeat(lives);

            if(lives <= 0){

                gameOver();
                return;
            }

            playerSequence = [];

            messageEl.textContent =
                `Wrong! ${lives} lives left`;

            setTimeout(()=>{
                playSequence();
            },1000);

            return;
        }

        if(
            playerSequence.length ===
            sequence.length
        ){

            canClick = false;

            messageEl.textContent =
                "Correct!";

            setTimeout(()=>{
                nextLevel();
            },1000);
        }

    });

});

startBtn.addEventListener(
    "click",
    startGame
);
