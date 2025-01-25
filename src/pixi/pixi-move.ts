import { Sprite } from "pixi.js";

let targetSprite: Sprite = null;
const position = {
    x: 0,
    y: 0
};

document.addEventListener("keyup", function (event) {
    if (targetSprite) {
        event.stopImmediatePropagation();
    }
});

let scale = 1;
document.addEventListener("keydown", function (event) {
    if (!targetSprite) {
        return;
    }

    if (event.altKey) {
        let dy = 0;

        switch (event.key) {
            case "ArrowUp":
                dy = -1;
                break;
            case "ArrowDown":
                dy = 1;
                break;
        }
        scale += dy * 0.1;

        // targetEntity.setLocalScale(scale, scale, scale);
        targetSprite.scale.set(scale, scale);
    } else {
        let dx = 0;
        let dy = 0;

        switch (event.key) {
            case "ArrowLeft":
                dx = -1;
                break;
            case "ArrowRight":
                dx = 1;
                break;
            case "ArrowUp":
                dy = -1;
                break;
            case "ArrowDown":
                dy = 1;
                break;
        }

        if (dx === 0 && dy === 0) {
            return;
        }

        if (event.shiftKey) {
            dx *= 10;
            dy *= 10;
        }

        if (event.ctrlKey) {
            dx *= 10;
            dy *= 10;
        }

        position.x += dx;
        position.y += dy;
    }
    targetSprite.position.set(position.x, position.y);

    console.log("position: " + position.x + " x " + position.y + " scale: " + scale.toString());
});

function pixiMove(target: Sprite) {
    targetSprite = target;
    position.x = target.x;
    position.y = target.y;
    scale = 1;
}

export { pixiMove };
