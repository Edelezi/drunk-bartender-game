import { Assets, Texture } from "pixi.js";
import { Spine } from "pixi-spine";
import { Atlas } from "#src/pixi/atlas";

let mainAtlas: Atlas;
let slotAtlas: Atlas;

const spineAnimations = {
};

export async function loadAssets() {
    slotAtlas = await Assets.load("/atlases/reel.json");
    mainAtlas = await Assets.load("/atlases/main.json");
}

export function getSpine(name: string): Spine {
    // @ts-ignore
    return new Spine(spineAnimations[name].spineData);
}

export function getTexture(texPathName: string): Texture {
    // @ts-ignore
    if (mainAtlas.textures[texPathName]) {
        // @ts-ignore
        return mainAtlas.textures[texPathName];
    }

    // @ts-ignore
    if (slotAtlas.textures[texPathName]) {
        // @ts-ignore
        return slotAtlas.textures[texPathName];
    }

    throw new Error("unknow teture " + texPathName);
}
