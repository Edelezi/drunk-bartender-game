import { Graphics, Matrix } from "pixi.js";

interface ITap {
    x: number;
    y: number;
    width: number;
    height: number;
    isPouring: boolean;
}

interface IPointer {
    x: number;
    y: number;
}

class Cup {
    public x: number;
    public y: number;
    public readonly width: number = 100;
    public readonly height: number = 200;
    private fillLevel: number = 50;
    private foamLevel: number = 20;
    private readonly maxFill: number = 180;
    private readonly maxFoam: number = 40;
    private angle: number = 0;
    private time: number = 0;
    private readonly moveSpeed: number = 0.05;
    public gameOver: boolean = false;
    private readonly matrix: Matrix;
    public readonly graphics: Graphics = new Graphics();

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.graphics.name = 'cup';

        const graphics = this.graphics;
        graphics.beginFill(0x00ff00);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();
        // seat.addChild(graphics);

        this.matrix = new Matrix();
    }

    public isUnderTap(tap: ITap): boolean {
        const tapCenter = tap.x + tap.width/2;
        const glassCenter = this.x + this.width/2;
        return Math.abs(tapCenter - glassCenter) < 20;
    }

    public update(pointer: IPointer | null, screenWidth: number, screenHeight: number, tap: ITap): void {
        if (this.gameOver) return;

        this.time += 0.02;

        if (pointer) {
            this.x += (pointer.x - this.x) * this.moveSpeed;
            this.y += (pointer.y - this.y) * this.moveSpeed;
        }

        this.x = Math.max(this.width/2, Math.min(screenWidth - this.width/2, this.x));
        this.y = Math.max(this.height/2, Math.min(screenHeight - this.height/2, this.y));

        if (tap.isPouring && this.isUnderTap(tap)) {
            if (this.fillLevel < this.maxFill) {
                this.fillLevel += 1;
                this.foamLevel += 0.8;
            }

            if (this.fillLevel + this.foamLevel > this.height) {
                this.gameOver = true;
            }
        } else if (this.foamLevel > this.maxFoam) {
            this.foamLevel -= 0.2;
        }

        const maxRotation = Math.PI / 6;
        this.angle = Math.sin(this.time) * maxRotation;
    }

    public draw(): void {
        this.graphics.clear();
        // Draw glass
        this.graphics.lineStyle(3, 0xb2ebf2);
        this.graphics.beginFill(0xb2ebf2, 0.2);

        this.matrix.identity()
            .translate(-this.x - this.width/2, -this.y - this.height/2)
            .rotate(this.angle)
            .translate(this.x + this.width/2, this.y + this.height/2);

        this.graphics.setMatrix(this.matrix);
        this.graphics.drawRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );
        this.graphics.endFill();

        // Reset transformation
        this.graphics.setMatrix(new Matrix());

        if (this.fillLevel > 0) {
            this.drawLiquid(this.fillLevel, 0xf39c12);
        }

        if (this.foamLevel > 0) {
            this.drawLiquid(this.foamLevel, 0xfff5e6, -this.fillLevel);
        }
    }

    private drawLiquid(fillLevel: number, color: number, baseOffset: number = 0): void {
        const halfWidth = this.width/2;
        const halfHeight = this.height/2;
        const liquidAngle = -this.angle * 0.7;
        const leftOffset = Math.tan(liquidAngle) * halfHeight;
        const rightOffset = -leftOffset;

        this.graphics.beginFill(color);
        this.graphics.moveTo(this.x - halfWidth, this.y + halfHeight);
        this.graphics.lineTo(
            this.x - halfWidth,
            this.y + halfHeight - fillLevel + (leftOffset - rightOffset) + baseOffset
        );
        this.graphics.lineTo(
            this.x + halfWidth,
            this.y + halfHeight - fillLevel + baseOffset
        );
        this.graphics.lineTo(this.x + halfWidth, this.y + halfHeight);
        this.graphics.closePath();
        this.graphics.endFill();
    }

    public getFillPercentage(): number {
        return Math.round((this.fillLevel / this.maxFill) * 100);
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    public getDimensions(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }
}

export { Cup }
