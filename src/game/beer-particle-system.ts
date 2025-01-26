import { Vector2 } from 'pixi-spine';
import * as PIXI from 'pixi.js';

interface Vector2D {
    x: number;
    y: number;
}

interface ParticleOptions {
    maxParticles?: number;
    emissionRate?: number;
    particleSize?: number;
    gravity?: number;
    initialVelocity?: Vector2D;
    color?: number;
}

class BeerParticle extends PIXI.Sprite {
    velocity: Vector2D = new Vector2();
    acceleration: Vector2D = new Vector2();

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.reset();
    }

    reset(): void {
        this.x = Math.random() * 10 - 5;
        this.y = 0;
        this.alpha = 0.6 + Math.random() * 0.4;
        this.scale.set(0.5 + Math.random() * 0.5);
        this.velocity = {
            x: .2 * Math.random() * (Math.random() > .5 ? 1 : -1),
            y: 2 + Math.random() * 3
        };
        this.acceleration = {
            x: 0,
            y: 0.1
        };
    }

    update(): boolean {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
        return this.alpha > 0;
    }
}

class BeerParticleSystem {
    private app: PIXI.Application;
    private container: PIXI.Container;
    private particleTexture: PIXI.Texture;
    private particles: BeerParticle[];
    private options: Required<ParticleOptions>;
    isFlowing: boolean;

    constructor(app: PIXI.Application, position: Vector2D, options: ParticleOptions = {}) {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.position.set(position.x, position.y);
        this.app.stage.addChild(this.container);

        this.options = {
            maxParticles: options.maxParticles ?? 200,
            emissionRate: options.emissionRate ?? 5,
            particleSize: options.particleSize ?? 4,
            gravity: options.gravity ?? 5,
            initialVelocity: options.initialVelocity ?? { x: 0, y: 20 },
            color: options.color ?? 0xf4e675
        };

        const graphics = new PIXI.Graphics();
        graphics.beginFill(this.options.color);
        graphics.drawCircle(0, 0, this.options.particleSize);
        graphics.endFill();
        this.particleTexture = app.renderer.generateTexture(graphics);

        this.particles = [];
        this.isFlowing = false;

        this.app.ticker.add(this.update.bind(this));
    }

    startFlow(): void {
        this.isFlowing = true;
    }

    stopFlow(): void {
        this.isFlowing = false;
    }

    private update(): void {
        if (this.isFlowing && this.particles.length < this.options.maxParticles) {
            for (let i = 0; i < this.options.emissionRate; i++) {
                const particle = new BeerParticle(this.particleTexture);
                this.particles.push(particle);
                this.container.addChild(particle);
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const alive = particle.update();

            if (!alive || particle.y > 300) {
                this.container.removeChild(particle);
                this.particles.splice(i, 1);
                particle.destroy();
                // particle.reset();
            }
        }
    }

    destroy(): void {
        this.app.ticker.remove(this.update.bind(this));
        this.container.destroy({ children: true });
        this.particleTexture.destroy();
    }
}

export { BeerParticle, BeerParticleSystem };
