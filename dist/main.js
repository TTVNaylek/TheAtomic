import utils from "./utils.js";
const gameState = {
    food: 100,
    water: 100,
    wood: 0,
    metal: 0,
    stick: 0,
    rock: 0,
    survivors: 0,
};
const baseConsumption = 0.25;
function consumeFood(state) {
    if (state.food <= 0) {
        state.food = 0;
        return;
    }
    if (utils.isNotNullAndSuperior(state.survivors)) {
        state.food -= baseConsumption * state.survivors;
        return;
    }
    state.food -= baseConsumption;
    return;
}
function consumeWater(state) {
    if (state.water <= 0) {
        state.water = 0;
        return;
    }
    if (utils.isNotNullAndSuperior(state.survivors)) {
        state.water -= baseConsumption * state.survivors;
        return;
    }
    state.water -= baseConsumption;
    return;
}
function searchItems() {
    // TODO faire une fonction de recherche d'item avec une proba
}
function renderGameState(state) {
    console.log("---CURRENT GAME STATE---");
    console.log("Food " + state.food);
    console.log("Water " + state.water);
    console.log("Wood " + state.wood);
    console.log("Stick " + state.stick);
    console.log("Rock " + state.rock);
    console.log("Metal " + state.metal);
    console.log("Survivors " + state.survivors);
    const updateData = (id, value) => {
        const doc = document.getElementById(id);
        doc ? doc.textContent = value.toString() : "NULL DATA";
    };
    updateData("food-count", state.food);
    updateData("water-count", state.water);
    updateData("wood-count", state.wood);
    updateData("rock-count", state.rock);
}
// 1 Sec
setInterval(() => {
    consumeFood(gameState);
    consumeWater(gameState);
    renderGameState(gameState);
}, 1000);
