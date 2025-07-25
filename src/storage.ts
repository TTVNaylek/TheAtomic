import bManager from "./buildRegistry.js";
import bSManager from "./buildState.js";
import sManager from "./gameState.js";
import lManager from "./lootTable.js";
import render from "./render.js";
import sSManager from "./survivorsState.js";

const stateInstance = [sManager.gameStateInstance, bSManager.bStateInstance, sSManager.survivorStateInstance];
const lStorageKeys = ["gameState", "buildState", "survivorState"];

function saveGame() : void {
    for (let i = 0; i < stateInstance.length; i++) {
        localStorage.setItem(lStorageKeys[i], JSON.stringify(stateInstance[i]));
    }
    console.log("SAVED");
};

function loadGame(click?: boolean) : void {
    for (let i = 0; i < lStorageKeys.length; i++) {
        const savedData = localStorage.getItem(lStorageKeys[i]);

        if (!savedData) {
            if (click) alert("No save data found");
            return;
        }
        Object.assign(stateInstance[i],JSON.parse(savedData));
    }
    
    console.log("LOADED");
    return;
};

function clearGame() : void {
    if (!confirm("Are you sure to clear the game ? All of your data will be deleted and you can't restore it")) return;

    localStorage.clear();
    resetGameData();

    render.renderStates();
    console.log("CLEARED");
    return;
};

const resetGameData = () : void => {
    const currentDatas = [sManager.gameStateInstance, bSManager.bStateInstance, lManager.lootTable, bManager.buildRegistry, sSManager.survivorStateInstance];
    const initDatas = [sManager.initialGState, bSManager.initialBState, lManager.initialLTable, bManager.initialBuildRegistry, sSManager.initialSState];
    
    for (let i = 0; i < currentDatas.length; i++) {
        Object.assign(currentDatas[i], initDatas[i]);
    }
};

export default {
    saveGame,
    loadGame,
    clearGame,
};