import { alimentsList } from "./alimentsList.js";
import { HelpGame } from "./helpGame.js";

export class Game {
    constructor(onGameOverCallback, canvasWidth, canvasHeight, colors, soundManager, assets) {
        this.onGameOver = onGameOverCallback;
        this.colors = colors;
        this.soundManager = soundManager;
        this.allAliments = [...alimentsList];
        this.cardImages = {};

        this.allAliments.forEach(aliment => {
            this.cardImages[aliment.imageFile] = assets[aliment.imageFile];
        });
        this.gameAliments = [];
        this.deckCorrectOptions = [];
        this.positionsCalculated = false;

        this.gameShouldEndAllFound = false;
        this.gameTextInstructions = null;
        this.listLayout = null;

        this.initializeGameAliments();

        this.helpGame = new HelpGame(this.deckCorrectOptions, this.soundManager, assets.flag);
        console.log("check card images", this.cardImages);

    }

    createDecks() {

        const shuffled = this.allAliments.sort(() => 0.5 - Math.random());
        this.gameAliments = shuffled.slice(0, 12).map(aliment => ({
            ...aliment,
            isFound: false,
            isCorrect: false,
            isHovering: false,
            isTranslated: false
        }));

        this.deckCorrectOptions = this.gameAliments.slice(5, 10);

        const correctIds = new Set(this.deckCorrectOptions.map(card => card.id));


        this.gameAliments.forEach(card => {
            if (correctIds.has(card.id)) {
                card.isCorrect = true;
            }
        });

        this.gameAliments.sort(() => 0.5 - Math.random());
        this.deckCorrectOptions.sort(() => 0.5 - Math.random());

    }


    initializeGameAliments() {
        this.createDecks();
        this.clickedCards = [];
        // this.resize(this.canvasWidth, this.canvasHeight);
    }

    update(mousePos) {
        this.gameAliments.forEach(card => {

            card.isHovering = mousePos.x >= card.x && mousePos.x <= card.x + card.width &&
                mousePos.y >= card.y && mousePos.y <= card.y + card.height;
        });
    }


    handleInput(x, y) {
        console.log("handling input");

        if (this.helpGame.handleInput(x, y)) {
            return;
        }

        if (this.clickedCards.length === 1) {
            return;
        }

        for (const card of this.gameAliments) {
            console.log("entered in loop");
            if (!card.isClicked &&
                x >= card.x && x <= card.x + card.width &&
                y >= card.y && y <= card.y + card.height) {
                console.log("check x y");


                card.isClicked = true;
                this.soundManager.playEffect('click');
                this.clickedCards.push(card);
                setTimeout(() => this.checkAnswer(), 500);
                console.log(JSON.parse(JSON.stringify(card)));
                break;
            }
        }

    }


    checkAnswer() {
        const [card1] = this.clickedCards;
        console.log("checking array clicked cards", JSON.parse(JSON.stringify(this.clickedCards)));

        if (card1.isCorrect) {

            card1.isFound = true;
            this.soundManager.playEffect('match');

            const allMatched = this.deckCorrectOptions.every(card => card.isFound);
            if (allMatched) {
                this.gameShouldEndAllFound = true;
                this.onGameOver('all_found');

            }

        } else {

            card1.isClicked = false;
            this.soundManager.playEffect('error');
        }

        this.clickedCards = [];
    }

