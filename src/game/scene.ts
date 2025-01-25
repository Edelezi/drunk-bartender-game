import { Container, Graphics, Sprite } from "pixi.js";
import { Ticker, assert, getRandomArrayElement, getRandomIndex } from "../common";
import { barSpots, clientArrivedSignal, clientLeaveSignal, ClientModel } from "#src/model/barModel";
import { getTexture } from "#src/game/atlas";
import { GameController } from "#src/game/gameController";
import { level1 } from "#src/model/levelModel";

let previousTimeStamp = -1;

export class Scene {
    container: Container = new Container();
    currentTime = 0;
    ticker: Ticker = new Ticker();
    moving = false;
    gameController = new GameController();

    init() {
        this.animate = this.animate.bind(this);

        for (let i = 0; i < barSpots; i++) {
            this.createSeat(i);
        }

        requestAnimationFrame(this.animate);

        clientLeaveSignal.add(this.onClientLeave);
        clientArrivedSignal.add(this.onClientArrived);

        window.addEventListener("start-game", () => {
            this.startGame();
        });
    }

    onClientArrived({ spot }: { client: ClientModel; spot: number }) {
        const seat = this.container.getChildByName("seat" + spot) as Container;
        assert("spot not found", !!seat);

        seat.removeChildren();
        // draw green square instead of red
        const graphics = new Graphics();
        graphics.beginFill(0x00ff00);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();
        seat.addChild(graphics);
    }

    onClientLeave({ spot }: { client: ClientModel; spot: number }) {
        console.log("onClientLeave");

        const seat = this.container.getChildByName("seat" + spot) as Container;
        assert("spot not found", !!seat);

        seat.removeChildren();

        // draw red square instead of green
        const graphics = new Graphics();
        graphics.beginFill(0xff0000);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();
        seat.addChild(graphics);
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
        this.gameController.startGame(level1);
    }

    private createSeat(pos: number) {
        const seat = new Container();
        seat.x = 100 + pos * 100;
        seat.y = 100;
        seat.width = 50;
        seat.height = 50;
        seat.interactive = true;
        seat.name = "seat" + pos;

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
