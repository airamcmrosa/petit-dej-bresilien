export class Footer {
    constructor(colors) {
        this.fontSize = 10;
        this.colors = colors;
        this.text = '© 2025 Bonjour, Maria!';
        this.footerArea = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            text: this.text
        };
        this.homepageUrl = 'https://www.bonjourmaria.com.br';
    }


    resize(canvasWidth, canvasHeight) {
        this.fontSize = Math.max(12, canvasWidth / 100);
        const paddingBottom = 20;
        const footerAreaHeight = this.fontSize + 10;
        const footerAreaY = canvasHeight - footerAreaHeight - paddingBottom;

        this.footerArea = {
            width: canvasWidth,
            height: footerAreaHeight,
            x:canvasWidth/2,
            y: footerAreaY,
            text: this.text
        };
    }

    draw(ctx) {
        if (!this.footerArea.width) return;

        ctx.fillStyle = this.colors.darkText;
        ctx.font = `${this.fontSize}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
            this.footerArea.text,
            this.footerArea.width / 2,
            this.footerArea.y + this.footerArea.height - (this.footerArea.height - this.fontSize) / 2
        );
    }
    handleInput(x, y) {

        window.location.href = this.homepageUrl;
    }

}