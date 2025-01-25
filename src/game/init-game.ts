import { Application, Sprite, BLEND_MODES } from "pixi.js";
import { getSpine, getTexture } from "./atlas";
import { Spine } from "pixi-spine";
import { pixiMove } from "#src/pixi/pixi-move";
import { Scene } from "./scene";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let pixiApp: Application;
function makeSprite(texturePath = "", x = 0, y = 0, sx = 1, sy = 1) {
    const sp = new Sprite(getTexture(texturePath));
    sp.anchor.set(0.5);
    sp.x = x;
    sp.y = y;
    sp.scale.set(sx, sy);
    pixiApp.stage.addChild(sp);
    return sp;
}

function makeScene(x = 0, y = 0) {
    const slot = new Scene();
    pixiApp.stage.addChild(slot.container);
    const mask = makeSprite("main/mask.png", x, y);
    slot.container.mask = mask;
    return slot;
}

type Game = {
    scene: Scene;
};

export function initGame(app: Application) {
    pixiApp = app;
    // const cx = app.view.width / 2;
    // const cy = app.view.height / 2 + 90;
    const cx = 400;
    const cy = 390;

    // makeSprite("main/bg.png", cx, cy);
    const scene = makeScene(cx, cy);

    const sp = new Sprite(getTexture('main/arrow.png'));
    sp.anchor.set(0.5);
    sp.x = 100;
    sp.y = 100;
    sp.scale.set(1, 1);
    pixiApp.stage.addChild(sp);

    const game: Game = {
        scene
    };
    return { game };
}
