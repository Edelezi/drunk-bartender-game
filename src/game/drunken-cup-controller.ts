import { Cup } from './cup';

interface DrunkenCupControllerProps {
    x: number;
    y: number;
    swayAmplitude?: number;
    swayFrequency?: number;
    cup: null | Cup;
}

class DrunkenCupController  {
    private initialX: number;
    private time: number;
    private swayAmplitude: number;
    private swayFrequency: number;

    constructor(private props: DrunkenCupControllerProps = { x: 0, y: 0, swayAmplitude: 30, swayFrequency: 0.002, cup: null }) {
        this.initialX = this.props.x;
        this.time = 0;
        this.swayAmplitude = this.props.swayAmplitude;
        this.swayFrequency = this.props.swayFrequency;
    }

    update(delta: number): void {
        this.time += delta;
        const posX = this.initialX + Math.sin(this.time * this.swayFrequency) * this.swayAmplitude;
        this.props.cup.x = posX;
        this.props.cup.y = this.props.y;
    }

    setSwayAmplitude(amplitude: number): void {
        this.swayAmplitude = amplitude;
    }

    setSwayFrequency(frequency: number): void {
        this.swayFrequency = frequency;
    }
}

export { DrunkenCupController }
