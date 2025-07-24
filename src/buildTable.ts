import bsManager, {BuildKey} from "./buildState.js";
import {ResourceKey} from "./gameState.js";
import lManager from "./lootTable.js";
import render from "./render.js";
import utils from "./utils.js";

type Build = {
    name: BuildKey;
    // Prix sous forme {ressource: prix}
    cost: {[resource in ResourceKey]? : number};
    discovered: boolean;
    requires? : {
        buildings? : Array<BuildKey>,
        resources? : Array<ResourceKey>
    };
    survivorCap?: number;
};

const buildTable: Build[] = await utils.getJsonData<Build[]>("./public/datas/BuildTable.json");

/*const buildTable: Build[] = [
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

const initialBTable: Build[] = structuredClone(buildTable);

// Retorune la production du batiment sous forme {ressource: production}
function getBuildCost(buildName: BuildKey) : {[resources in ResourceKey]? : number} {
    // Récupère le building dans la table
    const build = buildTable.find(b => b.name === buildName);
    if (!build) return {};

    // Récupérer le nb de batiments construits
    const nbBuilt = bsManager.bStateInstance[buildName].nbOfBuild;

    const dynCost: {[resource in ResourceKey]?: number} = {};
    // Pour chaques ressources dans build.cost
    // On fait baseAmount * (nbBuilt + 1)
    for (const resource in build.cost) {
        const baseAmount = build.cost[resource as ResourceKey];
        if (baseAmount === undefined) continue;
        // Prix de base * (nb deja construit + le suivant)
        dynCost[resource as ResourceKey] = baseAmount * (nbBuilt + 1);
    }
    return dynCost;
};

// Check si un batiment peut être débloqué
function checkBuildingRequire() : void {
    for (let i = 0; i < buildTable.length; i++) {

        if (buildTable[i].discovered) continue;

        const buildReq = buildTable[i].requires?.buildings;
        
        // Check les requis de tous les batiments pour les dévérouiller
        if (buildReq?.some(req => !buildTable.find(item => item.name === req)?.discovered)
        || buildTable[i].requires?.resources?.some(req => !lManager.lootTable.find(item => item.name === req)?.discovered)) continue;

        
        // Vérifie qu'au minimum 1 batiment requis soit construit pour débloquer le suivant
        if (buildReq?.some(req => bsManager.bStateInstance[req].nbOfBuild < 1)) continue;

        buildTable[i].discovered = true;
        render.renderLog("[UNLOCKED] You can now build " + buildTable[i].name + " for only " + JSON.stringify(buildTable[i].cost) + " !");
    }
};

// Retourne la capacité total de survivants de tous les batiments
function getSurvivorCapacity() : number {
    let totalCap = 0;

    // Parcourt tous les batiments
    for (let i = 0; i < buildTable.length; i++) {
        const building = buildTable[i];
        // Check si ce n'est pas undefined, null ou = 0
        if (!building || !building.survivorCap) continue;

        totalCap += building.survivorCap;
    }

    return totalCap;
};

export default {
    initialBTable,
    buildTable,
    getBuildCost,
    checkBuildingRequire,
    getSurvivorCapacity,
};