class Button {
	constructor(x, y, sprite, width, height) {

		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.width = width;
		this.height = height;

	};


	update() {
		if ((gameEngine.mouse?.x > this.x & gameEngine.mouse?.x < this.x + this.width ) & (gameEngine.mouse?.y < this.y+this.height & gameEngine.mouse?.y > this.y)) {
			this.sprite = "./startButton2.png";
			console.log(2);
			
		} else {
			this.sprite = "./startButton.png";
		}


	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(this.sprite), this.x, this.y)
	};
}