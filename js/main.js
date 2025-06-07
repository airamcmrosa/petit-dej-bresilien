import {Footer} from "./footer.js";
import {Game} from "./game.js";
import {GamePanel} from "./gamePanel.js";

window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');


    // let gameState = 'menu';

    const colors = {
        backgroundColor: '#e4fde1',
        borderColor: '#6ba292',
        highlight1: '#ffdc7c',
        accentColor: '#ff9b71',
        alertColor: '#dd614a',
        darkTextForCanvas: '#4A3F35'
    };

    const footer = new Footer(colors);
    const gamePanel = new  GamePanel(canvas.width, canvas.height, ctx);

    const game = new Game(canvas.width, canvas.height, ctx);

    this.backgroundImage = new Image();
    this.backgroundImage.src = './media/mesa-removebg-preview.png';
    this.backgroundImage.addEventListener("load", (e) => {
        ctx.drawImage(this.backgroundImage, 10, 10)
    });


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        // background.resize(canvas.width, canvas.height);
        footer.resize(canvas.width, canvas.height);
        if(footer.footerArea) {
            console.log("resizing game panel");
            gamePanel.resize(canvas.width, canvas.height, footer);
        }



        // if(gameState === 'menu') {
            // console.log("resize ok em", gameState)
            // menu.resize(canvas.width, canvas.height);
        // } else if (gameState === 'playing' && game) {
        //     // console.log("resize ok do", gameState)
        //     quizPanel.resize(canvas.width, canvas.height);
        //     game.resize(quizPanel);
        //     if (quizPanel.heartsArea && quizPanel.heartsArea.width > 0) {
        //         heartsDisplay.resize(quizPanel.heartsArea);
        //     } else {
        //         console.warn("main.js resize: quizPanel.heartsArea NÃO está pronto ou tem largura zero. Não chamando heartsDisplay.resize.");
        //     }
        //     if (quizPanel.questionCounterArea && quizPanel.questionCounterArea.width > 0) {
        //         progressDisplay.resize(quizPanel.questionCounterArea);
        //     }
        // } else if (gameState === 'gameOver') {
        //     // console.log("resize ok do", gameState)
        //     quizPanel.resize(canvas.width, canvas.height);
        //     if (game) {
        //         game.resize(quizPanel);
        //     }
        //     endScreen.resize(canvas.width, canvas.height);
        // } else {
        //     console.warn("rezise not working");
        // }
    }

    window.addEventListener('resize', resize);
    resize();

    function isClickInside(button, x, y) {
        if (!button || !button.width) return false;
        return x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height;
    }

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

        // if (gameState === 'menu') {
        // if (menu.playButton && menu.playButton.width && isClickInside(menu.playButton, mouseX, mouseY)) {
        //     if (soundManager) soundManager.playEffect('click');
        //     startGame();
        // }
        // } else if (gameState === 'playing' && game) {
        //     game.handleInput(mouseX, mouseY);
        //
        // } else if (gameState === 'gameOver') {
        //
        //     endScreen.handleInput(mouseX, mouseY);
        // }
        if (footer.footerArea && footer.footerArea.width && isClickInside(footer.footerArea, mouseX, mouseY)) {
            footer.handleInput(mouseX, mouseY);
        }
    }


    canvas.addEventListener('click', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);

    function animate() {


        ctx.fillStyle = colors.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);



        // background.update();
        // background.draw(ctx);
        footer.draw(ctx);
        ctx.drawImage(backgroundImage, 0, 10);
        if(game) game.draw(ctx);
        //
        // if (gameState === 'menu') {
        //     menu.draw(ctx);
        // } else if (gameState === 'playing' && game) {
        //     quizPanel.draw(ctx);
        //     heartsDisplay.draw(ctx);
        //     if(progressDisplay) progressDisplay.draw(ctx);
        //     game.draw(ctx, quizPanel);
        //
        // } else if (gameState === 'gameOver') {
        //
        //     if (game) game.draw(ctx, quizPanel);
        //     if (endScreen) {
        //         console.log("[Main.animate] Desenhando EndScreen. Reason:", endScreen.reasonForGameOver);
        //         endScreen.draw(ctx, canvas.width, canvas.height);
        //     } else {
        //         console.error("[Main.animate] Instância de EndScreen não encontrada para desenhar!");
        //     }


        // }
        requestAnimationFrame(animate);

    }
    animate();
}