import { alimentsList } from "./alimentsList.js"
export class Game {
    constructor(canvasWidth, canvasHeight, colors) {
        this.colors = colors;
        this.allAliments = [...alimentsList];
        this.gameAliments = [];
        this.deckCorrectOptions = [];
        this.positionsCalculated = false;

        this.initializeGameAliments();
        this.loadImages();
    }

    createDecks() {

        const shuffled = this.allAliments.sort(() => 0.5 - Math.random());
        this.gameAliments = shuffled.slice(0, 12);
        const cardAliments = [];
        this.gameAliments.forEach((gameAliment, index) => {
            cardAliments.push({
                ...gameAliment, isFound: false, isCorrect: false
            });
        });
        this.deckCorrectOptions = cardAliments.slice(5, 10);

        const correctIds = new Set(this.deckCorrectOptions.map(card => card.id));

        // --- Step 4: Loop through the main gameAliments deck and update the flag ---
        cardAliments.forEach(card => {
            if (correctIds.has(card.id)) {
                card.isCorrect = true;
            }
        });

        cardAliments.sort(() => 0.5 - Math.random());
        this.gameAliments = cardAliments;
        this.deckCorrectOptions.sort(() => 0.5 - Math.random());

    }


    initializeGameAliments() {
        // this.userSelectedOption = null;
        // this.correctOption = null;
        // this.feedbackActive = false;

        this.createDecks();


        this.clickedCards = [];
        this.cardImages = {};
        this.imagesLoaded = 0;
        this.totalImages = this.gameAliments.length;

        // Calcula o layout inicial
        // this.resize(this.canvasWidth, this.canvasHeight);
    }

    imageLoaded() {
        this.imagesLoaded++;
    }

    loadImages() {
        this.gameAliments.forEach(card => {
            const image = new Image();
            this.cardImages[card.imageFile] = image;

            image.onload = () => {
                // console.log(`✅ Image loaded successfully: ${card.imageFile}.png`);
                this.imageLoaded();
            };

            image.onerror = () => {
                console.error(`❌ Image not found: media/${card.imageFile}.png`);
                image.failed = true;
                this.imageLoaded();
            };

            image.src = `media/${card.imageFile}.png`;
            // console.log(`Attempting to load: ${image.src}`);
        });
    }


    handleInput(x, y) {
        console.log("handling input");

            if (this.clickedCards.length === 1) {
                return;
            }

            for (const card of this.gameAliments) {
                if (!card.isClicked &&
                    x >= card.x && x <= card.x + card.width &&
                    y >= card.y && y <= card.y + card.height) {

                    // this.soundManager.play('click');

                    card.isClicked = true;
                    this.clickedCards.push(card);
                    console.log(JSON.parse(JSON.stringify(card)));
                    this.checkAnswer();
                    break;
                }
            }

            // If two cards are now flipped, check for a match
            if (this.clickedCards.length === 2) {
                setTimeout(() => this.checkAnswer(), 1000);
            }
    }


    checkAnswer() {
        const [card1] = this.clickedCards;
        console.log("checking array clicked cards", JSON.parse(JSON.stringify(this.clickedCards)));

        if (card1.isCorrect) {

            // this.soundManager.play('match');
            card1.isFound = true;
            console.log("card was found", JSON.parse(JSON.stringify(card1)));


            const allMatched = this.deckCorrectOptions.every(card => card.isFound);
            if (allMatched) {
                // Notifica o main.js que o jogo acabou
                // setTimeout(() => this.onGameOver(), 500);
            }

        } else {

            card1.isClicked = false;
            console.log(JSON.parse(JSON.stringify(card1)));
        }

        this.clickedCards = [];
    }

