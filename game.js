/* =========================================================
   ATRAPA LA ESTRELLA
   Sistema completo de partidas
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const gameArea = document.getElementById("game-area");

const estrella = document.getElementById("estrella");

const startScreen = document.getElementById("start-screen");

const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-button");

const restartButton = document.getElementById("restart-button");

const homeButton = document.getElementById("home-button");

const scoreText = document.getElementById("score");

const livesText = document.getElementById("lives");

const timeText = document.getElementById("time");

const bestScoreText = document.getElementById("best-score");

const progressBar = document.getElementById("progress-bar");

const finalScoreText = document.getElementById("final-score");

const rewardText = document.getElementById("reward");

const finalBestText = document.getElementById("final-best");

const resultTitle = document.getElementById("result-title");

const resultMessage = document.getElementById("result-message");

const resultIcon = document.getElementById("result-icon");

const resultLabel = document.getElementById("result-label");

const pointsEffect = document.getElementById("points-effect");


/* =========================================================
   CONFIGURACIÓN DE LA PARTIDA
========================================================= */

const GAME_TIME = 30;

const STARTING_LIVES = 3;

const STAR_SIZE = 70;

const MIN_SPEED = 350;

const START_SPEED = 1100;


/* =========================================================
   VARIABLES
========================================================= */

let score = 0;

let lives = STARTING_LIVES;

let timeLeft = GAME_TIME;

let speed = START_SPEED;

let gameRunning = false;

let timerInterval = null;

let moveInterval = null;

let bestScore = Number(
    localStorage.getItem("atrapaEstrellaBest") || 0
);


/* =========================================================
   MOSTRAR RÉCORD
========================================================= */

bestScoreText.textContent = bestScore;


/* =========================================================
   INICIAR PARTIDA
========================================================= */

function startGame() {

    clearGameTimers();

    score = 0;

    lives = STARTING_LIVES;

    timeLeft = GAME_TIME;

    speed = START_SPEED;

    gameRunning = true;


    /* ACTUALIZAR INTERFAZ */

    scoreText.textContent = score;

    livesText.textContent = lives;

    timeText.textContent = timeLeft;

    progressBar.style.width = "100%";


    /* MOSTRAR JUEGO */

    startScreen.classList.remove("active");

    resultScreen.classList.remove("active");

    gameArea.classList.add("playing");

    estrella.classList.remove("visible");

    estrella.style.display = "block";


    /* PRIMER MOVIMIENTO */

    moverEstrella();

    estrella.classList.add("visible");


    /* INICIAR RELOJ */

    timerInterval = setInterval(() => {

        if (!gameRunning) {
            return;
        }

        timeLeft--;

        timeText.textContent = timeLeft;


        const percentage =
            (timeLeft / GAME_TIME) * 100;

        progressBar.style.width =
            `${percentage}%`;


        /* TERMINAR POR TIEMPO */

        if (timeLeft <= 0) {

            endGame("time");

        }

    }, 1000);


    /* MOVIMIENTO AUTOMÁTICO */

    iniciarMovimiento();

}


/* =========================================================
   INICIAR MOVIMIENTO
========================================================= */

function iniciarMovimiento() {

    clearInterval(moveInterval);

    moveInterval = setInterval(() => {

        if (!gameRunning) {
            return;
        }

        moverEstrella();

    }, speed);

}


/* =========================================================
   MOVER ESTRELLA
========================================================= */

function moverEstrella() {

    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;


    const maxX =
        Math.max(0, areaWidth - STAR_SIZE);


    const maxY =
        Math.max(0, areaHeight - STAR_SIZE);


    const x =
        Math.random() * maxX;


    const y =
        Math.random() * maxY;


    estrella.style.left =
        `${x}px`;


    estrella.style.top =
        `${y}px`;


    estrella.classList.remove("move-animation");


    void estrella.offsetWidth;


    estrella.classList.add("move-animation");

}


/* =========================================================
   ATRAPAR ESTRELLA
========================================================= */

estrella.addEventListener("click", () => {

    if (!gameRunning) {
        return;
    }


    /* SUMAR PUNTO */

    score++;

    scoreText.textContent = score;


    /* EFECTO */

    mostrarPuntos();


    /* AUMENTAR DIFICULTAD */

    if (speed > MIN_SPEED) {

        speed -= 35;

        iniciarMovimiento();

    }


    /* MOVER ESTRELLA */

    moverEstrella();

});


