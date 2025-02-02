const gameEngine = new GameEngine();
scene = "MainMenu";
const sceneManager = new SceneManager();

const ASSET_MANAGER = new AssetManager();

// Menu Assets
ASSET_MANAGER.queueDownload("./Menu.png");
ASSET_MANAGER.queueDownload("./StartButton1.png");
ASSET_MANAGER.queueDownload("./StartButton2.png");
ASSET_MANAGER.queueDownload("./ShopMenu.png");
ASSET_MANAGER.queueDownload("./BattleScene.png");

// Shop Buttons
ASSET_MANAGER.queueDownload("./RollButton1.png");
ASSET_MANAGER.queueDownload("./RollButton2.png");
ASSET_MANAGER.queueDownload("./EndTurnButton1.png");
ASSET_MANAGER.queueDownload("./EndTurnButton2.png");
ASSET_MANAGER.queueDownload("./PurchaseButton1.png")
ASSET_MANAGER.queueDownload("./PurchaseButton2.png")

// Shop Info Display
ASSET_MANAGER.queueDownload("./CoinDisplay10.png")
ASSET_MANAGER.queueDownload("./CoinDisplay9.png")
ASSET_MANAGER.queueDownload("./CoinDisplay8.png")
ASSET_MANAGER.queueDownload("./CoinDisplay7.png")
ASSET_MANAGER.queueDownload("./CoinDisplay6.png")
ASSET_MANAGER.queueDownload("./CoinDisplay5.png")
ASSET_MANAGER.queueDownload("./CoinDisplay4.png")
ASSET_MANAGER.queueDownload("./CoinDisplay3.png")
ASSET_MANAGER.queueDownload("./CoinDisplay2.png")
ASSET_MANAGER.queueDownload("./CoinDisplay1.png")
ASSET_MANAGER.queueDownload("./CoinDisplay0.png")
ASSET_MANAGER.queueDownload("./HealthDisplay1.png")
ASSET_MANAGER.queueDownload("./WinDisplay1.png")
ASSET_MANAGER.queueDownload("./TurnDisplay1.png")

// Monster Sprites
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

class GameState {
    constructor() {
        this.inGame = false;
        this.paused = false;
        this.gameOver = false;
    }
}

const gameState = new GameState();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false; // Disable image smoothing for pixel art

    // Set canvas size to match window size while maintaining aspect ratio
    function resizeCanvas() {
        const targetAspectRatio = 16/9;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const windowRatio = width / height;

        if (windowRatio > targetAspectRatio) {
            canvas.height = height;
            canvas.width = height * targetAspectRatio;
        } else {
            canvas.width = width;
            canvas.height = width / targetAspectRatio;
        }

        canvas.style.position = 'absolute';
        canvas.style.left = `${(window.innerWidth - canvas.width) / 2}px`;
        canvas.style.top = `${(window.innerHeight - canvas.height) / 2}px`;
    }

    // Initial resize and add event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add UI elements
    gameEngine.addEntity(new Background(0, 0, "./Menu.png"));
    gameEngine.addEntity(new Button(650, 700, "./StartButton1.png", 546, 100, "./StartButton2.png", () => { 
        scene = "Shop";
        gameState.inGame = true;
    }));

    // Stats display
    class StatsDisplay {
        constructor() {
            this.x = 10;
            this.y = 30;
        }

        update() {}

        draw(ctx) {
            if (gameState.inGame) {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.font = '24px Arial';

                // Draw stats with outline
                const stats = [
                    `Lives: ${sceneManager.lives}`,
                    `Gold: ${sceneManager.gold}`,
                    `Wins: ${sceneManager.wins}`,
                    `Round: ${sceneManager.currentRound}`
                ];

                stats.forEach((stat, i) => {
                    ctx.strokeText(stat, this.x, this.y + (i * 30));
                    ctx.fillText(stat, this.x, this.y + (i * 30));
                });
            }
        }
    }

    gameEngine.addEntity(new StatsDisplay());

    // Initialize game
    gameEngine.init(ctx);
    gameEngine.start();
});

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        gameState.paused = !gameState.paused;
    }
});

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});