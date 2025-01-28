class SceneManager {
    constructor() {
        this.lives = 10;
        this.gold = 10;
        this.wins = 0;
        this.shopLevel = 1;
        this.currentRound = 1;
        this.number = 0;
        this.one = "";
        this.two = "";
        this.three = "";
        this.four = "";
        this.five = "";
        this.six = "";
        this.seven = "";
        this.eight = "";
        this.nine = "";
        this.ten = "";
    }

    update() {
        // if (scene == "MainMenu") {
        //     gameEngine.addEntity(new Button(650, 700, "./startButton.png", 672, 131, "./startButton2.png", () => { 
        //         scene = "Shop";
        //         console.log("Changed Scene to Shop");
        //         console.log(scene);
        //     }));
        //     gameEngine.addEntity(new Background(0, 0, "./Menu.png"));
            
        // }

        if (scene == "Shop") {
            this.clearEntities();
            this.getMonster();

            // Roll Button, still needs functionality
            gameEngine.addEntity(new Button(200, 850, "./RollButton1.png", 200, 100, "./RollButton2.png", () => { 
                // this.getMonster();
                console.log("roll");
            }));

            // End Turn Button, still needs functionality, next scene wont load
            gameEngine.addEntity(new Button(1360, 850, "./EndTurnButton1.png", 400, 100, "./EndTurnButton2.png", () => { 
                scene = "Battle";
                console.log("end turn");
                console.log(scene);
            }));

            gameEngine.addEntity(new Background(0, 0, "./ShopMenu.png"));
            // scene == "LoadedShop";

        } else if (scene == "Battle") {
            this.clearEntities();
            gameEngine.addEntity(new Background(0, 0, "./BattleScene.png"));

        }
        
    }

    draw(ctx) {
        
    }

    clearEntities() {
        gameEngine.entities = [];
    }

    // Chooses a monster based off a random number that is selected
    randomMonster(min, max) {
		this.number = Math.floor(Math.random() * max) + min;
		if (this.number == 1) {
            this.one = "./Chewy.png";
			return this.one;
		} else if (this.number == 2) {
            this.two = "./Chopper.png";
			return this.two;
		} else if (this.number == 3) {
            this.three = "./Cthulhu.png";
			return this.three;
		} else if (this.number == 4) {
            this.four = "./Ghost.png";
			return this.four;
		} else if (this.number == 5) {
            this.five = "./Goldie.png";
			return this.five;
		} else if (this.number == 6) {
            this.six = "./Pinky.png";
			return this.six;
		} else if (this.number == 7) {
            this.seven = "./Puffer.png";
			return this.seven;
		} else if (this.number == 8) {
            this.eight = "./Slug.png";
			return this.eight;
		} else if (this.number == 9) {
            this.nine = "./Spider.png";
			return this.nine;
		} else if (this.number == 10) {
            this.ten = "./Stink.png";
			return this.ten;
		}
	}

    // Selects three monsters at random for the shop menu selection
    getMonster() {
        // this.clearEntities();
        gameEngine.addEntity(new Unit(280, 500, this.randomMonster(1, 10)));
        gameEngine.addEntity(new Unit(480, 500, this.randomMonster(1, 10)));
        gameEngine.addEntity(new Unit(680, 500, this.randomMonster(1, 10)));
    }

}