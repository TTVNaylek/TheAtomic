import bsManager, {BuildKey} from "./buildState.js";
import {ResourceKey} from "./gameState.js";
import lManager from "./lootTable.js";
import render from "./render.js";
import utils from "./utils.js";

type Build = {
    name: BuildKey;
    // Prix sous forme {ressource: prix}
    cost: {[resource in ResourceKey]? : number};
    production?: {[resource in ResourceKey]? : number};
    //consumption?: Array<ResourceKey>;
    requires? : {
        buildings? : Array<BuildKey>,
        resources? : Array<ResourceKey>
    };
    survivorCap?: number;
    capacity?: {[resource in ResourceKey]? : number};
    discovered: boolean;
};

const buildRegistry: Record<BuildKey, Build> = await utils.getJsonData<Record<BuildKey, Build> >("./public/datas/BuildRegistry.json");

/*const buildRegistry: Build[] = [
    {name: "lumberHut", cost: {"stick": 80}, discovered: false, requires: {resources: ["stick"]}},
    {name: "stoneQuarry", cost: {"wood": 120}, discovered: false, requires: {buildings: ["lumberHut"], resources: ["wood", "stick"]}},
    {name: "smelter", cost: {"rock": 180, "stick": 50}, discovered: false, requires: {buildings: ["stoneQuarry"], resources: ["rock", "wood"]}},
  
    {name: "scrapYard", cost: {"wood": 180, "rock": 80}, discovered: false, requires: {buildings: ["stoneQuarry"], resources: ["stick", "rock"]}},
    {name: "waterCollector", cost: {"wood": 90, "metal": 40}, discovered: false, requires: {buildings: ["smelter"], resources: ["rock", "metal"]}},
    {name: "basicGarden", cost: {"wood": 100, "food": 40, "water": 40}, discovered: false, requires: {buildings: ["waterCollector"], resources: ["food", "water"]}},

    {name: "forge", cost: {"metal": 130, "rock": 40}, discovered: false, requires: {buildings: ["smelter"], resources: ["metal", "stick"]}},
    {name: "workshop", cost: {"metal": 130, "wood": 80}, discovered: false, requires: {buildings: ["forge"], resources: ["wood", "metal"]}},
    {name: "craftingChamber", cost: {"metal": 180, "wood": 130}, discovered: false, requires: {buildings: ["workshop"], resources: ["metal", "wood"]}},

    {name: "watchTower", cost: {"wood": 180, "rock": 80}, discovered: false, requires: {buildings: ["stoneQuarry"], resources: ["rock", "wood"]}},
    {name: "shelter", cost: {"wood": 120, "stick": 80}, discovered: false, requires: {buildings: ["lumberHut"], resources: ["wood", "stick"]}, survivorCap: 2},
    {name: "medicalCenter", cost: {"wood": 180, "metal": 80}, discovered: false, requires: {buildings: ["shelter"], resources: ["metal", "wood"]}},
    {name: "commonRoom", cost: {"wood": 130, "food": 80}, discovered: false, requires: {buildings: ["basicGarden"], resources: ["food", "water"]}, survivorCap: 2},

    {name: "solarPanels", cost: {"metal": 220}, discovered: false, requires: {buildings: ["forge"], resources: ["metal"]}},
    {name: "radioTower", cost: {"metal": 260, "rock": 130}, discovered: false, requires: {buildings: ["solarPanels"], resources: ["metal", "rock"]}},
    {name: "sealedBunker", cost: {"metal": 450, "rock": 280, "wood": 280}, discovered: false, requires: {buildings: ["radioTower", "medicalCenter"], resources: ["metal", "rock", "wood"]}},
];*/

const initialBuildRegistry: Record<BuildKey, Build>  = structuredClone(buildRegistry);

