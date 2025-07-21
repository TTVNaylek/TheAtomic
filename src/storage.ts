import stateManager, {GameState} from "./gameState.js";
import bStateManager, {BuildState} from "./buildState.js";
import sManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";

function saveGame(gState: GameState, bState: BuildState) : void{
    localStorage.setItem("gameState", JSON.stringify(gState));
    localStorage.setItem("buildState", JSON.stringify(bState));
};

function loadGame() : void {
    const stateInstance = [stateManager.gameStateInstance, bStateManager.bStateInstance];
    const lStorageKeys = ["gameState", "buildState"];

    for (let i = 0; i < lStorageKeys.length; i++) {
        const savedData = localStorage.getItem(lStorageKeys[i]);

        if (!savedData)return;
        Object.assign(stateInstance[i],JSON.parse(savedData));
    }
    return;
};

function clearGame() : void{
    const answer =  confirm("Are you sure to clear the game ? All of your data will be deleted and you can't restore it");

    if (!answer)return;

    localStorage.clear();

    const currentDatas = [stateManager.gameStateInstance, bStateManager.bStateInstance, sManager.lootTable, bManager.buildTable];
    const initDatas = [stateManager.initialGState, bStateManager.initialBState, sManager.initialLTable, bManager.initialBTable];

    for (let i = 0; i < currentDatas.length; i++) {
        resetGameData(currentDatas[i], initDatas[i]);
        console.log(currentDatas[i]);
    }

    render.renderStates(stateManager.gameStateInstance, bStateManager.bStateInstance);
    return;
};

const resetGameData = (currentData : any, initData: any) : void => {
    Object.assign(currentData, initData);
};

export default {
    saveGame,
    loadGame,
    clearGame,
};