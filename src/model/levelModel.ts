import { ClientModel } from "./barModel";
import { generateClients } from "#src/helpers/gameHelpers";

export type LevelModel = {
    clients: ClientModel[];
    minGapTime: number;
    maxGapTime: number;
};

export const getLevel = (level: number): LevelModel => {
    switch (level) {
        case 1:
            return {
                ...level1,
                clients: generateClients(8)
            };
        case 2:
            return {
                ...level2,
                clients: generateClients(10)
            };
        case 3:
            return {
                ...level3,
                clients: generateClients(12)
            };
        default:
            throw new Error("Invalid level");
    }
};

export const level1: LevelModel = {
    clients: generateClients(8),
    minGapTime: 3,
    maxGapTime: 15
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
