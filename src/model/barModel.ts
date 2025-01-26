import { Signal } from "#src/common/signal";
import { Cup } from "#src/game/cup";

export class ClientModel {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _waitingTime: number;
    private readonly _cup: Cup;

    constructor(waitingTime: number, name: string, id: number) {
        this._waitingTime = waitingTime;
        this._name = name;
        this._id = id;
        this._cup = new Cup({ x: 0, y: 0 });
    }

    public get cup() {
        return this._cup;
    }

    public get waitingTime() {
        return this._waitingTime;
    }

    public get name() {
        return this._name;
    }

    public get id() {
        return this._id;
    }
}

export const barSpots = 8;

export const clientTimeoutSignal = new Signal();
export const clientArrivedSignal = new Signal();
export const clientLeaveSignal = new Signal();

export class BarModel {
    private _spots: (ClientModel | undefined)[] = [];
    private _timerIds: (number | undefined)[] = [];

    constructor() {
        for (let i = 0; i < barSpots; i++) {
            this._spots.push(undefined);
            this._timerIds.push(undefined);
        }
    }

    public getClient(spot: number) {
        return this._spots[spot];
    }

    public addClient(client: ClientModel, spot: number) {
        console.log("addClient");
        if (this._spots[spot]) {
            throw new Error("spot is already taken");
        }
        this._spots[spot] = client;
        clientArrivedSignal.dispatch({
            client,
            spot
        });
        this._timerIds[spot] = window.setTimeout(() => {
            this.removeClient(spot);
            clientTimeoutSignal.dispatch({
                client,
                spot
            });
        }, client.waitingTime);
    }

    public removeClient(spot: number) {
        if (!this._spots[spot]) {
            throw new Error("spot is already empty");
        }
        clearTimeout(this._timerIds[spot] as number);
        this._spots[spot] = undefined;
        clientLeaveSignal.dispatch({ spot });
    }

    public getFreeSpot(): number {
        return this._spots.findIndex(spot => !spot);
    }

    public getRandomFreeSpot(): number {
        const freeSpots = this._spots.map((spot, index) => (spot ? -1 : index)).filter(spot => spot !== -1);
        if (!freeSpots.length) {
            throw new Error("no free spots");
        }
        return freeSpots[Math.floor(Math.random() * freeSpots.length)];
    }
}
