class Projectile {
    constructor(sourceX, sourceY, targetX, targetY, type, options = {}) {
        // Base properties
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.x = sourceX;
        this.y = sourceY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.type = type;
        this.width = options.width || 32;
        this.height = options.height || 32;
        this.speed = options.speed || 500;  // Pixels per second
        this.rotation = 0;
        this.scale = options.scale || 1;
        this.layer = 5;  // High layer to ensure visibility
        this.removeFromWorld = false;

        // Animation and visuals
        this.sprite = this.getSprite(type);
        this.rotationSpeed = options.rotationSpeed || 0;
        this.animator = options.animator || null;
        this.trailEffect = options.trailEffect || null;
        this.impactEffect = options.impactEffect || null;
        
        // Trajectory
        this.trajectoryType = options.trajectoryType || "linear";
        this.arcHeight = options.arcHeight || 150;
        this.homingStrength = options.homingStrength || 0.1;
        this.homingTarget = options.homingTarget || null;
        
        // Timing
        this.elapsedTime = 0;
        this.totalDistance = Util.distance(
            {x: this.sourceX, y: this.sourceY}, 
            {x: this.targetX, y: this.targetY}
        );
        this.duration = this.totalDistance / this.speed;
        this.progress = 0;
        this.maxLifetime = 5; // Safety timeout (seconds)
        
        // Callbacks
        this.onHit = options.onHit || null;
        this.onUpdate = options.onUpdate || null;
        
        // Particles
        this.particles = [];
        this.trailFrequency = options.trailFrequency || 0.05;
        this.lastTrailTime = 0;
        
        // Start time - used for synchronized animations
        this.startTime = gameEngine.theTime;

        console.log(`Projectile created: ${type} from (${sourceX}, ${sourceY}) to (${targetX}, ${targetY})`);
    }
    
    update() {
        // Calculate time and progress
        const clockTick = gameEngine.clockTick;
        this.elapsedTime += clockTick;
        this.progress = Math.min(this.elapsedTime / this.duration, 1);
        
        // Check for maximum lifetime (safety)
        if (this.elapsedTime > this.maxLifetime) {
            console.log("Projectile reached maximum lifetime, completing");
            this.hitTarget();
            return;
        }
        
        // Update position based on trajectory
        this.updatePosition();
        
        // Update rotation if needed
        if (this.rotationSpeed !== 0) {
            this.rotation += this.rotationSpeed * clockTick;
        }
        
        // Generate trail particles
        if (this.trailEffect && this.elapsedTime - this.lastTrailTime > this.trailFrequency) {
            this.generateTrailParticle();
            this.lastTrailTime = this.elapsedTime;
        }
        
        // Update existing particles
        this.updateParticles(clockTick);
        
        // Custom update behavior
        if (this.onUpdate) {
            this.onUpdate(this, clockTick);
        }
        
        // Check if reached target
        if (this.progress >= 1) {
            this.hitTarget();
        }
    }
    
    updatePosition() {
        switch (this.trajectoryType) {
            case "linear":
                this.x = Util.lerp(this.sourceX, this.targetX, this.progress);
                this.y = Util.lerp(this.sourceY, this.targetY, this.progress);
                break;
                
            case "arc":
                this.x = Util.lerp(this.sourceX, this.targetX, this.progress);
                // Parabolic arc: y = 4h(x)(1-x) where h is max height and x is progress 0-1
                const arcOffset = 4 * this.arcHeight * this.progress * (1 - this.progress);
                this.y = Util.lerp(this.sourceY, this.targetY, this.progress) - arcOffset;
                break;
                
            case "homing":
                if (this.homingTarget && !this.homingTarget.removeFromWorld) {
                    // Adjust target position to follow the target
                    this.targetX = this.homingTarget.x + this.homingTarget.width/2;
                    this.targetY = this.homingTarget.y + this.homingTarget.height/2;
                }
                // Use linear interpolation with adjusted target
                this.x = Util.lerp(this.sourceX, this.targetX, this.progress);
                this.y = Util.lerp(this.sourceY, this.targetY, this.progress);
                break;
                
            case "spiral":
                const baseX = Util.lerp(this.sourceX, this.targetX, this.progress);
                const baseY = Util.lerp(this.sourceY, this.targetY, this.progress);
                const spiralRadius = 30 * (1 - this.progress);
                const spiralAngle = this.progress * Math.PI * 8; // 4 full rotations
                this.x = baseX + Math.cos(spiralAngle) * spiralRadius;
                this.y = baseY + Math.sin(spiralAngle) * spiralRadius;
                break;
                
            case "bounce":
                this.x = Util.lerp(this.sourceX, this.targetX, this.progress);
                // Add bouncing effect using sine function
                const bounceHeight = 40 * Math.sin(this.progress * Math.PI * 4);
                this.y = Util.lerp(this.sourceY, this.targetY, this.progress) - Math.abs(bounceHeight);
                break;
        }
    }
    
