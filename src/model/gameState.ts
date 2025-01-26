import { gameFinishSignal, gameStartSignal, pointsUpdatedSignal } from "#src/signals/game";

export const gameState = {
    isStarted: false,
    isFinished: false,
    roundPoints: 0,
    addPoints(points: number) {
        this.roundPoints += points;
        this.roundPoints = Math.max(0, this.roundPoints);
        pointsUpdatedSignal.dispatch(this.roundPoints);
    }
};

gameStartSignal.add(startGame, this);
gameFinishSignal.add(finishGame, this);

function startGame() {
    gameState.isStarted = true;
}

function finishGame() {
    gameState.isFinished = true;
}
