export interface GameState {
    food: number,
    water: number,
    electricity: number,

    wood: number,
    stick: number,
    rock: number,
    metal: number,

    survivors: number,
};

export type ResourceKey = keyof GameState;

const gameStateInstance: GameState = {
    food: 100,
    water: 100,

    electricity: 0,

    wood: 0,
    metal: 0,
    stick: 0,
    rock: 0,
  
    survivors: 0,
};

const initialGState: GameState = structuredClone(gameStateInstance);


// Ressources à diminuer par rapport aux survivants
const consommable = ["food", "water"] as Array<ResourceKey>;

export default {
    gameStateInstance,
    consommable,
    initialGState,
};
