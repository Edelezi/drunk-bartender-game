import { isBtnDebug } from '#src/pixi/pixi-init';
import * as PIXI from 'pixi.js';

class StartButton extends PIXI.Container {
    // private background: PIXI.Graphics;
    private label: PIXI.Text;
    private isPressed: boolean = false;
    private onPress: () => void;
    private onRelease: () => void;
    private background: PIXI.Sprite;

    constructor(x: number, y: number, width: number = 0, height: number = 0, private labelText: string = 'next') {
        super();
        this.x = x;
        this.y = y;

        // Create button background
        this.background = new PIXI.Sprite(PIXI.Texture.from("/assets/start.png"));
        if (width !== 0 && height !== 0) {
            this.background.width = width;
            this.background.height = height;
        }
        this.addChild(this.background);

        // Create button text
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            fontWeight: 'bold'
        });

        this.label = new PIXI.Text(labelText, style);
        this.label.anchor.set(0.5);
        this.label.x = width / 2 - this.label.width/2;
        this.label.y = height / 2;
        this.label.visible = isBtnDebug;
        this.addChild(this.label);

        // Make interactive
        this.eventMode = 'static';
        this.cursor = 'pointer';

        // Event listeners
        this.on('pointerdown', this.handlePress);
        this.on('pointerup', this.handleRelease);
        this.on('pointerupoutside', this.handleRelease);
        this.on('touchstart', this.handlePress);
        this.on('touchend', this.handleRelease);
        this.on('touchendoutside', this.handleRelease);
        this.drawBackground(0x4CAF50);
    }

    private drawBackground(color: number): void {
        // this.background.clear();
        // this.background.beginFill(color);
        // this.background.drawRoundedRect(0, 0, this.label.width + 40, this.label.height + 20, 8);
        // this.background.endFill();

        // this.background.lineStyle(2, this.isPressed ? 0x368a3a : 0x5dbf61);
        // this.background.drawRoundedRect(0, 0, this.label.width + 40, this.label.height + 20, 8);
    }

    private handlePress = (): void => {
        this.isPressed = true;
        this.drawBackground(0x45a049);
        this.scale.set(0.95);
        if (this.onPress) this.onPress();
    }

    private handleRelease = (): void => {
        this.isPressed = false;
        this.drawBackground(0x4CAF50);
        this.scale.set(1);
        if (this.onRelease) this.onRelease();
    }

    setCallbacks(onPress: () => void, onRelease: () => void): void {
        this.onPress = onPress;
        this.onRelease = onRelease;
    }
}

export { StartButton }
