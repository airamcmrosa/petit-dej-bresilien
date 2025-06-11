export class Menu {
    constructor(colors, soundManager) {
        this.menuPanel = {};
        
        this.title = {
            fontsize: 0,
            x: 0,
            y:0,
            width: 0,
            height: 0,
            text: 'Petit déjeuner',
            scale: 0

        };

        this.subtitle = {
            fontsize: 0,
            x: 0,
            y:0,
            width: 0,
            height: 0,
            text: 'brésilien',
            scale: 0

        };
        this.buttonPlay = {
            cornerRadius: 20,
            fontsize: 0,
            x: 0,
            y:0,
            width: 0,
            height: 0,
            text: 'Lancer le jeu',
            scale: 0

        };
        this.buttonCredits = {
            cornerRadius: 20,
            fontsize: 0,
            x: 0,
            y:0,
            width: 0,
            height: 0,
            text: 'Crédits',
            scale: 0

        };
        this.colors = colors;
        this.soundManager = soundManager;

        this.animationTimer = 0;
        this.animationDuration = 1.2;


    }

    startAnimation() {
        this.animationTimer = 0;
        this.title.scale = 0;
        this.subtitle.scale = 0;
        this.buttonPlay.scale = 0;
        this.buttonCredits.scale = 0;
    }

    resize(canvasWidth, canvasHeight) {

        this.title.fontsize = Math.max(36, canvasWidth / 22);

        this.subtitle.fontsize = Math.max(24, this.title.fontsize * 0.8);

        this.buttonPlay.fontsize = Math.max(18, canvasWidth / 38);


        this.buttonCredits.fontsize = Math.max(18, canvasWidth / 38);

        const isWider = canvasWidth > canvasHeight;

        const topMargin = canvasHeight * 0.05;
        const padding = canvasWidth * (isWider? 0.025 : 0.005);
        const availableWidth = canvasWidth - (padding * 2);

        const availableHeight =  canvasHeight - topMargin;

        const bottomMargin = this.buttonPlay.fontsize * 1.5;

        this.menuPanel = {
            x: isWider? padding : 0,
            y: topMargin,
            width: availableWidth,
            height: availableHeight
        };

        this.title = {
            ...this.title,
            x: this.menuPanel.x + this.menuPanel.width/2,
            y: this.menuPanel.y + this.menuPanel.height/3,
            width: this.menuPanel.width,
            height: this.title.fontsize
        };

        this.subtitle = {
            ...this.subtitle,
            x: this.menuPanel.x + this.menuPanel.width/2,
            y: this.title.y + this.title.height + bottomMargin ,
            width: this.menuPanel.width,
            height: this.subtitle.fontsize
        }
        this.buttonPlay = {
            ...this.buttonPlay,
            x: this.menuPanel.x + (availableWidth/3),
            y: this.subtitle.y + this.subtitle.height + bottomMargin ,
            width: this.menuPanel.width/3 + padding *2,
            height: (this.buttonPlay.fontsize * 3.2)
        }
        this.buttonCredits = {
            ...this.buttonCredits,
            x: this.menuPanel.x + this.menuPanel.width/3,
            y: this.buttonPlay.y + this.buttonPlay.height + bottomMargin,
            width: this.menuPanel.width/3 + padding *2,
            height: (this.buttonPlay.fontsize * 3.2)
        }


    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    update(deltaTime) {
        if (this.animationTimer > this.animationDuration) return;

        this.animationTimer += deltaTime;

        // Define os tempos para cada parte da animação
        const titleStartTime = 0.1;
        const subtitleStartTime = 0.4;
        const buttonStartTime = 0.7;
        const buttonCreditsStartTime = 0.9;

        // Animação do Título
        if (this.animationTimer > titleStartTime) {
            const progress = (this.animationTimer - titleStartTime) / 0.5; // Duração da animação do título = 0.5s
            this.title.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        // Animação do Subtítulo
        if (this.animationTimer > subtitleStartTime) {
            const progress = (this.animationTimer - subtitleStartTime) / 0.5;
            this.subtitle.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        // Animação do Botão
        if (this.animationTimer > buttonStartTime) {
            const progress = (this.animationTimer - buttonStartTime) / 0.5;
            this.buttonPlay.scale = this.easeOutBack(Math.min(1.0, progress));
        }
        if (this.animationTimer > buttonCreditsStartTime) {
            const progress = (this.animationTimer - buttonCreditsStartTime) / 0.5;
            this.buttonCredits.scale = this.easeOutBack(Math.min(1.0, progress));
        }
    }


    draw(ctx) {

        if (!this.buttonPlay.width || !this.title || !this.subtitle || !this.buttonCredits || this.title.width <0 ) return;

        ctx.save();
        ctx.fillStyle = this.colors.alertColor;
        ctx.font = `800 ${this.title.fontsize}px "Dancing Script"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Move o canvas para o centro do título, aplica a escala e desenha
        ctx.translate(this.title.x, this.title.y);
        ctx.scale(this.title.scale, this.title.scale);
        ctx.fillText(this.title.text, 0, 0);
        ctx.restore();

        // --- Desenha o Subtítulo com sua escala atual ---
        ctx.save();
        ctx.fillStyle = this.colors.alertColor;
        ctx.font = `500 ${this.subtitle.fontsize}px "Quicksand"`;
        ctx.translate(this.subtitle.x, this.subtitle.y);
        ctx.scale(this.subtitle.scale, this.subtitle.scale);
        ctx.fillText(this.subtitle.text, 0, 0);
        ctx.restore();

        const btn = this.buttonPlay;
        ctx.save();
        // Move para o centro do botão para escalar a partir do centro
        ctx.translate(btn.x + btn.width / 2, btn.y + btn.height / 2);
        ctx.scale(this.buttonPlay.scale, this.buttonPlay.scale);

        // Desenha o botão na nova origem (0,0), mas deslocado pela metade de sua largura/altura
        const btnDrawX = -btn.width / 2;
        const btnDrawY = -btn.height / 2;

        ctx.shadowColor = this.colors.highlight1;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.colors.highlight1;
        ctx.beginPath();
        ctx.roundRect(btnDrawX, btnDrawY, btn.width, btn.height, btn.cornerRadius);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'white';
        ctx.font = `600 ${this.buttonPlay.fontsize}px "Quicksand"`;
        ctx.fillText(btn.text, 0, 10);

        ctx.restore();

        ctx.save();

        ctx.translate(this.buttonCredits.x + this.buttonCredits.width / 2, this.buttonCredits.y + this.buttonCredits.height / 2);
        ctx.scale(this.buttonCredits.scale, this.buttonCredits.scale);

        const btn2DrawX = -this.buttonCredits.width / 2;
        const btn2DrawY = -this.buttonCredits.height / 2;

        ctx.shadowColor = this.colors.highlight1;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.colors.highlight1;
        ctx.beginPath();
        ctx.roundRect(btn2DrawX, btn2DrawY, this.buttonCredits.width, this.buttonCredits.height, this.buttonCredits.cornerRadius);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'white';
        ctx.font = `600 ${this.buttonCredits.fontsize}px "Quicksand"`;
        ctx.fillText(this.buttonCredits.text, 0, 10);

        ctx.restore();
    }
}