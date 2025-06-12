export class Credits {
    constructor(colors, onReturn, soundManager) {
        this.colors = colors;
        this.onReturn = onReturn;
        this.soundManager = soundManager;
        this.creditsPanel = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.title1 = {text: "Crédits", fontsize:0, x:0, y: 0, width: 0, height: 0 };
        this.title2 = {text: "Images & Sons", fontsize:0, x:0, y: 0, width: 0, height: 0};
        this.subtitle = {text: "Vecteezy", fontsize:0, x:0, y: 0, width: 0, height: 0};
        this.subtitle2 = {text: "PixBay", fontsize:0, x:0, y: 0, width: 0, height: 0};
        this.btnReturn = {text: "Retourner", x: 0, y: 0, width: 0, height: 0, cornerRadius: 15};
        this.animationTimer = 0;
        this.animationDuration = 1.2;
    }

    resize(ctx, canvasWidth, canvasHeight) {

        const panelWidth = Math.max(canvasWidth * 0.8, 350);
        const panelHeight = Math.max(canvasHeight * 0.6, 450);


        this.title1.fontsize = Math.max(32, panelWidth / 15);
        this.title2.fontsize = Math.max(21, panelWidth / 18);
        this.subtitle.fontsize = Math.max(20, panelWidth / 25);
        this.btnReturn.fontsize = Math.max(18, panelWidth / 22);

        const padding = panelHeight * 0.1;
        this.creditsPanel = {
            ...this.creditsPanel,
            width: panelWidth,
            height: panelHeight - padding,
            x: canvasWidth / 2 - panelWidth / 2,
            y: canvasHeight / 2 - panelHeight / 2 - padding,
        };
        let currentY = this.creditsPanel.y + padding;

        this.title1.width = ctx.measureText(this.title1.text);

        this.title1 = {
            ... this.title1,
            x : this.creditsPanel.x + (this.creditsPanel.width / 2),
            y : currentY
        };

        currentY += this.title1.fontsize + padding / 2;

        this.title2.x = this.creditsPanel.x + this.creditsPanel.width / 2;
        this.title2.y = currentY;
        currentY += this.title2.fontsize + padding;

        this.subtitle.x = this.creditsPanel.x + this.creditsPanel.width / 2;
        this.subtitle.y = currentY;
        currentY += this.subtitle.fontsize + padding;

        this.subtitle2 = {
            ...this.subtitle2,
            x: this.subtitle.x,
            y: currentY
        }

        const btnWidth = panelWidth * 0.7;
        const btnHeight = Math.max(50, panelHeight * 0.15);
        this.btnReturn = {
            ...this.btnReturn,
            width: btnWidth,
            height: btnHeight,
            x: this.creditsPanel.x + (this.creditsPanel.width / 2) - (btnWidth/2),
            y: this.creditsPanel.y + this.creditsPanel.height + padding,
        };
        console.log("resize end credits");
    }
    startAnimation() {

        this.animationTimer = 0;
        this.creditsPanel.scale = 0;
        this.title1.scale = 0;
        this.title2.scale = 0;
        this.subtitle.scale = 0;
        this.subtitle2.scale = 0;
        this.btnReturn.scale = 0;
    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    update(deltaTime) {
        if (this.animationTimer > this.animationDuration) return;

        this.animationTimer += deltaTime;

        const title1StartTime = 0.1;
        const title2StartTime = 0.5;
        const subtitleStartTime = 0.5;
        const subtitle2StartTime = 0.5;
        const panelStartTime = 0.4;
        const btnStartTime = 0.6;


        if (this.animationTimer > panelStartTime) {
            const progress = (this.animationTimer - panelStartTime) / 0.6;
            this.creditsPanel.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        if (this.animationTimer > title1StartTime) {
            const progress = (this.animationTimer - title1StartTime) / 0.5;
            this.title1.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        if (this.animationTimer > title2StartTime) {
            const progress = (this.animationTimer - title2StartTime) / 0.5;
            this.title2.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        if (this.animationTimer > subtitleStartTime) {
            const progress = (this.animationTimer - subtitleStartTime) / 0.5;
            this.subtitle.scale = this.easeOutBack(Math.min(1.0, progress));
        }
        if (this.animationTimer > subtitle2StartTime) {
            const progress = (this.animationTimer - subtitle2StartTime) / 0.5;
            this.subtitle2.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        if (this.animationTimer > btnStartTime) {
            const progress = (this.animationTimer - btnStartTime) / 0.5;
            this.btnReturn.scale = this.easeOutBack(Math.min(1.0, progress));
        }

    }

    draw(ctx) {
        if (!this.btnReturn.width) return;

        this.drawPanel(ctx, this.creditsPanel);

        this.drawText(ctx, this.title1, `800 ${this.title1.fontsize}px "Dancing Script"`, this.colors.alertColor);
        this.drawText(ctx, this.title2, `600 ${this.title2.fontsize}px "Dancing Script"`, this.colors.alertColor);

        this.drawText(ctx, this.subtitle, `500 ${this.subtitle.fontsize}px "Quicksand"`, this.colors.borderColor);
        this.drawText(ctx, this.subtitle2, `500 ${this.subtitle.fontsize}px "Quicksand"`, this.colors.borderColor);

        this.drawButton(ctx, this.btnReturn);

    }

    drawPanel(ctx, panel) {
        ctx.save();
        ctx.translate(panel.x + panel.width / 2, panel.y + panel.height / 2);
        ctx.scale(panel.scale, panel.scale);
        ctx.fillStyle = this.colors.overlay;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.roundRect(-panel.width / 2, -panel.height / 2, panel.width, panel.height, panel.cornerRadius);
        ctx.fill();
        ctx.restore();

    }
    drawText(ctx, textObject, font, color) {
        if (textObject.scale === 0) return;
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

    drawButton(ctx, btnReturn) {
        ctx.save();
        ctx.translate(btnReturn.x + btnReturn.width / 2, btnReturn.y + btnReturn.height / 2);
        ctx.scale(btnReturn.scale, btnReturn.scale);
        const btnDrawX = -btnReturn.width / 2;
        const btnDrawY = -btnReturn.height / 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = btnReturn.fontsize * 0.15;
        const gradient = ctx.createLinearGradient(0, btnDrawY, 0, btnDrawY + btnReturn.height);

        // 2. Adiciona as "paradas de cor". 0 é o início (topo), 1 é o fim (base).
        // Usaremos duas cores do seu tema para criar o efeito.
        gradient.addColorStop(0, '#ffdc7c'); // Cor inicial (usando a cor de highlight)
        gradient.addColorStop(1, '#ff9b71'); // Cor final (usando a cor de accent)

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(btnDrawX, btnDrawY, btnReturn.width, btnReturn.height, btnReturn.cornerRadius);
        ctx.fill();
        ctx.shadowColor = this.colors.darkText;
        ctx.shadowBlur = 5;
        ctx.fillStyle = 'white';

        ctx.font = `900 ${btnReturn.fontsize}px "Quicksand"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btnReturn.text.toUpperCase(), 0, 0);
        ctx.restore();
    }



    handleInput(x, y) {
        if (this.btnReturn.width && x >= this.btnReturn.x && x <= this.btnReturn.x + this.btnReturn.width &&
            y >= this.btnReturn.y && y <= this.btnReturn.y + this.btnReturn.height) {
            if (this.soundManager) this.soundManager.playEffect('click');
            if (this.onReturn) this.onReturn();
        }
    }





}