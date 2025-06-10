export class Menu {
    constructor(colors, soundManager) {
        this.title = 'Petit déjeuner';
        this.subtitle = 'brésilien'; //
        this.buttonTextPlay = 'Lancer le jeu';
        this.colors = colors;
        this.soundManager = soundManager;



        this.titleFontSize = 0;
        this.titlePosition = {};
        this.subtitleFontSize = 0;
        this.subtitlePosition = {};
        this.buttonFontSize = 0;
        this.playButton = { cornerRadius: 20 };
    }

    resize(canvasWidth, canvasHeight) {

        this.titleFontSize = Math.max(36, canvasWidth / 22);

        this.subtitleFontSize = Math.max(16, this.titleFontSize * 0.5);

        this.buttonFontSize = Math.max(18, canvasWidth / 38);


        const basePadding = canvasHeight * 0.05;


        const subtitleY = canvasHeight * 0.2;

        const titleY = subtitleY + this.subtitleFontSize + basePadding * 0.9;
        const title2Y = titleY + this.titleFontSize * 0.7 + basePadding * 0.9;

        const buttonY = title2Y + this.titleFontSize * 0.7 + basePadding * 1.2;

        this.titlePosition = { x: canvasWidth / 2, y: titleY };
        this.title2Position = { x: canvasWidth / 2, y: title2Y };
        this.subtitlePosition = { x: canvasWidth / 2, y: subtitleY };


        const btnWidth = Math.min(canvasWidth * 0.55, 380);
        const btnHeight = Math.max(65, canvasHeight * 0.09);

        this.playButton = {
            ...this.playButton,
            width: btnWidth,
            height: btnHeight,
            x: (canvasWidth / 2) - (btnWidth / 2),
            y: buttonY,
            text: this.buttonTextPlay
        };
    }

    draw(ctx) {
        if (!this.playButton.width) return;

        const btn = this.playButton;


        ctx.fillStyle = this.colors.mainAccent;
        ctx.font = `bold ${this.titleFontSize}px "Dancing Script"`; //
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.title, this.titlePosition.x, this.titlePosition.y);

        ctx.fillStyle = this.colors.mainAccent;
        ctx.font = `bold ${this.titleFontSize}px "Dancing Script"`; //
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.title2, this.title2Position.x, this.title2Position.y);


        ctx.fillStyle = this.colors.text;
        ctx.font = `${this.subtitleFontSize}px "Quicksand"`;
        ctx.fillText(this.subtitle, this.subtitlePosition.x, this.subtitlePosition.y);


        ctx.shadowColor = this.colors.mainAccent;
        ctx.shadowBlur = 15;

        ctx.fillStyle = this.colors.btnbackground;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, btn.cornerRadius);
        ctx.fill();

        ctx.shadowBlur = 0;


        ctx.fillStyle = this.colors.textDark;
        ctx.font = `300 ${this.buttonFontSize}px "Quicksand"`;
        ctx.fillText(btn.text, this.titlePosition.x, btn.y + btn.height / 2);
    }
}