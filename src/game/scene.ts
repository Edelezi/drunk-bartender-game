import { Container } from "pixi.js";
import { MoveSymbols } from "./move-symbols";
import { Ticker, assert, getRandomArrayElement, getRandomIndex } from "../common";

let previousTimeStamp = -1;

export class Scene {
    container: Container = new Container();
    currentTime = 0;
    reel: MoveSymbols[] = [];
    ticker: Ticker = new Ticker();
    moving = false;

    init() {
        this.animate = this.animate.bind(this);

        requestAnimationFrame(this.animate);
    }

    animate(timeStamp: number) {
        if (previousTimeStamp === -1) {
            previousTimeStamp = timeStamp;
        } else {
            this.update(timeStamp - previousTimeStamp);
        }

        previousTimeStamp = timeStamp;
        // resize();
        requestAnimationFrame(this.animate);
    }

    startGame() {
    }

    onResize(width: number, height: number) {
        console.log("onResize " + width + "x" + height);
    }

    update(dt: number) {
        this.currentTime += dt;
    }
}
