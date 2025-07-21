import stateManager from "./gameState.js";
import bStateManager from "./buildState.js";
import sManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";
function saveGame(gState, bState) {
    localStorage.setItem("gameState", JSON.stringify(gState));
    localStorage.setItem("buildState", JSON.stringify(bState));
    console.log("SAVED");
}
;
function loadGame(click) {
    const stateInstance = [stateManager.gameStateInstance, bStateManager.bStateInstance];
    const lStorageKeys = ["gameState", "buildState"];
    for (let i = 0; i < lStorageKeys.length; i++) {
        const savedData = localStorage.getItem(lStorageKeys[i]);
        if (!savedData) {
            if (click)
                alert("No save data found");
            return;
        }
        Object.assign(stateInstance[i], JSON.parse(savedData));
    }
    console.log("LOADED");
    return;
}
;
function clearGame() {
    const answer = confirm("Are you sure to clear the game ? All of your data will be deleted and you can't restore it");
    if (!answer)
        return;
    localStorage.clear();
    const currentDatas = [stateManager.gameStateInstance, bStateManager.bStateInstance, sManager.lootTable, bManager.buildTable];
    const initDatas = [stateManager.initialGState, bStateManager.initialBState, sManager.initialLTable, bManager.initialBTable];
    for (let i = 0; i < currentDatas.length; i++) {
        resetGameData(currentDatas[i], initDatas[i]);
        console.log(currentDatas[i]);
    }
    render.renderStates(stateManager.gameStateInstance, bStateManager.bStateInstance);
    console.log("CLEARED");
    return;
}
;
const resetGameData = (currentData, initData) => {
    Object.assign(currentData, initData);
};
export default {
    saveGame,
    loadGame,
    clearGame,
};
