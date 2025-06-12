export class Menu {
    constructor(colors, soundManager, menuAssets) {

        this.menuImage = {
            image: menuAssets.backImg
        };

        this.bannerSubtitle = {x:0, y:0 ,width: 0, height: 0, scale:0, image: menuAssets.banner};

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
        this.bannerSubtitle.scale = 0;
        this.buttonPlay.scale = 0;
        this.buttonCredits.scale = 0;
    }

    resize(canvasWidth, canvasHeight) {


        this.title.fontsize = Math.min(85, canvasWidth / 7);

        const buttonFontSize = Math.max(20, canvasWidth / 35);
        this.buttonPlay.fontsize = buttonFontSize;
        this.buttonCredits.fontsize = buttonFontSize;


        this.menuImage = {
            ...this.menuImage,
            width: canvasWidth,
            height: canvasHeight

        }

        const bannerMaxWidth = 550;

        const bannerWidth = Math.min(canvasWidth * 0.5, bannerMaxWidth);
        const bannerAspectRatio = this.bannerSubtitle.image.naturalHeight / this.bannerSubtitle.image.naturalWidth;
        const bannerHeight = bannerWidth * bannerAspectRatio;

        const isWider = canvasWidth > canvasHeight;

        const topMargin = canvasHeight * 0.05;

        const availableHeight =  canvasHeight - topMargin * 2;
        let btnWidth;
        let btnHeight;


        if (isWider) {
            btnWidth = Math.min(canvasWidth * 0.4, 450);
            btnHeight = Math.min(availableHeight * 0.12, 90);
        } else {
            btnWidth = Math.min(canvasWidth * 0.75, 360);
            btnHeight = Math.min(availableHeight * 0.1, 80);
        }

        const verticalPadding = canvasHeight * 0.03;
        let currentY = canvasHeight / 2 - (this.title.fontsize + bannerHeight + btnHeight * 2 + verticalPadding * 2 + topMargin *2) / 2;

        this.title.x = canvasWidth / 2;
        this.title.y = currentY;
        currentY += this.title.fontsize;

        this.bannerSubtitle = {
            ...this.bannerSubtitle,
            x: canvasWidth / 2 - (bannerWidth/2),
            y: currentY - verticalPadding,
            width: bannerWidth,
            height: bannerHeight
        };
        currentY += bannerHeight + verticalPadding * 1.5;

        this.buttonPlay = {
            ...this.buttonPlay,
            x:  ( canvasWidth /2) - (btnWidth/2),
            y: currentY,
            width: btnWidth,
            height: btnHeight
        }
        currentY += btnHeight + verticalPadding;
        console.log("tam btn2:", this.buttonPlay.width);

        this.buttonCredits = {
            ...this.buttonCredits,
            x: ( canvasWidth /2) - (btnWidth/2),
            y: currentY,
            width: btnWidth,
            height: btnHeight
        }
        console.log("tam btn2:", this.buttonCredits.width);


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
        const bannerSubtitleStartTime = 0.4;
        const buttonStartTime = 0.7;
        const buttonCreditsStartTime = 0.7;

        // Animação do Título
        if (this.animationTimer > titleStartTime) {
            const progress = (this.animationTimer - titleStartTime) / 0.5; // Duração da animação do título = 0.5s
            this.title.scale = this.easeOutBack(Math.min(1.0, progress));
        }

        // Animação do banenr subtitle
        if (this.animationTimer > bannerSubtitleStartTime) {
            const progress = (this.animationTimer - bannerSubtitleStartTime) / 0.5;
            this.bannerSubtitle.scale = this.easeOutBack(Math.min(1.0, progress));
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
        if (!this.buttonPlay.width) return;

        if (this.menuImage.image && this.menuImage.image.complete && this.menuImage.image.naturalWidth > 0) {
            ctx.drawImage(this.menuImage.image, 0, 0, this.menuImage.width, this.menuImage.height);
        }

        this.drawSubtitleComponent(ctx);

        this.drawText(ctx, this.title, `800 ${this.title.fontsize}px "Dancing Script"`, this.colors.alertColor);


        this.drawButton(ctx, this.buttonPlay);
        this.drawButton(ctx, this.buttonCredits);
    }

    drawSubtitleComponent(ctx) {
        const sub = this.bannerSubtitle;
        if (!sub.width || sub.scale === 0) return;

        ctx.save();
        // Move a origem para o centro do banner para a animação de escala
        ctx.translate(sub.x + sub.width / 2, sub.y + sub.height / 2);
        ctx.scale(sub.scale, sub.scale);

        // 1. Desenha a imagem do banner na origem (0,0) transladada
        if (sub.image && sub.image.complete) {
            ctx.drawImage(sub.image, -sub.width / 2, -sub.height / 2, sub.width, sub.height);
        }
        //
        // // 2. Desenha o texto por cima do banner
        // ctx.fillStyle = this.colors.darkText; // Cor escura para bom contraste
        // ctx.font = `500 ${sub.fontsize}px "Quicksand"`;
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText(sub.text, 0, 0); // Desenha no centro do banner

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


    // draw(ctx) {
    //
    //     if (!this.buttonPlay.width || !this.title || !this.subtitle || !this.buttonCredits || this.title.width <0 ) return;
    //
    //     ctx.save();
    //     ctx.fillStyle = this.colors.alertColor;
    //     ctx.font = `800 ${this.title.fontsize}px "Dancing Script"`;
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     // Move o canvas para o centro do título, aplica a escala e desenha
    //     ctx.translate(this.title.x, this.title.y);
    //     ctx.scale(this.title.scale, this.title.scale);
    //     ctx.fillText(this.title.text, 0, 0);
    //     ctx.restore();
    //
    //     // --- Desenha o Subtítulo com sua escala atual ---
    //     ctx.save();
    //     ctx.fillStyle = this.colors.alertColor;
    //     ctx.font = `500 ${this.subtitle.fontsize}px "Quicksand"`;
    //     ctx.translate(this.subtitle.x, this.subtitle.y);
    //     ctx.scale(this.subtitle.scale, this.subtitle.scale);
    //     ctx.fillText(this.subtitle.text, 0, 0);
    //     ctx.restore();
    //
    //     const btn = this.buttonPlay;
    //     ctx.save();
    //     // Move para o centro do botão para escalar a partir do centro
    //     ctx.translate(btn.x + btn.width / 2, btn.y + btn.height / 2);
    //     ctx.scale(this.buttonPlay.scale, this.buttonPlay.scale);
    //
    //     // Desenha o botão na nova origem (0,0), mas deslocado pela metade de sua largura/altura
    //     const btnDrawX = -btn.width / 2;
    //     const btnDrawY = -btn.height / 2;
    //
    //     ctx.shadowColor = 'black';
    //     ctx.shadowBlur = this.buttonPlay.fontsize * 0.1;
    //     ctx.fillStyle = this.colors.darkText;
    //     ctx.beginPath();
    //     ctx.roundRect(btnDrawX, btnDrawY, btn.width, btn.height, btn.cornerRadius);
    //     ctx.fill();
    //     ctx.shadowBlur = 0;
    //
    //     ctx.fillStyle = 'white';
    //     ctx.font = `600 ${this.buttonPlay.fontsize}px "Quicksand"`;
    //     ctx.fillText(btn.text, 0, 10);
    //
    //     ctx.restore();
    //
    //     ctx.save();
    //
    //     ctx.translate(this.buttonCredits.x + this.buttonCredits.width / 2, this.buttonCredits.y + this.buttonCredits.height / 2);
    //     ctx.scale(this.buttonCredits.scale, this.buttonCredits.scale);
    //
    //     const btn2DrawX = -this.buttonCredits.width / 2;
    //     const btn2DrawY = -this.buttonCredits.height / 2;
    //
    //     ctx.shadowColor = 'black';
    //     ctx.shadowBlur = this.buttonPlay.fontsize * 0.1;
    //     ctx.fillStyle = this.colors.darkText;
    //     ctx.beginPath();
    //     ctx.roundRect(btn2DrawX, btn2DrawY, this.buttonCredits.width, this.buttonCredits.height, this.buttonCredits.cornerRadius);
    //     ctx.fill();
    //     ctx.shadowBlur = 0;
    //
    //     ctx.fillStyle = 'white';
    //     ctx.font = `600 ${this.buttonCredits.fontsize}px "Quicksand"`;
    //     ctx.fillText(this.buttonCredits.text, 0, 10);
    //
    //     ctx.restore();
    // }
}