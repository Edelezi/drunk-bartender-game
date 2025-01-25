export interface IPlayable {
    update?(delta: number): void;
    step(stepInterval: number): void;
}