// Check si un batiment peut être débloqué
function checkBuildingRequire() : void {
    for (const key in buildRegistry) {
        const build = buildRegistry[key as BuildKey];
        if (build.discovered) continue;

        const buildRequire = build.requires;

        const missingRequiredBuilding = buildRequire?.buildings?.some(req => !buildRegistry[req].discovered);
        const missingRequiredResources = buildRequire?.resources?.some(req => !lManager.lootTable.find(item => item.name === req)?.discovered);

        if (missingRequiredBuilding || missingRequiredResources) {
            console.log("RESSOURCES MANQUANTES");
            continue;
        }

        
        if (buildRequire?.buildings?.some(req => bsManager.bStateInstance[req].nbOfBuild < 1)) {
            console.log("PEUX PAS DEBLOQUER CE BATIMENT");
            continue;
        }

        build.discovered = true;
        render.renderLog("[UNLOCKED] You can now build " + build.name + " for only " + JSON.stringify(build.cost) + " !");
    }
};

// Retorune la production du batiment sous forme {ressource: production}
function getBuildCost(buildName: BuildKey) : {[resources in ResourceKey]? : number} {
    const build = buildRegistry[buildName];
    if (!build) return {};

    const nbBuilt = bsManager.bStateInstance[buildName].nbOfBuild;
    const dynCost: {[resource in ResourceKey]?: number} = {};

    for (const key in build.cost) {
        const typedResource = key as ResourceKey;
        const baseAmount = build.cost[typedResource];
        
        if (baseAmount === undefined) {
            console.log("NO BASE AMOUNT FOR BUY BUILDING");
            continue;
        }
        dynCost[typedResource] = baseAmount * (nbBuilt + 1);
    
    }
    return dynCost;
};

// Retourne la capacité total de survivants de tous les batiments
function getSurvivorCapacity() : number {
    let totalCap = 0;

    for (const key in buildRegistry) {
        const build = buildRegistry[key as BuildKey];
        if (!build || !build.survivorCap) continue;
        
        const nbBuilt = bsManager.bStateInstance[build.name].nbOfBuild;
        totalCap += build.survivorCap * nbBuilt;
    }
    return totalCap;
};

function getProduction() : {[resources in ResourceKey]? : number} {
    // Parcourir chaque batiment
    // Récupérer la production
    // Si pas de production skip
    // Sinon continue
    // production * nbBuild * survivants
    // retourner le résultat sous forme ressource: prix
    const dynProd: {[resource in ResourceKey]?: number} = {};
    const bState = bsManager.bStateInstance;

    for (const bkey in buildRegistry) {
        const build = buildRegistry[bkey as BuildKey];

        if (!build || !build.production) {
            console.log("NO BUILD OR NO PRODUCTION");
            continue;
        }

        const buildInstance = bState[build.name];

        for (const rkey in build.production) {
            const typedKey = rkey as ResourceKey;
            const resource = build.production[typedKey];

            if (!resource) {
                console.log("NO RESOURCE PRODUCTION");
                continue;
            }

            const survivors = buildInstance.assignedSurvivors ?? 0;
            const multiplier = (1 + (0.1 * survivors));
            dynProd[typedKey] = (dynProd[typedKey] ?? 0) + resource * buildInstance.nbOfBuild * multiplier;
        }
    }
    return dynProd;
};

function getCapacity() : {[resource in ResourceKey]?: number} {
    const dynCap: {[resource in ResourceKey]?: number} = {};
    for (const bkey in buildRegistry) {
        const build = buildRegistry[bkey as BuildKey];

        const nbBuilt = bsManager.bStateInstance[build.name].nbOfBuild;
        const buildCapacity = buildRegistry[build.name].capacity;

        if (nbBuilt < 1 || !buildCapacity) {
            continue;
        }

        for (const rkey in buildCapacity) {
            const typedResource = rkey as ResourceKey;
            const resCapacity = buildCapacity[typedResource];

            if (!resCapacity) {
                continue;
            }
            dynCap[typedResource] = (dynCap[typedResource] ?? 0) + resCapacity * nbBuilt;
        }
    }
    return dynCap;
};

export default {
    initialBuildRegistry,
    buildRegistry,
    checkBuildingRequire,
    getBuildCost,
    getSurvivorCapacity,
    getProduction,
    getCapacity,
};