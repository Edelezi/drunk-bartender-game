import { Text, TextStyle } from "pixi.js";

export interface CreateTextProps {
    value: string;
    x?: number;
    y?: number;
    anchor?: number;
    fill?: number;
}

export const createText = ({ value, x = 0, y = 0, anchor = 0.5, fill = 0x000000 }: CreateTextProps) => {
    const textBaseAtts = {
        style: {
            fontFamily: "Arial",
            fontWeight: "700",
            fontSize: 30,
            fill: 0xffffff
        }
    };

    const text = new Text({
        x,
        y,
        text: value,
        anchor,
        ...textBaseAtts
    } as any);

    text.style.fill = fill;

    return text;
};
