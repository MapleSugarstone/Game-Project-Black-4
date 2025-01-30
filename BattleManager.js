class BattleManager {
    constructor() {
        this.playerTeam = [];
        this.enemyTeam = [];
        this.currentPhase = 'start'; // start, battle, end
        this.turnDelay = 1000; // 1 second between turns
        this.battleLog = [];
        this.currentAnimation = null;
        this.battleOver = false;
    }

    initializeBattle(playerTeam, enemyTeam) {
        this.playerTeam = playerTeam.filter(unit => unit !== null);
        this.enemyTeam = enemyTeam.filter(unit => unit !== null);
        this.currentPhase = 'start';
        this.battleLog = [];
        this.battleOver = false;

        // Position teams
        this.positionTeams();
    }

    positionTeams() {
        // Position player team on left side
        this.playerTeam.forEach((unit, index) => {
            unit.moveTo(200 + (index * 150), 400);
        });

        // Position enemy team on right side
        this.enemyTeam.forEach((unit, index) => {
            unit.moveTo(1000 + (index * 150), 400);
        });
    }

    async executeBattle() {
        this.currentPhase = 'battle';

        while (!this.battleOver && this.playerTeam.length > 0 && this.enemyTeam.length > 0) {
            await this.executeTurn();
        }

        this.currentPhase = 'end';
        this.determineBattleResults();
    }

    async executeTurn() {
        return new Promise(resolve => {
            // Front units attack each other
            const playerUnit = this.playerTeam[0];
            const enemyUnit = this.enemyTeam[0];

            // Player unit attacks
            setTimeout(() => {
                if (playerUnit && enemyUnit) {
                    this.performAttack(playerUnit, enemyUnit);
                }
            }, 0);

            // Enemy unit attacks
            setTimeout(() => {
                if (playerUnit && enemyUnit) {
                    this.performAttack(enemyUnit, playerUnit);
                }
            }, this.turnDelay / 2);

            // Check for defeated units and cleanup
            setTimeout(() => {
                this.cleanupDefeatedUnits();
                resolve();
            }, this.turnDelay);
        });
    }

    performAttack(attacker, defender) {
        // Calculate damage
        const damage = attacker.attack;
        defender.health -= damage;

        // Trigger attack animation
        attacker.attack(defender);

        // Log the attack
        this.battleLog.push({
            attacker: attacker.type,
            defender: defender.type,
            damage: damage,
            remainingHealth: defender.health
        });

        // Trigger abilities if they exist
        if (attacker.ability && attacker.ability.trigger === 'onAttack') {
            attacker.ability.effect(defender);
        }
    }

    cleanupDefeatedUnits() {
        // Remove defeated units from player team
        for (let i = this.playerTeam.length - 1; i >= 0; i--) {
            if (this.playerTeam[i].health <= 0) {
                const defeatedUnit = this.playerTeam[i];
                // Trigger death abilities if they exist
                if (defeatedUnit.ability && defeatedUnit.ability.trigger === 'onDeath') {
                    defeatedUnit.ability.effect(this.playerTeam);
                }
                this.playerTeam.splice(i, 1);
            }
        }

        // Remove defeated units from enemy team
        for (let i = this.enemyTeam.length - 1; i >= 0; i--) {
            if (this.enemyTeam[i].health <= 0) {
                const defeatedUnit = this.enemyTeam[i];
                // Trigger death abilities if they exist
                if (defeatedUnit.ability && defeatedUnit.ability.trigger === 'onDeath') {
                    defeatedUnit.ability.effect(this.enemyTeam);
                }
                this.enemyTeam.splice(i, 1);
            }
        }

        // Check if battle is over
        if (this.playerTeam.length === 0 || this.enemyTeam.length === 0) {
            this.battleOver = true;
        }
    }

    determineBattleResults() {
        const result = {
            winner: this.playerTeam.length > 0 ? 'player' : 'enemy',
            remainingUnits: this.playerTeam.length > 0 ? this.playerTeam : this.enemyTeam,
            log: this.battleLog
        };

        return result;
    }

    update() {
        // Update all units in battle
        [...this.playerTeam, ...this.enemyTeam].forEach(unit => {
            unit.update();
        });
    }

    draw(ctx) {
        // Draw battle scene elements
        [...this.playerTeam, ...this.enemyTeam].forEach(unit => {
            unit.draw(ctx);
        });

        // Draw battle log if in debug mode
        if (PARAMS.DEBUG) {
            this.drawBattleLog(ctx);
        }
    }

    drawBattleLog(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        this.battleLog.slice(-5).forEach((log, index) => {
            ctx.fillText(
                `${log.attacker} hit ${log.defender} for ${log.damage} damage`,
                10,
                500 + (index * 20)
            );
        });
    }
}