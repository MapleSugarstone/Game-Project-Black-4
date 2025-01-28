const gameEngine = new GameEngine();
scene = "MainMenu";

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./testUnit.png")
ASSET_MANAGER.queueDownload("./Menu.png")
ASSET_MANAGER.queueDownload("./startButton.png")
ASSET_MANAGER.queueDownload("./startButton2.png")
ASSET_MANAGER.queueDownload("./ShopMenu.png")

// Monster Sprite Images
ASSET_MANAGER.queueDownload("./Chewy.png");
ASSET_MANAGER.queueDownload("./Chopper.png");
ASSET_MANAGER.queueDownload("./Cthulhu.png");
ASSET_MANAGER.queueDownload("./Ghost.png");
ASSET_MANAGER.queueDownload("./Goldie.png");
ASSET_MANAGER.queueDownload("./Pinky.png");
ASSET_MANAGER.queueDownload("./Puffer.png");
ASSET_MANAGER.queueDownload("./Slug.png");
ASSET_MANAGER.queueDownload("./Spider.png");
ASSET_MANAGER.queueDownload("./Stink.png");

// Shop Menu Buttons
ASSET_MANAGER.queueDownload("./RollButton1.png");
ASSET_MANAGER.queueDownload("./RollButton2.png");
ASSET_MANAGER.queueDownload("./EndTurnButton1.png");
ASSET_MANAGER.queueDownload("./EndTurnButton2.png");

// Battle Scene
ASSET_MANAGER.queueDownload("./BattleScene.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.addEntity(new Button(650, 700, "./startButton.png", 672, 131, "./startButton2.png", () => { 
		scene = "Shop";
		console.log("Changed Scene to Shop");
		console.log(scene);
	}));
	gameEngine.addEntity(new Background(0, 0, "./Menu.png"));

	gameEngine.addEntity(new SceneManager());

	//gameEngine.addEntity(new Unit(gameEngine, 0, 0, "./testUnit.png"))

	gameEngine.init(ctx);
	gameEngine.sceneManager = new SceneManager();
	gameEngine.start();
});


