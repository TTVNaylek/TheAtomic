import {ResourceKey} from "./gameState.js";
import utils from "./utils.js";

type BuildInstance = {
    nbOfBuild: number;
    production?: {[resource in ResourceKey]? : number};
    consumption?: Array<ResourceKey>;
    assignedSurvivors?: number;
    capacity?: {[resource in ResourceKey]? : number};
};

interface BuildState {
    lumberHut: BuildInstance;
    stoneQuarry: BuildInstance;
    scrapYard: BuildInstance;
    waterCollector: BuildInstance;
    basicGarden: BuildInstance;

    forge: BuildInstance;
    workshop: BuildInstance;
    smelter: BuildInstance;
    craftingChamber: BuildInstance;

    watchTower: BuildInstance;

    shelter: BuildInstance;
    medicalCenter: BuildInstance;
    commonRoom: BuildInstance;

    solarPanels: BuildInstance;
    radioTower: BuildInstance;
    sealedBunker: BuildInstance;
};

type BuildKey = keyof BuildState;

//const bStateInstance: BuildState = BuildDatas;

const bStateInstance: BuildState = await utils.getJsonData<BuildState>("./public/datas/BuildState.json");

// AJOUTER UNE CAPACITE AU BATIMENTS
/*const bStateInstance: BuildState = {
    lumberHut: {nbOfBuild: 0, production: {stick: 1, wood: 1}, assignedSurvivors: 0},
    stoneQuarry: {nbOfBuild: 0, production: {rock: 1}, consumption: ["wood"], assignedSurvivors: 0},
    scrapYard: {nbOfBuild: 0},
    waterCollector: {nbOfBuild: 0, production: {water: 1}, assignedSurvivors: 0},
    basicGarden: {nbOfBuild: 0, production: {food: 1}, consumption: ["water", "food"], assignedSurvivors: 0},

    forge: {nbOfBuild: 0, production: {metal: 1}, consumption: ["wood", "metal"], assignedSurvivors: 0},
    workshop: {nbOfBuild: 0, consumption: ["wood", "rock"], assignedSurvivors: 0},
    smelter: {nbOfBuild: 0, consumption: ["rock", "metal"], assignedSurvivors: 0},
    craftingChamber: {nbOfBuild: 0,  consumption: ["stick", "metal"], assignedSurvivors: 0},

    watchTower: {nbOfBuild: 0, assignedSurvivors: 0},

    shelter: {nbOfBuild: 0, consumption: ["food", "water", "electricity"]},
    medicalCenter: {nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0},
    commonRoom: {nbOfBuild: 0, consumption: ["electricity"]},

    solarPanels: {nbOfBuild: 0, production: {electricity: 1}},
    radioTower: {nbOfBuild: 0, consumption: ["electricity"], assignedSurvivors: 0},
    sealedBunker: {nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0},
};*/

const initialBState: BuildState = structuredClone(bStateInstance);


function getProduction(buildState: BuildState) : {[resources in ResourceKey]? : number} {
    const buildKeys = Object.keys(buildState) as Array<BuildKey>;
    const dynProd: {[resource in ResourceKey]?: number} = {};
  
    for (let i = 0; i < buildKeys.length; i++) {
        const nbBuilt = buildState[buildKeys[i]].nbOfBuild;
        const prodTable = buildState[buildKeys[i]].production;

 
        if (nbBuilt < 1 || !prodTable) {
            continue;
        }

        // Récupère chaque ressources de prodTable dans ressource
        for (const ressource in prodTable) {
            const typedResource = ressource as ResourceKey;
            const production = prodTable[typedResource];
            if (!production) {
                continue;
            }

            // Survivant assigné = boost la production
            // + 10% par survivants assignés
            const survivors = buildState[buildKeys[i]].assignedSurvivors ?? 0;
            const multiplier = (1 + (0.1 * survivors));
            dynProd[typedResource] = (dynProd[typedResource] ?? 0) + production * nbBuilt * multiplier;
        }
    }
    return dynProd;
};

function getCapacity(buildState: BuildState) {
    const buildKeys = Object.keys(buildState) as Array<BuildKey>;
    const dynCap: {[resource in ResourceKey]?: number} = {};
  
    for (let i = 0; i < buildKeys.length; i++) {
        const nbBuilt = buildState[buildKeys[i]].nbOfBuild;
        const capTable = buildState[buildKeys[i]].capacity;

 
        if (nbBuilt < 1 || !capTable) {
            continue;
        }

        // Récupère chaque ressources de prodTable dans ressource
        for (const ressource in capTable) {
            const typedResource = ressource as ResourceKey;
            const capacity = capTable[typedResource];
            if (!capacity) {
                continue;
            }

            dynCap[typedResource] = (dynCap[typedResource] ?? 0) + capacity * nbBuilt;
        }
    }
    return dynCap;
};

export default {
    bStateInstance,
    getProduction,
    initialBState,
    getCapacity,
};

export {
    BuildKey, BuildState
};
