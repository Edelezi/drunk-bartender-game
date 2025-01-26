import { LevelModel } from "#src/model/levelModel";
import { BarModel, ClientModel } from "#src/model/barModel";
import { getRandomNumber } from "#src/helpers/gameHelpers";

export class GameController {
    private _currentLevel: LevelModel | undefined;
    private _barModel: BarModel;
    private _lastClientIndex = -1;

    constructor() {
        this._barModel = new BarModel();
    }

    public get barModel() {
        return this._barModel;
    }

    private getNextClient(): ClientModel | undefined {
        console.log("getNextClient");
        if (!this._currentLevel) {
            throw new Error("Level is not set");
        }

        this._lastClientIndex++;
        if (this._lastClientIndex >= this._currentLevel.clients.length) {
            this._lastClientIndex = -1;
            this.finishGame();
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

    private finishGame(): void {
        console.log("Game finished");
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