    draw(ctx) {
        // Draw particles first (behind projectile)
        this.drawParticles(ctx);
        
        // Save context for transformations
        ctx.save();
        
        // Move to center position for rotation
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        
        // Apply rotation
        ctx.rotate(this.rotation);
        
        // Apply scale
        ctx.scale(this.scale, this.scale);
        
        // Draw the projectile sprite
        const img = ASSET_MANAGER.getAsset(this.sprite);
        if (img) {
            ctx.drawImage(
                img,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else {
            // Fallback if image not found
            ctx.fillStyle = 'red';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            console.error("Missing projectile asset:", this.sprite);
        }
        
        // Restore context
        ctx.restore();
    }
    
    hitTarget() {
        // Create impact effect if specified
        if (this.impactEffect) {
            this.createImpactEffect();
        }
        
        // Call hit callback if specified
        if (this.onHit) {
            this.onHit(this);
        }
        
        console.log(`Projectile ${this.type} hit target`);
        
        // Mark for removal
        this.removeFromWorld = true;
    }
    
    generateTrailParticle() {
        // Generate a particle based on the trail effect type
        let particle;
        
        switch (this.trailEffect) {
            case "smoke":
                particle = {
                    x: this.x + this.width/2,
                    y: this.y + this.height/2,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    size: 5 + Math.random() * 10,
                    alpha: 0.7,
                    color: "rgba(200, 200, 200, 0.7)",
                    life: 1,
                    rotation: Math.random() * Math.PI * 2
                };
                break;
                
            case "fire":
                particle = {
                    x: this.x + this.width/2,
                    y: this.y + this.height/2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8 - 15,
                    size: 8 + Math.random() * 8,
                    alpha: 0.8,
                    color: `hsl(${30 + Math.random() * 30}, 100%, 50%)`,
                    life: 0.8,
                    rotation: Math.random() * Math.PI * 2
                };
                break;
                
            case "ice":
                particle = {
                    x: this.x + this.width/2,
                    y: this.y + this.height/2,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    size: 4 + Math.random() * 6,
                    alpha: 0.9,
                    color: `hsl(${190 + Math.random() * 20}, 70%, ${70 + Math.random() * 20}%)`,
                    life: 1.2,
                    rotation: Math.random() * Math.PI * 2
                };
                break;
                
            case "sparkle":
                particle = {
                    x: this.x + this.width/2,
                    y: this.y + this.height/2,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    size: 2 + Math.random() * 4,
                    alpha: 1,
                    color: `hsl(${Math.random() * 360}, 100%, 80%)`,
                    life: 0.6,
                    rotation: Math.random() * Math.PI * 2
                };
                break;
                
            default:
                return; // No trail effect
        }
        
        this.particles.push(particle);
    }
    
    updateParticles(clockTick) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * clockTick;
            p.y += p.vy * clockTick;
            
            // Update rotation
            p.rotation += 0.1;
            
            // Update life
            p.life -= clockTick;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                // Fade out as life decreases
                p.alpha = p.life;
                
                // Shrink as life decreases
                p.size *= 0.98;
            }
        }
    }
    
    drawParticles(ctx) {
        ctx.save();
        
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            // Draw the particle (circle or custom shape)
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.rotate(-p.rotation);
            ctx.translate(-p.x, -p.y);
        }
        
        ctx.restore();
    }
    
    createImpactEffect() {
        // Create impact particles based on effect type
        for (let i = 0; i < 15; i++) {
            let particle;
            
            switch (this.impactEffect) {
                case "explosion":
                    particle = {
                        x: this.targetX,
                        y: this.targetY,
                        vx: (Math.random() - 0.5) * 80,
                        vy: (Math.random() - 0.5) * 80,
                        size: 10 + Math.random() * 15,
                        alpha: 1,
                        color: `hsl(${30 + Math.random() * 20}, 100%, 50%)`,
                        life: 0.5 + Math.random() * 0.3,
                        rotation: Math.random() * Math.PI * 2
                    };
                    break;
                    
                case "splash":
                    const angle = i * (Math.PI * 2 / 15);
                    const speed = 40 + Math.random() * 60;
                    particle = {
                        x: this.targetX,
                        y: this.targetY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 8 + Math.random() * 8,
                        alpha: 0.9,
                        color: `hsl(${190 + Math.random() * 20}, 70%, ${70 + Math.random() * 20}%)`,
                        life: 0.6 + Math.random() * 0.4,
                        rotation: angle
                    };
                    break;
                    
                case "heal":
                    const healAngle = i * (Math.PI * 2 / 15);
                    particle = {
                        x: this.targetX,
                        y: this.targetY,
                        vx: Math.cos(healAngle) * 30,
                        vy: Math.sin(healAngle) * 30 - 20, // Bias upward
                        size: 6 + Math.random() * 6,
                        alpha: 0.9,
                        color: `hsl(${100 + Math.random() * 40}, 90%, 60%)`,
                        life: 0.8 + Math.random() * 0.4,
                        rotation: healAngle
                    };
                    break;
                    
                default:
                    return; // No impact effect
            }
            
            // Create a standalone impact particle manager
            if (!gameEngine.entities.find(e => e instanceof ImpactParticleManager)) {
                gameEngine.addEntity(new ImpactParticleManager());
            }
            
            // Add particle to the impact manager
            const impactManager = gameEngine.entities.find(e => e instanceof ImpactParticleManager);
            impactManager.addParticle(particle);
        }
    }
    
    getSprite(type) {
        // Return sprite path based on projectile type
        const sprites = {
            "snowball": "./Projectiles/SnowBall.png",
            "iceShard": "./Projectiles/IceShard.png",
            "dagger": "./Projectiles/Dagger.png",
            "healOrb": "./Projectiles/HealOrb.png",
            "frostBolt": "./Projectiles/FrostBolt.png",
            "fireball": "./Projectiles/FireBall.png",
            "arrow": "./Projectiles/Arrow.png",
            "poison": "./Projectiles/Poison.png",
            "magic": "./Projectiles/Magic.png"
        };
        
        const spritePath = sprites[type] || sprites.snowball;
        return spritePath;
    }
}

