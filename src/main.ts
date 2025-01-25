import { Graphics, Text, type Application } from "pixi.js";
import { createText } from "./helpers/createText";
import { pixiInit } from "./pixi/pixi-init";
import { initGame } from "./game/init-game";

let app: Application;
const fps: number = 60;
const quad = {
    x: 0,
    y: 0,
    width: 24,
    height: 24
};
let testDirection = 1;

function gameLoop(delta: number) {
    quad.x += delta * 100 * testDirection;
    if (quad.x + quad.width > app.renderer.width) {
        testDirection = testDirection * -1;
    }
}

async function init() {
    const gameElement = document.querySelector<HTMLDivElement>("#canvas");
    if (!(gameElement && gameElement instanceof HTMLCanvasElement)) {
        throw new Error("canvas not found");
    }
    app = await pixiInit(gameElement as HTMLCanvasElement);

    const text = createText({ value: "test", x: 200, y: 200, fill: 0x00ff00 });
    app.stage.addChild(text);

    const test = new Text("test");
    test.position.set(100, 100);
    app.stage.addChild(test);

    const { slot } = initGame(app);
    slot.init();

    addEventListener("spin-click", slot.startGame.bind(slot));

    // const graphics: Graphics = new Graphics();
    // graphics.rect(quad.x, quad.y, quad.width, quad.height);
    // graphics.fill(0xff0000);
    // app.stage.addChild(graphics);

    // setInterval(() => {
    //     gameLoop(1 / fps);
    //     graphics.position.set(quad.x, quad.y);
    // }, 1000 / fps);
}

init();
