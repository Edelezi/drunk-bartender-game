import { loadAssets } from "#src/game/atlas";
import { Application } from "pixi.js";

let pixiApp: Application;
let canvas: HTMLCanvasElement;

export async function pixiInit(c: HTMLCanvasElement): Promise<Application> {
    canvas = c;
    pixiApp = new Application({
        view: canvas,
        resizeTo: canvas,
        antialias: true,
        backgroundAlpha: 0
    });

    pixiApp.renderer.background.alpha = 0;
    await loadAssets();
    console.log("pixi init");

    // resize();
    // window.addEventListener("resize", () => {
    //     resize();
    // });

    return pixiApp;
}
