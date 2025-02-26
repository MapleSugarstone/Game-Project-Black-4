const WINS_THRESHOLD = 10;
const STARTING_GOLD = 11;
const STARTING_LIVES = 5;
const BUY_COST = 3;
const UPGRADE_COST = 5;
const ROLL_COST = 1;
const SELL_PRICE = 1;
class SceneManager {
    constructor() {

        // Game state
        this.lives = STARTING_LIVES;
        this.gold = STARTING_GOLD;
        this.index = 0;
        this.wins = 0;
        this.shopLevel = 1;
        this.currentRound = 1;
        this.activeTeam = [null, null, null, null, null];
        this.enemyTeam = [null, null, null, null, null];
        this.eventQueue = [];
        this.actionQueue = [];
        this.abilityQueue = [];
        this.sortingList = [];
        this.battleAnimationSpeed = 1;
        this.fastToggle = false;
        this.autoToggle = false;
        this.isNextApproved = false;
        

        // Shop state
        this.goldDisplayer = new Display(20, 20, "./UI_Assets/CoinDisplay10.png", 131, 61);
        this.livesDisplayer = new Display(170, 20, "./UI_Assets/HealthDisplay5.png", 131, 61);
        this.winsDisplayer = new Display(320, 20, "./UI_Assets/WinDisplay0.png", 131, 61);
        this.currentRoundDisplayer = new Display(470, 20, "./UI_Assets/TurnDisplay1.png", 131, 61);
        this.shopSlots = [null, null, null];
        this.frozenSlots = [false, false, false];
        this.teamSlots = [null, null, null, null, null];
        this.selectedUnit = null;
        
        // Available monsters in pool
        this.monsterTypes = [
            "./Units/Unit1.png",
            "./Units/Unit2.png",
            "./Units/Unit3.png",
            "./Units/Unit4.png",
            "./Units/Unit5.png",
            "./Units/Unit6.png",
            "./Units/Unit7.png",
            "./Units/Unit8.png",
            "./Units/Unit9.png",
            "./Units/Unit10.png",
        ];

        // Shop coordinates
        this.shopPositions = [
            {x: 280, y: 650},
            {x: 480, y: 650},
            {x: 680, y: 650}
        ];

        // Team positions
        this.teamPositions = [
            {x: 1080, y: 300},
            {x: 880, y: 300},
            {x: 680, y: 300},
            {x: 480, y: 300},
            {x: 280, y: 300}
        ];

        this.battlePositionsPlayer = [
            {x: 750, y: 680},
            {x: 600, y: 680},
            {x: 450, y: 680},
            {x: 300, y: 680},
            {x: 150, y: 680}
        ];
    
        this.battlePositionsEnemy = [
            {x: 1000, y: 680},
            {x: 1150, y: 680},
            {x: 1300, y: 680},
            {x: 1450, y: 680},
            {x: 1600, y: 680}
        ];

        // Dragging state
        this.draggedUnit = null;
        this.dragStartSlot = null;
    }

    update() {
        if (scene === "Shop") {
            this.clearEntities();
            this.setupShop();
            scene = "LoadedShop";
        } else if (scene === "Battle") {
            this.clearEntities();
            this.startBattle();
            scene = "LoadedBattle";
        } else if (scene === "LoadedBattle") {
            this.executeBattle(this.activeTeam, this.enemyTeam);
        } else if (scene === "LoadedShop") {
            // console.log("Gold: " + this.gold);
            // console.log("Lives: " + this.lives);
            // console.log("Wins: " + this.wins);
            // console.log("Current Round: " + this.currentRound);
            this.goldDisplayer.sprite = `./UI_Assets/CoinDisplay${this.gold}.png`;
            this.livesDisplayer.sprite = `./UI_Assets/HealthDisplay${this.lives}.png`;
            this.winsDisplayer.sprite = `./UI_Assets/WinDisplay${this.wins}.png`;
            this.currentRoundDisplayer.sprite = `./UI_Assets/TurnDisplay${this.currentRound}.png`;
        } else if (scene === "End") {
            this.clearEntities();
            this.endGame();
        }

        

        // Handle dragging
        if (gameEngine.click) {
            this.handleClick(gameEngine.click.x, gameEngine.click.y);
        }

        

        if (gameEngine.mouse) {
            this.handleMouseMove(gameEngine.mouse.x, gameEngine.mouse.y);
        }
            

        
    }