class ImpactParticleManager {
    constructor() {
        this.particles = [];
        this.layer = 6;  // Above projectiles
    }
    
    addParticle(particle) {
        this.particles.push(particle);
    }
    
    update() {
        const clockTick = gameEngine.clockTick;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * clockTick;
            p.y += p.vy * clockTick;
            
            // Apply gravity to some effects
            if (p.color.includes("hsl(30") || p.color.includes("hsl(190")) { // Fire or ice
                p.vy += 60 * clockTick; // Gravity
            }
            
            // Update rotation
            p.rotation += 2 * clockTick;
            
            // Update life
            p.life -= clockTick;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                // Fade out as life decreases
                p.alpha = p.life;
            }
        }
        
        // Remove the manager if no particles remain
        if (this.particles.length === 0) {
            this.removeFromWorld = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            // Draw the particle (circle or custom shape)
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.rotate(-p.rotation);
            ctx.translate(-p.x, -p.y);
        }
        
        ctx.restore();
    }
}

class ProjectileManager {
    static createProjectile(sourceUnit, targetUnit, type, options = {}) {
        // Calculate source and target positions
        const sourceX = sourceUnit.x + sourceUnit.width/2;
        const sourceY = sourceUnit.y + sourceUnit.height/2;
        const targetX = targetUnit.x + targetUnit.width/2;
        const targetY = targetUnit.y + targetUnit.height/2;
        
        // Set default options based on projectile type
        const projectileDefaults = {
            "snowball": {
                width: 32,
                height: 32,
                speed: 800,
                trajectoryType: "arc",
                arcHeight: 120,
                rotationSpeed: 0,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.02
            },
            "iceShard": {
                width: 28,
                height: 28,
                speed: 450,
                trajectoryType: "linear",
                rotationSpeed: 5,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.03
            },
            "dagger": {
                width: 24,
                height: 24,
                speed: 600,
                trajectoryType: "linear",
                rotationSpeed: 8,
                trailEffect: null,
                impactEffect: null
            },
            "healOrb": {
                width: 32,
                height: 32,
                speed: 250,
                trajectoryType: "arc",
                arcHeight: 150,
                rotationSpeed: 3,
                trailEffect: "sparkle",
                impactEffect: "heal",
                trailFrequency: 0.04,
                scale: 1.2
            },
            "frostBolt": {
                width: 36,
                height: 36,
                speed: 350,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.02
            },
            "fireball": {
                width: 40,
                height: 40,
                speed: 400,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: "fire",
                impactEffect: "explosion",
                trailFrequency: 0.01
            },
            "arrow": {
                width: 30,
                height: 30,
                speed: 700,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: null,
                impactEffect: null
            },
            "poison": {
                width: 28,
                height: 28,
                speed: 300,
                trajectoryType: "bounce",
                rotationSpeed: 2,
                trailEffect: "smoke",
                impactEffect: "splash",
                scale: 0.9,
                trailFrequency: 0.05
            },
            "magic": {
                width: 36,
                height: 36,
                speed: 350,
                trajectoryType: "spiral",
                rotationSpeed: 4,
                trailEffect: "sparkle",
                impactEffect: "explosion",
                trailFrequency: 0.02
            }
        };
        
        // Merge default options with provided options
        const mergedOptions = { ...projectileDefaults[type], ...options };
        
        // Create and return the projectile
        const projectile = new Projectile(
            sourceX, sourceY, targetX, targetY, type, mergedOptions
        );
        
        // Add to game engine
        gameEngine.addEntity(projectile);
        
        return projectile;
    }
    
