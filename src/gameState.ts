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

export type ResourceKey = Exclude<keyof GameState, "survivors">;

const gameStateInstance: GameState = {
    food: 0,
    water: 0,

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
