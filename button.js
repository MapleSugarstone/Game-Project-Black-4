class Button {
	constructor(x, y, sprite, width, height, hoversprite) {

		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.width = width;
		this.height = height;
		this.hoversprite = hoversprite;
		this.truesprite = sprite;

	};


	update() {
		hovering = checkOverlap(gameEngine.mouse?.x, gameEngine.mouse?.y);


	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(this.truesprite), this.x, this.y)
	};

	
	

	checkOverlap(x, y) {
		if ((x > this.x & x < this.x + this.width ) & (y < this.y+this.height & y > this.y)) {
			return true;
		} else {
			return false;
		}
	}
}