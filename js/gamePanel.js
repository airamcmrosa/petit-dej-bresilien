
export class GamePanel {
    constructor(colors) {
        this.colors = colors;

        this.panelRect = { x: 0, y: 0, width: 0, height: 0 };

        this.timeDisplayArea = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.gameTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.alimentsListTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.tableRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };

        this.flagsArea = { x: 0, y: 0, width: 0, height: 0 };

        this.imagesLoaded = 0;
        this.totalImages = 3;

        this.loadImages();


    }

    loadImages() {

        this.alimentListImage = new Image();

        this.alimentListImage.onload = () => {
            console.log(`✅ Image loaded successfully`);
            this.imageLoaded();
        };
        this.alimentListImage.src = 'media/papel.svg';


        this.tableImage = new Image();
        this.tableImage.onload = () => {
            console.log(`✅ Image loaded successfully`);
            this.imageLoaded();
        };
        this.tableImage.src = 'media/mesa.svg';

        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            console.log(`✅ Image loaded successfully`);
            this.imageLoaded();
        };
        this.backgroundImage.src = 'media/piso.svg';
    }

    imageLoaded() {
        this.imagesLoaded++;
    }

    resize(canvasWidth, canvasHeight, footer) {
        // --- Painel Principal ---

        if (!footer) return;
        const topMargin = 50;

        // The panel takes the full canvas width and the height remaining after the footer.
        this.panelRect.width = canvasWidth;
        this.panelRect.height = canvasHeight - topMargin - footer.footerArea.height;
        this.panelRect.x = 0;
        this.panelRect.y = topMargin;

        const padding = canvasWidth * 0.02; // Use a responsive padding.

        // --- Top Row Calculations (gameText and timeDisplay) ---
        const topRowY = this.panelRect.y + padding;
        const topRowHeight = this.panelRect.height * 0.1;

        // Calculate available width for elements, considering 3 padding gaps (left, middle, right).
        const availableWidth = this.panelRect.width - (padding * 3);
        const rightDisplayWidth = availableWidth;
        const timeDisplayWidth = availableWidth * 0.3;
        const gameTextWidth = availableWidth * 0.7;

        // Define gameTextRect (left side of top row).
        this.gameTextRect = {
            x: this.panelRect.x + padding,
            y: topRowY,
            width: gameTextWidth,
            height: topRowHeight,
            cornerRadius: 15
        };

        const bottomRowY = topRowY + topRowHeight + padding;
        const bottomRowHeight = this.panelRect.height - topRowHeight - (padding * 3);

        const flagColumnWidth = 40;

        const alimentsListWidth = timeDisplayWidth - flagColumnWidth - padding;


        this.rightDisplayArea = {
            x: this.gameTextRect.x + this.gameTextRect.width + padding,
            y: 0,
            width: rightDisplayWidth,
            height: canvasHeight,
            cornerRadius: 15
        };

        this.timeDisplayArea = {
            x: this.gameTextRect.x + this.gameTextRect.width + padding,
            y: topRowY,
            width: alimentsListWidth,
            height: topRowHeight,
            cornerRadius: 15
        };


        this.tableRect = {
            x: this.gameTextRect.x,
            y: bottomRowY,
            width: this.gameTextRect.width + 20,
            height: bottomRowHeight + 50,
            cornerRadius: 15
        };

        this.alimentsListTextRect = {
            x: this.timeDisplayArea.x,
            y: bottomRowY,
            width: this.timeDisplayArea.width,
            height: bottomRowHeight,
            cornerRadius: 15
        };

        this.flagsArea = {
            x: this.alimentsListTextRect.x + this.alimentsListTextRect.width + padding,
            y: bottomRowY,
            width: flagColumnWidth,
            height: bottomRowHeight
        };


    }

    draw(ctx) {


        if (!this.panelRect.width) return;

        if(this.imagesLoaded < this.totalImages) return;

        // --- Draw Main Panel Background ---
        ctx.save();
        ctx.drawImage(this.backgroundImage, 0, 0, this.panelRect.width, this.panelRect.height + this.panelRect.y);

        ctx.restore();


        if (this.gameTextRect && this.gameTextRect.width > 0) {
            ctx.shadowColor = this.colors.backgroundColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.colors.backgroundColor;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.roundRect(this.gameTextRect.x, this.gameTextRect.y, this.gameTextRect.width, this.gameTextRect.height,
                this.gameTextRect.cornerRadius);
            ctx.fill();
        }

        // Placeholder for timeDisplayArea
        if(this.rightDisplayArea) {
            ctx.shadowColor = this.colors.backgroundColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.colors.backgroundColor;
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.roundRect(this.timeDisplayArea.x, this.rightDisplayArea.y, this.rightDisplayArea.width,
                this.rightDisplayArea.height, this.timeDisplayArea.cornerRadius);
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();

        }
        if (this.timeDisplayArea && this.timeDisplayArea.width > 0) {

            ctx.beginPath();
            ctx.roundRect(this.timeDisplayArea.x, this.timeDisplayArea.y, this.timeDisplayArea.width,
                this.timeDisplayArea.height, this.timeDisplayArea.cornerRadius);
            ctx.fill();
        }

        // Placeholder for aliments list
        if (this.alimentsListTextRect && this.alimentsListTextRect.width > 0) {
            ctx.globalAlpha = 1;
            // ctx.beginPath();
            // ctx.roundRect(this.alimentsListTextRect.x, this.alimentsListTextRect.y, this.alimentsListTextRect.width,
            //     this.alimentsListTextRect.height, this.alimentsListTextRect.cornerRadius);
            // ctx.stroke();

            ctx.drawImage(this.alimentListImage, this.alimentsListTextRect.x + (this.alimentsListTextRect.width /2)*0.1, this.alimentsListTextRect.y,
                this.alimentsListTextRect.width + 60, this.alimentsListTextRect.height);

        }
        if (this.tableRect && this.tableRect.width > 0) {
            ctx.drawImage(this.tableImage, this.tableRect.x, this.tableRect.y, this.tableRect.width, this.tableRect.height * 1.1);

        }
    }
}