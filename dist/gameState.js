;
const gameStateInstance = {
    food: 100,
    water: 100,
    electricity: 0,
    wood: 0,
    metal: 0,
    stick: 0,
    rock: 0,
    survivors: 0,
};
// Ressources à diminuer par rapport aux survivants
const consommable = ["food", "water"];
export default {
    gameStateInstance,
    consommable
};
