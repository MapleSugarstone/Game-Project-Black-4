class Button {
    constructor(x, y, sprite, width, height, hoversprite, method) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = width;
        this.height = height;
        this.hoversprite = hoversprite;
        this.truesprite = sprite;
        this.hovering = false;
		this.method = method;
    }

    update() {
        this.hovering = this.checkOverlap(gameEngine.mouse?.x, gameEngine.mouse?.y);
        this.truesprite = this.hovering ? this.hoversprite : this.sprite;
		if (this.checkOverlap(gameEngine.click?.x, gameEngine.click?.y) && gameEngine.clickProcessed && this.hovering) {
			gameEngine.clickProcessed = false;
			this.method()
		}
    }

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.truesprite), this.x, this.y);
    }

    checkOverlap(x, y) {
        return (x > this.x && x < this.x + this.width) && 
               (y < this.y + this.height && y > this.y);
    }
}