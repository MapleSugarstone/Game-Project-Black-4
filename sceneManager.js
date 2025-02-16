const WINS_THRESHOLD = 3;
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
            {x: 750, y: 400},
            {x: 600, y: 400},
            {x: 450, y: 400},
            {x: 300, y: 400},
            {x: 150, y: 400}
        ];
    
        this.battlePositionsEnemy = [
            {x: 1000, y: 400},
            {x: 1150, y: 400},
            {x: 1300, y: 400},
            {x: 1450, y: 400},
            {x: 1600, y: 400}
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

    endGame() {
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/Menu.png"));
        console.log("Wins: %d", this.wins);
        console.log("Lives: %d", this.lives);
        if (this.wins >= WINS_THRESHOLD) {
            gameEngine.addEntity(new Display(650, 350, "./UI_Assets/EndTurnButton1.png", 546, 100));
            console.log("You Win!");
        }
        else if (this.lives <= 0) {
            gameEngine.addEntity(new Display(650, 350, "./UI_Assets/EndTurnButton2.png", 546, 100));
            console.log("You Lose!");
        }
        
        gameState.inGame = false;
        gameEngine.addEntity(new Button(650, 700, "./UI_Assets/StartButton1.png", 546, 100, "./UI_Assets/StartButton2.png", () => {
            this.lives = STARTING_LIVES;
            this.gold = STARTING_GOLD;
            this.index = 0;
            this.wins = 0;
            this.shopLevel = 1;
            this.currentRound = 1;
            this.frozenSlots = [false, false, false];
            this.teamSlots = [null, null, null, null, null];
            this.selectedUnit = null;
            scene = "Shop";
            gameState.inGame = true;
    }));
    }
    setupShop() {
        // Add background
        gameEngine.addEntity(new ShopMenuBackground(gameEngine));

        // Unit platforms
        // Shop positions
        gameEngine.addEntity(new Display(240, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(440, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(640, 665, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        // Team positions
        gameEngine.addEntity(new Display(1040, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(840, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(640, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(440, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));
        gameEngine.addEntity(new Display(240, 315, "./UI_Assets/UnitPlatformSnow.png", 200, 200));

        // Add info display
        gameEngine.addEntity(this.goldDisplayer);

        gameEngine.addEntity(this.livesDisplayer);

        gameEngine.addEntity(this.winsDisplayer);

        gameEngine.addEntity(this.currentRoundDisplayer);

        // Add buttons
        gameEngine.addEntity(new Button(200, 900, "./UI_Assets/RollButton1.png", 200, 100, "./UI_Assets/RollButton2.png", () => {
            this.rollShop();
        }));

        gameEngine.addEntity(new Button(820, 900, "./UI_Assets/SellButton1.png", 200, 100, "./UI_Assets/SellButton2.png", () => {
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

        gameEngine.addEntity(new Button(410, 900, "./UI_Assets/PurchaseButton1.png", 400, 100, "./UI_Assets/PurchaseButton2.png", () => {
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
            } else if (this.gold >= BUY_COST && !(gameEngine.SelectedUnitGlobal==null) && (this.teamSlots.includes(null)) && this.selectedUnit && (this.shopSlots.includes(this.selectedUnit))) {
                this.gold -= BUY_COST;
                this.index = this.teamSlots.indexOf(null);
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

        gameEngine.addEntity(new Button(1360, 900, "./UI_Assets/EndTurnButton1.png", 400, 100, "./UI_Assets/EndTurnButton2.png", () => {
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
                    //this.dragStartSlot.index = null;
                }
            }
        }
    }

        /*
        // Handle unit drop
        if (this.draggedUnit) {
            const targetSlot = this.findTargetSlot(x, y);
            if (targetSlot) {
                this.handleUnitDrop(targetSlot);
            } else {
                this.returnUnitToStart();
            }
            this.draggedUnit = null;
        }
    }
        */

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
        

    /*

    handleUnitDrop(targetSlot) {
        if (targetSlot.type === 'team') {
            if (this.dragStartSlot.type === 'shop') {
                // Buying from shop
                if (this.gold >= 3 && !this.teamSlots[targetSlot.index]) {
                    this.gold -= 3;
                    this.teamSlots[targetSlot.index] = this.draggedUnit;
                    this.shopSlots[this.dragStartSlot.index] = null;
                }
            } else {
                // Moving within team
                if (this.teamSlots[targetSlot.index]) {
                    // Combine if same type
                    if (this.teamSlots[targetSlot.index].type === this.draggedUnit.type) {
                        this.teamSlots[targetSlot.index].level++;
                        this.teamSlots[targetSlot.index].attack++;
                        this.teamSlots[targetSlot.index].health++;
                        this.teamSlots[this.dragStartSlot.index] = null;
                    } else {
                        // Swap positions
                        const temp = this.teamSlots[targetSlot.index];
                        this.teamSlots[targetSlot.index] = this.draggedUnit;
                        this.teamSlots[this.dragStartSlot.index] = temp;
                    }
                } else {
                    // Move to empty slot
                    this.teamSlots[targetSlot.index] = this.draggedUnit;
                    this.teamSlots[this.dragStartSlot.index] = null;
                }
            }
        }

        this.updateUnitDisplay();
    }

    returnUnitToStart() {
        if (this.dragStartSlot.type === 'shop') {
            this.draggedUnit.moveTo(
                this.shopPositions[this.dragStartSlot.index].x,
                this.shopPositions[this.dragStartSlot.index].y
            );
        } else {
            this.draggedUnit.moveTo(
                this.teamPositions[this.dragStartSlot.index].x,
                this.teamPositions[this.dragStartSlot.index].y
            );
        }
    }
        */

    startBattle() {
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/BattleScene.png"));
        
        // Generate enemy team
        this.enemyTeam = this.generateEnemyTeam();
        
        // Create a deep copy of team slots for battle
        this.activeTeam = this.teamSlots.filter(unit => unit !== null).map(unit => {
            const battleUnit = new Unit(unit.x, unit.y, unit.sprite, {
                attack: unit.attack,
                health: unit.health,
                level: unit.level
            });
            gameEngine.addEntity(battleUnit);
            return battleUnit;
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
    
        this.addToggleButton(760, 100, "./UI_Assets/AutoButton", 0, 100, 100);
        this.addToggleButton(910, 100, "./UI_Assets/FastButton", 0, 100, 100);
        gameEngine.addEntity(new Button(1060, 100, "./UI_Assets/NextButton1.png", 100, 100, "./UI_Assets/NextButton2.png", () => {
            //next turn
        }));
        this.battleTimer = gameEngine.timestamp/10000 + 0.1;
    }

    addToggleButton(x, y, path, toggle, width, height) {
        if (toggle == 0) {
            gameEngine.addEntity(new Button(x, y, `${path}1.png`, width, height, `${path}2.png`, () => {
                gameEngine.entities = gameEngine.entities.filter((entity) => entity.sprite != `${path}1.png`);
                this.addToggleButton(x, y, path, (toggle + 1) % 2, width, height);
            }));
        } else {
            gameEngine.addEntity(new Button(x, y, `${path}Pressed1.png`, width, height, `${path}Pressed2.png`, () => {
                gameEngine.entities = gameEngine.entities.filter((entity) => entity.sprite != `${path}Pressed1.png`);
                this.addToggleButton(x, y, path, (toggle + 1) % 2, width, height);
            }));
        }
    }

    generateEnemyTeam() {
        const teamSize = Math.min(Math.max(3, Math.floor(this.currentRound/2) + 1), 5);
        const team = [];
        
        for (let i = 0; i < teamSize; i++) {
            const type = this.monsterTypes[Math.floor(Math.random() * this.monsterTypes.length)];
            const stats = {
                attack: Math.floor(Math.random() * 2) + this.currentRound,
                health: Math.floor(Math.random() * 2) + this.currentRound + 1
            };
            const unit = new Unit(0, 0, type, stats);
            unit.facingLeft = true;  // Make enemy units face left
            team.push(unit);
        }
        
        return team;
    }
    
    executeBattle(playerTeam, enemyTeam) {
        if (playerTeam.length > 0 && enemyTeam.length > 0) {
            if (this.battleTimer < gameEngine.timestamp/10000) {
                const playerUnit = playerTeam[0];
                const enemyUnit = enemyTeam[0];
    
                // Start new combat sequence
                if (!playerUnit.isAttacking && !enemyUnit.isAttacking) {
                    playerUnit.isAttacking = true;
                    enemyUnit.isAttacking = true;
                    playerUnit.attackTime = 0;
                    enemyUnit.attackTime = 0;
                    playerUnit.attackStartX = playerUnit.x;
                    enemyUnit.attackStartX = enemyUnit.x;
                    playerUnit.hasDealtDamage = false;
                    enemyUnit.hasDealtDamage = false;
                }
    
                const attackTime = playerUnit.attackTime;
                if (!playerUnit.hasDealtDamage && attackTime >= 0.75) {
                    playerUnit.hasDealtDamage = true;
                    enemyUnit.hasDealtDamage = true;
                    playerUnit.health -= enemyUnit.attack;
                    enemyUnit.health -= playerUnit.attack;
                }
                
                if (attackTime >= 1.0) {
                    playerUnit.isAttacking = false;
                    enemyUnit.isAttacking = false;
                    playerUnit.x = playerUnit.attackStartX;
                    enemyUnit.x = enemyUnit.attackStartX;
                    this.battleTimer = gameEngine.timestamp/10000 + 0.1;
    
                    let playerDied = playerUnit.health <= 0;
                    let enemyDied = enemyUnit.health <= 0;
    
                    if (enemyDied) {
                        gameEngine.entities = gameEngine.entities.filter(entity => entity !== enemyUnit);
                        enemyTeam.shift();
                        enemyTeam.forEach((unit, index) => {
                            unit.moveTo(this.battlePositionsEnemy[index].x, this.battlePositionsEnemy[index].y);
                        });
                    }
    
                    if (playerDied) {
                        gameEngine.entities = gameEngine.entities.filter(entity => entity !== playerUnit);
                        playerTeam.shift();
                        playerTeam.forEach((unit, index) => {
                            unit.moveTo(this.battlePositionsPlayer[index].x, this.battlePositionsPlayer[index].y);
                        });
                    }
                }
            }
        } else {
            if (playerTeam.length > 0) {
                this.wins++;
            } else if (enemyTeam.length > 0) {
                this.lives--;
            }
    
            if (this.wins >= WINS_THRESHOLD || this.lives <= 0) {
                scene = "End";
            } else {
                this.currentRound++;
                this.gold = STARTING_GOLD;
                scene = "Shop";
            }
        }
    }

    clearEntities() {
        gameEngine.entities = [];
    }
}
