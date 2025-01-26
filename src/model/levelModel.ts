import { ClientModel } from "./barModel";
import { generateClients } from "#src/helpers/gameHelpers";

export type LevelModel = {
    clients: ClientModel[];
    minGapTime: number;
    maxGapTime: number;
};

export const level1: LevelModel = {
    clients: generateClients(8),
    minGapTime: 1,
    maxGapTime: 3
};

export const level2: LevelModel = {
    clients: generateClients(10),
    minGapTime: 6,
    maxGapTime: 12
};

export const level3: LevelModel = {
    clients: generateClients(12),
    minGapTime: 4,
    maxGapTime: 10
};
