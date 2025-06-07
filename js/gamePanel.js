export class GamePanel {
    constructor(colors) {
        this.colors = colors;

        this.panelRect = { x: 0, y: 0, width: 0, height: 0 };

        this.timeDisplayArea = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.gameTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.alimentsListTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.tableRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };

        // this.answerOptionRects = [];
    }

    resize(canvasWidth, canvasHeight, footer) {
        // --- Painel Principal ---
        const minPanelWidth = 450;
        const minPanelHeight = 450;

        console.log("entering resize")

        if(!footer.height) return;


        this.panelRect.width = Math.max(minPanelWidth, canvasWidth);
        this.panelRect.height = Math.max(minPanelHeight, canvasHeight) - footer.footerArea.height;
        this.panelRect.x = canvasWidth - this.panelRect.width;
        this.panelRect.y = canvasHeight - this.panelRect.height;

        console.log("values after adding footer to panel = ", JSON.parse(JSON.stringify(this.panelRect)));


        const padding = this.panelRect.width * 0.05;

        this.gameTextRect = {
            x: this.panelRect.x + padding,
            y: this.panelRect.y + padding,
            width: this.panelRect.width - this.timeDisplayArea.width - (padding * 2),
            height: this.panelRect.height * 0.1,
            cornerRadius : 15,
        };


        this.timeDisplayArea = {
            ...this.timeDisplayArea,
            width: this.panelRect.width * 0.3 - padding,
            height: this.gameTextRect.height,
            x: this.panelRect.x + this.gameTextRect - padding,
        };

        // Área da lista de alimentos a serem encontrados na mesa (Abaixo do display de tempo)
        const alimentsListTextRectY = this.gameTextRect.y + this.gameTextRect.height + padding;
        this.alimentsListTextRect = {
            x: this.timeDisplayArea.x + padding,
            y: alimentsListTextRectY,
            width: this.timeDisplayArea.width,
            height: this.panelRect.height - this.gameTextRect - padding,
            cornerRadius : 15,
        };

        const tableRectY = this.gameTextRect.y + this.gameTextRect.height + padding;
        this.tableRect = {
            x: this.gameTextRect.x + padding,
            y: tableRectY,
            width: this.gameTextRect.width,
            height: this.panelRect.height - this.gameTextRect - padding,
            cornerRadius : 15,
        };



        // this.answerOptionRects = [];
        // for (let i = 0; i < 3; i++) {
        //     this.answerOptionRects.push({
        //         x: this.panelRect.x + padding,
        //         y: answerOptionStartY + i * (answerOptionHeight + gapBetweenAnswers),
        //         width: answerOptionWidth,
        //         height: answerOptionHeight,
        //         cornerRadius: 15
        //     });
        // }

    }

    draw(ctx) {
        if (!this.panelRect.width) return;
        console.log("tem panelRect:", JSON.parse(JSON.stringify(this.panelRect)));

        ctx.save();

        console.log("drawing panel rect")

        ctx.shadowColor = this.colors.highlight1;
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.colors.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(this.panelRect.x, this.panelRect.y, this.panelRect.width, this.panelRect.height);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        console.log("draw ok panel rect")

        // --- Desenha placeholders para as áreas internas com bordas arredondadas ---

        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 2;

        // Placeholder para game text area
        ctx.beginPath();
        ctx.roundRect(this.gameTextRect.x, this.gameTextRect.y, this.gameTextRect.width, this.gameTextRect.height,
            this.gameTextRect.cornerRadius);
        ctx.stroke();

        // Placeholder para timeDisplayArea
        ctx.beginPath();
        ctx.roundRect(this.timeDisplayArea.x, this.timeDisplayArea.y, this.timeDisplayArea.width,
            this.timeDisplayArea.height, this.timeDisplayArea.cornerRadius);
        ctx.stroke();

        // Placeholder para aliments list
        ctx.beginPath();
        ctx.roundRect(this.alimentsListTextRect.x, this.alimentsListTextRect.y, this.alimentsListTextRect.width,
            this.alimentsListTextRect.height, this.alimentsListTextRect.cornerRadius);
        ctx.stroke();

        ctx.beginPath();
        ctx.roundRect(this.tableRect.x, this.tableRect.y, this.tableRect.width,
            this.tableRect.height, this.tableRect.cornerRadius);
        ctx.stroke();



        // // Placeholders para AnswerOptionRects
        // this.answerOptionRects.forEach(rect => {
        //     ctx.beginPath();
        //     ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.cornerRadius);
        //     ctx.stroke();
        // });
    }
}