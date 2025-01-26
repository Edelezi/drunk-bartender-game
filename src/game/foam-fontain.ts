import * as PIXI from 'pixi.js';
import { Cup } from './cup';

class FoamParticle extends PIXI.Sprite {
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    life: number;
    maxLife: number;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.reset();
    }

    reset(): void {
        this.life = 1.0;
        this.maxLife = 1.0 + Math.random() * 0.5;
        this.alpha = 0.7;
        this.scale.set(0.3 + Math.random() * 0.3);

        // Initial velocity with more spread
        const angle = (Math.random() * Math.PI) - Math.PI/2; // -90 to 90 degrees
        const speed = 1 + Math.random() * 2;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 2 // Initial upward velocity
        };

        this.acceleration = {
            x: 0,
            y: 0.1 // Gravity
        };
    }

    update(delta: number): boolean {
        this.velocity.x += this.acceleration.x * delta;
        this.velocity.y += this.acceleration.y * delta;
        this.x += this.velocity.x * delta * 60;
        this.y += this.velocity.y * delta * 60;

        this.life -= delta * 0.8;
        // this.alpha = (this.life / this.maxLife) * 0.7;
        this.scale.set((0.3 + Math.random() * 0.3) * (this.life / this.maxLife));

        return this.life > 0;
    }
}

class FoamFountain {
    private app: PIXI.Application;
    private container: PIXI.Container;
    private particleTexture: PIXI.Texture;
    private particles: FoamParticle[];
    private cup: Cup;
    private emissionRate: number;
    private maxParticles: number;

    overflowCallback() {
        console.log('verflow');
    }

    constructor(app: PIXI.Application, cup: Cup) {
        this.app = app;
        this.cup = cup;
        this.cup.overflow.add(this.overflowCallback, this);
        this.container = new PIXI.Container();
        this.container.name = 'foam';
        this.app.stage.addChild(this.container);

        this.particles = [];
        this.emissionRate = 2;
        this.maxParticles = 50;

        // Create foam particle texture
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFACD);
        graphics.drawCircle(0, 0, 3);
        graphics.endFill();
        this.particleTexture = app.renderer.generateTexture(graphics);

        this.app.ticker.add(this.update.bind(this));
    }

    private update(delta: number): void {
        // Update container position to top of cup's liquid
        // const liquidTop = this.cup.y + this.cup.height - (this.cup.height * this.cup.liquid) / 100;
        // this.container.position.set(
        //     this.cup.x + this.cup.width / 2,
        //     liquidTop
        // );
        this.container.position.set(100, 100);

        // Emit new particles if overflowing
        if (this.cup.liquid >= 98) {
            const particlesToEmit = Math.round(this.emissionRate * (this.cup.liquid - 98));
            for (let i = 0; i < particlesToEmit; i++) {
                if (this.particles.length < this.maxParticles) {
                    const particle = new FoamParticle(this.particleTexture);
                    this.particles.push(particle);
                    this.container.addChild(particle);
                }
            }
        }

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const alive = particle.update(delta);

            if (!alive) {
                this.container.removeChild(particle);
                this.particles.splice(i, 1);
                particle.destroy();
            }
        }
    }

    destroy(): void {
        this.app.ticker.remove(this.update.bind(this));
        this.container.destroy({ children: true });
        this.particleTexture.destroy();
    }
}

export { FoamFountain };
