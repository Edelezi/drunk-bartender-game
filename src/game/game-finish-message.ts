import * as pixi from "pixi.js";
import { gameState } from "#src/model/gameState";
import { gameStartSignal } from "#src/signals/game";
import * as PIXI from "pixi.js";

class GameFinishMessage {
    private container: pixi.Container;
    private background: pixi.Graphics;
    private messageText: pixi.Text;
    private gradeText: pixi.Text;
    private percentageText: pixi.Text;
    private closeButton: pixi.Container;
    private character: pixi.Sprite;

    constructor(private app: pixi.Application) {
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.app.stage.addChild(this.container);

        // Create semi-transparent background
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 0.8);
        this.background.drawRect(-100 + 400, 177 + 169, 450, 169);
        this.background.endFill();
        this.container.addChild(this.background);

        const character = new PIXI.Sprite(PIXI.Texture.from("/assets/guy.png"));
        this.character = character;
        character.name = "ilya";
        character.visible = false;
        const scaleChar = 0.5;
        character.scale.set(scaleChar, scaleChar);
        character.position.set(-100, 450);
        this.container.addChild(character);

        // Create text styles
        const titleStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fontWeight: "bold",
            fill: "#ffffff"
        });

        const subtitleStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#ffffff"
        });

        // Create text elements
        this.messageText = new PIXI.Text("", titleStyle);
        this.messageText.anchor.set(0.5);
        this.messageText.x = app.screen.width / 2;
        this.messageText.y = app.screen.height / 2 - 50;

        this.percentageText = new PIXI.Text("", subtitleStyle);
        this.percentageText.anchor.set(0.5);
        this.percentageText.x = app.screen.width / 2;
        this.percentageText.y = app.screen.height / 2;

        this.gradeText = new PIXI.Text("", subtitleStyle);
        this.gradeText.anchor.set(0.5);
        this.gradeText.x = app.screen.width / 2;
        this.gradeText.y = app.screen.height / 2 + 50;

        // Create close button
        this.closeButton = this.createCloseButton();
        this.closeButton.x = app.screen.width / 2 + 200;
        this.closeButton.y = app.screen.height / 2 + 250;

        // Add all elements to container
        this.container.addChild(this.messageText, this.percentageText, this.gradeText, this.closeButton);
    }

    private createCloseButton(): PIXI.Container {
        const button = new PIXI.Container();

        const buttonGraphics = new PIXI.Graphics();
        buttonGraphics.beginFill(0x4caf50);
        buttonGraphics.drawRoundedRect(-50, -20, 100, 40, 8);
        buttonGraphics.endFill();

        const buttonText = new PIXI.Text("Start new", {
            fontFamily: "Arial",
            fontSize: 20,
            fill: "#ffffff"
        });
        buttonText.anchor.set(0.5);

        button.addChild(buttonGraphics, buttonText);

        button.eventMode = "static";
        button.cursor = "pointer";
        button.on("pointerdown", () => this.hide());

        return button;
    }

    public show(): void {
        const message: string = "Arrr, matey!";
        const grade: string = gameState.roundPoints.toFixed(0) + " points";

        this.messageText.text = message;
        this.percentageText.text = "Ya did it!";
        this.gradeText.text = grade;
        this.container.visible = true;

        // Add fade-in animation
        this.container.alpha = 0;
        this.app.ticker.add(this.fadeIn, this);
        this.character.visible = true;
    }

    private fadeIn(): void {
        this.container.alpha += 0.05;
        if (this.container.alpha >= 1) {
            this.app.ticker.remove(this.fadeIn, this);
        }
    }

    public hide(): void {
        console.log("hide");
        gameStartSignal.dispatch();
        this.container.visible = false;
    }
}

export { GameFinishMessage };
