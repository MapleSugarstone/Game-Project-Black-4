const gameEngine = new GameEngine();
scene = "mainMenu";

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./testUnit.png")
ASSET_MANAGER.queueDownload("./Menu.png")
ASSET_MANAGER.queueDownload("./startButton.png")
ASSET_MANAGER.queueDownload("./startButton2.png")
ASSET_MANAGER.queueDownload("./ShopMenu.png")


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.addEntity(new Button(650, 700, "./startButton.png", 672, 131, "./startButton2.png", () => { 
		scene = "Shop";
		console.log("Changed Scene to Shop");
	}));
	gameEngine.addEntity(new Background(0, 0, "./Menu.png"));

	gameEngine.addEntity(new SceneManager());

	//gameEngine.addEntity(new Unit(gameEngine, 0, 0, "./testUnit.png"))

	gameEngine.init(ctx);

	gameEngine.start();
});


