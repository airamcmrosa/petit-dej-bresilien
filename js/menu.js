export class Menu {
    constructor(colors, soundManager) {
        this.title = 'Petit déjeuner';
        this.subtitle = 'brésilien';
        this.buttonTextPlay = 'Lancer le jeu';
        this.colors = colors;
        this.soundManager = soundManager;


        this.titleFontSize = 0;
        this.titlePosition = {};
        this.subtitleFontSize = 0;
        this.subtitlePosition = {};
        this.buttonFontSize = 0;
        this.playButton = { cornerRadius: 20 };

        this.animationTimer = 0;
        this.animationDuration = 1.2;

        // Escala inicial de cada elemento (0 = invisível, 1 = tamanho normal)
        this.titleScale = 0;
        this.subtitleScale = 0;
        this.buttonScale = 0;

    }

    startAnimation() {
        this.animationTimer = 0;
        this.titleScale = 0;
        this.subtitleScale = 0;
        this.buttonScale = 0;
    }

    resize(canvasWidth, canvasHeight) {

        this.titleFontSize = Math.max(36, canvasWidth / 22);

        this.subtitleFontSize = Math.max(16, this.titleFontSize * 0.5);

        this.buttonFontSize = Math.max(18, canvasWidth / 38);


        const basePadding = canvasHeight * 0.05;

        const titleY =  canvasHeight * 0.2;

        const subtitleY = titleY+ this.subtitleFontSize + basePadding * 0.9;


        const buttonY = subtitleY + this.titleFontSize * 0.7 + basePadding * 1.2;

        this.titlePosition = { x: canvasWidth / 2, y: titleY };
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

        // Animação do Título
        if (this.animationTimer > titleStartTime) {
            const progress = (this.animationTimer - titleStartTime) / 0.5; // Duração da animação do título = 0.5s
            this.titleScale = this.easeOutBack(Math.min(1.0, progress));
        }

        // Animação do Subtítulo
        if (this.animationTimer > subtitleStartTime) {
            const progress = (this.animationTimer - subtitleStartTime) / 0.5;
            this.subtitleScale = this.easeOutBack(Math.min(1.0, progress));
        }

        // Animação do Botão
        if (this.animationTimer > buttonStartTime) {
            const progress = (this.animationTimer - buttonStartTime) / 0.5;
            this.buttonScale = this.easeOutBack(Math.min(1.0, progress));
        }
    }


    draw(ctx) {

        if (!this.playButton.width) return;

        // --- Desenha o Título com sua escala atual ---
        ctx.save();
        ctx.fillStyle = this.colors.alertColor;
        ctx.font = `bold ${this.titleFontSize}px "Dancing Script"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Move o canvas para o centro do título, aplica a escala e desenha
        ctx.translate(this.titlePosition.x, this.titlePosition.y);
        ctx.scale(this.titleScale, this.titleScale);
        ctx.fillText(this.title, 0, 0);
        ctx.restore();

        // --- Desenha o Subtítulo com sua escala atual ---
        ctx.save();
        ctx.fillStyle = this.colors.highlight1;
        ctx.font = `${this.subtitleFontSize}px "Quicksand"`;
        ctx.translate(this.subtitlePosition.x, this.subtitlePosition.y);
        ctx.scale(this.subtitleScale, this.subtitleScale);
        ctx.fillText(this.subtitle, 0, 0);
        ctx.restore();

        // --- Desenha o Botão com sua escala atual ---
        const btn = this.playButton;
        ctx.save();
        // Move para o centro do botão para escalar a partir do centro
        ctx.translate(btn.x + btn.width / 2, btn.y + btn.height / 2);
        ctx.scale(this.buttonScale, this.buttonScale);

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

        // Texto do botão
        ctx.fillStyle = 'white';
        ctx.font = `300 ${this.buttonFontSize}px "Quicksand"`;
        ctx.fillText(btn.text, 0, 0); // O texto já está centralizado na origem

        ctx.restore();
    }
}