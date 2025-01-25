import { Sprite, Texture, Container, Graphics } from "pixi.js";
// import gsap, { Power2 } from 'gsap';
import { MoveSymbols } from "./move-symbols";
import { Ticker, assert, getRandomArrayElement, getRandomIndex } from "../common";
import { getTexture } from "./atlas";

let previousTimeStamp = -1;

function makeSprite(texturePath = '', x = 0, y = 0, sx = 1, sy = 1) {
  const sp = new Sprite(getTexture(texturePath));
  sp.anchor.set(0.5);
  sp.x = x;
  sp.y = y;
  sp.scale.set(sx, sy);
  return sp;
}

export class Slot {
    container: Container = new Container();
    currentTime = 0;
    reel: MoveSymbols[] = [];
    ticker: Ticker = new Ticker();
    moving = false;

    init() {
        this.animate = this.animate.bind(this);

        requestAnimationFrame(this.animate);
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
    }

    onResize(width: number, height: number) {
        console.log("onResize " + width + "x" + height);
    }

    update(dt: number) {
        this.currentTime += dt;
    }
}
