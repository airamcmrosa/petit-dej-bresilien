import { alimentsList } from "./alimentsList.js"
export class Game {
    constructor(canvasWidth, canvasHeight) {
        // this.onGameOver = onGameOver;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // this.soundManager = soundManager;
        this.allAliments = [...alimentsList];

        this.gameAliments = [];

        this.initializeGameAliments(alimentsList);
        this.loadImages();


    }

    selectGameAlimentsDecks() {

        const shuffled = this.allAliments.sort(() => 0.5 - Math.random());
        this.gameAliments = shuffled.slice(0, 10);
        const cardAliments = [];
        this.gameAliments.forEach((gameAliment, index) => {
            cardAliments.push({
                ...gameAliment
            });
            console.log(JSON.parse(JSON.stringify(gameAliment)));
        });
        this.gameAliments = cardAliments.sort(() => 0.5 - Math.random());
        const deckIncorrectOptions = this.gameAliments.slice(0,5);
        console.log(deckIncorrectOptions);
        const deckCorrectOptions = this.gameAliments.slice(5, 10);
        console.log("created correct Deck as ", JSON.parse(JSON.stringify(deckCorrectOptions)));

    }

    initializeGameAliments() {
        // this.userSelectedOption = null;
        // this.correctOption = null;
        // this.feedbackActive = false;

        this.selectGameAlimentsDecks();


        // this.checkedCards = [];
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
                console.log(`✅ Image loaded successfully: ${card.imageFile}.png`);
                this.imageLoaded();
            };

            image.onerror = () => {
                console.error(`❌ Image not found: media/${card.imageFile}.png`);
                image.failed = true;
                this.imageLoaded();
            };

            image.src = `media/${card.imageFile}.png`;
            console.log(`Attempting to load: ${image.src}`);
        });
    }




    // handleGameInput(x, y) {
    //
    //     if (this.flippedCards.length === 2) {
    //         return;
    //     }
    //
    //     for (const card of this.deck) {
    //         if (!card.isFlipped && !card.isMatched &&
    //             x >= card.x && x <= card.x + card.width &&
    //             y >= card.y && y <= card.y + card.height) {
    //
    //             this.soundManager.play('click');
    //
    //             card.isFlipped = true;
    //             this.flippedCards.push(card);
    //             break;
    //         }
    //     }
    //
    //     // If two cards are now flipped, check for a match
    //     if (this.flippedCards.length === 2) {
    //         setTimeout(() => this.checkMatch(), 1000);
    //     }
    // }


    // checkMatch() {
    //     const [card1, card2] = this.flippedCards;
    //
    //     if (card1.pairId === card2.pairId) {
    //
    //         card1.isMatched = true;
    //         card2.isMatched = true;
    //
    //         this.soundManager.play('match');
    //
    //         const allMatched = this.deck.every(card => card.isMatched);
    //         if (allMatched) {
    //             // Notifica o main.js que o jogo acabou
    //             setTimeout(() => this.onGameOver(), 500);
    //         }
    //
    //     } else {
    //
    //         card1.isFlipped = false;
    //         card2.isFlipped = false;
    //     }
    //
    //     this.flippedCards = [];
    // }

    draw(ctx) {

        if (this.imagesLoaded < this.totalImages) {
            return;
        }

        const imageWidth = 100; // Test width
        const imageHeight = 100; // Test height
        const padding = 20;      // Space between images
        let startX = 10;
        let startY = 10;

        this.gameAliments.forEach((card, index) => {
            const image = this.cardImages[card.imageFile];

            // NEW: Check if the image exists and didn't fail to load
            if (!image || image.failed) {
                return; // Skip drawing this image
            }

            // Calculate position for each image to lay them out in a row
            const x = startX + index * (imageWidth + padding);
            const y = startY;

            ctx.save();

            if (card.isClicked) {
                ctx.globalAlpha = 0.5;
            }

            // Use the calculated position and a non-zero size
            ctx.drawImage(image, x, y, imageWidth, imageHeight);

            ctx.restore();
        });
    }

}