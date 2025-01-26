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
        this.life = 10.0;
        this.maxLife = 5.5 + Math.random() * 0.5;
        this.alpha = 0.8;
        this.scale.set(0.8 + Math.random() * 0.4);

        const angle = (Math.random() * Math.PI) - Math.PI/2;
        const speed = (2 + Math.random() * 3) / 10;

        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 4
        };

        this.acceleration = {
            x: 0,
            y: 0.2
        };
    }

    update(delta: number): boolean {
        this.velocity.x += this.acceleration.x * delta;
        this.velocity.y += this.acceleration.y * delta;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.life -= delta;
        this.alpha = Math.min(0.8, (this.life / this.maxLife) * 0.8);
        this.scale.set(
            (0.8 + Math.random() * 0.4) * (this.life / this.maxLife)
        );

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
    private updateBound: (delta: number) => void;

    constructor(app: PIXI.Application, cup: Cup) {
        this.app = app;
        this.cup = cup;
        this.cup.overflow.add(this.onOverflow, this);

        this.container = new PIXI.Container();
        this.container.name = 'foam';
        this.app.stage.addChild(this.container);

        this.particles = [];
        this.emissionRate = 3;

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF, 1);
        graphics.drawCircle(0, 0, 5);
        graphics.endFill();

        this.particleTexture = app.renderer.generateTexture(graphics);
        this.updateBound = this.update.bind(this);
        this.app.ticker.add(this.updateBound);
    }

    private onOverflow(): void {
        console.log('Overflow detected');
    }

    private update(delta: number): void {
        const liquidTop = this.cup.y + this.cup.height - (this.cup.height * this.cup.liquid) / 100;
        this.container.position.set(
            0, 0
        );

        if (this.cup.liquid >= 0) {
            // const particlesToEmit = Math.round(this.emissionRate * ((this.cup.liquid - 95) / 5));
            const particlesToEmit = 10;

            for (let i = 0; i < particlesToEmit; i++) {
                const particle = new FoamParticle(this.particleTexture);
                particle.position.x = this.cup.x + Math.random() * this.cup.width;
                particle.position.y = liquidTop - 10;
                particle.tint = 0xFFFACD;
                this.particles.push(particle);
                this.container.addChild(particle);
            }
        }

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
        this.app.ticker.remove(this.updateBound);
        this.cup.overflow.unsubscribe(this.onOverflow);
        this.container.destroy({ children: true });
        this.particleTexture.destroy();
    }
}

export { FoamFountain };
