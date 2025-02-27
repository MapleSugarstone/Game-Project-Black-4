// unit.js
const MAX_LEVEL = 4;
class Unit {
    constructor(x, y, sprite, stats = {}) {
        this.newName();
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 128; // Display at half size (256/2)
        this.height = 128;
        
        // Stats
        this.attack = stats.attack || 2;
        this.health = stats.health || 2;
        this.maxHealth = this.health;
        this.maxHealth = stats.maxHealth || this.health;
        this.level = stats.level || 1;
        this.type = sprite; // Use sprite path as type identifier
        this.cost = 3; // Standard cost for units
        this.animator = new UnitAnimator(this);
        this.Selected = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        // This will allow a unit to be purchased, and be randomized when rerolling
        this.isInShop = true;

        this.facingLeft = false;  // By default units face right
        
        // Visual effects
        this.isHovered = false;
        this.attackAnim = 0;
        this.hitAnim = 0;
        
        // Ability
        this.getAbility(sprite);
    }

    getAbility(sprite) {
        switch (sprite) {
            case "./Units/Unit1.png":
                this.ability = new Passive("H", "I", "RA", "HP.1", false, "BuffAlly", "Heal a random ally's HP by 1 when hurt.");
                break;
            case "./Units/Unit2.png":
                this.ability = new Passive("SB", "N", "RE", "HP.-2", false, "Ice", "Deal 2 damage to random enemy at the start of the battle.");
                break;
            case "./Units/Unit3.png":
                this.ability = new Passive("A", "I", "RE", "AT.-1", false, "Fire", "Deal 1 damage to a random enemy after attacking.");
                break;
            case "./Units/Unit4.png":
                this.ability = new Passive("A", "AA", "I", "AT.1", false, "BuffAlly", "When the ally ahead attacks, increase attack by 1.");
                break;
            case "./Units/Unit5.png":
                this.ability = new Passive("D", "I", "FE", "HP.-1", true, "Magic", "When this unit dies, it deals 1 damage to the enemy in front.");
                break;
            case "./Units/Unit6.png":
                this.ability = new Passive("H", "EE", "T", "AT.-1", false, "Poison", "Whenever an enemy is hurt, reduce their attack by 1.");
                break;
            default:
                this.ability = new Passive("N", "N", "N", "N", false, "N", "This unit has no passive.");
        }
    }

    levelUp() {
        if (this.level < MAX_LEVEL) {
            this.level++;
            this.attack++;
            this.health++;
            this.maxHealth++;
        }
    }

    update() {
        this.animator.update(gameEngine.clockTick);
        this.Selected = gameEngine.SelectedUnitGlobal == this.ID;
    }

    draw(ctx) {
        // Get current animation state (position, rotation, scale)
        const animState = this.animator.getDrawPosition();
        
        ctx.save();
        
        // Calculate center point for transformations
        const centerX = animState.x + this.width/2;
        const centerY = animState.y + this.height/2;
        
        // Apply transformations around center point
        ctx.translate(centerX, centerY);
        ctx.rotate(animState.rotation * Math.PI/180);
        ctx.scale(animState.scale, animState.scale);
        
        // Flip sprite if facing left
        if (this.facingLeft) {
            ctx.scale(-1, 1);
        }
        
        // Move back to top-left for drawing
        ctx.translate(-this.width/2, -this.height/2);
        
        // Draw the unit sprite
        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.sprite),
            0,
            0,
            this.width,
            this.height
        );
        
        ctx.restore();
    
        // Draw stats (not affected by transformations)
        this.drawStats(ctx, 32, 16);

        if (this.Selected) this.drawDescription(ctx);
    }

    drawStats(ctx, statx, staty,) {
        // Stats background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x + 5 + statx, this.y + this.height - 30, 50, 25);

        // Attack stat
        ctx.fillStyle = "orange";
        ctx.font = "bold 20px Arial";
        ctx.fillText(this.attack, this.x + 10 + statx, this.y + this.height - 10);

        // Health stat
        ctx.fillStyle = this.health < this.maxHealth ? "red" : "green";
        ctx.fillText(this.health, this.x + 40 + statx, this.y + this.height - 10);

        // Level stars if above level 1
        if (this.level > 1) {
            ctx.fillStyle = "gold";
            for (let i = 0; i < this.level; i++) {
                ctx.fillText("★", this.x + (i * 15), this.y + 20);
            }
        }

        // Ability indicator if unit has one
        if (this.ability) {
            ctx.fillStyle = 'purple';
            ctx.fillText("✧", this.x + this.width - 20, this.y + 20);
        }
    }

    drawDescription(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        let left = 1240;
        let bottom = 200;
        if (this.isInShop) {
            left = 940;
            bottom = 550;
        }
        ctx.fillRect(left, bottom, 300, 180);

        const lines = this.splitText(this.ability.description);

        ctx.fillStyle = "cyan";
        ctx.font = "bold 20px Arial";

        for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], left + 20, bottom + 35 + (25 * i));
    }

    splitText(text) {
        let index = 0;
        let end = 20;
        let lines = []
        let textLeft = text;

        while (textLeft.length > end) {
            while (textLeft.charAt(end) != ' ') end --;
            lines[index] = textLeft.substring(0, end);
            textLeft = textLeft.substring(end+1);
            index++;
            end = 20;
        }

        lines[index] = textLeft;

        return lines
    }

    moveTo(x, y) {
        // Delegate movement animation to animator
        this.animator.moveTo(x, y);
    }

    newName() {
        this.ID = Math.floor(Math.random() * 99999999999999);
        while (gameEngine.takenIDS.includes(this.ID)) {
            this.ID = Math.floor(Math.random() * 99999999999999);
        }
        gameEngine.takenIDS.push(this.ID)
    }
}
