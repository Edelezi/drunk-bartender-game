import { Application, Sprite, BLEND_MODES, Texture, Text } from "pixi.js";
import { getSpine, getTexture } from "./atlas";
import { Spine } from "pixi-spine";
import { pixiMove } from "#src/pixi/pixi-move";
import { Scene } from "./scene";
import { Cup } from "./cup";
import { BeerParticle, BeerParticleSystem } from "./beer-particle-system";
import { TapButton } from "./tap-button";

const _sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

function makeScene(_x = 0, _y = 0) {
    const slot = new Scene();
    slot.init();
    pixiApp.stage.addChild(slot.container);
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
    const sprite = new Sprite(Texture.from("/bg.jpeg"));
    sprite.scale.set(.8, .8);
    pixiApp.stage.addChild(sprite);

    const scene = makeScene(cx, cy);

    const sp = new Sprite(getTexture("main/arrow.png"));
    sp.anchor.set(0.5);
    sp.x = 100;
    sp.y = 100;
    sp.scale.set(1, 1);
    pixiApp.stage.addChild(sp);

    const game: Game = {
        scene
    };

    const beerTap = new BeerParticleSystem(app, { x: 400, y: 100 }, {
        maxParticles: 250,
        emissionRate: 8,
        color: 0xf4e675,
        gravity: 0.15
    });

    // app.view.addEventListener('click', () => {
    //     beerTap.isFlowing ? beerTap.stopFlow() : beerTap.startFlow();
    // });
    const button = new TapButton(
        300,
        400,
        150,
        50
    );

    button.setCallbacks(
        () => beerTap.startFlow(),
        () => beerTap.stopFlow()
    );

    app.stage.addChild(button);

    pixiApp.stage.addChild(scene.container);

    document.body.appendChild(pixiApp.view as any);

    const cup = new Cup({ x: 350, y: 250 });
    pixiApp.stage.addChild(cup.graphics);

    pixiApp.view.addEventListener('mousedown', () => {
        cup.isPouring = true;
    });

    pixiApp.view.addEventListener('mouseup', () => {
        cup.isPouring = false;
    });

    pixiApp.view.addEventListener('mouseleave', () => {
        cup.isPouring = false;
    });

    const instructions = new Text('Hold mouse button to fill the cup', {
        fontSize: 16,
        fill: '#FFFFFF'
    });

    instructions.position.set(10, 10);
    pixiApp.stage.addChild(instructions);

    pixiApp.ticker.add((delta: number) => {
        cup.update(delta);
        cup.draw();
    });

    return { game };
}
