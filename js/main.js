import { AssetLoader } from "./assetLoader.js";
import { alimentsList } from './alimentsList.js';
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
    let mousePos = {x: 0, y: 0};
    let gameState = 'loading';

    const interfaceAssets = [
        {id: 'flag', src: 'media/brazil-flag-round-circle-icon.svg'},
        {id: 'panelBg', src: 'media/piso.svg'},
        {id: 'table', src: 'media/mesa.svg'},
        {id: 'paper', src: 'media/papel.svg'}
    ];

    const alimentAssets = alimentsList.map(aliment => {
        return {
            id: aliment.imageFile,
            src: `media/${aliment.imageFile}.png`
        };
    });
    const ASSET_MANIFEST = [
        ...interfaceAssets,
        ...alimentAssets
    ];

    const assetLoader = new AssetLoader(ASSET_MANIFEST);


    const colors = {
        backgroundColor: '#e4fde1',
        overlay: 'rgba(8,31,21,0.85)',
        borderColor: '#6ba292',
        highlight1: '#ffdc7c',
        accentColor: '#ff9b71',
        alertColor: '#dd614a',
        darkText: '#4A3F35'
    };

    const soundManager = new SoundManager(
        {
            click: 'card-flip',
            match: 'match-sound',
            error: 'error-sound'
        },
        'background-music',
        'music-toggle-btn'
    );

    let menu, gamePanel, game, endScreen;

    const timer = new Timer(60, (reason) => {
        console.log("Time's up! Game Over. Reason:", reason);

        gameState = 'gameOver';
        endScreen.setGameOverInfo(reason);
        resize();
    });

    assetLoader.loadAll(() => {
        // --- ESTA FUNÇÃO SÓ SERÁ CHAMADA QUANDO TUDO ESTIVER PRONTO ---
        console.log("Todos os assets foram carregados. Iniciando o menu.");

        const panelAssets = {
            panelBg: assetLoader.getAsset('panelBg'),
            tableImg: assetLoader.getAsset('table'),
            paper: assetLoader.getAsset('paper')
        };


        gamePanel = new GamePanel(colors, timer, panelAssets);
        menu = new Menu(colors, soundManager);
        endScreen = new EndScreen(colors, startGame, soundManager);


        gameState = 'menu';
        menu.startAnimation();
        resize();
    });

    const footer = new Footer(colors);

    let lastTime = 0;


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;



        if(gameState === 'loading') {
            footer.resize(canvas.width, canvas.height);
        } else if (gameState === 'menu') {
            console.log("resize ok em", gameState)
            menu.resize(canvas.width, canvas.height);
        } else if (gameState === 'playing' && game) {
            if (footer.footerArea) {
                gamePanel.resize(canvas.width, canvas.height, footer);
                game.resize();
            }

        } else if (gameState === 'gameOver') {
            gamePanel.resize(canvas.width, canvas.height);
            endScreen.resize(canvas.width, canvas.height);
        } else {
            console.warn("resize is not working");
        }
    }

    window.addEventListener('resize', resize);
    resize();

    function startGame() {
        console.log("start game running!");
        const assetsForGame = {
            flag: assetLoader.getAsset('flag')
        };
        alimentsList.forEach(aliment => {
            assetsForGame[aliment.imageFile] = assetLoader.getAsset(aliment.imageFile);
        });

        timer.start();
        game = new Game((reason) => {
            console.log("Callback de fim de jogo chamado!");
            gameState = 'gameOver';
            timer.stop()
            if (endScreen) {
                endScreen.setGameOverInfo(reason || 'noMoreTime');
            }
            resize();
        }, canvas.width, canvas.height, colors, soundManager, assetsForGame);

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
            if (menu.buttonPlay && menu.buttonPlay.width && isClickInside(menu.buttonPlay, mouseX, mouseY)) {
                if (soundManager) soundManager.playEffect('click');
                const assetsForGame = {
                    flag: assetLoader.getAsset('flag')
                };
                alimentsList.forEach(aliment => {
                    assetsForGame[aliment.imageFile] = assetLoader.getAsset(aliment.imageFile);
                });
                startGame(assetsForGame);
            }
        } else if (gameState === 'playing' && game) {
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

            footer.draw(ctx);

            if (gameState === 'loading') {
                ctx.fillStyle = colors.darkText;
                ctx.font = "30px 'Quicksand'";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const progress = (assetLoader.assetsLoaded / assetLoader.assetsToLoad) * 100;
                ctx.fillText(`Carregando... ${Math.round(progress)}%`, canvas.width / 2, canvas.height / 2);
            } else if (gameState === 'menu') {

                menu.update(deltaTime);
                menu.draw(ctx);
            } else if (gameState === 'playing' && game) {

                game.update(mousePos);
                timer.update();
                gamePanel.draw(ctx, timer);
                game.draw(ctx, gamePanel);

            } else if (gameState === 'gameOver') {

                if (game) game.draw(ctx, gamePanel);
                if (endScreen) {
                    endScreen.draw(ctx, canvas.width, canvas.height);
                } else {
                    console.error("[Main.animate] Instância de EndScreen não encontrada para desenhar!");
                }


            }

            lastTime = performance.now();
            requestAnimationFrame(animate);

        }

        animate(0);

}