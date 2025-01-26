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
import { ZoomBlurFilter } from "@pixi/filter-zoom-blur";
import { beerDoneSignal, clientSelectSignal, gameFinishSignal, gameStartSignal, pointsUpdatedSignal } from "#src/signals/game";
import { clientLeaveSignal, ClientModel } from "#src/model/barModel";
import { CongratulationMessage } from "./congratulations-message";
import { Ticker } from "#src/common";
import { StartButton } from "./start-button";
import { isBtnDebug } from "#src/pixi/pixi-init";
import { GameFinishMessage } from "#src/game/game-finish-message";

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

let mainCup: Cup;
export function getMainCup() {
    return mainCup;
}

let _selectedClient: ClientModel | undefined;
let _selectedSpot: number | undefined;

export function initGame(app: Application) {
    pixiApp = app;
    // const cx = app.view.width / 2;
    // const cy = app.view.height / 2 + 90;
    const cx = 400;
    const cy = 390;

    // makeSprite("main/bg.png", cx, cy);
    const barBack = new Sprite(Texture.from("/assets/bar.png"));
    barBack.name = "barback";
    const backScale = 0.5;
    barBack.scale.set(backScale, backScale);
    pixiApp.stage.addChild(barBack);

    const pointText = new Text("0", {
        fontSize: 50,
        fill: "#FFFFFF"
    });

    pointText.position.set(800, 20);
    pixiApp.stage.addChild(pointText);

    gameStartSignal.add(() => {
        pointText.visible = true;
        doneBtn.visible = true;
        startGameBtn.visible = false;
        tapButton.visible = true;
        _gameFinishMessage.hide();
    }, this);

    gameFinishSignal.add(() => {
        pointText.visible = false;
        doneBtn.visible = false;
        startGameBtn.visible = true;
        tapButton.visible = false;
    }, this);

    pointsUpdatedSignal.add((points: number) => {
        pointText.text = points.toFixed(0);
    });

    const scene = makeScene(cx, cy);

    // const sp = new Sprite(getTexture("main/arrow.png"));
    // sp.anchor.set(0.5);
    // sp.x = 100;
    // sp.y = 100;
    // sp.scale.set(1, 1);
    // pixiApp.stage.addChild(sp);

    const game: Game = {
        scene
    };

    const beerTap = new BeerParticleSystem(
        app,
        { x: 515, y: 512 },
        {
            maxParticles: 250,
            emissionRate: 8,
            color: 0xf4e675,
            gravity: 0.15
        }
    );

    const tapButton = new TapButton(800, 650, 426 / 2, 456 / 2);
    tapButton.visible = false;

    app.stage.addChild(tapButton);
    tapButton.setCallbacks(
        () => beerTap.startFlow(),
        () => beerTap.stopFlow()
    );

    pixiApp.stage.addChild(scene.container);

    document.body.appendChild(pixiApp.view as any);

    mainCup = new Cup({ x: 512, y: 550 });
    mainCup.container.visible = false;
    beerTap.setCup(mainCup);
    clientSelectSignal.add(({ client, spot }: { client: ClientModel; spot: number }) => {
        if (_selectedClient) {
            _selectedClient.cup.liquid = mainCup.liquid;
            _selectedClient.cup.foam = mainCup.foam;
        }
        _selectedClient = client;
        _selectedSpot = spot;
        mainCup.liquid = client.cup.liquid;
        mainCup.foam = client.cup.foam;
        mainCup.container.visible = true;
        const rate = Math.random() * 0.1;
        mainCup.foamDecayRate = 0.05 + rate;
        mainCup.bubbleSpawnRate = 0.05 + rate;
    }, this);

    clientLeaveSignal.add(({ spot }: { spot: number }) => {
        if (_selectedSpot === spot) {
            _selectedClient = undefined;
            _selectedSpot = undefined;
            mainCup.container.visible = false;
        }
    }, this);

    const _foamFountain = new FoamFountain(app, mainCup);

    pixiApp.stage.addChild(mainCup.container);

    const dcc = new DrunkenCupController({ x: mainCup.x - 60 / 2, y: mainCup.y, swayAmplitude: 60, swayFrequency: 0.07, cup: mainCup });

    const congratulationMessage = new CongratulationMessage(pixiApp);

    const _gameFinishMessage = new GameFinishMessage(pixiApp);

    gameFinishSignal.add(() => {
        _gameFinishMessage.show();
    }, this);

    const doneBtn = new NextButton(426, 754, 183, 106);
    doneBtn.visible = false;
    app.stage.addChild(doneBtn);
    doneBtn.setCallbacks(
        () => () => {},
        () => {
            beerDoneSignal.dispatch(_selectedSpot);
            congratulationMessage.show(mainCup.liquid);
            mainCup.liquid = 0;
            mainCup.foam = 0;
            mainCup.container.visible = false;
        }
    );

    const startGameBtn = new StartButton(10, 10, 113, 66, "start");
    app.stage.addChild(startGameBtn);
    startGameBtn.setCallbacks(
        () => () => undefined,
        () => {
            gameStartSignal.dispatch();
        }
    );
    // window.setTimeout(() => {
    //     gameStartSignal.dispatch();
    // }, 500);

    const instructions = new Text("Hold mouse button to fill the cup", {
        fontSize: 16,
        fill: "#FFFFFF"
    });
    instructions.position.set(400, 5);
    pixiApp.stage.addChild(instructions);

    const fillPercentage = new Text("", {
        fontSize: 50,
        fill: "#FFFFFF"
    });
    fillPercentage.position.set(411, 160);
    fillPercentage.visible = isBtnDebug;
    pixiApp.stage.addChild(fillPercentage);

    pixiApp.ticker.add((delta: number) => {
        if (mainCup.liquid >= 100) {
            fillPercentage.text = "beer over... bubbled!";
        } else {
            fillPercentage.text = "Fill " + mainCup.liquid.toFixed(2) + "%";
        }

        mainCup.update(delta);
        dcc.update(delta);
        mainCup.draw();
    });

    // TODO add displacement/twist?
    // const df = new DisplacementFilter();

    const zbf = new ZoomBlurFilter();
    zbf.strength = 0.0;
    zbf.center[0] = 512;
    zbf.center[1] = 512;
    zbf.innerRadius = 250;
    zbf.radius = 750;

    pixiApp.stage.filters = [zbf];

    return { game };
}
