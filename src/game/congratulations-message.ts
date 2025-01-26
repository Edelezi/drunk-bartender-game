import * as PIXI from 'pixi.js';

class CongratulationMessage {
    private container: PIXI.Container;
    private background: PIXI.Graphics;
    private messageText: PIXI.Text;
    private gradeText: PIXI.Text;
    private percentageText: PIXI.Text;
    private closeButton: PIXI.Container;

    constructor(private app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.app.stage.addChild(this.container);

        // Create semi-transparent background
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 0.5);
        this.background.drawRect(0, 0, app.screen.width, app.screen.height);
        this.background.endFill();
        this.container.addChild(this.background);

        // Create text styles
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
        });

        const subtitleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
        });

        // Create text elements
        this.messageText = new PIXI.Text('', titleStyle);
        this.messageText.anchor.set(0.5);
        this.messageText.x = app.screen.width / 2;
        this.messageText.y = app.screen.height / 2 - 50;

        this.percentageText = new PIXI.Text('', subtitleStyle);
        this.percentageText.anchor.set(0.5);
        this.percentageText.x = app.screen.width / 2;
        this.percentageText.y = app.screen.height / 2;

        this.gradeText = new PIXI.Text('', subtitleStyle);
        this.gradeText.anchor.set(0.5);
        this.gradeText.x = app.screen.width / 2;
        this.gradeText.y = app.screen.height / 2 + 50;

        // Create close button
        this.closeButton = this.createCloseButton();
        this.closeButton.x = app.screen.width / 2;
        this.closeButton.y = app.screen.height / 2 + 120;

        // Add all elements to container
        this.container.addChild(this.messageText, this.percentageText, this.gradeText, this.closeButton);
    }

    private createCloseButton(): PIXI.Container {
        const button = new PIXI.Container();

        const buttonGraphics = new PIXI.Graphics();
        buttonGraphics.beginFill(0x4CAF50);
        buttonGraphics.drawRoundedRect(-50, -20, 100, 40, 8);
        buttonGraphics.endFill();

        const buttonText = new PIXI.Text('Close', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#ffffff',
        });
        buttonText.anchor.set(0.5);

        button.addChild(buttonGraphics, buttonText);

        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointerdown', () => this.hide());

        return button;
    }

    private hideTimeout: NodeJS.Timeout | null = null;

    public show(fillPercentage: number): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        let message: string;
        let grade: string;

        if (fillPercentage === 100) {
            message = "Overflowned! This one's on the house";
            grade = "Actually, it's on the floor";
        } else if (fillPercentage >= 95 && fillPercentage < 100) {
            message = 'Outstanding Performance!';
            grade = 'You are a true beer master!';
        } else if (fillPercentage >= 90) {
            message = 'Amazing Job!';
            grade = 'Your pouring skills are exceptional!';
        } else if (fillPercentage >= 85) {
            message = 'Well Done!';
            grade = 'You have good potential!';
        } else if (fillPercentage >= 80) {
            message = 'Okay Pour';
            grade = 'More practice needed';
        } else if (fillPercentage >= 70) {
            message = 'Too Greedy';
            grade = 'Be more careful with the portions';
        } else {
            message = 'You\'re Fired!';
            grade = 'This job might not be for you';
        }

        this.messageText.text = message;
        this.percentageText.text = `Fill Level: ${Math.round(fillPercentage)}%`;
        this.gradeText.text = grade;
        this.container.visible = true;

        // Add fade-in animation
        this.container.alpha = 0;
        this.app.ticker.add(this.fadeIn, this);

        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 3000);
    }

    private fadeIn(): void {
        this.container.alpha += 0.05;
        if (this.container.alpha >= 1) {
            this.app.ticker.remove(this.fadeIn, this);
        }
    }

    public hide(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        this.container.visible = false;
    }
}

export { CongratulationMessage };