/* =========================================================
   EFECTO +1
========================================================= */

function mostrarPuntos() {

    pointsEffect.classList.remove("show");

    void pointsEffect.offsetWidth;

    pointsEffect.classList.add("show");

}


/* =========================================================
   CONTROL DE VIDAS
========================================================= */

gameArea.addEventListener("click", (event) => {

    if (!gameRunning) {
        return;
    }


    /*
       Si el jugador hace clic dentro del área
       pero NO toca la estrella, pierde una vida.
    */

    if (
        event.target !== estrella &&
        !estrella.contains(event.target)
    ) {

        perderVida();

    }

});


/* =========================================================
   PERDER VIDA
========================================================= */

function perderVida() {

    if (!gameRunning) {
        return;
    }


    lives--;

    livesText.textContent = lives;


    gameArea.classList.add("miss");

    setTimeout(() => {

        gameArea.classList.remove("miss");

    }, 250);


    /* SIN VIDAS */

    if (lives <= 0) {

        endGame("lives");

    }

}


/* =========================================================
   FINALIZAR PARTIDA
========================================================= */

function endGame(reason) {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearGameTimers();


    estrella.classList.remove("visible");

    estrella.style.display = "none";


    gameArea.classList.remove("playing");


    /* ACTUALIZAR RÉCORD */

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "atrapaEstrellaBest",
            bestScore
        );

    }


    /* CALCULAR RECOMPENSA */

    const reward = calcularRecompensa(
        score,
        reason
    );


    /* RESULTADOS */

    finalScoreText.textContent = score;

    rewardText.textContent =
        `${reward} 🪙`;

    finalBestText.textContent =
        bestScore;


    /* CONFIGURAR MENSAJE */

    if (reason === "lives") {

        resultIcon.textContent = "💥";

        resultLabel.textContent =
            "PARTIDA TERMINADA";

        resultTitle.textContent =
            "¡Te quedaste sin vidas!";

        resultMessage.textContent =
            "No pasa nada. Recibiste una recompensa por tu partida.";

    }


    else if (reason === "time") {

        resultIcon.textContent = "⏰";

        resultLabel.textContent =
            "TIEMPO AGOTADO";

        resultTitle.textContent =
            "¡Se acabó el tiempo!";

        resultMessage.textContent =
            "Buen trabajo. La recompensa depende de tu puntaje.";

    }


    /* NUEVO RÉCORD */

    if (score === bestScore && score > 0) {

        resultIcon.textContent = "🏆";

        resultLabel.textContent =
            "NUEVO RÉCORD";

        resultTitle.textContent =
            "¡Nuevo récord!";

        resultMessage.textContent =
            "Has conseguido tu mejor puntuación.";

    }


    /* MOSTRAR RESULTADO */

    resultScreen.classList.add("active");

}


/* =========================================================
   RECOMPENSA
========================================================= */

function calcularRecompensa(score, reason) {

    /*
       Recompensa base:
       2 monedas por cada punto.
    */

    let reward = score * 2;


    /*
       Recompensa mínima por participar.
    */

    if (reward < 5) {

        reward = 5;

    }


    /*
       Bonus si terminó por tiempo.
    */

    if (reason === "time") {

        reward += 5;

    }


    return reward;

}


/* =========================================================
   LIMPIAR TEMPORIZADORES
========================================================= */

function clearGameTimers() {

    clearInterval(timerInterval);

    clearInterval(moveInterval);

    timerInterval = null;

    moveInterval = null;

}


/* =========================================================
   JUGAR NUEVAMENTE
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        resultScreen.classList.remove("active");

        startGame();

    }
);


/* =========================================================
   VOLVER A INICIO
========================================================= */

homeButton.addEventListener(
    "click",
    () => {

        clearGameTimers();

        gameRunning = false;

        resultScreen.classList.remove("active");

        startScreen.classList.add("active");

        estrella.style.display = "none";

        scoreText.textContent = "0";

        livesText.textContent =
            STARTING_LIVES;

        timeText.textContent =
            GAME_TIME;

        progressBar.style.width =
            "100%";

    }
);


/* =========================================================
   BOTÓN COMENZAR
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   AJUSTAR ESTRELLA AL CAMBIAR TAMAÑO
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (gameRunning) {

            moverEstrella();

        }

    }
);
