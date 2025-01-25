import { Signal } from "#src/common/signal";

export class ClientModel {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _waitingTime: number;

    constructor(waitingTime: number, name: string, id: number) {
        this._waitingTime = waitingTime;
        this._name = name;
        this._id = id;
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

const clientTimeoutSignal = new Signal();

class BarModel {
    private _spots: (ClientModel | undefined)[] = [];
    private _timerIds: (number | undefined)[] = [];

    constructor() {
        for (let i = 0; i < barSpots; i++) {
            this._spots.push(undefined);
            this._timerIds.push(undefined);
        }
    }

    public addClient(client: ClientModel, spot: number) {
        if (this._spots[spot]) {
            throw new Error("spot is already taken");
        }
        this._spots[spot] = client;
        this._timerIds[spot] = setTimeout(() => {
            this.removeClient(spot);
            clientTimeoutSignal.dispatch(this, {
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
    }
}
