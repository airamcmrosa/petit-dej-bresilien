import {Footer} from "./footer.js";
import { Menu } from './menu.js';
import {Game} from "./game.js";
import {GamePanel} from "./gamePanel.js";
import {SoundManager} from "./soundManager.js";
import {EndScreen} from "./endScreen.js";
import { Timer } from "./timer.js";

window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let mousePos = { x: 0, y: 0 };


    const timer = new Timer(60, (reason) => {
        console.log("Time's up! Game Over. Reason:", reason);

        gameState = 'gameOver';
        endScreen.setGameOverInfo(reason);
        resize();
    });

    const colors = {
        backgroundColor: '#e4fde1',
        overlay: 'rgba(8,31,21,0.85)',
        borderColor: '#6ba292',
        highlight1: '#ffdc7c',
        accentColor: '#ff9b71',
        alertColor: '#dd614a',
        darkTextForCanvas: '#4A3F35'
    };

    const footer = new Footer(colors);
    const gamePanel = new  GamePanel(colors);

    const soundManager = new SoundManager(
        {
            click: 'card-flip',
            match: 'match-sound',
            error: 'error-sound'
        },
        'background-music',
        'music-toggle-btn'
    );
    const menu = new Menu(colors, soundManager);

    const endScreen = new EndScreen(colors, startGame, soundManager);


    let gameState = 'menu';
    let game = null;
    let lastTime = 0;


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        footer.resize(canvas.width, canvas.height);

        if(gameState === 'menu') {
            console.log("resize ok em", gameState)
            menu.resize(canvas.width, canvas.height);
        } else if (gameState === 'playing' && game) {
            if(footer.footerArea) {
                gamePanel.resize(canvas.width, canvas.height, footer);
                game.resize();
            }

        } else if (gameState === 'gameOver') {
            // console.log("resize ok do", gameState)
            gamePanel.resize(canvas.width, canvas.height);
            endScreen.resize(canvas.width, canvas.height);
        } else {
            console.warn("rezise not working");
        }
    }

    window.addEventListener('resize', resize);
    resize();

    menu.startAnimation();


    function startGame() {
        console.log("start game running!");
        timer.start();
        game = new Game((reason) => {
            console.log("Callback de fim de jogo chamado!");
            gameState = 'gameOver';
            if (endScreen) {
                endScreen.setGameOverInfo(reason || 'noMoreTime');
            }
            resize();
        }, canvas.width, canvas.height, colors, soundManager, timer);

        gameState = 'playing';
        resize();
    }



    function isClickInside(button, x, y) {
        if (!button || !button.width) return false;
        return x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height;
    }
    function updateMousePosition(event) {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = event.clientX - rect.left;
        mousePos.y = event.clientY - rect.top;
    }
    canvas.addEventListener('mousemove', updateMousePosition);

    function handleInteraction(event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let mouseX, mouseY;

        if (event.touches && event.touches.length > 0) {
            mouseX = event.touches[0].clientX - rect.left;
            mouseY = event.touches[0].clientY - rect.top;
        } else {
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        }

        if (gameState === 'menu') {
        if (menu.playButton && menu.playButton.width && isClickInside(menu.playButton, mouseX, mouseY)) {
            if (soundManager) soundManager.playEffect('click');
            startGame();
        }
        } else
        if (gameState === 'playing' && game) {
            game.handleInput(mouseX, mouseY);
        } else if (gameState === 'gameOver') {

            endScreen.handleInput(mouseX, mouseY);
        }
        if (footer.footerArea && footer.footerArea.width && isClickInside(footer.footerArea, mouseX, mouseY)) {
            footer.handleInput(mouseX, mouseY);
        }
    }


    canvas.addEventListener('click', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);

    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;


        ctx.fillStyle = colors.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (gameState === 'menu') {
            menu.update(deltaTime);
            menu.draw(ctx);
        } else if (gameState === 'playing' && game) {
            game.update(mousePos);
            gamePanel.draw(ctx);
            timer.update();
            game.draw(ctx, gamePanel, timer);

        } else if (gameState === 'gameOver') {

            if (game) game.draw(ctx, gamePanel, timer);
            if (endScreen) {
                console.log("[Main.animate] Desenhando EndScreen. Reason:", endScreen.reasonForGameOver);
                endScreen.draw(ctx, canvas.width, canvas.height);
            } else {
                console.error("[Main.animate] Instância de EndScreen não encontrada para desenhar!");
            }


        }
        footer.draw(ctx);
        lastTime = performance.now();
        requestAnimationFrame(animate);

    }
    animate(lastTime);
}