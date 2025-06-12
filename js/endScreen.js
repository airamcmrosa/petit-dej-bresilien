export class EndScreen {
    constructor(colors, onRestartCallback, soundManager) {
        this.onRestart = onRestartCallback;
        this.colors = colors;

        this.titleFontSize = 0;
        this.buttonFontSize = 0;
        this.messageFontSize = 0;
        this.scoreFontSize = 0;
        this.reasonForGameOver = null;
        this.soundManager = soundManager;

        this.playAgainButton = {
            x: 0, y: 0, width: 0, height: 0,
            text: 'Jouer à nouveau!',
            cornerRadius: 20
        };

    }
    setGameOverInfo(reason) {
        this.reasonForGameOver = reason;
    }



    resize(canvasWidth, canvasHeight) {

        this.messageFontSize = Math.max(30, canvasWidth / 28);
        this.scoreFontSize = Math.max(20, this.messageFontSize * 0.7);
        this.buttonFontSize = Math.max(18, this.messageFontSize / 2.2);


        const btnWidth = Math.min(canvasWidth * 0.55, 350);
        const btnHeight = Math.max(60, canvasHeight * 0.08);

        const messageAreaHeight = this.messageFontSize + this.scoreFontSize + 20;

        this.playAgainButton = {
            ...this.playAgainButton,
            width: btnWidth,
            height: btnHeight,
            x: canvasWidth / 2 - (btnWidth / 2),
            y: canvasHeight / 2 + messageAreaHeight / 2 + 20,
        };
    }

    draw (ctx, canvasWidth, canvasHeight) {

        if (!this.playAgainButton.width) return;


        ctx.fillStyle = this.colors.overlay;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let mainMessage = '';


        if (this.reasonForGameOver === 'noMoreTime') {
            mainMessage = 'Oops...Fin de jeu!';
        } else if (this.reasonForGameOver === 'all_found') {
            mainMessage = 'Félicitations!';
        }


        ctx.fillStyle ='white';
        ctx.font = `bold ${this.messageFontSize}px "Quicksand"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mainMessage, canvasWidth / 2, canvasHeight / 2 - this.messageFontSize * 0.8);

        const btn = this.playAgainButton;
        ctx.save();


        ctx.shadowColor = this.colors.highlight1;
        ctx.fillStyle = this.colors.highlight1;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, btn.cornerRadius);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${this.buttonFontSize}px "Quicksand"`;
        const textX = btn.x + btn.width / 2;
        const textY = btn.y + btn.height / 2;

        ctx.fillText(btn.text, textX, textY);

    }
    handleInput(x, y) {
        const btn = this.playAgainButton;
        if (btn.width &&
            x >= btn.x && x <= btn.x + btn.width &&
            y >= btn.y && y <= btn.y + btn.height) {
            if (this.soundManager) this.soundManager.playEffect('click');
            this.onRestart();
        }
    }

}