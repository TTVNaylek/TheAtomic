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
    consumption?: Array<ResourceKey>;
    requires: {
        buildings? : Array<BuildKey>,
        resources? : Array<ResourceKey>
    };
    survivorCap?: number;
    capacity?: {[resource in ResourceKey]? : number};
    discovered: boolean;
};

const buildRegistry: Record<BuildKey, Build> = await utils.getJsonData<Record<BuildKey, Build> >("./public/datas/BuildRegistry.json");

const initialBuildRegistry: Record<BuildKey, Build>  = structuredClone(buildRegistry);

// Check si un batiment peut être débloqué
function checkBuildingRequire() : void {
    for (const key in buildRegistry) {
        const build = buildRegistry[key as BuildKey];
        if (build.discovered) continue;

        const buildRequire = build.requires;

        const missingRequiredBuilding = buildRequire?.buildings?.some(req => !buildRegistry[req].discovered);
        const missingRequiredResources = buildRequire?.resources?.some(req => !lManager.lootTable.find(item => item.name === req)?.discovered);

        if (missingRequiredBuilding || missingRequiredResources) continue;

        
        if (buildRequire?.buildings?.some(req => bsManager.bStateInstance[req].nbOfBuild < 1)) continue;

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
        
        if (baseAmount === undefined) continue;
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

// Retourne la production des batiments
function getProduction() : {[resources in ResourceKey]? : number} {
    const dynProd: {[resource in ResourceKey]?: number} = {};
    const bState = bsManager.bStateInstance;

    for (const bkey in buildRegistry) {
        const build = buildRegistry[bkey as BuildKey];

        if (!build || !build.production) continue;

        const buildInstance = bState[build.name];

        for (const rkey in build.production) {
            const typedKey = rkey as ResourceKey;
            const resource = build.production[typedKey];

            if (!resource) continue;

            const survivors = buildInstance.assignedSurvivors ?? 0;
            const multiplier = (1 + (0.1 * survivors));
            dynProd[typedKey] = (dynProd[typedKey] ?? 0) + resource * buildInstance.nbOfBuild * multiplier;
        }
    }
    return dynProd;
};

function getCapacity() : {[resource in ResourceKey]?: number} {
    const dynCap: {[resource in ResourceKey]?: number} = {"food": 50, "water":50, "stick": 50};

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