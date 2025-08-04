import bManager from "./buildRegistry.js";
import bSManager from "./buildState.js";
import sManager from "./gameState.js";
import lManager from "./lootTable.js";
import render from "./render.js";
import sSManager from "./survivorsState.js";

type Survivor = {
    id: string;
    name: string;
};

type GameDataType = {
    version: number;
    state: typeof sManager.initialGState;
    buildings: typeof bSManager.initialBState;
    buildRegistry: typeof bManager.initialBuildRegistry;
    lootTable: typeof lManager.initialLTable;
    survivors: Survivor[],
};

const stateInstance = [sManager.gameStateInstance, bSManager.bStateInstance, bManager.buildRegistry, lManager.lootTable, sSManager.survivorStateInstance];
//const lStorageKeys = ["gameState", "buildState", "buildRegistry", "lootTable", "survivorState"];

function saveGame() : void {
    /*const store = [];
    for (let i = 0; i < stateInstance.length; i++) {
        store.push(stateInstance[i]);
    }
    
    localStorage.setItem("GameData", JSON.stringify(store));*/

    const GameData = {
        version: 1,
        state: sManager.gameStateInstance,
        buildings: bSManager.bStateInstance,
        buildRegistry: bManager.buildRegistry,
        lootTable: lManager.lootTable,
        survivors: sSManager.survivorStateInstance,
    };

    localStorage.setItem("GameData", JSON.stringify(GameData));
    console.log("SAVED");
    return;
};

function loadGame(click?: boolean) : void {

    const data = localStorage.getItem("GameData");

    if (!data) {
        if (click) alert("No save data found");
        return;
    }

    // OLD LOAD VERSION
    /*for (let i = 0; i < stateInstance.length; i++) {
        Object.assign(stateInstance[i], JSON.parse(data)[i]);

        if (stateInstance[i] === sSManager.survivorStateInstance) {
            sSManager.survivorStateInstance.length = 0;
            sSManager.survivorStateInstance.push(...JSON.parse(data)[i]);
        }
    }*/

    // NEW LOAD VERSION
    const rawData = JSON.parse(data);
    let GameData;

    if (Array.isArray(rawData)) {
        GameData = {
            version: 1,
            state: rawData[0],
            buildings: rawData[1],
            buildRegistry: rawData[2],
            lootTable: rawData[3],
            survivors: rawData[4],
        };
    } else {
        GameData = rawData;
    }

    GameData = migrateSave(GameData);

    sManager.gameStateInstance = GameData.state;
    bSManager.bStateInstance = GameData.buildings;
    bManager.buildRegistry = GameData.buildRegistry;
    lManager.lootTable = GameData.lootTable;
    sSManager.survivorStateInstance = GameData.survivors;


    console.log("LOADED");
    return;
};

function migrateSave(data: GameDataType) : GameDataType {

    const mappings = [
        {key: 'state', init: sManager.initialGState},
        {key: 'buildings', init: bSManager.initialBState},
        {key: 'buildRegistry', init: bManager.initialBuildRegistry}
    ] as const;

    // Parcourt les clés de la version actuelle
    // Cela permet d'ajouter les clés manquantes des anciennes save
    for (const {key, init} of mappings) {
        for (const itemKey in init) {
            const typedKey = itemKey as keyof typeof init;
            // Si clé manquante on la rajoute
            if (!(typedKey in data[key])) {
                data[key][typedKey] = init[typedKey];
            }
        }
    }

    for (const item of lManager.initialLTable) {
        const exists = data.lootTable.some(savedItem => savedItem.name === item.name);
        if (!exists) {
            data.lootTable.push(item);
        }
    }

    if (!Array.isArray(data.survivors)) {
        data.survivors = [];
    }

    return data;
}

function clearGame() : void {
    if (!confirm("Are you sure to clear the game ? All of your data will be deleted and you can't restore it")) return;

    localStorage.clear();
    resetGameData();

    render.renderStates();
    console.log("CLEARED");
    return;
};

const resetGameData = () : void => {
    const initDatas = [sManager.initialGState, bSManager.initialBState, bManager.initialBuildRegistry, lManager.initialLTable];
    
    for (let i = 0; i < stateInstance.length; i++) {
        Object.assign(stateInstance[i], initDatas[i]);
    }
    sSManager.survivorStateInstance.length = 0;
};

export default {
    saveGame,
    loadGame,
    clearGame,
};