    static createProjectileAtPosition(sourceX, sourceY, targetX, targetY, type, options = {}) {
        // Set default options based on projectile type
        const projectileDefaults = {
            "snowball": {
                width: 32,
                height: 32,
                speed: 800,
                trajectoryType: "arc",
                arcHeight: 120,
                rotationSpeed: 0,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.02
            },
            "iceShard": {
                width: 28,
                height: 28,
                speed: 450,
                trajectoryType: "linear",
                rotationSpeed: 5,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.03
            },
            "dagger": {
                width: 24,
                height: 24,
                speed: 600,
                trajectoryType: "spiral",
                rotationSpeed: 8,
                trailEffect: null,
                impactEffect: null
            },
            "healOrb": {
                width: 32,
                height: 32,
                speed: 250,
                trajectoryType: "arc",
                arcHeight: 150,
                rotationSpeed: 3,
                trailEffect: "sparkle",
                impactEffect: "heal",
                trailFrequency: 0.04,
                scale: 1.2
            },
            "frostBolt": {
                width: 36,
                height: 36,
                speed: 350,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: "ice",
                impactEffect: "splash",
                trailFrequency: 0.02
            },
            "fireball": {
                width: 40,
                height: 40,
                speed: 400,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: "fire",
                impactEffect: "explosion",
                trailFrequency: 0.01
            },
            "arrow": {
                width: 30,
                height: 30,
                speed: 700,
                trajectoryType: "linear",
                rotationSpeed: 0,
                trailEffect: null,
                impactEffect: null
            },
            "poison": {
                width: 28,
                height: 28,
                speed: 300,
                trajectoryType: "bounce",
                rotationSpeed: 2,
                trailEffect: "smoke",
                impactEffect: "splash",
                scale: 0.9,
                trailFrequency: 0.05
            },
            "magic": {
                width: 36,
                height: 36,
                speed: 350,
                trajectoryType: "spiral",
                rotationSpeed: 4,
                trailEffect: "sparkle",
                impactEffect: "explosion",
                trailFrequency: 0.02
            }
        };
        
        // Merge default options with provided options
        const mergedOptions = { ...projectileDefaults[type], ...options };
        
        // Create and return the projectile
        const projectile = new Projectile(
            sourceX, sourceY, targetX, targetY, type, mergedOptions
        );
        
        // Add to game engine
        gameEngine.addEntity(projectile);
    
        return projectile;
    }
    
