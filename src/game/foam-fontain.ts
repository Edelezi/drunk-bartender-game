import * as PIXI from 'pixi.js';
import { Cup } from './cup';

class FoamParticle extends PIXI.Sprite {
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    life: number;
    maxLife: number;
    initialScale: number;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.reset();
    }

    reset(): void {
        this.life = this.maxLife = 1.5;
        this.alpha = 1.0;
        this.initialScale = 3;
        this.scale.set(this.initialScale);

        const angle = (Math.random() * Math.PI) - Math.PI/2;
        const speed = (2 + Math.random() * 2)/5;
        this.velocity = {
            x: Math.cos(angle) * speed * (Math.random() > .5 ? 1 : -1),
            y: Math.sin(angle) * speed - 2
        };
        this.acceleration = {
            x: 0,
            y: 0.1
        };
    }

    update(delta: number): boolean {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= 0.016;

        const lifeRatio = this.life / this.maxLife;
        this.alpha = lifeRatio;
        this.scale.set(this.initialScale * lifeRatio);

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
    private updateBound: (delta: number) => void;

    constructor(app: PIXI.Application, cup: Cup) {
        this.app = app;
        this.cup = cup;
        this.cup.overflow.add(this.onOverflow, this);

        this.container = new PIXI.Container();
        this.container.name = 'foam';
        this.app.stage.addChild(this.container);

        this.particles = [];
        this.emissionRate = 25;  // Increased emission rate

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF, 1);
        graphics.drawCircle(0, 0, 3);  // Smaller particles
        graphics.endFill();
        this.particleTexture = app.renderer.generateTexture(graphics);

        this.updateBound = this.update.bind(this);
        this.app.ticker.add(this.updateBound);
    }

    private onOverflow(): void {
        this.emissionRate = 20;
        for (let i = 0; i < 100; i++) {  // Emit more particles on overflow
            this.emitParticle();
        }
    }

    private emitParticle(): void {
        const particle = new FoamParticle(this.particleTexture);
        const liquidTop = this.cup.y + this.cup.height - (this.cup.height * this.cup.liquid) / 100;

        particle.position.x = this.cup.x + Math.random() * this.cup.width;
        particle.position.y = liquidTop;
        particle.tint = 0xFFFACD;

        this.particles.push(particle);
        this.container.addChild(particle);
    }

    private update(delta: number): void {
        // Emit particles when liquid level is high enough
        if (this.cup.liquid >= 98) {  // Lowered threshold
            this.emissionRate = 1;
            for (let i = 0; i < this.emissionRate; i++) {
                this.emitParticle();
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
