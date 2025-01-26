import { Signal } from '#src/common/signal';
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
    private graphics: PIXI.Graphics;
    width: number;
    height: number;
    isPouring: boolean;
    foamFillRate: number;
    foamDecayRate: number;
    bubbles: Bubble[];
    bubbleSpawnRate: number;
    overflow: Signal<void> = new Signal();
    container: PIXI.Container;
    // deltaSeconds: number; //delta from preivous frame

    constructor({ x, y }: CupProps) {
        this.liquid = 0;
        this.foam = 0;
        this.x = x;
        this.y = y;
        this.container = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
        this.width = 196/2;
        this.height = 330/2;
        this.isPouring = false;
        this.foamDecayRate = 0.1;
        this.bubbles = [];
        this.bubbleSpawnRate = 0.2;

        const cupBack = new PIXI.Sprite(PIXI.Texture.from("/assets/cup.png"));
        this.container.addChild(cupBack);
        cupBack.name = 'cup';
        const sc = .5;
        cupBack.scale.set(sc, sc);
        cupBack.position.set(-13, -11);
    }

    update(delta: number): void {
        this.container.position.set(this.x, this.y);
        //Bubbles sim
        if (Math.random() < this.bubbleSpawnRate && this.liquid > 0) {
            const bubbleX = Math.random() * this.width;
            const liquidHeight = (this.height * this.liquid) / 100;
            const bubbleY = this.height - Math.random() * liquidHeight;
            this.bubbles.push(new Bubble({
                x: bubbleX,
                y: bubbleY,
                size: Math.random() * 2 + 1
            }));
        }

        this.bubbles = this.bubbles.filter(bubble => {
            bubble.update(0, this.width);
            const liquidTop = 0 + this.height - (this.height * this.liquid) / 100;
            return bubble.y > liquidTop;
        });

        // Foam decrease over time
        if (this.foam > 4) {
            //TODO convert extra foam to beer
            this.foam = Math.max(4, this.foam - this.foamDecayRate * delta);
        }

        // Overflow - add foam fountain
        if (this.liquid + this.foam >= 100) {
            this.foam = 100 - this.liquid;
            console.log('liquid overflow');
            this.overflow.dispatch()
            return;
        }

        // Convert delta to seconds
        // this.deltaSeconds = delta / 1000;
        // if (this.isPouring)
            // this.pour(this.deltaSeconds);
    }

    /*
    pour(deltaSeconds) {
        const totalContent = this.liquid + this.foam;
        if (totalContent < 100) {
            const remainingSpace = 100 - totalContent;
            // Apply fill rates per second
            const liquidIncrease = Math.min(remainingSpace, this.liquidFillRate * deltaSeconds);
            const foamIncrease = Math.min(remainingSpace - liquidIncrease, this.foamFillRate * deltaSeconds);

            this.liquid += liquidIncrease;
            this.foam += foamIncrease;
        }
    }
    */

    draw(): void {
        const g = this.graphics;
        g.clear();

        // Draw cup outline
        g.lineStyle(2, 0x666666);
        g.beginFill(0xFFFFFF, 0.1);
        g.drawRect(0, 0, this.width, this.height);
        g.endFill();

        // Calculate heights
        const liquidHeight = (this.height * this.liquid) / 100;
        const foamHeight = (this.height * this.foam) / 100;

        // Draw liquid
        g.beginFill(0xFEB20F);
        g.drawRect(
            0,
            0 + this.height - liquidHeight,
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
            0,
            0 + this.height - liquidHeight - foamHeight,
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