    roundWin() {
        this.clearEntities();
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/SolidWhite.png"));
        gameEngine.addEntity(new Display(580, 200, "./UI_Assets/WinRound.png", 800, 150));

        setTimeout(function() {
            gameEngine.addEntity(new Button(760, 900, "./UI_Assets/NextTurnButton1.png", 400, 100, "./UI_Assets/NextTurnButton2.png", () => {
                scene = "Shop";
            }));
          }, 1500);

        gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(1075, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(1185, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(1295, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));
        gameEngine.addEntity(new DisplayStill(1405, 500, "./UI_Assets/WinPlaceHolder.png", 100, 100));

        console.log("Total wins: " + this.wins);

        if (this.wins === 1) {
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 2) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 3) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 4) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 5) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 6) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 7) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(1075, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 8) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1075, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(1185, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } else if (this.wins === 9) {
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1075, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1185, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(1295, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
        } 
    }

    roundLose() {
        this.clearEntities();
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/SolidWhite.png"));
        gameEngine.addEntity(new Display(580, 200, "./UI_Assets/LoseRound.png", 800, 150));

        setTimeout(function() {
            gameEngine.addEntity(new Button(760, 900, "./UI_Assets/NextTurnButton1.png", 400, 100, "./UI_Assets/NextTurnButton2.png", () => {
                scene = "Shop";
            }));
          }, 1500);

        if (this.lives === 4) {
            gameEngine.addEntity(new DisplayStill(424, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(648, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(872, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(1096, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(1320, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            setTimeout(function() {
                gameEngine.entities.pop();
              }, 1000);
        } else if (this.lives === 3) {
            gameEngine.addEntity(new DisplayStill(548, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(772, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(996, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(1220, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            setTimeout(function() {
                gameEngine.entities.pop();
              }, 1000);
        } else if (this.lives === 2) {
            gameEngine.addEntity(new DisplayStill(672, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(896, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(1120, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            setTimeout(function() {
                gameEngine.entities.pop();
              }, 1000);
        } else if (this.lives === 1) {
            gameEngine.addEntity(new DisplayStill(796, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            gameEngine.addEntity(new DisplayStill(1020, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            setTimeout(function() {
                gameEngine.entities.pop();
              }, 1000);
        }
    }

    roundDraw() {
        this.clearEntities();
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/SolidWhite.png"));
        gameEngine.addEntity(new Display(535, 200, "./UI_Assets/DrawRound.png", 850, 150));
        gameEngine.addEntity(new DisplayStill(755, 400, "./UI_Assets/DrawDisplay.png", 400, 400));

        setTimeout(function() {
            gameEngine.addEntity(new Button(760, 900, "./UI_Assets/NextTurnButton1.png", 400, 100, "./UI_Assets/NextTurnButton2.png", () => {
                scene = "Shop";
            }));
          }, 1500);
    }

    endGame() {
        scene = "End Game";
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/SolidWhite.png"));

        gameState.inGame = false;
        setTimeout(function() {
            gameEngine.addEntity(new Button(687, 900, "./UI_Assets/StartButton1.png", 546, 100, "./UI_Assets/StartButton2.png", () => { 
                scene = "Shop";
                gameState.inGame = true;
        }));
          }, 1500);

        if (this.wins >= WINS_THRESHOLD) {
            gameEngine.addEntity(new Display(580, 200, "./UI_Assets/WinRound.png", 800, 150));
            gameEngine.addEntity(new DisplayStill(415, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(525, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(635, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(745, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(855, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(965, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1075, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1185, 500, "./UI_Assets/Win.png", 100, 100));
            gameEngine.addEntity(new DisplayStill(1295, 500, "./UI_Assets/Win.png", 100, 100));
            setTimeout(function() {
                gameEngine.addEntity(new DisplayStill(1405, 500, "./UI_Assets/Win.png", 100, 100));
              }, 1000);
            console.log("You Win!");
            this.lives = STARTING_LIVES;
                this.gold = STARTING_GOLD;
                this.index = 0;
                this.wins = 0;
                this.shopLevel = 1;
                this.currentRound = 1;
                this.frozenSlots = [false, false, false];
                this.teamSlots = [null, null, null, null, null];
                this.selectedUnit = null;
            
        }
        else if (this.lives <= 0) {
            gameEngine.addEntity(new Display(580, 200, "./UI_Assets/LoseRound.png", 800, 150));
            gameEngine.addEntity(new DisplayStill(860, 500, "./UI_Assets/HealthHeart.png", 200, 200));
            setTimeout(function() {
                gameEngine.entities.pop();
              }, 1000);
            console.log("You Lose!");
            this.lives = STARTING_LIVES;
                this.gold = STARTING_GOLD;
                this.index = 0;
                this.wins = 0;
                this.shopLevel = 1;
                this.currentRound = 1;
                this.frozenSlots = [false, false, false];
                this.teamSlots = [null, null, null, null, null];
                this.selectedUnit = null;
        }
        
    }

    setupShop() {
        // Add background
        gameEngine.addEntity(new ShopMenuBackground(gameEngine));

        // Unit platforms
        // Shop positions
        gameEngine.addEntity(new DisplayStill(240, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(440, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(640, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        // Team positions
        gameEngine.addEntity(new DisplayStill(1040, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(840, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(640, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(440, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new DisplayStill(240, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));

        // Add info display
        gameEngine.addEntity(this.goldDisplayer);

        gameEngine.addEntity(this.livesDisplayer);

        gameEngine.addEntity(this.winsDisplayer);

        gameEngine.addEntity(this.currentRoundDisplayer);

        // Add buttons
        gameEngine.addEntity(new Button(60, 920, "./UI_Assets/RollButton1.png", 200, 100, "./UI_Assets/RollButton2.png", () => {
            this.rollShop();
        }));

        gameEngine.addEntity(new Button(680, 920, "./UI_Assets/SellButton1.png", 200, 100, "./UI_Assets/SellButton2.png", () => {
            if (!(gameEngine.SelectedUnitGlobal==null) && this.teamSlots.includes(this.selectedUnit)) {

                this.gold = Math.min(20, this.gold+SELL_PRICE);
                this.index = this.teamSlots.indexOf(this.selectedUnit);
                this.selectedUnit.x = gameEngine.ctx.canvas.width;
                this.selectedUnit.y = gameEngine.ctx.canvas.height;
                this.teamSlots[this.index] = null;
                gameEngine.SelectedUnitGlobal = null;
                this.selectedUnit = null;
            }
        }));

        gameEngine.addEntity(new Button(270, 920, "./UI_Assets/PurchaseButton1.png", 400, 100, "./UI_Assets/PurchaseButton2.png", () => {
            console.log(gameEngine.SelectedUnitGlobal);
            console.log(this.teamSlots.includes(null));
            console.log(this.gold);
            console.log(this.teamSlots);
            console.log(this.selectedUnit);
            // && (!gameEngine.SelectedUnitGlobal == null) && (this.teamSlots.includes(null))
            if (this.gold >= BUY_COST && !(gameEngine.SelectedUnitGlobal==null) && (this.teamSlots.includes(null)) && this.selectedUnit && (this.shopSlots.includes(this.selectedUnit))) {
                this.gold -= BUY_COST;
                this.index = this.teamSlots.indexOf(null);
                this.selectedUnit.isInShop = false;
                this.selectedUnit.moveTo(this.teamPositions[this.index].x, this.teamPositions[this.index].y);
                this.teamSlots[this.index] = this.selectedUnit;
                this.index2 = this.shopSlots.indexOf(this.selectedUnit);
                this.shopSlots[this.index2] = null;
                //this.shopSlots[this.dragStartSlot.index] = null;
                gameEngine.SelectedUnitGlobal = null;
                this.selectedUnit = null;
                //this.updateUnitDisplay();
            }
        }));

        gameEngine.addEntity(new Button(890, 920, "./UI_Assets/UpGradeButton1.png", 400, 100, "./UI_Assets/UpGradeButton2.png", () => {
            console.log(gameEngine.SelectedUnitGlobal);
            console.log(this.teamSlots.includes(null));
            console.log(this.gold);
            console.log(this.teamSlots);
            console.log(this.selectedUnit);
            // && (!gameEngine.SelectedUnitGlobal == null) && (this.teamSlots.includes(null))
            if (this.gold >= UPGRADE_COST && !(gameEngine.SelectedUnitGlobal==null) && this.teamSlots.includes(this.selectedUnit) && this.selectedUnit.level < 4) {
                this.gold -= UPGRADE_COST;
                this.selectedUnit.levelUp();
                gameEngine.SelectedUnitGlobal = null;
                this.selectedUnit = null;
                console.log("Up grade team unit")
            }
        }));

        gameEngine.addEntity(new Button(1460, 920, "./UI_Assets/EndTurnButton1.png", 400, 100, "./UI_Assets/EndTurnButton2.png", () => {
            scene = "Battle";
            gameEngine.SelectedUnitGlobal = null;
            this.selectedUnit = null;
        }));


        for (let i = 0; i < 4; i++) {
        gameEngine.addEntity(new Button(990-200*i, 400, "./UI_Assets/SwapButton1.png", 106, 51, "./UI_Assets/SwapButton2.png", () => {
            this.teamSlots[i]?.moveTo(this.teamPositions[i+1].x, this.teamPositions[i+1].y);
            this.teamSlots[i+1]?.moveTo(this.teamPositions[i].x, this.teamPositions[i].y);
            let temp1 = this.teamSlots[i];
            this.teamSlots[i] = this.teamSlots[i+1];
            this.teamSlots[i+1] = temp1;
        }));
        }

        // Initialize shop if empty
        //if (!this.shopSlots.some(slot => slot !== null)) {
        this.rollShop();
        //}

        // Add existing units to display
        this.updateUnitDisplay();
    }

    rollShop() {
        if (this.gold >= ROLL_COST) {
            this.gold -= ROLL_COST;
            
            for (let i = 0; i < this.shopSlots.length; i++) {
                if (!this.frozenSlots[i]) {
                    const type = this.monsterTypes[Math.floor(Math.random() * this.monsterTypes.length)];
                    const stats = {
                        attack: Math.floor(Math.random() * 2) + 1,
                        health: Math.floor(Math.random() * 2) + 2

                        // God mode for testing, uncomment to use
                        // attack: 50,
                        // health: 50
                    };
                    
                    this.shopSlots[i] = new Unit(
                        this.shopPositions[i].x,
                        this.shopPositions[i].y,
                        type,
                        stats
                    );
                }
            }
            this.updateUnitDisplay();
        }
        console.log(this.gold);
    }

    updateUnitDisplay() {
        // Clear existing units
        gameEngine.entities = gameEngine.entities.filter(entity => !(entity instanceof Unit));

        // Add shop units
        this.shopSlots.forEach((unit, i) => {
            if (unit) {
                gameEngine.addEntity(unit);
            }
        });

        // Add team units
        this.teamSlots.forEach((unit, i) => {
            if (unit) {
                unit.health = unit.maxHealth;
                gameEngine.addEntity(unit);
            }
        });
    }

    handleClick(x, y) {
        // Check shop slots
        for (let i = 0; i < this.shopSlots.length; i++) {
            const unit = this.shopSlots[i];
            if (unit && this.isClickInUnit(x, y, unit)) {
                //this.draggedUnit = unit;
                //this.dragStartSlot = {type: 'shop', index: i};
                if (unit.isInShop && gameEngine.SelectedUnitGlobal != unit.ID) {
                    gameEngine.SelectedUnitGlobal = unit.ID;
                    this.selectedUnit = unit;
                    //this.dragStartSlot.index = null;
                }
 
                //unit.startDrag(x, y);
            }
        }


        // Check team slots
        for (let i = 0; i < this.teamSlots.length; i++) {
            const unit = this.teamSlots[i];
           //if (unit == null) break; add once we implement auto move units to front if empty space available
            if (unit && this.isClickInUnit(x, y, unit)) {
                if (gameEngine.SelectedUnitGlobal != unit.ID) {
                    gameEngine.SelectedUnitGlobal = unit.ID;
                    this.selectedUnit = unit;
                    console.log("Selected team unit");


                    // Idea for having up grade button appear ontop of purchase button, but isn't the best method
                    // gameEngine.addEntity(new Button(410, 900, "./UI_Assets/UpGradeButton1.png", 400, 100, "./UI_Assets/UpGradeButton2.png", () => {
                    //     // && (!gameEngine.SelectedUnitGlobal == null) && (this.teamSlots.includes(null))
                    //     if (this.gold >= UPGRADE_COST && !(gameEngine.SelectedUnitGlobal==null) && this.teamSlots.includes(this.selectedUnit) && this.selectedUnit.level < 4) {
                    //         this.gold -= UPGRADE_COST;
                    //         this.selectedUnit.levelUp();
                    //         gameEngine.SelectedUnitGlobal = null;
                    //         this.selectedUnit = null;
                    //         console.log("Up grade team unit");

                    //         // Timer function used to delay removing the up grade button after 1 second
                    //         setTimeout(function() {
                    //             console.log("timer started");
                    //             gameEngine.entities.pop();
                    //         }, 1000);
                    //     } 
                    // }));



                    //this.dragStartSlot.index = null;
                }
            }
        }
    }



    handleMouseMove(x, y) {
        //if (this.draggedUnit) {
        //    this.draggedUnit.dragTo(x, y);
        //}
            

        // Update hover states
        [...this.shopSlots, ...this.teamSlots].forEach(unit => {
            if (unit) {
                unit.isHovered = this.isClickInUnit(x, y, unit);
                //add ability text bubble
            }
        });
    }
    


    isClickInUnit(x, y, unit) {
        return x >= unit.x && x <= unit.x + unit.width &&
               y >= unit.y && y <= unit.y + unit.height;
    }


    
    findTargetSlot(x, y) {
        // Check team slots
        for (let i = 0; i < this.teamPositions.length; i++) {
            const pos = this.teamPositions[i];
            if (x >= pos.x && x <= pos.x + 128 &&
                y >= pos.y && y <= pos.y + 128) {
                return {type: 'team', index: i};
            }
        }

        // Check shop slots
        for (let i = 0; i < this.shopPositions.length; i++) {
            const pos = this.shopPositions[i];
            if (x >= pos.x && x <= pos.x + 128 &&
                y >= pos.y && y <= pos.y + 128) {
                return {type: 'shop', index: i};
            }
        }
        return null;
    }
        


    startBattle() {
        this.eventQueue = ["SB.N"];
        this.abilityQueue = [];
        this.actionQueue = [];
        
        // Add background
        gameEngine.addEntity(new BattleBackground(gameEngine));
        
        // Generate enemy team
        this.enemyTeam = this.generateEnemyTeam();
        
        // Create a deep copy of team slots for battle
        this.activeTeam = this.teamSlots.filter(unit => unit !== null).map(unit => {
            const battleUnit = new Unit(unit.x, unit.y, unit.sprite, {
                attack: unit.attack,
                health: unit.health,
                maxHealth: unit.maxHealth,
                level: unit.level
            });
            gameEngine.addEntity(battleUnit);
            return battleUnit;
        });

        // Adding abilities to the Ability Queue
        this.activeTeam.forEach((unit, i) => {
            let tempAbility = unit.ability;
            tempAbility.team = 0;
            tempAbility.CID = unit.ID;
            this.abilityQueue.push(unit.ability);
            this.sortingList.push(unit.attack);
        });
        this.enemyTeam.forEach((unit, i) => {
            let tempAbility = unit.ability;
            tempAbility.team = 1;
            tempAbility.CID = unit.ID;
            this.abilityQueue.push(unit.ability);
            this.sortingList.push(unit.attack);
        });
    
        // Position player team
        this.activeTeam.forEach((unit, i) => {
            unit.moveTo(this.battlePositionsPlayer[i].x, this.battlePositionsPlayer[i].y);
        });
    
        // Position enemy team
        this.enemyTeam.forEach((unit, i) => {
            unit.moveTo(this.battlePositionsEnemy[i].x, this.battlePositionsEnemy[i].y);
            unit.facingLeft = true;
            gameEngine.addEntity(unit);
        });
    
        gameEngine.addEntity(this.autoButton = new Button(760, 100, "./UI_Assets/AutoButton1.png", 100, 100, "./UI_Assets/AutoButton2.png", () => {
            this.autoToggle = !this.autoToggle;
            this.isNextApproved = true;
            if(this.autoToggle) {
                this.autoButton.sprite = "./UI_Assets/AutoButtonPressed1.png";
                this.autoButton.hoversprite = "./UI_Assets/AutoButtonPressed2.png";
            } else {
                this.autoButton.sprite = "./UI_Assets/AutoButton1.png";
                this.autoButton.hoversprite = "./UI_Assets/AutoButton2.png";
            }
            this.autoButton.truesprite = this.autoButton.sprite;
        }));
        gameEngine.addEntity(new Button(1060, 100, "./UI_Assets/NextButton1.png", 100, 100, "./UI_Assets/NextButton2.png", () => {
                this.isNextApproved = true;
                //if(this.autoToggle) this.isNextApproved = false; ///put this line on where you want the battle paused
        }));
        gameEngine.addEntity(this.fastButton = new Button(910, 100, "./UI_Assets/FastButton1.png", 100, 100, "./UI_Assets/FastButton2.png", () => {
            this.battleAnimationSpeed = (this.battleAnimationSpeed % 2) + 1;
            this.activeTeam.forEach((unit) => unit.animator.battleAnimationSpeed = (unit.animator.battleAnimationSpeed % 2) + 1);
            this.enemyTeam.forEach((unit) => unit.animator.battleAnimationSpeed = (unit.animator.battleAnimationSpeed % 2) + 1);

            this.fastToggle = !this.fastToggle;
            if(this.fastToggle) {
                this.fastButton.sprite = "./UI_Assets/FastButtonPressed1.png";
                this.fastButton.hoversprite = "./UI_Assets/FastButtonPressed2.png";
            } else {
                this.fastButton.sprite = "./UI_Assets/FastButton1.png";
                this.fastButton.hoversprite = "./UI_Assets/FastButton2.png";
            }
            this.fastButton.truesprite = this.fastButton.sprite;
        }));
        this.battleTimer = gameEngine.timestamp/10000 + 0.1;
        this.ParseEvents();
    }

    generateEnemyTeam() {
        const teamSize = Math.min(Math.max(3, Math.floor(this.currentRound/2) + 1), 5);
        const team = [];
        
        for (let i = 0; i < teamSize; i++) {
            const type = this.monsterTypes[Math.floor(Math.random() * this.monsterTypes.length)];
            const stats = {
                attack: Math.floor(Math.random() * 2), //+ this.currentRound,
                health: Math.floor(Math.random() * 2) //+ this.currentRound + 1
            };
            const unit = new Unit(0, 0, type, stats);
            unit.facingLeft = true;  // Make enemy units face left
            team.push(unit);
        }
        
        return team;
    }
    
    executeBattle(playerTeam, enemyTeam) {
        // Only proceed if both teams have units
        if (playerTeam.length > 0 && enemyTeam.length > 0) {
            // Check if enough time has passed since last battle action
            if (this.battleTimer < (gameEngine.timestamp/10000) * this.battleAnimationSpeed) {
                // First check if there are any queued actions to process
                if (this.actionQueue.length > 0) {
                    let theAction = this.actionQueue.pop();
                    console.log("attempting action " + theAction[0] + theAction[1]);

                    // Placeholder for animation
                    console.log("Animate: " + theAction[6] + " going from " + theAction[5] + " to " + theAction[2]);
                    console.log(theAction[5]);
                    console.log(theAction[2]);


                    // Effect after animation
                    this.affectStat(theAction[0], theAction[1], theAction[2], theAction[3], theAction[4]);
                    // Check for passive ability deaths after applying the action
                    if (theAction[2].health <= 0) {
                        this.killUnit(theAction[2], true);
                    }
                } 
                // Then check if there are any events to parse
                else if (this.eventQueue.length > 0) {
                    console.log("parsing events" + this.eventQueue);
                    this.ParseEvents();
                } 
                // If no queued actions/events, proceed with combat
                else if (this.isNextApproved){   
                    console.log("attempting attack");
                    const playerUnit = playerTeam[0];
                    const enemyUnit = enemyTeam[0];
        
                    // Check if units can start a new attack
                    if (!playerUnit.animator.isAttacking && !enemyUnit.animator.isAttacking) {
                        // Initialize attack animations for both units
                        playerUnit.animator.startAttack();
                        enemyUnit.animator.startAttack();
                    }
        
                    // Get current attack animation progress
                    const attackTime = playerUnit.animator.attackTime;
        
                    // Check if it's time to deal damage (75% through animation)
                    if (!playerUnit.animator.hasDealtDamage && attackTime >= 0.75) {
                        playerUnit.animator.hasDealtDamage = true;
                        enemyUnit.animator.hasDealtDamage = true;
                    }
                    
                    // Check if attack sequence is complete
                    if (attackTime >= 1.0) {
                        if(!this.autoToggle) this.isNextApproved = false;
                        // Reset attack states
                        playerUnit.animator.isAttacking = false;
                        enemyUnit.animator.isAttacking = false;
                        playerUnit.x = playerUnit.animator.attackStartX;
                        enemyUnit.x = enemyUnit.animator.attackStartX;
                        
                        // Set timer for next battle action
                        this.battleTimer = gameEngine.timestamp/10000 + 0.1;
                        
                        // Apply damage to both units
                        this.affectStat("HP", enemyUnit.attack*-1, playerUnit, this.activeTeam, this.battlePositionsPlayer);
                        this.affectStat("HP", playerUnit.attack*-1, enemyUnit, this.enemyTeam, this.battlePositionsEnemy);
                        
                        // Check for combat deaths
                        if (playerUnit.health <= 0) {
                            this.killUnit(playerUnit, false);
                        }
                        if (enemyUnit.health <= 0) {
                            this.killUnit(enemyUnit, false);
                        }
                        
                        // Queue attack events
                        this.eventQueue.unshift("A." + playerUnit.ID);
                        this.eventQueue.unshift("A." + enemyUnit.ID);
                    }
                }
            }
        } 
        // If one team is empty, battle is over
        else {
            //reset battle animation
            this.battleAnimationSpeed = 1;
            this.activeTeam.forEach((unit) => unit.animator.battleAnimationSpeed = 1);
            this.enemyTeam.forEach((unit) => unit.animator.battleAnimationSpeed = 1);
            // Handle victory conditions
            if (playerTeam.length > 0) {
                this.wins++;
                scene = "Win round";
                console.log(scene);
            } else if (enemyTeam.length > 0) {
                this.lives--;
                scene = "Lose round";
            } else if (playerTeam.length === enemyTeam.length) {
                scene = "Draw round";
            }
        
            // Check if game is over or continue to next round
            if (this.wins >= WINS_THRESHOLD || this.lives <= 0) {
                scene = "End";
            } else {
                this.currentRound++;
                this.gold = STARTING_GOLD;
                this.fastToggle = false;
                this.autoToggle = false;
                this.isNextApproved = false;
                if (scene === "Win round") {
                    this.roundWin();
                } else if (scene === "Lose round") {
                    this.roundLose();
                } else if (scene === "Draw round") {
                    this.roundDraw();
                }
                // scene = "Shop";
                // console.log(scene);
            }
        }
    }

    killUnit(unit, isPassiveDeath) {
        // Determine which team and positions to use for unit repositioning
        let tempTeam = null;
        let tempBattlePos = null;
    
        // Check if unit is from player team or enemy team
        if (this.activeTeam.includes(unit)) {
            tempTeam = this.activeTeam;
            tempBattlePos = this.battlePositionsPlayer;
        } else {
            tempTeam = this.enemyTeam;
            tempBattlePos = this.battlePositionsEnemy;
        }
    
        // Add death event to queue for ability triggers
        this.eventQueue.unshift("D." + unit.ID);
    
        if (!isPassiveDeath) {
            // For combat deaths - start the launch animation
            unit.animator.startDeath();
        } else {
            // For passive ability deaths - remove unit immediately
            // Later we'll add smoke puff effect here
            gameEngine.entities = gameEngine.entities.filter(entity => entity !== unit);
        }
        
        // Remove unit from its team array
        const index = tempTeam.indexOf(unit);
        if (index > -1) {
            tempTeam.splice(index, 1);
        }
    
        // Move all remaining units forward to fill the gap
        tempTeam.forEach((unit, index) => {
            unit.moveTo(tempBattlePos[index].x, tempBattlePos[index].y);
        });
    }
    
    checkAndCleanupDeadUnits() {
        // Remove dead units once they go off screen
        gameEngine.entities = gameEngine.entities.filter(entity => {
            if (entity instanceof Unit && entity.animator.isDying) {
                // Keep unit until it goes sufficiently off screen
                return entity.x > -200 && entity.x < gameEngine.ctx.canvas.width + 200 
                    && entity.y > -200 && entity.y < gameEngine.ctx.canvas.height + 200;
            }
            return true;
        });
    }

    clearEntities() {
        gameEngine.entities = [];
    }

    ParseEvents() {
        console.log("Events are being parsed");
        console.log(this.eventQueue);

        while (this.eventQueue.length > 0) {
            this.currentEvent = this.eventQueue.pop();
            let eventInfo = this.currentEvent.split(".");
            for (let i = 0; i < this.abilityQueue.length; i++) {

                //console.log(this.abilityQueue[i]);

                // Checking every ability compared to the event and even triggerer to see if it should be applied
                if (this.abilityQueue[i].triggerCondition == eventInfo[0] &&
                     this.checkTriggerValidity(this.abilityQueue[i].whoTriggers, eventInfo[1], this.abilityQueue[i].team, this.abilityQueue[i].CID)) {
                        this.applyEffect(this.abilityQueue[i], eventInfo[1], this.abilityQueue[i].team, this.abilityQueue[i].CID);
                        //console.log("success");
                } else {
                    //console.log("failure");
                }
            }
        }
    }

    applyEffect(ability, eventTriggerer, team, owner) {
        let abilityInfo = ability.effect.split(".");
        let target = null;
        let theParty = null;
        let theBattlePositions = null;
        let ownerUnit = null;

        [...this.enemyTeam, ...this.activeTeam].forEach(unit => {
            if (unit.ID == owner) {
                ownerUnit = unit;
            }
        });

        if (team == 0) {
            theParty = this.activeTeam;
            theBattlePositions = this.battlePositionsPlayer;
        } else {
            theParty = this.enemyTeam;
            theBattlePositions = this.battlePositionsEnemy;
        }

        if (ability.whoAffected == "I") {
            target = ownerUnit;
        }

        if (ability.whoAffected == "T") {
            [...this.enemyTeam, ...this.activeTeam].forEach(unit => {
                if (unit.ID == eventTriggerer) {
                    target = unit;
                }
            });
        }
        
        
        if (team == 0) {
            if (ability.whoAffected == "RE") {
                target = this.enemyTeam[Math.floor(Math.random() * this.enemyTeam.length)];
            }
            if (ability.whoAffected == "RA") {
                target = this.activeTeam[Math.floor(Math.random() * this.activeTeam.length)];
            }
            if (ability.whoAffected == "FE") {
                target = this.enemyTeam[0];
            }
            if (ability.whoAffected == "FA") {
                target = this.activeTeam[0];
            }
        }

        if (team == 1) {
            if (ability.whoAffected == "RE") {
                target = this.activeTeam[Math.floor(Math.random() * this.activeTeam.length)];
            }
            if (ability.whoAffected == "RA") {
                target = this.enemyTeam[Math.floor(Math.random() * this.enemyTeam.length)];
            }
            if (ability.whoAffected == "FE") {
                target = this.activeTeam[0];
            }
            if (ability.whoAffected == "FA") {
                target = this.enemyTeam[0];
            }
        }

        // After finding the target and stats to be affected, the information is sent to this
        // queue to be processed after every ability is checked for an event.
        this.actionQueue.unshift([abilityInfo[0], abilityInfo[1], target, theParty, theBattlePositions, ownerUnit, ability.visualEffect]);
    }

    affectStat(stat, amount, unit, team, teampos) {
        // Log debug info about stat change
        console.log("affecting stats" + stat + " " + amount + " " + unit);
     
        // Handle HP changes
        if (stat == "HP") {
            // Apply HP change
            unit.health += Number(amount);
            
            // If unit took damage, add hurt event to queue
            if (amount < 0) {
                this.eventQueue.unshift("H." + unit.ID);
            }
        }
     
        // Handle Attack changes 
        if (stat == "AT") {
            // Apply attack change, ensuring it doesn't go below 1
            unit.attack = Math.max(1, unit.attack + Number(amount));
        }
     }

    checkTriggerValidity(whoTriggers, TID, Team, Owner) {

        if (whoTriggers == "N") {
            return true;
        }

        if (whoTriggers == "I") {
            return TID == Owner;
        }

        // Team is ally
        if (Team == 0) {
            if (whoTriggers == "E") {
                return this.teamContainsID(TID, this.enemyTeam);
            }
            if (whoTriggers == "A") {
                return this.teamContainsID(TID, this.activeTeam);
            }
            if (whoTriggers == "AA") {
                let tempIndex = this.indexOfID(TID, this.activeTeam);
                let tempIndex2 = this.indexOfID(Owner, this.activeTeam);
                return tempIndex == tempIndex2-1
            }
        }

      // Team is enemy
        if (Team == 1) {
            if (whoTriggers == "E") {
                return this.teamContainsID(TID, this.activeTeam);
            }
            if (whoTriggers == "A") {
                return this.teamContainsID(TID, this.enemyTeam);
            }
            if (whoTriggers == "AA") {
                let tempIndex = this.indexOfID(TID, this.enemyTeam);
                let tempIndex2 = this.indexOfID(Owner, this.enemyTeam);
                return tempIndex == tempIndex2-1
            }
        }
    }

    teamContainsID(ID, team) {
        team.forEach((unit) => {
            if (unit.ID == ID) {
                return true;
            } 
        });
            return false;
    }

    indexOfID(ID, team) {
        team.forEach((unit, i) => {
            if (unit.ID == ID) {
                return i;
            } 
        });
            return -99;
    }

}

    
