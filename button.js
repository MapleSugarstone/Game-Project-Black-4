class Button {
	constructor(x, y, sprite, width, height) {

		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.width = width;
		this.height = height;

	};


	update() {
		//if (gameEngine.mouse.x > this.x) {
		//	this.sprite = "./startButton2.png";
		//	console.log(2);
		//}
		//& (gameEngine.click.y > this.y+this.height & this.y < gameEngine.click.x)) 
		//& gameEngine.mouse.x < this.x + this.width 

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(this.sprite), this.x, this.y)
	};
}