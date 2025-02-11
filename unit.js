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
        this.level = stats.level || 1;
        this.type = sprite; // Use sprite path as type identifier
        this.cost = 3; // Standard cost for units
        
        // Animation properties
        this.isAnimating = false;
        this.targetX = x;
        this.targetY = y;
        this.animationSpeed = 5;
        this.scale = 1;
        this.originalX = x; //for attack
        this.originalY = y; //for float
        
        // Drag and drop properties
        this.isDragging = false;
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
        this.ability = this.getAbility(sprite);
    }

    getAbility(sprite) {
        const abilities = {
            "./Units/Unit1.png": {
                name: "Bite",
                trigger: "onAttack",
                effect: (target) => { target.health -= 1; }
            },
            "./Units/Ghost.png": {
                name: "Haunt",
                trigger: "onDeath",
                effect: (allies) => {
                    allies.forEach(ally => {
                        if (ally) ally.attack += 1;
                    });
                }
            },
            "./Units/Spider.png": {
                name: "Web",
                trigger: "onAttack",
                effect: (target) => { target.attack = Math.max(0, target.attack - 1); }
            },
            "./Units/Puffer.png": {
                name: "Spikes",
                trigger: "onHurt",
                effect: (attacker) => { attacker.health -= 1; }
            }
            // Add more abilities as needed
        };
        return abilities[sprite] || null;
    }

    levelUp() {
        if (this.level < MAX_LEVEL) {
            this.level++;
            this.attack++;
            this.health++;
        }
    }

    update() {
        // Handle animations
        if (this.isAnimating) {
            this.dx = (this.targetX - this.x) / this.animationSpeed;
            this.dy = (this.targetY - this.y) / this.animationSpeed;
            
            if (Math.abs(this.dx) < 0.1 && Math.abs(this.dy) < 0.1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.originalX = this.x;
                this.originalY = this.y;
                this.isAnimating = false;
                this.isDragging = false;
            } else {
                this.x += this.dx;
                this.y += this.dy;
                this.isDragging = true;
            }
        }

        this.Selected = gameEngine.SelectedUnitGlobal == this.ID;

        // Handle hover animation
        if (this.isHovered && this.scale < 1.1) {
            console.log("hovering");
            this.scale += 0.01;
        }

        if (this.Selected && this.scale < 1.3) {
            this.scale += 0.03;
        }

        if ((!this.isHovered && !this.Selected) && this.scale > 1) {
            this.scale -= 0.01;
        }

        // Handle attack animation
        if (this.attackAnim > 0) {
            this.attackAnim -= 0.1;
        }

        // Handle hit animation
        if (this.hitAnim > 0) {
            this.hitAnim -= 0.1;
        }

        // Floating animation when not dragging
        if (!this.isDragging) {
            this.y = this.originalY + Math.sin(Date.now() / 500) * 5;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Apply scale for hover effect and facing direction
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.scale(this.scale * (this.facingLeft ? -1 : 1), this.scale);
        ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));
    
        // Draw attack effect
        if (this.attackAnim > 0) {
            ctx.globalAlpha = this.attackAnim;
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width * 0.75, 0, Math.PI * 2);
            ctx.fill();
        }
    
        // Draw hit effect
        if (this.hitAnim > 0) {
            ctx.globalAlpha = this.hitAnim;
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
    
        // Draw unit
        ctx.globalAlpha = 1;
        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.sprite),
            this.x,
            this.y,
            this.width,
            this.height
        );
    
        // Reset transform for stats so they're not flipped
        ctx.restore();
        ctx.save();
        
        // Apply only the hover scale for stats, not the flip
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));
    
        // Draw stats
        this.drawStats(ctx, 32, 16);
        
        ctx.restore();
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

    startDrag(mouseX, mouseY) {
        this.isDragging = true;
        this.dragOffsetX = this.x - mouseX;
        this.dragOffsetY = this.y - mouseY;
    }

    dragTo(mouseX, mouseY) {
        if (this.isDragging) {
            this.x = mouseX + this.dragOffsetX;
            this.y = mouseY + this.dragOffsetY;
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isAnimating = true;
    }

    attack(target) {
        this.originalX = this.x;
        
        // Attack animation
        this.attackAnim = 1;
        this.moveTo(this.x + 40, this.y);
        
        setTimeout(() => {
            this.moveTo(this.originalX, this.y);
            target.takeHit();
            
            // Apply ability if it's an attack trigger
            if (this.ability && this.ability.trigger === "onAttack") {
                this.ability.effect(target);
            }
        }, 200);
    }

    takeHit() {
        this.hitAnim = 1;
    }

    newName() {
        this.ID = Math.floor(Math.random() * 99999999999999);
        while (gameEngine.takenIDS.includes(this.ID)) {
            this.ID = Math.floor(Math.random() * 99999999999999);
        }
        gameEngine.takenIDS.push(this.ID)
    }
}
