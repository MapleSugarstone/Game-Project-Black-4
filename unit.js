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

        // Combat animation state tracking
        this.isAttacking = false;          // Controls if unit is currently in attack animation sequence
        this.attackTime = 0;               // Tracks elapsed time during attack animation (in seconds)
        this.attackStartX = x;             // Stores initial X position to return to after attack completes
        this.rotation = 0;                 // Current rotation angle for attack animation (in degrees)
        this.hasDealtDamage = false;       // Prevents damage from being applied multiple times per attack
        
        // Shake effect properties for attack animation
        this.shakeIntensity = 0;           // Maximum pixel offset for current shake
        this.shakeOffsetX = 0;             // Current horizontal shake displacement
        this.shakeOffsetY = 0;             // Current vertical shake displacement
        
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
        this.getAbility(sprite);
    }

    getAbility(sprite) {
        // Triggers: H - Hurt, SB - Start of Battle, A - Attack
        // Who triggers?: I - Myself, N - None, AA - Ally Ahead, RA - Random Ally, RE - Random Enemy, FE - Front Enemy, FA - Front Ally
        // EE - Every Enemy
        // Who is Affected?: ^ Same notation
        //
        //

        switch (sprite) {
            case "./Units/Unit1.png":
                this.ability = new Passive("H", "I", "RA", "HP.1", false);
                break;
            case "./Units/Unit2.png":
                this.ability = new Passive("SB", "N", "RE", "HP.-99", false);
                break;
            case "./Units/Unit3.png":
                this.ability = new Passive("A", "I", "RE", "AT.-1", false);
                break;
            case "./Units/Unit4.png":
                this.ability = new Passive("A", "AA", "I", "AT.1", false);
                break;
            case "./Units/Unit5.png":
                this.ability = new Passive("D", "I", "FE", "HP.-1", true);
                break;
            case "./Units/Unit6.png":
                this.ability = new Passive("H", "EE", "T", "AT.-1", false);
                break;
            default:
                this.ability = new Passive("N", "N", "N", "N", false);
                
        }
    }

    levelUp() {
        if (this.level < MAX_LEVEL) {
            this.level++;
            this.attack++;
            this.health++;
        }
    }

    update() {
        // Handle shop movement and positioning animations
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
    
        // Track if unit is currently selected in shop
        this.Selected = gameEngine.SelectedUnitGlobal == this.ID;
    
        // Handle attack animation during combat
        if (this.isAttacking) {
            this.attackTime += gameEngine.clockTick;
    
            // Update shake effect during charge-up and lunge phases (first 0.75 seconds)
            if (this.attackTime < 0.75) {
                // Gradually increase shake intensity during charge-up
                const shakeProgress = Math.min(1, this.attackTime / 0.3);
                this.shakeIntensity = 4 * shakeProgress;
                // Apply random shake offset in both directions
                this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
                this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
            } else {
                // Reset shake after lunge phase
                this.shakeIntensity = 0;
                this.shakeOffsetX = 0;
                this.shakeOffsetY = 0;
            }
    
            // Charge-up phase (0 to 0.6 seconds) - Rotate into attack position
            if (this.attackTime < 0.6) {
                const chargeProgress = this.attackTime / 0.6;
                // Quick initial rotation then hold position
                const easeInRotation = chargeProgress < 0.2 ? 
                    Math.pow(chargeProgress * 5, 2) : 1;
                // Apply rotation based on unit's team
                this.rotation = this.facingLeft ? 
                    -30 * easeInRotation : 
                    30 * easeInRotation;
                this.x = this.attackStartX;  // Hold position during charge
            } 
            // Lunge phase (0.6 to 0.75 seconds) - Move forward to attack
            else if (this.attackTime < 0.75) {
                const lungeProgress = (this.attackTime - 0.6) / 0.15;
                // Custom easing for snappy forward movement
                const easeInOutLunge = lungeProgress < 0.5 ? 
                    4 * lungeProgress * lungeProgress * lungeProgress : 
                    1 - Math.pow(-2 * lungeProgress + 2, 3) / 2;
                
                const ATTACK_DISTANCE = 61;  // Pixels to move forward
                if (this.facingLeft) {
                    this.x = this.attackStartX - (ATTACK_DISTANCE * easeInOutLunge);
                    this.rotation = -30;  // Hold rotation during lunge
                } else {
                    this.x = this.attackStartX + (ATTACK_DISTANCE * easeInOutLunge);
                    this.rotation = 30;   // Hold rotation during lunge
                }
            }
            // Return phase (0.75 to 1.0 seconds) - Move back to starting position
            else if (this.attackTime < 1.0) {
                const returnProgress = (this.attackTime - 0.75) / 0.25;
                // Smooth ease out for natural return motion
                const easeOutReturn = 1 - Math.pow(1 - returnProgress, 4);
                
                const ATTACK_DISTANCE = 61;
                if (this.facingLeft) {
                    this.x = (this.attackStartX - ATTACK_DISTANCE) + (ATTACK_DISTANCE * easeOutReturn);
                    this.rotation = -30 * (1 - easeOutReturn);  // Gradually remove rotation
                } else {
                    this.x = (this.attackStartX + ATTACK_DISTANCE) - (ATTACK_DISTANCE * easeOutReturn);
                    this.rotation = 30 * (1 - easeOutReturn);   // Gradually remove rotation
                }
            }
        }
    
        // Handle hover/selection scaling in shop
        if (this.isHovered && this.scale < 1.1) {
            this.scale += 0.01;
        }
    
        if (this.Selected && this.scale < 1.3) {
            this.scale += 0.03;
        }
    
        if ((!this.isHovered && !this.Selected) && this.scale > 1) {
            this.scale -= 0.01;
        }
    
        // Apply floating animation when not being dragged
        if (!this.isDragging) {
            this.y = this.originalY + Math.sin(Date.now() / 500) * 5;
        }
    }

    draw(ctx) {
        ctx.save();  // Save current canvas state
        
        // Calculate position including any shake effect during combat
        let drawX = this.x;
        let drawY = this.y;
        if (this.isAttacking) {
            // Add shake offset to position during attack animations
            drawX += this.shakeOffsetX;
            drawY += this.shakeOffsetY;
        }
    
        // Center point for rotations and scaling
        const centerX = drawX + this.width/2;
        const centerY = drawY + this.height/2;
        
        // Move canvas origin to unit's center point
        ctx.translate(centerX, centerY);
    
        // Apply rotation if unit is attacking
        if (this.isAttacking) {
            ctx.rotate(this.rotation * Math.PI/180);
        }
    
        // Apply scaling (from selection/hover)
        ctx.scale(this.scale, this.scale);
    
        // Flip sprite if unit is on enemy team
        if (this.facingLeft) {
            ctx.scale(-1, 1);
        }
    
        // Move origin back to top-left for drawing
        ctx.translate(-this.width/2, -this.height/2);
        
        // Draw the unit sprite
        ctx.drawImage(
            ASSET_MANAGER.getAsset(this.sprite),
            0,
            0,
            this.width,
            this.height
        );
        
        // Restore canvas to original state
        ctx.restore();
    
        // Draw stats (not affected by transformations)
        this.drawStats(ctx, 32, 16);
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
