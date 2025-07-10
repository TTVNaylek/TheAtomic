;
const gameStateInstance = {
    food: 100,
    water: 100,
    wood: 0,
    metal: 0,
    stick: 0,
    rock: 0,
    survivors: 0,
};
const keys = ["food", "water", "wood", "stick", "rock", "metal", "survivors"];
const consommable = ["food", "water"];
export default {
    gameStateInstance,
    keys,
    consommable
};