    calculateImagePositions(gamePanel) {
        if (!gamePanel || !gamePanel.tableRect || !gamePanel.tableRect.width) return;

        const table = gamePanel.tableRect;
        const imageWidth = (table.width*0.2)/2;
        const imageHeight = imageWidth;
        const padding = table.width*0.025; // The space between each image.

        // --- 1. Determine the grid configuration (rows and columns) ---
        // Check if the table area is wider than it is tall.
        const isWider = table.width > table.height;
        const numCols = isWider ? 4 : 3;
        const numRows = isWider ? 3 : 4;

        // --- 2. Calculate the total size of the grid ---
        const gridWidth = (numCols * imageWidth) + ((numCols - 1) * padding);
        const gridHeight = (numRows * imageHeight) + ((numRows - 1) * padding);

        // --- 3. Calculate the starting position to center the grid ---
        const startX = table.x + (table.width - gridWidth) / 2;
        const startY = table.y + (table.height - gridHeight) / 2;

        // Check for edge cases where the grid might be larger than the table.
        if (gridWidth > table.width || gridHeight > table.height) {
            console.warn("Grid size is larger than the table area. Images may overflow.");
            // In a real-world scenario, you might want to scale down image sizes here.
        }

        this.gameAliments = this.gameAliments.sort(() => 0.5 - Math.random());
        this.gameAliments.forEach((card, index) => {
            const row = Math.floor(index / numCols);
            const col = index % numCols;

            const cardX = startX + col * (imageWidth + padding);
            const cardY = startY + row * (imageHeight + padding);

            card.x = cardX;
            card.y = cardY;
            card.width = imageWidth;
            card.height = imageHeight;
        });
    }


    draw(ctx, gamePanel) {

        if (this.imagesLoaded < this.totalImages) {
            return;
        }

        if (!this.positionsCalculated && gamePanel.tableRect.width > 0) {
            this.calculateImagePositions(gamePanel);
            this.positionsCalculated = true;
        }


        this.gameAliments.forEach(card => {
            const image = this.cardImages[card.imageFile];

            // Check if the image and its position are valid
            if (!image || image.failed || card.x === undefined) {
                return;
            }

            ctx.save();
            if (card.isClicked && card.isCorrect) {
                ctx.globalAlpha = 0.5;
            }

            // Use the stored x, y, width, and height from the card object
            ctx.drawImage(image, card.x, card.y, card.width, card.height);
            ctx.restore();
        });

        if (!gamePanel || !gamePanel.gameTextRect) {
            return;
        }
        const textRect = gamePanel.gameTextRect;


        const textRectPadding = textRect.width * 0.1;
        this.gameTextInstructions = {
            x:textRect.x + textRectPadding,
            y: textRect.y+ (textRect.height*0.1),
            width: textRect.width - (textRectPadding * 2),
            height: textRect.height- - (textRectPadding * 2),
            text: "On a faim! Trouve les aliments de la liste dessous: "

        };


        const fontSizeGameText = textRect.height * 0.5;
        ctx.font = `500 ${fontSizeGameText}px 'Lilita One', cursive`;
        ctx.fillStyle = this.colors.alertColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(this.gameTextInstructions.text, this.gameTextInstructions.x, this.gameTextInstructions.y)


        if (!gamePanel || !gamePanel.alimentsListTextRect) {
            return;
        }

        const listRect = gamePanel.alimentsListTextRect;
        const fontSize = listRect.height * 0.035;
        ctx.font = `400 ${fontSize}px 'Lilita One', cursive`;
        ctx.fillStyle = this.colors.alertColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const textPadding = {
            top: listRect.height * 0.25,
            left: listRect.width * 0.15
        };
        const lineHeight = fontSize * 1.5;

        this.deckCorrectOptions.forEach((option, index) => {
            const text = option.fr;
            const textX = listRect.x + textPadding.left;
            const textY = listRect.y + textPadding.top + (index * lineHeight);
            ctx.fillText(text, textX, textY);

            if(option.isFound){
                const metrics = ctx.measureText(text);
                const textWidth = metrics.width;
                const lineY = textY + (fontSize / 2);
                ctx.strokeStyle = '#dd614a';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(textX, lineY);
                ctx.lineTo(textX + textWidth, lineY );
                ctx.stroke();
            }
        });
    }
}