import { Assets, Texture } from "pixi.js";
import { Spine } from "pixi-spine";
import { Atlas } from "#src/pixi/atlas";

let mainAtlas: Atlas;
let slotAtlas: Atlas;
const spineAnimations = {
    arrow: null
};

export async function loadAssets() {
    slotAtlas = await Assets.load("/assets/slot_atlases/reel.json");
    mainAtlas = await Assets.load("/assets/slot_atlases/main.json");
    spineAnimations.arrow = await Assets.load("/assets/spine/arrow/arrow.json");
}

export function getSpine(name: string): Spine {
    return new Spine(spineAnimations[name].spineData);
}

export function getTexture(texPathName: string): Texture {
    if (mainAtlas.textures[texPathName]) {
        return mainAtlas.textures[texPathName];
    }

    if (slotAtlas.textures[texPathName]) {
        return slotAtlas.textures[texPathName];
    }

    throw new Error("unknow teture " + texPathName);
}
