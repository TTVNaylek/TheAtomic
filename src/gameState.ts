interface GameState {
  food: number,
  water: number,

  wood: number,
  stick: number,
  rock: number,
  metal: number,

  survivors: number,
};

const gameStateInstance: GameState = {
  food: 100,
  water: 100,
  wood: 0,
  metal: 0,
  stick: 0,
  rock: 0,
  survivors: 0,
};

const keys : Array<keyof GameState> = ["food", "water", "wood", "stick", "rock", "metal", "survivors"];

const consommable = ["food", "water"] as (keyof GameState)[];

export default {
    gameStateInstance,
    keys,
    consommable
}

export {
    GameState
}