import { Container, Graphics, Sprite } from "pixi.js";
import { Ticker, assert, getRandomArrayElement, getRandomIndex } from "../common";
import { barSpots } from "#src/model/barModel";
import { getTexture } from "#src/game/atlas";

let previousTimeStamp = -1;

export class Scene {
    container: Container = new Container();
    currentTime = 0;
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
        for (let i = 0; i < barSpots; i++) {
            this.createSeat(i);
        }
        console.log("startGame");
    }

    private createSeat(pos: number) {
        const sp = new Sprite(getTexture("main/arrow.png"));
        sp.anchor.set(0.5);
        sp.x = 100 + pos * 100;
        sp.y = 100;
        sp.scale.set(1, 1);
        this.container.addChild(sp);

        const seat = new Container();
        seat.x = 100 + pos * 100;
        seat.y = 100;
        seat.width = 50;
        seat.height = 50;
        seat.interactive = true;

        seat.on("pointerdown", () => {
            console.log("pointerdown");
        });

        // seat is red square
        const graphics = new Graphics();
        graphics.beginFill(0xff0000);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();
        seat.addChild(graphics);

        this.container.addChild(seat);
    }

    onResize(width: number, height: number) {
        console.log("onResize " + width + "x" + height);
    }

    update(dt: number) {
        this.currentTime += dt;
    }
}
