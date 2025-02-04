const WINS_THRESHOLD = 3;
const STARTING_GOLD = 11;
const STARTING_LIVES = 5;
class SceneManager {
    constructor() {

        // Game state
        this.lives = STARTING_LIVES;
        this.gold = STARTING_GOLD;
        this.index = 0;
        this.wins = 0;
        this.shopLevel = 1;
        this.currentRound = 1;
        

        // Shop state
        this.goldDisplayer = new Display(20, 20, "./UI_Assets/CoinDisplay10.png", 121, 61);
        this.shopSlots = [null, null, null];
        this.frozenSlots = [false, false, false];
        this.teamSlots = [null, null, null, null, null];
        this.rerollCost = 1;
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
            {x: 280, y: 670},
            {x: 480, y: 670},
            {x: 680, y: 670}
        ];

        // Team positions
        this.teamPositions = [
            {x: 280, y: 300},
            {x: 480, y: 300},
            {x: 680, y: 300},
            {x: 880, y: 300},
            {x: 1080, y: 300}
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
        } else if (scene === "LoadedShop") {
            this.goldDisplayer.sprite = `./UI_Assets/CoinDisplay${this.gold}.png`;
        } else if (scene === "End") {
            this.clearEntities();
            this.endGame();
        }

        

        // Handle dragging
        if (gameEngine.click) {
            console.log("checking for clicks");
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
        gameEngine.addEntity(new Background(0, 0, "./Backgrounds/ShopMenu.png"));
        gameEngine.addEntity(this.goldDisplayer);

        // Add info display
        

        gameEngine.addEntity(new Display(170, 20, "./UI_Assets/HealthDisplay1.png", 121, 61));

        gameEngine.addEntity(new Display(320, 20, "./UI_Assets/WinDisplay1.png", 121, 61));

        gameEngine.addEntity(new Display(470, 20, "./UI_Assets/TurnDisplay1.png", 121, 61));

        // Add buttons
        gameEngine.addEntity(new Button(200, 850, "./UI_Assets/RollButton1.png", 200, 100, "./UI_Assets/RollButton2.png", () => {
            this.rollShop();
        }));

        gameEngine.addEntity(new Button(410, 850, "./UI_Assets/PurchaseButton1.png", 400, 100, "./UI_Assets/PurchaseButton2.png", () => {
            console.log(gameEngine.SelectedUnitGlobal);
            console.log(this.teamSlots.includes(null));
            console.log(this.gold);
            console.log(this.teamSlots);
            // && (!gameEngine.SelectedUnitGlobal == null) && (this.teamSlots.includes(null))
            if (this.gold > 2 && !(gameEngine.SelectedUnitGlobal==null) && (this.teamSlots.includes(null))) {
                this.gold -= 3;
                this.index = this.teamSlots.indexOf(null);
                this.teamSlots[this.index] = this.selectedUnit;
                this.selectedUnit.moveTo(this.teamPositions[this.index].x, this.teamPositions[this.index].y);
                //this.shopSlots[this.dragStartSlot.index] = null;
                gameEngine.SelectedUnitGlobal = null;
                this.selectedUnit = null;
                //this.updateUnitDisplay();
            }
        }));

        gameEngine.addEntity(new Button(1360, 850, "./UI_Assets/EndTurnButton1.png", 400, 100, "./UI_Assets/EndTurnButton2.png", () => {
            scene = "Battle";
        }));

        // Initialize shop if empty
        //if (!this.shopSlots.some(slot => slot !== null)) {
        this.rollShop();
        //}

        // Add existing units to display
        this.updateUnitDisplay();
    }

    rollShop() {
        if (this.gold >= this.rerollCost) {
            this.gold -= this.rerollCost;
            
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
                console.log("clicked");
                if (unit.isInShop) {
                    gameEngine.SelectedUnitGlobal = unit.ID;
                    this.selectedUnit = unit;
                    //this.dragStartSlot.index = null;
                    console.log("clicked unit");
                }
                
                //unit.startDrag(x, y);
            }
        }
    
    

        // Check team slots
        for (let i = 0; i < this.teamSlots.length; i++) {
            const unit = this.teamSlots[i];
            if (unit && this.isClickInUnit(x, y, unit)) {
                this.draggedUnit = unit;
                this.dragStartSlot = {type: 'team', index: i};
                unit.startDrag(x, y);
                return;
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

    handleMouseMove(x, y, clickX, clickY) {
        //if (this.draggedUnit) {
        //    this.draggedUnit.dragTo(x, y);
        //}
            

        // Update hover states
        [...this.shopSlots, ...this.teamSlots].forEach(unit => {
            if (unit) {
                unit.isHovered = this.isClickInUnit(x, y, unit);
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
        const enemyTeam = this.generateEnemyTeam();
        
        // Position player team on left
        const activeTeam = this.teamSlots.filter(unit => unit !== null);
        activeTeam.forEach((unit, i) => {
            unit.moveTo(200 + (i * 150), 400);
            gameEngine.addEntity(unit);
        });

        // Position enemy team on right
        enemyTeam.forEach((unit, i) => {
            unit.moveTo(1000 + (i * 150), 400);
            gameEngine.addEntity(unit);
        });

        // Start battle sequence
        setTimeout(() => this.executeBattle(activeTeam, enemyTeam), 1000);
    }

    generateEnemyTeam() {
        const teamSize = Math.min(Math.floor(this.currentRound/2) + 1, 5);
        const team = [];
        
        for (let i = 0; i < teamSize; i++) {
            const type = this.monsterTypes[Math.floor(Math.random() * this.monsterTypes.length)];
            const stats = {
                attack: Math.floor(Math.random() * 2) + this.currentRound,
                health: Math.floor(Math.random() * 2) + this.currentRound + 1
            };
            team.push(new Unit(0, 0, type, stats));
        }
        
        return team;
    }

    executeBattle(playerTeam, enemyTeam) {
        while (playerTeam.length > 0 && enemyTeam.length > 0) {
            
            // Animate here?
            // playerTeam[0].attack(enemyTeam[0]);
            // enemyTeam[0].attack(playerTeam[0]);
            playerTeam[0].health -= enemyTeam[0].attack;
            console.log("Player Unit HP: %d", playerTeam[0].health);
            enemyTeam[0].health -= playerTeam[0].attack;
            console.log("Enemy Unit HP: %d", enemyTeam[0].health);
            
            if (playerTeam[0].health <= 0) {
                playerTeam.shift();
                console.log("Player unit died!");
            }
            if (enemyTeam[0].health <= 0) {
                enemyTeam.shift();
                console.log("Enemy unit killed!");
            }
        }

            if (playerTeam.length > 0) {
                this.wins++;
                console.log("Wins: %d", this.wins);
            } else if (enemyTeam.length > 0){
                this.lives--;
                console.log("Lives: %d", this.lives);
            }

            if (this.wins >= WINS_THRESHOLD || this.lives <= 0){
                scene = "End";
            } else {
                this.currentRound++;
                this.gold = STARTING_GOLD;
                scene = "Shop";
            }
            
        }


    clearEntities() {
        gameEngine.entities = [];
    }
}