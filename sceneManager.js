class SceneManager {
    constructor() {
        this.lives = 10;
        this.gold = 10;
        this.wins = 0;
        this.shopLevel = 1;
        this.currentRound = 1;
    }

    update() {
        if (scene == "Shop") {
            this.clearEntities();
            gameEngine.addEntity(new Background(0, 0, "./ShopMenu.png"));
            scene == "LoadedShop"
        }
        
    }

    draw(ctx) {

    }

    clearEntities() {
        gameEngine.entities = [];
    }

}