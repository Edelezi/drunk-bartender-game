import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import {ICanvas} from "pixi.js";

const PixiCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create a PixiJS Application
        const pixiApp = new PIXI.Application({
            view: canvasRef.current as ICanvas, // Use the provided canvas element
            resizeTo: window,        // Automatically resize to the window
            antialias: true,        // Make the background transparent
        });

        // Create a Graphics object to draw
        const graphics = new PIXI.Graphics();

        // Draw a rectangle
        graphics.beginFill(0xff0000); // Red fill color
        graphics.drawRect(50, 50, 200, 100); // x, y, width, height
        graphics.endFill();

        // Add the rectangle to the stage
        pixiApp.stage.addChild(graphics);

        // Cleanup on component unmount
        return () => {
            pixiApp.destroy(true, { children: true });
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default PixiCanvas;
