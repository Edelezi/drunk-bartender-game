import * as PIXI from 'pixi.js';
import { Cup } from './cup';

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
    velocity: Vector2D = { x: 0, y: 0 };
    acceleration: Vector2D = { x: 0, y: 0 };

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
    private cup: Cup | null = null;
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

    setCup(cup: Cup): void {
        this.cup = cup;
    }

    private checkCupCollision(particle: BeerParticle): boolean {
        if (!this.cup) return false;

        // Convert particle position to global coordinates
        const particleGlobalPos = this.container.toGlobal(new PIXI.Point(particle.x, particle.y));

        // Check horizontal bounds first
        const cupLeft = this.cup.x;
        const cupRight = this.cup.x + this.cup.width;
        const cupBottom = this.cup.y + this.cup.height;
        const liquidTop = cupBottom - (this.cup.height * this.cup.liquid) / 100;

        const fill = () => {
            // If particle hits liquid surface or cup is empty
            if (particleGlobalPos.y >= liquidTop || this.cup.liquid === 0) {
                const particleVolume = 0.05; // Adjust this value to control filling speed
                this.cup.liquid = Math.min(100, this.cup.liquid + particleVolume);
                this.cup.foam = Math.min(
                    20,
                    this.cup.foam + (particleVolume * (Math.random() * 0.5 + 0.5))
                );
                return true;
            }
        }
        if (particleGlobalPos.x >= cupLeft && particleGlobalPos.x <= cupRight) {
            // Check if particle hits the liquid surface
            if (this.cup.liquid >= 5 && particleGlobalPos.y >= liquidTop && particleGlobalPos.y <= cupBottom) {
                fill();
                return true;
            }
            // Check if particle hits the cup bottom when empty
            if (this.cup.liquid < 5 && particleGlobalPos.y >= cupBottom - 2 && particleGlobalPos.y <= cupBottom + 5) {
                fill();
                return true;
            }
        }


        // Check if particle is within cup boundaries
        // const cupLeft = this.cup.x;
        // const cupRight = this.cup.x + this.cup.width;
        // const cupTop = this.cup.y;
        // const cupBottom = this.cup.y + this.cup.height;
        // const liquidTop = cupBottom - (this.cup.height * this.cup.liquid) / 100;

        // if (particleGlobalPos.x >= cupLeft &&
        //     particleGlobalPos.x <= cupRight &&
        //     particleGlobalPos.y >= cupTop &&
        //     particleGlobalPos.y <= cupBottom) {

        // }
        return false;
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
                particle.reset();
                this.particles.push(particle);
                this.container.addChild(particle);
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const alive = particle.update();

            if (this.checkCupCollision(particle)) {
                this.container.removeChild(particle);
                this.particles.splice(i, 1);
                particle.destroy();

                this.cup.isPouring = true;
            } else if (!alive || particle.y > 300) {
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

export { BeerParticle, BeerParticleSystem };