    calculateLayout(ctx, gamePanel) {
        if (!gamePanel || !gamePanel.tableRect || !gamePanel.tableRect.width) return;

        // --- 1. Calculate Image Positions (existing logic) ---
        const table = gamePanel.tableRect;

        const isWider = table.width > table.height;
        const imageWidth =isWider?( (table.width * 0.2) / 2) : ( (table.width * 0.3) / 2);
        const imageHeight = imageWidth;
        const padding = table.width * (isWider? 0.025 : 0.015);
        const numCols = isWider ? 4 : 3;
        const numRows = isWider ? 3 : 4;
        const gridWidth = (numCols * imageWidth) + ((numCols - 1) * padding);
        const gridHeight = (numRows * imageHeight) + ((numRows - 1) * padding);
        const startX = table.x + (table.width - gridWidth) / 2;
        const startY = table.y + (table.height - gridHeight) / 2;
        this.gameAliments.sort(() => 0.5 - Math.random());
        this.gameAliments.forEach((card, index) => {
            const row = Math.floor(index / numCols);
            const col = index % numCols;
            card.x = startX + col * (imageWidth + padding);
            card.y = startY + row * (imageHeight + padding);
            card.width = imageWidth;
            card.height = imageHeight;
        });

        // --- 2. Calculate Instructions Text Layout  ---
        const textRect = gamePanel.gameTextRect;
        const textToDraw = "On a faim! Trouve les aliments de la liste dessous: ";
        const availableWidth = textRect.width * 0.9;
        let fontSizeGameText = textRect.height * 0.5;
        console.log("text height is", textRect.height);

        while (fontSizeGameText > 10) {
            ctx.font = `500 ${fontSizeGameText}px 'Lilita One', cursive`;
            const metrics = ctx.measureText(textToDraw);

            if (metrics.width < availableWidth) {
                break;
            }
            fontSizeGameText -= 1;
        }


        this.gameTextInstructions = {
            x: textRect.x + (textRect.width - ctx.measureText(textToDraw).width) / 2,
            y: textRect.y + (textRect.height*0.3),
            font: `500 ${fontSizeGameText}px 'Lilita One', cursive`,
            text: textToDraw
        };

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';


        // --- 3. Calculate Vocabulary List Layout  ---
        const listRect = gamePanel.alimentsListTextRect;
        let longestWord = '';
        this.deckCorrectOptions.forEach(option => {
            if (option.fr.length > longestWord.length) {
                longestWord = option.fr;
            }
            if (option.pt && option.pt.length > longestWord.length) {
                longestWord = option.pt;
            }
        });
        const availableListWidth = listRect.width * 0.8;
        let fontSizeListText = listRect.height * (isWider? 0.05 : 0.1);

        while (fontSizeListText > 10) {
            ctx.font = `500 ${fontSizeListText}px 'Lilita One', cursive`;
            const metrics = ctx.measureText(longestWord);

            if (metrics.width < availableListWidth) {
                break;
            }
            fontSizeListText -= 1;
        }

        this.listLayout = {
            rect: listRect,
            x: listRect.x,
            y: listRect.y,
            width: availableListWidth,
            height: listRect.height,
            font: `400 ${fontSizeListText}px 'Lilita One', cursive`,
            fontSize: fontSizeListText,
            lineHeight: fontSizeListText * 1.5,
            textPadding: {top: listRect.height * 0.25, left: listRect.width * 0.15}
        };


        this.helpGame.calculateLayout(ctx, this.listLayout);
    }

    resize() {
        this.positionsCalculated = false;
    }


    draw(ctx, gamePanel) {

        if (!this.positionsCalculated && gamePanel.tableRect.width > 0) {
            this.calculateLayout(ctx, gamePanel);
            this.positionsCalculated = true;
        }

            this.gameAliments.forEach((card) => {
                const image = this.cardImages[card.imageFile];


                if (!image || card.x === undefined) {
                    return;
                }

                ctx.save();
                const centerX = card.x + card.width / 2;
                const centerY = card.y + card.height / 2;
                ctx.translate(centerX, centerY);

                if (card.isClicked) {
                    ctx.scale(0.8, 0.8);
                } else if (card.isHovering) {
                    ctx.scale(1.1, 1.1);
                }

                ctx.translate(-centerX, -centerY);


                if (card.isFound && card.isCorrect) {
                    ctx.globalAlpha = 0.5;
                }

                ctx.drawImage(image, card.x, card.y, card.width, card.height);
                ctx.restore();
            });


        if (this.gameTextInstructions) {
            ctx.font = this.gameTextInstructions.font;
            ctx.fillStyle = this.colors.darkText;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(this.gameTextInstructions.text, this.gameTextInstructions.x, this.gameTextInstructions.y);
        }

        if (this.listLayout) {
            ctx.font = this.listLayout.font;
            ctx.fillStyle = this.colors.darkText;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            this.deckCorrectOptions.forEach((option, index) => {
                const text = option.isTranslated ? option.pt : option.fr;
                const textX = this.listLayout.rect.x + this.listLayout.textPadding.left;
                const textY = this.listLayout.rect.y + this.listLayout.textPadding.top + (index * this.listLayout.lineHeight);

                ctx.fillText(text, textX, textY);

                if (option.isFound) {
                    const metrics = ctx.measureText(text);
                    const textWidth = metrics.width;
                    const lineY = textY + (this.listLayout.fontSize / 2);
                    ctx.strokeStyle = '#dd614a';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(textX, lineY);
                    ctx.lineTo(textX + textWidth, lineY);
                    ctx.stroke();
                }

                this.helpGame.draw(ctx, option);

            });


        }

    }
}