// Generate an array of client names
import { ClientModel } from "#src/model/barModel";

const clientNames = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ivan", "Julia"];

// Function to generate a random number within a range
export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate an array of clients
export const generateClients = (count: number) => {
    return Array.from({ length: count }, (_, index) => {
        const _name = clientNames[index % clientNames.length]; // Loop through names if count exceeds the array length
        return new ClientModel(getRandomNumber(8, 15) * 1000, _name, index);
    });
};
