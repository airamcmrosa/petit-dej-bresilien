export class HelpGame {

    constructor(deckToManage, soundManager) {
        this.deck = deckToManage;
        this.soundManager = soundManager;
        this.flagImage = null;
        this.ctx = null;
        this.listRect = null;
        this.flagsArea = null;
        this.fontSize = null;
    }


    loadAssets(onAssetLoaded) {
        this.flagImage = new Image();
        this.flagImage.onload = () => {
            // console.log("✅ Flag image loaded successfully.");
            onAssetLoaded();
        };
        this.flagImage.onerror = () => {
            console.error("Failed to load flag image.");
            onAssetLoaded();
        };
        this.flagImage.src = `media/brazil-flag-round-circle-icon.svg`;
    }

    calculateLayout(ctx, listRect, flagsArea, fontSize) {
        if (ctx) this.ctx = ctx;
        if (listRect) this.listRect = listRect;
        if (flagsArea) this.flagsArea = flagsArea;
        if (fontSize) this.fontSize = fontSize;

        if (!this.listRect || !flagsArea || !this.ctx || !this.deck || !this.fontSize) return;

        const lineHeight = fontSize * 1.5;
        const textPadding = { top: this.listRect.height * 0.25, left: this.listRect.width * 0.15 };

        this.ctx.font = fontSize;

        this.deck.forEach((option, index) => {
            const text = option.isTranslated ? option.pt : option.fr;
            const textX = this.listRect.x + textPadding.left;
            const textY = this.listRect.y + textPadding.top + (index * lineHeight);

            const metrics = this.ctx.measureText(text);
            const textWidth = metrics.width;

            const flagSize = fontSize;
            const flagX = textX + textWidth + (flagSize * 0.2);
            const flagY = textY + (fontSize / 2) - (flagSize / 2);


            option.flagX = flagX;
            option.flagY = flagY;
            option.flagSize = flagSize;
        });
    }


    handleInput(x, y) {
        console.log("called handle input draw");
        for (const option of this.deck) {

            if (option.flagX &&
                x >= option.flagX - (option.flagSize * 0.5) && x <= option.flagX - (option.flagSize * 0.5) + option.flagSize &&
                y >= option.flagY && y <= option.flagY + option.flagSize
            ) {
                this.soundManager.playEffect('click');
                this.traduction(option);
                return true;
            }
        }
        return false;
    }


    traduction(cardToTranslate) {
        cardToTranslate.isTranslated = !cardToTranslate.isTranslated;
        this.calculateLayout();
    }



    draw(ctx) {
        if (!this.flagImage || !this.flagImage.complete ) return;

        this.deck.forEach(option => {

            if (option.flagX !== undefined) {
                ctx.drawImage(this.flagImage, option.flagX, option.flagY, option.flagSize, option.flagSize);
            }
        });
    }
}