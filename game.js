const estrella = document.getElementById("estrella");
const scoreText = document.getElementById("score");

let score = 0;
let velocidad = 1200; // más bajo = más rápido

function moverEstrella() {
    const area = document.getElementById("game-area");

    const maxX = area.clientWidth - 70;
    const maxY = area.clientHeight - 70;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    estrella.style.left = x + "px";
    estrella.style.top = y + "px";
}

estrella.addEventListener("click", () => {
    score++;
    scoreText.textContent = score;

    // aumentar dificultad
    if (velocidad > 400) velocidad -= 50;

    moverEstrella();
});

// movimiento automático
setInterval(moverEstrella, velocidad);

moverEstrella();
