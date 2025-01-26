import { LevelModel } from "#src/model/levelModel";
import { BarModel, clientLeaveSignal, ClientModel } from "#src/model/barModel";
import { getRandomNumber } from "#src/helpers/gameHelpers";
import { beerDoneSignal, gameFinishSignal, lastClientSignal } from "#src/signals/game";
import { getMainCup } from "#src/game/init-game";
import { gameState } from "#src/model/gameState";

export class GameController {
    private _currentLevel: LevelModel | undefined;
    private _barModel: BarModel;
    private _lastClientIndex = -1;
    private _isLastClient = false;

    constructor() {
        this._barModel = new BarModel();
        beerDoneSignal.add(this.onBeerDone, this);
        clientLeaveSignal.add(this.onClientLeave, this);
    }

    public get barModel() {
        return this._barModel;
    }

    private onClientLeave(): void {
        console.log(this._isLastClient + " " + this._barModel.hasClients());
        if (this._isLastClient && !this._barModel.hasClients()) {
            this.finishGame();
            return;
        }
    }

    private getNextClient(): ClientModel | undefined {
        console.log("getNextClient");
        if (!this._currentLevel) {
            throw new Error("Level is not set");
        }

        this._lastClientIndex++;
        if (this._lastClientIndex >= this._currentLevel.clients.length) {
            this._lastClientIndex = -1;
            lastClientSignal.dispatch();
            this._isLastClient = true;
            return undefined;
        }
        return this._currentLevel.clients[this._lastClientIndex];
    }

    private async awaitClientArrival(_client: ClientModel, _spot: number): Promise<void> {
        if (!this._currentLevel) {
            throw new Error("Level is not set");
        }

        while (this._lastClientIndex >= 0) {
            await new Promise(resolve => setTimeout(resolve, getRandomNumber(this._currentLevel?.minGapTime ?? 0, this._currentLevel?.maxGapTime ?? 0) * 1000));

            console.log("Client arrived");
            const nextClient = this.getNextClient();
            if (!nextClient) {
                return;
            }

            this._barModel.addClient(nextClient, this._barModel.getRandomFreeSpot());
        }
    }

    private onBeerDone(spot: number): void {
        let points = 0;
        const mainCup = getMainCup();
        const liquid = mainCup.liquid;
        if (liquid < 50) {
            points = 0;
        } else {
            points = Math.floor(liquid - 50);
        }
        gameState.addPoints(points);
        console.log("onBeerDone");
        this._barModel.removeClient(spot);
    }

    private finishGame(): void {
        console.log("Game finished");
        gameFinishSignal.dispatch();
    }

    public startGame(level: LevelModel): void {
        this._currentLevel = level;
        console.log("Game started");
        const firstClient = this.getNextClient();

        if (!firstClient) {
            throw new Error("No clients in the level");
        }

        this._barModel.addClient(firstClient, this._barModel.getRandomFreeSpot());

        void this.awaitClientArrival(firstClient, 0);
    }
}
