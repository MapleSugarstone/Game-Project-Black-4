class Unit {
	constructor(game, x, y, sprite,) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.sprite = sprite;

	};

	update() {
		

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(this.sprite), this.x, this.y)
	};
}