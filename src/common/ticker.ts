import { IPlayable } from "../interfaces";

const stepInterval = 16.666667; // ~60 frames per second
const timeout = 50000;
const minElapsed = 0.0000001;
const maxElapsed = 10000000;
let gameSpeed = 1;

let previousSpeed = 0;
function enableDebugShortcuts() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "1") {
            gameSpeed = 0.1;
            previousSpeed = gameSpeed;
        } else if (event.key === "2") {
            gameSpeed = 0.5;
            previousSpeed = gameSpeed;
        } else if (event.key === "3") {
            gameSpeed = 1;
            previousSpeed = gameSpeed;
        } else if (event.key === "4") {
            gameSpeed = 4;
            previousSpeed = gameSpeed;
        } else if (event.key === "5") {
            gameSpeed = 10;
            previousSpeed = gameSpeed;
        } else if (event.key === "6") {
            gameSpeed = 30;
            previousSpeed = gameSpeed;
        } else if (event.key === " ") {
            if (gameSpeed === 0) {
                gameSpeed = previousSpeed;
            } else {
                previousSpeed = gameSpeed;
                gameSpeed = 0;
            }
        }
    });
}
enableDebugShortcuts();

export class Ticker {
    private players: IPlayable[] = [];
    private lastTime: number = -1;
    private accumulator: number = 0;
    private timeToStep: number = 0;
    private animateBind: () => void;

    constructor() {
        this.animateBind = this.animate.bind(this);
        requestAnimationFrame(this.animateBind);
    }

    private getDelta(now: number): number {
        if (this.lastTime === -1) {
            this.lastTime = now;
        }

        const delta = now - this.lastTime;
        this.lastTime = now;

        if (delta > timeout || (this.accumulator += delta * gameSpeed) < minElapsed) {
            return 0;
        }

        const elapsed = this.accumulator < maxElapsed ? this.accumulator : maxElapsed;
        this.accumulator -= elapsed;

        return elapsed;
    }

    public start(p: IPlayable): IPlayable {
        this.add(p);
        return p;
    }

    public add(p: IPlayable) {
        this.players.push(p);
        return p;
    }

    public remove(p) {
        const index = this.players.indexOf(p);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    public reset(): void {
        this.timeToStep = 0;
        this.lastTime = -1;
    }

    public clear(): void {
        this.players = [];
    }

    private animate(timeStamp: number): void {
        this.timeToStep += this.getDelta(timeStamp);

        for (const player of this.players) {
            if (player.update) {
                player.update(timeStamp);
            }
        }

        while (this.timeToStep >= stepInterval) {
            for (const player of this.players) {
                player.step(stepInterval);
            }
            this.timeToStep -= stepInterval;
        }
        requestAnimationFrame(this.animateBind);
    }
}
