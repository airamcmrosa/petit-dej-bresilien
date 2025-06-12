export class Credits {
    constructor(colors, soundManager) {
        this.colors = colors;
        this.soundManager = soundManager;
        this.creditsPanel = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15, scale: 0 };
        this.title1 = {text: "", fontsize:0, x:0, y: 0, width: 0, height: 0, scale: 0 };
        this.title2 = {text: "", fontsize:0, x:0, y: 0, width: 0, height: 0, scale: 0 };
        this.subtitle = {text: "", fontsize:0, x:0, y: 0, width: 0, height: 0, scale: 0 };
        this.btnReturn = {};

        this.animationTimer = 0;
        this.animationDuration = 1.2;
    }

    resize (canvasWidth, canvasHeight) {
        const isWider = canvasWidth > canvasHeight;
        const padding = {side: canvasWidth * (isWider? 0.04 : 0.02), top: canvasHeight * (isWider? 0.05 : 0.025)}
        this.creditsPanel.width = canvasWidth/2 - (padding.side * 2);
        this.creditsPanel.height = canvasHeight/2 - (padding.top * 2) ;

        this.title1.fontsize = Math.max(36, canvasWidth / 22);
        this.title2.fontsize = Math.max(32, canvasWidth / 26);

        this.subtitle.fontsize = Math.max(24, this.title2.fontsize * 0.8);

        this.btnReturn.fontsize = Math.max(20, canvasWidth / 35);

    }

    startAnimation() {
        this.animationTimer = 0;
        this.creditsPanel.scale = 0;
    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    update(deltaTime) {
        if (this.animationTimer > this.animationDuration) return;

        this.animationTimer += deltaTime;

        const creditsStartTime = 0.1;
        const title1StartTime = 0.1;
        const title2StartTime = 0.2;
        const subtitleStartTime = 0.2;
        const creditsPanelStartTime = 0.2;
        const btnStartTime = 0.2;


        if (this.animationTimer > creditsStartTime) {
            const progress = (this.animationTimer - creditsStartTime) / 0.5;
            this.creditsPanel.scale = this.easeOutBack(Math.min(1.0, progress));
        }
    }

    draw(ctx) {
        if (!this.btnReturn.width) return;

        this.drawPanel(ctx, this.creditsPanel);

        this.drawText(ctx, this.title1, `800 ${this.title1.fontsize}px "Dancing Script"`, this.colors.alertColor);
        this.drawText(ctx, this.title2, `600 ${this.title2.fontsize}px "Dancing Script"`, this.colors.alertColor);

        this.drawText(ctx, this.subtitle, `500 ${this.subtitle.fontsize}px "Quicksand"`, this.colors.borderColor);

        this.drawButton(ctx, this.btnReturn);
    }

    drawPanel(ctx, Object) {
        ctx.save();
        ctx.fillStyle = this.colors.overlay;
        ctx.translate(Object.x, Object.y);
        ctx.scale(Object.scale, Object.scale);
        ctx.restore();
    }

    drawText(ctx, textObject, font, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(textObject.x, textObject.y);
        ctx.scale(textObject.scale, textObject.scale);
        ctx.fillText(textObject.text, 0, 0);
        ctx.restore();
    }

    drawButton(ctx, buttonObject) {
        ctx.save();
        ctx.translate(buttonObject.x + buttonObject.width / 2, buttonObject.y + buttonObject.height / 2);
        ctx.scale(buttonObject.scale, buttonObject.scale);
        const btnDrawX = -buttonObject.width / 2;
        const btnDrawY = -buttonObject.height / 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = buttonObject.fontsize * 0.15;
        const gradient = ctx.createLinearGradient(0, btnDrawY, 0, btnDrawY + buttonObject.height);

        // 2. Adiciona as "paradas de cor". 0 é o início (topo), 1 é o fim (base).
        // Usaremos duas cores do seu tema para criar o efeito.
        gradient.addColorStop(0, '#ffdc7c'); // Cor inicial (usando a cor de highlight)
        gradient.addColorStop(1, '#ff9b71'); // Cor final (usando a cor de accent)

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(btnDrawX, btnDrawY, buttonObject.width, buttonObject.height, buttonObject.cornerRadius);
        ctx.fill();
        ctx.shadowColor = this.colors.darkText;
        ctx.shadowBlur = 5;
        ctx.fillStyle = 'white';

        ctx.font = `900 ${buttonObject.fontsize}px "Quicksand"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buttonObject.text.toUpperCase(), 0, 0);
        ctx.restore();
    }


}