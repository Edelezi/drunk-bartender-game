import { Application, Sprite, BLEND_MODES } from "pixi.js";
import { getSpine, getTexture } from "./atlas";
import { Slot } from "./slot";
import { Spine } from "pixi-spine";
import { pixiMove } from "#src/pixi/pixi-move";

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

function makeSlot(x = 0, y = 0) {
    const slot = new Slot();
    pixiApp.stage.addChild(slot.container);
    const mask = makeSprite("main/mask.png", x, y);
    slot.container.mask = mask;
    return slot;
}

type Game = {
    shadows: Sprite[];
    selected: Sprite[];
    arrow: Spine[];
};

const game: Game = {
    shadows: [],
    selected: [],
    arrow: []
};

export function initGame(app: Application) {
    pixiApp = app;
    // const cx = app.view.width / 2;
    // const cy = app.view.height / 2 + 90;
    const cx = 400;
    const cy = 390;

    // makeSprite("main/bg.png", cx, cy);
    // const slot = makeSlot(cx, cy);
    // makeSprite("main/frames.png", cx, cy);

    // makeSprite('main/arrow.png', 100, 100);
    const sp = new Sprite(getTexture('main/arrow.png'));
    sp.anchor.set(0.5);
    sp.x = 100;
    sp.y = 100;
    sp.scale.set(1, 1);
    pixiApp.stage.addChild(sp);

    // const mask2 = makeSprite("main/mask2.png", 100, 190);
    // mask2.scale.set(100, 0.15);
    // pixiMove(mask2);

    // const positions = [115, 250, 390];
    // for (let i = 0; i < positions.length; i++) {
    //     const x = positions[i];
    //     const shadow = (game.shadows[i] = makeSprite("main/shadow.png", x, cy + 15));
    //     shadow.blendMode = BLEND_MODES.MULTIPLY;
    //     shadow.alpha = 0.45;
    //     game.selected[i] = makeSprite("main/selected.png", x, cy + 7);

    //     const arrow = (game.arrow[i] = getSpine("arrow"));
    //     arrow.position.set(x, 200);
    //     arrow.state.setAnimation(0, "animation", true);
    //     app.stage.addChild(arrow);
    //     arrow.mask = mask2;
    // }

    // selectNext();
    // const ay = cy + 15;
    // const arrows = [
    //     makeSprite("main/arrow.png", 60, ay),
    //     makeSprite("main/arrow.png", 166, ay, -1),
    //     makeSprite("main/arrow.png", 200, ay),
    //     makeSprite("main/arrow.png", 300, ay, -1),
    //     makeSprite("main/arrow.png", 335, ay),
    //     makeSprite("main/arrow.png", 439, ay, -1)
    // ];

    return { slot, game };
}
