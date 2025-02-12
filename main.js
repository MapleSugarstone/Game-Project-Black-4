const gameEngine = new GameEngine();
scene = "MainMenu";

const sceneManager = new SceneManager();

const ASSET_MANAGER = new AssetManager();

// Menu Assets
ASSET_MANAGER.queueDownload("./Backgrounds/Menu.png");
ASSET_MANAGER.queueDownload("./Backgrounds/MainMenuSnowing.png");
ASSET_MANAGER.queueDownload("./UI_Assets/StartButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/StartButton2.png");

// Shop Buttons
ASSET_MANAGER.queueDownload("./UI_Assets/RollButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/RollButton2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/EndTurnButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/EndTurnButton2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/PurchaseButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/PurchaseButton2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/SellButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/SellButton2.png");

// Shop Info Display
ASSET_MANAGER.queueDownload("./Backgrounds/ShopMenu.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay20.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay19.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay18.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay17.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay16.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay15.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay14.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay13.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay12.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay11.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay10.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay9.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay8.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay7.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay6.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay5.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay4.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay3.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/CoinDisplay0.png");
ASSET_MANAGER.queueDownload("./UI_Assets/HealthDisplay5.png");
ASSET_MANAGER.queueDownload("./UI_Assets/HealthDisplay4.png");
ASSET_MANAGER.queueDownload("./UI_Assets/HealthDisplay3.png");
ASSET_MANAGER.queueDownload("./UI_Assets/HealthDisplay2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/HealthDisplay1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay10.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay9.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay8.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay7.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay6.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay5.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay4.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay3.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/WinDisplay0.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay20.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay19.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay18.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay17.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay16.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay15.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay14.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay13.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay12.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay11.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay10.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay9.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay8.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay7.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay6.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay5.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay4.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay3.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/TurnDisplay1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/Swap.png");
ASSET_MANAGER.queueDownload("./UI_Assets/Swap2.png");

// Battle Scene
ASSET_MANAGER.queueDownload("./Backgrounds/BattleScene.png");
ASSET_MANAGER.queueDownload("./UI_Assets/AutoButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/AutoButton2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/FastButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/FastButton2.png");
ASSET_MANAGER.queueDownload("./UI_Assets/NextButton1.png");
ASSET_MANAGER.queueDownload("./UI_Assets/NextButton2.png");

// Monster Sprites
ASSET_MANAGER.queueDownload("./UI_Assets/Select.png");
ASSET_MANAGER.queueDownload("./Units/Unit1.png");
ASSET_MANAGER.queueDownload("./Units/Unit2.png");
ASSET_MANAGER.queueDownload("./Units/Unit3.png");
ASSET_MANAGER.queueDownload("./Units/Unit4.png");
ASSET_MANAGER.queueDownload("./Units/Unit5.png");
ASSET_MANAGER.queueDownload("./Units/Unit6.png");
ASSET_MANAGER.queueDownload("./Units/Unit7.png");
ASSET_MANAGER.queueDownload("./Units/Unit8.png");
ASSET_MANAGER.queueDownload("./Units/Unit9.png");
ASSET_MANAGER.queueDownload("./Units/Unit10.png");
ASSET_MANAGER.queueDownload("./Units/Chewy.png");
ASSET_MANAGER.queueDownload("./Units/Chopper.png");
ASSET_MANAGER.queueDownload("./Units/Cthulhu.png");
ASSET_MANAGER.queueDownload("./Units/Ghost.png");
ASSET_MANAGER.queueDownload("./Units/Goldie.png");
ASSET_MANAGER.queueDownload("./Units/Pinky.png");
ASSET_MANAGER.queueDownload("./Units/Puffer.png");
ASSET_MANAGER.queueDownload("./Units/Slug.png");
ASSET_MANAGER.queueDownload("./Units/Spider.png");
ASSET_MANAGER.queueDownload("./Units/Stink.png");

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
    /* 
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
*/
    // Add UI elements
    // gameEngine.addEntity(new Background(0, 0, "./Backgrounds/Menu.png"));
    gameEngine.addEntity(new MainMenuBackground(gameEngine));
    gameEngine.addEntity(new Button(650, 700, "./UI_Assets/StartButton1.png", 546, 100, "./UI_Assets/StartButton2.png", () => { 
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