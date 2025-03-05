// unit.js
const MAX_LEVEL = 4;
class Unit {
    constructor(x, y, sprite, stats = {}, fresh) {
        this.newName();
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 128; // Display at half size (256/2)
        this.height = 128;
        
        // Stats
        if (fresh) {
            this.getStats(sprite, this.level);
        } else {
            this.attack = stats.attack || 2;
            this.health = stats.health || 2;
        }

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
        this.getAbility(sprite, this.level);
    }
    
    getAbility(sprite, level) {
        switch (sprite) {
            case "./Units/Unit1.png":
                if (level == 1) {
                    this.ability = new Passive("H", "I", "RA.1", "HP.1", false, "BuffAlly", "Heal a random ally's HP by 1 when hurt.");
                }
                if (level == 2) {
                    this.ability = new Passive("H", "I", "RA.2", "HP.1", false, "BuffAlly", "Heal 2 random ally's HP by 1 when hurt.");
                }
                if (level == 3) {
                    this.ability = new Passive("H", "I", "RA.3", "HP.1", false, "BuffAlly", "Heal 3 random ally's HP by 1 when hurt.");
                }
                if (level == 4) {
                    this.ability = new Passive("H", "I", "RA.4", "HP.1", false, "BuffAlly", "Heal 4 random ally's HP by 1 when hurt.");
                }
                break;
            case "./Units/Unit2.png":
                if (level == 1) {
                    this.ability = new Passive("SB", "N", "RE.1", "HP.-2", false, "Snowball", "Deal 2 damage to random enemy at the start of the battle.");
                }
                if (level == 2) {
                    this.ability = new Passive("SB", "N", "RE.1", "HP.-3", false, "Snowball", "Deal 3 damage to random enemy at the start of the battle.");
                }
                if (level == 3) {
                    this.ability = new Passive("SB", "N", "RE.1", "HP.-4", false, "Snowball", "Deal 4 damage to random enemy at the start of the battle.");
                }
                if (level == 4) {
                    this.ability = new Passive("SB", "N", "RE.1", "HP.-2", false, "Snowball", "Deal 5 damage to random enemy at the start of the battle.");
                }
                break;
            case "./Units/Unit3.png":
                if (level == 1) {
                    this.ability = new Passive("A", "I", "RE.1", "HP.-1", false, "Snowball", "Deal 1 damage to a random enemy after attacking.");
                }
                if (level == 2) {
                    this.ability = new Passive("A", "I", "RE.2", "HP.-1", false, "Snowball", "Deal 1 damage to 2 random enemies after attacking.");
                }
                if (level == 3) {
                    this.ability = new Passive("A", "I", "RE.3", "HP.-1", false, "Snowball", "Deal 1 damage to 3 random enemies after attacking.");
                }
                if (level == 4) {
                    this.ability = new Passive("A", "I", "RE.4", "HP.-1", false, "Snowball", "Deal 1 damage to 4 random enemies after attacking.");
                }
                break;
            case "./Units/Unit4.png":
                this.ability = new Passive("A", "AA", "I.1", "B.1", false, "BuffAlly", "When the ally ahead attacks, increase attack and hp by 1.");
                break;
            case "./Units/Unit5.png":
                this.ability = new Passive("D", "AA", "RE.1", "HP.-1", true, "Magic", "When an ally dies, it deals 1 damage to a random enemy.");
                break;
            case "./Units/Unit6.png":
                this.ability = new Passive("H", "E", "T.1", "AT.-1", false, "Poison", "Whenever an enemy is hurt, reduce their attack by 1.");
                break;
            case "./Units/Unit7.png":
                this.ability = new Passive("SB", "N", "FA.1", "AT.1", false, "BuffAlly", "Increase the front ally's attack by 1 at the start of battle.");
                break;
            case "./Units/Unit8.png":
                this.ability = new Passive("D", "A", "RE.1", "HP.-1", false, "Lightning", "When an ally dies, deal 1 damage to a random enemy.");
                break;
            case "./Units/Unit9.png":
                this.ability = new Passive("A", "E", "FA.1", "HP.1", false, "Healing", "When an enemy attacks, heal the front ally for 1.");
                break;
            case "./Units/Unit10.png":
                this.ability = new Passive("H", "I", "I.1", "AT.1", false, "Rage", "When this unit is hurt, increase its attack by 1.");
                break;
            default:
                this.ability = new Passive("N", "N", "N.1", "N", false, "N", "This unit has no passive.");
        }
    }


    getStats(sprite) {
        switch (sprite) {
            case "./Units/Unit1.png":
                this.attack = 2;
                this.health = 6;
                break;
            case "./Units/Unit2.png":
                this.attack = 2;
                this.health = 4;
                break;
            case "./Units/Unit3.png":
                this.attack = 3;
                this.health = 5;
                break;
            case "./Units/Unit4.png":
                this.attack = 1;
                this.health = 4;
                break;
            case "./Units/Unit5.png":
                this.attack = 2;
                this.health = 3;
                break;
            case "./Units/Unit6.png":
                this.attack = 3;
                this.health = 5;
                break;
            case "./Units/Unit7.png":
                this.attack = 3;
                this.health = 5;
                break;
            case "./Units/Unit8.png":
                this.attack = 5;
                this.health = 6;
                break;
            case "./Units/Unit9.png":
                this.attack = 6;
                this.health = 4;
                break;
            case "./Units/Unit10.png":
                this.attack = 5;
                this.health = 5;
                break;
            default:
                this.attack = 2;
                this.health = 4;
        }
    }

    levelUp() {
        if (this.level < MAX_LEVEL) {  
            this.level++;
            this.getAbility(this.sprite, this.level);
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

        this.Selected = gameEngine.SelectedUnitGlobal == this.ID;
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

        let lines = this.splitText(this.ability.description);

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
