// unit.js
class Unit {
    constructor(x, y, sprite, stats = {}) {
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
        this.originalY = y;
        
        // Drag and drop properties
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        // Visual effects
        this.isHovered = false;
        this.attackAnim = 0;
        this.hitAnim = 0;
        
        // Ability
        this.ability = this.getAbility(sprite);
    }

    getAbility(sprite) {
        const abilities = {
            "./Chewy.png": {
                name: "Bite",
                trigger: "onAttack",
                effect: (target) => { target.health -= 1; }
            },
            "./Ghost.png": {
                name: "Haunt",
                trigger: "onDeath",
                effect: (allies) => {
                    allies.forEach(ally => {
                        if (ally) ally.attack += 1;
                    });
                }
            },
            "./Spider.png": {
                name: "Web",
                trigger: "onAttack",
                effect: (target) => { target.attack = Math.max(0, target.attack - 1); }
            },
            "./Puffer.png": {
                name: "Spikes",
                trigger: "onHurt",
                effect: (attacker) => { attacker.health -= 1; }
            }
            // Add more abilities as needed
        };
        return abilities[sprite] || null;
    }

    update() {
        // Handle animations
        if (this.isAnimating) {
            const dx = (this.targetX - this.x) / this.animationSpeed;
            const dy = (this.targetY - this.y) / this.animationSpeed;
            
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isAnimating = false;
            } else {
                this.x += dx;
                this.y += dy;
            }
        }

        // Handle hover animation
        if (this.isHovered && this.scale < 1.1) {
            this.scale += 0.01;
        } else if (!this.isHovered && this.scale > 1) {
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
        
        // Apply scale for hover effect
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.scale(this.scale, this.scale);
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

        // Draw stats
        this.drawStats(ctx);
        
        ctx.restore();
    }

    drawStats(ctx) {
        // Stats background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x + 5, this.y + this.height - 30, 50, 25);

        // Attack stat
        ctx.fillStyle = "orange";
        ctx.font = "bold 20px Arial";
        ctx.fillText(this.attack, this.x + 10, this.y + this.height - 10);

        // Health stat
        ctx.fillStyle = this.health < this.maxHealth ? "red" : "green";
        ctx.fillText(this.health, this.x + 40, this.y + this.height - 10);

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
        this.originalY = y;
        this.isAnimating = true;
    }

    attack(target) {
        const originalX = this.x;
        
        // Attack animation
        this.attackAnim = 1;
        this.moveTo(this.x + 40, this.y);
        
        setTimeout(() => {
            this.moveTo(originalX, this.y);
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
}