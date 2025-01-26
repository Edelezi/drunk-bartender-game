import { Signal } from '#src/common/signal';
import { pixiApp } from '#src/pixi/pixi-init';
import * as PIXI from 'pixi.js';

interface BubbleProps {
    x: number;
    y: number;
    size: number;
}

class Bubble {
    x: number;
    y: number;
    size: number;
    speed: number;
    wobbleSpeed: number;
    wobbleDistance: number;
    time: number;

    constructor({ x, y, size }: BubbleProps) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = Math.random() * 0.5 + 0.2;
        this.wobbleSpeed = Math.random() * 0.1;
        this.wobbleDistance = Math.random() * 2;
        this.time = Math.random() * Math.PI * 2;
    }

    update(cupX: number, cupWidth: number): void {
        this.y -= this.speed;
        this.time += this.wobbleSpeed;
        const newX = this.x + Math.sin(this.time) * this.wobbleDistance;
        if (newX >= cupX && newX <= cupX + cupWidth) {
            this.x = newX;
        }
    }
}

interface CupProps {
    x: number;
    y: number;
}

class Cup {
    liquid: number;
    foam: number;
    x: number;
    y: number;
    graphics: PIXI.Graphics;
    width: number;
    height: number;
    isPouring: boolean;
    liquidFillRate: number;
    foamFillRate: number;
    foamDecayRate: number;
    bubbles: Bubble[];
    bubbleSpawnRate: number;
    overflow: Signal<void> = new Signal();

    constructor({ x, y }: CupProps) {
        this.liquid = 0;
        this.foam = 0;
        this.x = x;
        this.y = y;
        this.graphics = new PIXI.Graphics();
        this.width = 60;
        this.height = 100;
        this.isPouring = false;
        this.liquidFillRate = 0.4;
        this.foamFillRate = this.liquidFillRate * (Math.random() * 1.7 + 0.3);
        this.foamDecayRate = 0.1;
        this.bubbles = [];
        this.bubbleSpawnRate = 0.2;
    }

    update(delta: number): void {
        //Bubbles sim
        if (Math.random() < this.bubbleSpawnRate && this.liquid > 0) {
            const bubbleX = this.x + Math.random() * this.width;
            const liquidHeight = (this.height * this.liquid) / 100;
            const bubbleY = this.y + this.height - Math.random() * liquidHeight;
            this.bubbles.push(new Bubble({
                x: bubbleX,
                y: bubbleY,
                size: Math.random() * 2 + 1
            }));
        }

        this.bubbles = this.bubbles.filter(bubble => {
            bubble.update(this.x, this.width);
            const liquidTop = this.y + this.height - (this.height * this.liquid) / 100;
            return bubble.y > liquidTop;
        });

        // Foam decrease over time
        if (this.foam > 4) {
            this.foam = Math.max(4, this.foam - this.foamDecayRate * delta);
        }

        // Overflow - add foam fountain
        if (this.liquid + this.foam >= 100) {
            this.foam = 100 - this.liquid;
            console.log('liquid overflow');
            this.overflow.dispatch()
            return;
        }

        if (this.isPouring) {
            const totalContent = this.liquid + this.foam;
            if (totalContent < 100) {
                const remainingSpace = 100 - totalContent;
                const liquidIncrease = Math.min(remainingSpace, this.liquidFillRate);
                const foamIncrease = Math.min(remainingSpace - liquidIncrease, this.foamFillRate);

                this.liquid += liquidIncrease;
                this.foam += foamIncrease;
            }
            this.isPouring = false
        }
    }

    draw(): void {
        const g = this.graphics;
        g.clear();

        // Draw cup outline
        g.lineStyle(2, 0x666666);
        g.beginFill(0xFFFFFF, 0.1);
        g.drawRect(this.x, this.y, this.width, this.height);
        g.endFill();

        // Calculate heights
        const liquidHeight = (this.height * this.liquid) / 100;
        const foamHeight = (this.height * this.foam) / 100;

        // Draw liquid
        g.beginFill(0xFEB20F);
        g.drawRect(
            this.x,
            this.y + this.height - liquidHeight,
            this.width,
            liquidHeight
        );
        g.endFill();

        // Draw bubbles
        g.lineStyle(0);
        this.bubbles.forEach(bubble => {
            g.beginFill(0xFFFFFF, 0.4);
            g.drawCircle(bubble.x, bubble.y, bubble.size);
            g.endFill();
        });

        // Draw foam
        g.beginFill(0xFFFACD, 0.8);
        g.drawRect(
            this.x,
            this.y + this.height - liquidHeight - foamHeight,
            this.width,
            foamHeight
        );
        g.endFill();

        /*
        const textBg = new PIXI.Graphics();
        textBg.beginFill(0xFFFFFF, 0.8);
        textBg.drawRect(this.x + this.width + 10, this.y, 120, 50);
        textBg.endFill();
        pixiApp.stage.addChild(textBg);

        const style = new PIXI.TextStyle({
            fontSize: 12,
            fill: '#000000'
        });

        [
            { text: `Liquid: ${Math.round(this.liquid)}%`, y: 5 },
            { text: `Foam: ${Math.round(this.foam)}%`, y: 25 },
            { text: `Total: ${Math.round(this.liquid + this.foam)}%`, y: 45 }
        ].forEach(({ text, y }) => {
            const textSprite = new PIXI.Text(text, style);
            textSprite.position.set(this.x + this.width + 15, this.y + y);
            pixiApp.stage.addChild(textSprite);
        });
        */
    }
}

export { Cup }
