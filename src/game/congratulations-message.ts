import * as PIXI from 'pixi.js';

class CongratulationMessage {
    private container: PIXI.Container;
    private background: PIXI.Graphics;
    private messageText: PIXI.Text;
    private gradeText: PIXI.Text;
    private percentageText: PIXI.Text;
    private closeButton: PIXI.Container;
    private character: PIXI.Sprite;

    constructor(private app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.app.stage.addChild(this.container);



        // Create semi-transparent background
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 0.8);
        this.background.drawRect(0, 0, 100, 100);
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
        this.messageText.y = app.screen.height / 2 - 100;

        this.percentageText = new PIXI.Text('', subtitleStyle);
        this.percentageText.anchor.set(0.5);
        this.percentageText.x = app.screen.width / 2;
        this.percentageText.y = app.screen.height / 2 - 50;

        this.gradeText = new PIXI.Text('', subtitleStyle);
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
        buttonGraphics.beginFill(0x4CAF50);
        buttonGraphics.drawRoundedRect(-50, -20, 100, 40, 8);
        buttonGraphics.endFill();

        const buttonText = new PIXI.Text('Shut up', {
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
            message = "Overflow and Out!";
            grade = "The floor is getting more action than our customers";
        } else if (fillPercentage >= 95) {
            message = "Perfect Pour Pioneer!";
            grade = "You're making other bartenders look flat";
        } else if (fillPercentage >= 90) {
            message = "Foam Sweet Foam!";
            grade = "Your precision is driving customers hopping mad with joy";
        } else if (fillPercentage >= 85) {
            message = "Getting Your Hops Together!";
            grade = "Nearly there, just a little more brewing practice";
        } else if (fillPercentage >= 80) {
            message = "Ale-most There!";
            grade = "Don't get bitter, keep practicing";
        } else if (fillPercentage >= 75) {
            message = "Barley Making It!";
            grade = "Your technique needs some fermentation";
        } else if (fillPercentage >= 70) {
            message = "Living Life on the Foam";
            grade = "The glass is always half empty with you";
        } else if (fillPercentage >= 65) {
            message = "Malt-functioning Pour";
            grade = "Time to raise the bar(ley)";
        } else if (fillPercentage >= 60) {
            message = "Lager than Life Problems";
            grade = "Your confidence is brewing, but your skills aren't";
        } else if (fillPercentage >= 55) {
            message = "Beer Pressure's Getting to You";
            grade = "Stop wining and start pouring properly";
        } else if (fillPercentage >= 50) {
            message = "Half-Hearted Hops";
            grade = "The glass is definitely half empty now";
        } else if (fillPercentage >= 45) {
            message = "Pale Ale Performance";
            grade = "Your future here is looking a bit craft-y";
        } else if (fillPercentage >= 40) {
            message = "Beer Goggles Required";
            grade = "Even the glass looks disappointed";
        } else if (fillPercentage >= 35) {
            message = "Stout of Luck";
            grade = "Time to tap into your potential";
        } else if (fillPercentage >= 30) {
            message = "IPA lot of Problems Here";
            grade = "This is a pour situation";
        } else if (fillPercentage >= 25) {
            message = "Bottom of the Barrel";
            grade = "You're brewing up trouble";
        } else if (fillPercentage >= 20) {
            message = "Ale Be Seeing You Later";
            grade = "This job's not your cup of beer";
        } else if (fillPercentage >= 15) {
            message = "Porter Another Career";
            grade = "These results are hard to swallow";
        } else if (fillPercentage >= 10) {
            message = "Hefeweizen Up!";
            grade = "This performance is barely drinkable";
        } else if (fillPercentage >= 5) {
            message = "Bock to Square One";
            grade = "Time to drink in the reality - this isn't working";
        } else {
            message = "Beer-ly Trying";
            grade = "Even root beer would be disappointed";
        }

        this.messageText.text = message;
        this.percentageText.text = `Fill Level: ${Math.round(fillPercentage)}%`;
        this.gradeText.text = grade;
        this.container.visible = true;

        this.background.width = Math.max(this.messageText.width,
            this.percentageText.width) * 1.5;
        this.background.height = this.percentageText.height +
            this.gradeText.height + this.messageText.height + 150;
        this.background.position.x = this.messageText.x - this.background.width/2;
        this.background.position.y = this.messageText.y - 40;

        // Add fade-in animation
        this.container.alpha = 0;
        this.app.ticker.add(this.fadeIn, this);
        this.character.visible = true;

        this.hideTimeout = setTimeout(() => {
            this.character.visible = false;
            this.hide();
        }, 4000);
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
