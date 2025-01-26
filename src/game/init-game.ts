import { Application, Sprite, BLEND_MODES, Texture, Text, DisplacementFilter } from "pixi.js";
import { getSpine, getTexture } from "./atlas";
import { Spine } from "pixi-spine";
import { pixiMove } from "#src/pixi/pixi-move";
import { Scene } from "./scene";
import { Cup } from "./cup";
import { BeerParticle, BeerParticleSystem } from "./beer-particle-system";
import { TapButton } from "./tap-button";
import { FoamFountain } from "./foam-fontain";
import { DrunkenCupController } from "./drunken-cup-controller";
import { NextButton } from "./next-button";
import {ZoomBlurFilter} from '@pixi/filter-zoom-blur';

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
    const barBack = new Sprite(Texture.from("/assets/bar.png"));
    barBack.name = 'barback';
    const backScale = .5;
    barBack.scale.set(backScale, backScale);
    pixiApp.stage.addChild(barBack);

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

    const beerTap = new BeerParticleSystem(app, { x: 515, y: 512 }, {
        maxParticles: 250,
        emissionRate: 8,
        color: 0xf4e675,
        gravity: 0.15
    });

    const tapButton = new TapButton(
        300,
        400,
        150,
        50
    );
    app.stage.addChild(tapButton);
    tapButton.setCallbacks(
        () => beerTap.startFlow(),
        () => beerTap.stopFlow()
    );


    pixiApp.stage.addChild(scene.container);

    document.body.appendChild(pixiApp.view as any);

    const cup = new Cup({ x: 512, y: 550 });
    beerTap.setCup(cup)
    const foamFountain = new FoamFountain(app, cup);

    pixiApp.stage.addChild(cup.container);

    const dcc = new DrunkenCupController({ x: cup.x - 60/2, y: cup.y, swayAmplitude: 60, swayFrequency: 0.07, cup});

    const nextBtn = new NextButton(
        300,
        480,
        150,
        50
    );
    app.stage.addChild(nextBtn);
    nextBtn.setCallbacks(
        () => () => {},
        () => {
            cup.liquid = 0;
            cup.foam = 0;
        }
    );


    const startGameBtn = new NextButton(
        300,
        580,
        150,
        50, "start"
    );
    app.stage.addChild(startGameBtn);
    startGameBtn.setCallbacks(
        () => () => {},
        () => {
            new CustomEvent('start-game', {
                bubbles: true,
                cancelable: true,
              });
        }
    );

    const instructions = new Text('Hold mouse button to fill the cup', {
        fontSize: 16,
        fill: '#FFFFFF'
    });
    instructions.position.set(300, 20);
    pixiApp.stage.addChild(instructions);

    const fillPercentage = new Text('', {
        fontSize: 50,
        fill: '#FFFFFF'
    });
    fillPercentage.position.set(500, 400);
    pixiApp.stage.addChild(fillPercentage);

    pixiApp.ticker.add((delta: number) => {
        if (cup.liquid >= 100) {
            fillPercentage.text = 'beer over... bubbled!';
        } else {
            fillPercentage.text = 'Fill ' + cup.liquid.toFixed(2) + '%';
        }

        cup.update(delta);
        dcc.update(delta);
        cup.draw();
    });

    // TODO add displacement/twist?
    // const df = new DisplacementFilter();

    const zbf = new ZoomBlurFilter();
    zbf.strength = 0.05;
    zbf.center[0] = 512;
    zbf.center[1] = 512;
    zbf.innerRadius = 250;
    zbf.radius = 750;

    pixiApp.stage.filters = [zbf];

    return { game };
}
