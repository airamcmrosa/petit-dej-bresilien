
export class GamePanel {
    constructor(colors, timer, panelAssets) {
        this.colors = colors;
        this.backgroundImage = panelAssets.panelBg;
        this.tableImage = panelAssets.tableImg;
        this.alimentsListImage = panelAssets.paper;

        this.panelRect = { x: 0, y: 0, width: 0, height: 0 };

        this.timeDisplayArea = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.gameTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.alimentsListTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.tableRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };

        this.flagsArea = { x: 0, y: 0, width: 0, height: 0 };

    }

    resize(canvasWidth, canvasHeight, footer) {

        if (!footer) return;

        const isWider = canvasWidth > canvasHeight;
        const topMargin = canvasHeight * (isWider? 0.05 : 0.025);
        const padding = canvasWidth * (isWider? 0.04 : 0.02);
        this.panelRect.width = canvasWidth;
        this.panelRect.height = canvasHeight - topMargin - footer.footerArea.height;
        this.panelRect.x = 0;
        this.panelRect.y = topMargin * 2;



        const topRowY = this.panelRect.y;
        const topRowHeight = this.panelRect.height * (isWider? (1/8) : (1/10));

        const rightDisplayWidth = this.panelRect.width * (isWider? (1/3) : 1);
        const leftDisplayWidth = this.panelRect.width - rightDisplayWidth - padding;

        let secondRowY =  topRowY + topRowHeight + (topMargin / 2);
        let secondHowHeight = this.panelRect.height * (isWider? (1/8) : (1/10)) ;


        const thirdRowY = isWider? secondRowY + secondHowHeight : secondRowY  + (topMargin / 2);
        const thirdRowHeight = this.panelRect.height * (isWider? (6/8) : (6/10)) ;

        const fourthRowY = thirdRowY + thirdRowHeight +  (topMargin / 2);
        const fourthHowHeight = this.panelRect.height * (isWider? (1/8) : (2/10)) ;


        const flagColumnWidth = 40;

        if (isWider){
            this.rightDisplayArea = {
                x:this.panelRect.x + padding+ leftDisplayWidth ,
                y: topRowY,
                width: rightDisplayWidth,
                height: this.panelRect.height
            }

        }


        this.gameTextRect = {
            x: this.panelRect.x,
            y: topRowY,
            width: isWider? leftDisplayWidth : this.panelRect.width,
            height: topRowHeight,
            cornerRadius: 15
        };


        this.timeDisplayArea = {
            x: this.panelRect.x + (isWider? (leftDisplayWidth + padding) : (rightDisplayWidth /4)),
            y: isWider? topRowY : secondRowY,
            width: isWider? rightDisplayWidth : this.panelRect.width / 2,
            height: isWider? topRowHeight : secondHowHeight,
            cornerRadius: 15
        };


        this.tableRect = {
            x: this.panelRect.x,
            y: thirdRowY,
            width: isWider? leftDisplayWidth : this.panelRect.width,
            height: thirdRowHeight,
            cornerRadius: 15
        };

        this.alimentsListTextRect = {
            x:  this.panelRect.x + (isWider? (leftDisplayWidth + padding)  : 0),
            y: isWider? (this.timeDisplayArea.y + this.timeDisplayArea.height + padding) : fourthRowY,
            width: isWider? rightDisplayWidth : this.panelRect.width,
            height: isWider? thirdRowHeight: fourthHowHeight,
            cornerRadius: 15
        };

        this.flagsArea = {
            x: this.alimentsListTextRect.x + this.alimentsListTextRect.width + padding,
            y: fourthHowHeight,
            width: flagColumnWidth,
            height: isWider? thirdRowHeight : fourthHowHeight,
        };


    }

    draw(ctx, timer) {



        if (!this.panelRect.width) return;


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

        // Placeholder for aliments list
        if (this.alimentsListTextRect && this.alimentsListTextRect.width > 0) {
            ctx.globalAlpha = 1;
            // ctx.beginPath();
            // ctx.roundRect(this.alimentsListTextRect.x, this.alimentsListTextRect.y, this.alimentsListTextRect.width,
            //     this.alimentsListTextRect.height, this.alimentsListTextRect.cornerRadius);
            // ctx.stroke();

            ctx.drawImage(this.alimentsListImage, this.alimentsListTextRect.x, this.alimentsListTextRect.y,
                this.alimentsListTextRect.width, this.alimentsListTextRect.height + 10);

        }
        if (this.tableRect && this.tableRect.width > 0) {
            ctx.drawImage(this.tableImage, this.tableRect.x, this.tableRect.y + (this.timeDisplayArea.height/2), this.tableRect.width, this.tableRect.height);

        }
        if (this.timeDisplayArea && this.timeDisplayArea.width > 0) {
            //
            //     ctx.beginPath();
            //     ctx.roundRect(this.timeDisplayArea.x, this.timeDisplayArea.y, this.timeDisplayArea.width,
            //         this.timeDisplayArea.height, this.timeDisplayArea.cornerRadius);
            //     ctx.fill();
            // }


            const timerDisplay = this.timeDisplayArea;

            if (timerDisplay.width > 0) {
                const formattedTime = timer.getFormattedTime();


                const fontSize = timerDisplay.height * 0.6;
                ctx.font = `bold ${fontSize}px 'Nunito', non-serif`;
                ctx.fillStyle = this.colors.alertColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const textX = timerDisplay.x + timerDisplay.width / 2;
                const textY = timerDisplay.y + timerDisplay.height / 2;

                ctx.fillText(formattedTime, textX, textY);
            }
        }

    }
}