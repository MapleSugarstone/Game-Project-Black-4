class UnitAnimator {
    constructor(unit) {
        this.unit = unit;

        // Movement animation
        this.isAnimating = false;
        this.targetX = unit.x;
        this.targetY = unit.y;
        this.animationSpeed = 5;
        this.originalX = unit.x;
        this.originalY = unit.y;

        // Combat animation
        this.isAttacking = false;
        this.attackTime = 0;
        this.attackStartX = unit.x;
        this.hasDealtDamage = false;
        this.rotation = 0;

        // Shake effect properties
        this.shakeIntensity = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;

        // Shop animations
        this.scale = 1;
        this.isDragging = false;
    }

    update(clockTick) {
        // Handle shop movement and positioning
        if (this.isAnimating) {
            const dx = (this.targetX - this.unit.x) / this.animationSpeed;
            const dy = (this.targetY - this.unit.y) / this.animationSpeed;
            
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                this.unit.x = this.targetX;
                this.unit.y = this.targetY;
                this.originalX = this.unit.x;
                this.originalY = this.unit.y;
                this.isAnimating = false;
                this.isDragging = false;
            } else {
                this.unit.x += dx;
                this.unit.y += dy;
                this.isDragging = true;
            }
        }

        // Handle attack animation
        if (this.isAttacking) {
            this.attackTime += clockTick;

            if (this.attackTime < 0.75) {
                const shakeProgress = Math.min(1, this.attackTime / 0.3);
                this.shakeIntensity = 4 * shakeProgress;
                this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
                this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
            } else {
                this.shakeIntensity = 0;
                this.shakeOffsetX = 0;
                this.shakeOffsetY = 0;
            }

            if (this.attackTime < 0.6) {
                const chargeProgress = this.attackTime / 0.6;
                const easeInRotation = chargeProgress < 0.2 ? 
                    Math.pow(chargeProgress * 5, 2) : 1;
                this.rotation = this.unit.facingLeft ? 
                    -30 * easeInRotation : 
                    30 * easeInRotation;
                this.unit.x = this.attackStartX;
            } 
            else if (this.attackTime < 0.75) {
                const lungeProgress = (this.attackTime - 0.6) / 0.15;
                const easeInOutLunge = lungeProgress < 0.5 ? 
                    4 * lungeProgress * lungeProgress * lungeProgress : 
                    1 - Math.pow(-2 * lungeProgress + 2, 3) / 2;
                
                const ATTACK_DISTANCE = 61;
                if (this.unit.facingLeft) {
                    this.unit.x = this.attackStartX - (ATTACK_DISTANCE * easeInOutLunge);
                    this.rotation = -30;
                } else {
                    this.unit.x = this.attackStartX + (ATTACK_DISTANCE * easeInOutLunge);
                    this.rotation = 30;
                }
            }
            else if (this.attackTime < 1.0) {
                const returnProgress = (this.attackTime - 0.75) / 0.25;
                const easeOutReturn = 1 - Math.pow(1 - returnProgress, 4);
                
                const ATTACK_DISTANCE = 61;
                if (this.unit.facingLeft) {
                    this.unit.x = (this.attackStartX - ATTACK_DISTANCE) + (ATTACK_DISTANCE * easeOutReturn);
                    this.rotation = -30 * (1 - easeOutReturn);
                } else {
                    this.unit.x = (this.attackStartX + ATTACK_DISTANCE) - (ATTACK_DISTANCE * easeOutReturn);
                    this.rotation = 30 * (1 - easeOutReturn);
                }
            }
        }

        // Handle hover/selection scaling
        if (this.unit.isHovered && this.scale < 1.1) {
            this.scale += 0.01;
        }

        if (this.unit.Selected && this.scale < 1.3) {
            this.scale += 0.03;
        }

        if ((!this.unit.isHovered && !this.unit.Selected) && this.scale > 1) {
            this.scale -= 0.01;
        }

        // Apply floating animation
        if (!this.isDragging) {
            this.unit.y = this.originalY + Math.sin(Date.now() / 500) * 5;
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.attackTime = 0;
        this.attackStartX = this.unit.x;
        this.hasDealtDamage = false;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isAnimating = true;
    }

    getDrawPosition() {
        return {
            x: this.unit.x + this.shakeOffsetX,
            y: this.unit.y + this.shakeOffsetY,
            rotation: this.rotation,
            scale: this.scale
        };
    }
}
