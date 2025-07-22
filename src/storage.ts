import sManager from "./gameState.js";
import bSManager from "./buildState.js";
import sSManager from "./survivorsState.js";
import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";

const stateInstance = [sManager.gameStateInstance, bSManager.bStateInstance, sSManager.survivorStateInstance];
const lStorageKeys = ["gameState", "buildState", "survivorState"];

function saveGame() : void{
    for (let i = 0; i < stateInstance.length; i++) {
        localStorage.setItem(lStorageKeys[i], JSON.stringify(stateInstance[i]));
    }
    console.log("SAVED");
};

function loadGame(click?: boolean) : void {
    for (let i = 0; i < lStorageKeys.length; i++) {
        const savedData = localStorage.getItem(lStorageKeys[i]);

        if (!savedData){
            if (click) alert("No save data found");
            return;
        }
        Object.assign(stateInstance[i],JSON.parse(savedData));
    }
    
    console.log("LOADED");
    return;
};

function clearGame() : void{
    const answer =  confirm("Are you sure to clear the game ? All of your data will be deleted and you can't restore it");

    if (!answer)return;

    localStorage.clear();

    const currentDatas = [sManager.gameStateInstance, bSManager.bStateInstance, lManager.lootTable, bManager.buildTable, sSManager.survivorStateInstance];
    const initDatas = [sManager.initialGState, bSManager.initialBState, lManager.initialLTable, bManager.initialBTable, sSManager.initialSState];

    for (let i = 0; i < currentDatas.length; i++) {
        resetGameData(currentDatas[i], initDatas[i]);
        console.log(currentDatas[i]);
    }

    render.renderStates(sManager.gameStateInstance, bSManager.bStateInstance);
    console.log("CLEARED");
    return;
};

const resetGameData = (currentData: any, initData: any) : void => {
    Object.assign(currentData, initData);
};

export default {
    saveGame,
    loadGame,
    clearGame,
};