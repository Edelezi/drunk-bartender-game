import { IPlayable } from "#src/interfaces";
import { Container, Sprite } from "pixi.js";

export class MoveSymbols implements IPlayable {
    distance: number;
    hideY: number;
    speed: number;
    createSymbol: () => Sprite;
    symbols: Sprite[];
    bottomSymbol: Sprite | null;
    symbolsPool: Sprite[];
    scene: Container;
    x: number;

    constructor(scene: Container, createSymbol: () => Sprite, x: number) {
        this.x = x;
        this.distance = 100;
        this.hideY = 343;
        this.speed = 100;
        this.createSymbol = createSymbol;
        this.scene = scene;

        this.symbols = [];
        this.bottomSymbol = null;
        this.symbolsPool = [];

        // Create initial symbols
        let pos = -43;
        for (let i = 0; i < 5; i++) {
            // Create 5 initial symbols or as needed
            const s = this.createNewSymbol();
            s.position.set(s.position.x, pos);
            pos -= this.distance;
            this.symbols.push(s);

            if (!this.bottomSymbol || s.position.y < this.bottomSymbol.position.y) {
                this.bottomSymbol = s;
            }
        }
    }

    update(/*delta: number*/) {}

    step(stepInterval: number): void {
        for (let i = 0; i < this.symbols.length; i++) {
            const s = this.symbols[i];
            s.position.y += (this.speed * stepInterval) / 1000;
            if (s.position.y > this.hideY) {
                s.visible = false;
                this.symbolsPool.push(s);
            }
        }

        if (this.bottomSymbol && this.bottomSymbol.position.y > 0) {
            const newSymbol = this.createNewSymbol();
            this.resetSymbolPosition(newSymbol);
            this.symbols.push(newSymbol);
        }
    }

    resetSymbolPosition(s: Sprite) {
        if (this.bottomSymbol) {
            const ty = this.bottomSymbol.position.y - this.distance;
            console.log("set pos " + ty);
            s.visible = true;
            s.position.set(this.bottomSymbol.position.x, ty);
            this.bottomSymbol = s;
        }
    }

    createNewSymbol(): Sprite {
        if (!this.createSymbol) {
            console.error("No symbol template set.");
            return null;
        }

        const newSymbol = this.createSymbol();
        newSymbol.x = this.x;
        newSymbol.visible = true;
        this.scene.addChild(newSymbol);

        return newSymbol;
    }
}
