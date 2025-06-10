export class HelpGame {

    constructor(deckToManage, soundManager) {
        this.deck = deckToManage;
        this.soundManager = soundManager;
        this.flagImage = null;
        this.ctx = null;
        this.listLayout = null;
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

    calculateLayout(ctx, listLayout) {

        if (ctx) this.ctx = ctx;
        if (listLayout) this.listLayout = listLayout;

        console.log(this.listLayout);

        if (!this.listLayout) return;

        this.ctx.font = this.listLayout.font;
        const fontSize = parseFloat(this.listLayout.fontSize);
        const lineHeight = fontSize * 1.5;
        const textPadding = { top: this.listLayout.height * 0.25, left: this.listLayout.width * 0.2 };



        this.deck.forEach((option, index) => {
            const text = option.isTranslated ? option.pt : option.fr;
            const textX = this.listLayout.x + textPadding.left;
            const textY = this.listLayout.y + textPadding.top + (index * lineHeight);
            const textWidth = this.ctx.measureText(text).width;

            const flagSize = fontSize;
            const flagX = textX + textWidth;

            const flagY = textY + (fontSize / 2) - (flagSize / 2);

            option.flagX = flagX;
            option.flagY = flagY;
            option.flagSize = flagSize;
            console.log(option);
        });
    }


    handleInput(x, y) {
        // console.log("called handle input draw");
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
        console.log("called traduction");
        cardToTranslate.isTranslated = !cardToTranslate.isTranslated;
        this.calculateLayout();
    }



    draw(ctx, option) {
        if (!this.flagImage || !this.flagImage.complete || option.flagX === undefined) return;
        ctx.drawImage(this.flagImage, option.flagX, option.flagY, option.flagSize, option.flagSize);


    }
}