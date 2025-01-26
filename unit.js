class Unit {
	constructor(x, y, sprite,) {
		this.x = x;
		this.y = y;
		this.sprite = sprite;

	};

	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(this.sprite), this.x, this.y);

	};

}