    static getProjectileTypeFromVisualEffect(visualEffect) {
        // Map visual effects to specific projectile types
        const effectToProjectile = {
            "Projectile": "snowball",     // Default projectile
            "BuffAlly": "healOrb",
            "Damage": "fireball",
            "Poison": "poison",
            "Ice": "iceShard",
            "Frost": "frostBolt",
            "Fire": "fireball",
            "Magic": "magic",
            "Physical": "dagger",
            "Arrow": "arrow",
            "N": "snowball"   // Fallback for no effect specified
        };
        
        return effectToProjectile[visualEffect] || "snowball";
    }
}
class DeathParticleManager {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.layer = 6;  // Above units
        this.lifespan = 0.8;  // How long the entire effect lasts
        this.elapsedTime = 0;
        
        // Create initial particles
        this.initializeParticles();
    }
    
    initializeParticles() {
        // Create smoke particles
        const particleCount = 20 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 50;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 30, // Bias upward
                size: 5 + Math.random() * 15,
                alpha: 0.8,
                color: `rgba(200, 200, 200, ${0.5 + Math.random() * 0.5})`,
                life: 0.3 + Math.random() * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 2
            });
        }
    }
    
    update() {
        const clockTick = gameEngine.clockTick;
        this.elapsedTime += clockTick;
        
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * clockTick;
            p.y += p.vy * clockTick;
            
            // Apply gentle deceleration
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // Apply gravity
            p.vy += 15 * clockTick;
            
            // Update rotation
            p.rotation += p.rotationSpeed * clockTick;
            
            // Update life
            p.life -= clockTick;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                // Fade out as life decreases
                p.alpha = p.life * 2;
                
                // Grow particle size slightly
                p.size *= 1.03;
            }
        }
        
        // Remove the manager if effect duration is over or no particles remain
        if (this.elapsedTime >= this.lifespan || this.particles.length === 0) {
            this.removeFromWorld = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw each particle
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            // Draw an irregular cloud-like shape
            ctx.beginPath();
            if (Math.random() > 0.5) {
                // Circle
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            } else {
                // Puffy cloud shape
                const cloudSize = p.size * 0.7;
                ctx.arc(-cloudSize/2, -cloudSize/2, cloudSize, 0, Math.PI * 2);
                ctx.arc(cloudSize/2, -cloudSize/2, cloudSize * 0.8, 0, Math.PI * 2);
                ctx.arc(0, cloudSize/2, cloudSize * 0.9, 0, Math.PI * 2);
                ctx.arc(-cloudSize/2, cloudSize/2, cloudSize * 0.7, 0, Math.PI * 2);
                ctx.arc(cloudSize/2, cloudSize/2, cloudSize * 0.6, 0, Math.PI * 2);
            }
            ctx.fill();
            
            ctx.rotate(-p.rotation);
            ctx.translate(-p.x, -p.y);
        }
        
        ctx.restore();
    }
}
class StarParticleManager {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.layer = 6;  // Above units
        this.lifespan = 2.5;  // How long the entire effect lasts
        this.elapsedTime = 0;
        this.removeFromWorld = false;
        
        // Create initial particles
        this.initializeParticles();
    }
    
    initializeParticles() {
        // Create star particles in an explosion pattern - INCREASED COUNT AND SIZE
        const particleCount = 80 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 150 + Math.random() * 250;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 80, // Stronger upward bias
                size: 30 + Math.random() * 30, // MUCH LARGER STARS
                alpha: 1.0,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 15,
                life: 0.8 + Math.random() * 1.5 // Longer life
            });
        }
    }
    
    
    update() {
        const clockTick = gameEngine.clockTick;
        this.elapsedTime += clockTick;
        
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * clockTick;
            p.y += p.vy * clockTick;
            
            // Apply gentle deceleration
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // Apply gravity
            p.vy += 200 * clockTick;
            
            // Update rotation
            p.rotation += p.rotationSpeed * clockTick;
            
            // Update life
            p.life -= clockTick;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                // Fade out as life decreases
                p.alpha = p.life;
            }
        }
        
        // Remove the manager if effect duration is over or no particles remain
        if (this.elapsedTime >= this.lifespan || this.particles.length === 0) {
            this.removeFromWorld = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw each particle
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha;
            
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            
            // Draw the star image
            const starImage = ASSET_MANAGER.getAsset("./Projectiles/Star.png");
            ctx.drawImage(
                starImage,
                -p.size / 2,
                -p.size / 2,
                p.size,
                p.size
            );
            
            ctx.rotate(-p.rotation);
            ctx.translate(-p.x, -p.y);
        }
        
        ctx.restore();
    }
}
