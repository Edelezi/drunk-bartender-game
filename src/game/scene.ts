import { Container, Graphics } from "pixi.js";
import { assert, Ticker } from "../common";
import { barSpots, clientArrivedSignal, clientLeaveSignal, ClientModel } from "#src/model/barModel";
import { GameController } from "#src/game/gameController";
import { level1 } from "#src/model/levelModel";
import { clientSelectSignal, gameStartSignal } from "#src/signals/game";

let previousTimeStamp = -1;

export class Scene {
    container: Container = new Container();
    currentTime = 0;
    ticker: Ticker = new Ticker();
    moving = false;
    gameController = new GameController();
    selectedClientSpot: number = -1;

    init() {
        this.animate = this.animate.bind(this);

        for (let i = 0; i < barSpots; i++) {
            this.createSeat(i);
        }

        requestAnimationFrame(this.animate);

        clientLeaveSignal.add(this.onClientLeave, this);
        clientArrivedSignal.add(this.onClientArrived, this);
        gameStartSignal.add(() => {
            this.startGame();
        });
    }

    onClientArrived({ client, spot }: { client: ClientModel; spot: number }) {
        const seat = this.container.getChildByName("seat" + spot) as Container;
        assert("spot not found", !seat);

        seat.removeChildren();
        client.cup.container.scale.set(0.5, 0.5);
        client.cup.container.visible = true;
        seat.addChild(client.cup.container);
    }

    onClientLeave({ spot }: { client: ClientModel; spot: number }) {
        console.log("onClientLeave");

        const seat = this.container.getChildByName("seat" + spot) as Container;
        assert("spot not found", !seat);

        seat.removeChildren();

        if (spot === this.selectedClientSpot) {
            this.selectedClientSpot = -1;
        }

        // draw red square instead of green
        // const graphics = new Graphics();
        // graphics.beginFill(0xff0000);
        // graphics.drawRect(0, 0, 50, 50);
        // graphics.endFill();
        // seat.addChild(graphics);
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

    private selectSpot(pos: number) {
        if (this.selectedClientSpot) {
            const prevClient = this.gameController.barModel.getClient(this.selectedClientSpot);
            prevClient.cup.container.visible = true;
        }
        this.selectedClientSpot = pos;
        const client = this.gameController.barModel.getClient(pos);
        client.cup.container.visible = false;
        clientSelectSignal.dispatch({ spot: pos, client });
    }

    private createSeat(pos: number) {
        const seat = new Container();
        seat.x = 100 + pos * 100;
        seat.y = 100;
        seat.width = 50;
        seat.height = 50;
        seat.interactive = true;
        seat.name = "seat" + pos;
        seat.addEventListener("click", () => {
            if (this.gameController.barModel.getClient(pos)) {
                this.selectSpot(pos);
            }
        });

        seat.on("pointerdown", () => {
            console.log("pointerdown");
        });

        // seat is red square
        // const graphics = new Graphics();
        // graphics.beginFill(0xff0000);
        // graphics.drawRect(0, 0, 50, 50);
        // graphics.endFill();
        // seat.addChild(graphics);

        this.container.addChild(seat);
    }

    onResize(width: number, height: number) {
        console.log("onResize " + width + "x" + height);
    }

    update(dt: number) {
        this.currentTime += dt;
    }
}
