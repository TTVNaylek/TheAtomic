import bStateManager from "./buildState.js";
import lootManager from "./lootTable.js";
import render from "./render.js";
const buildTable = [
    { name: "lumberHut", cost: { "stick": 80 }, discovered: true, requires: { resource: ["stick"] } },
    { name: "stoneQuarry", cost: { "wood": 120 }, discovered: true, requires: { buildings: ["lumberHut"], resource: ["wood", "stick"] } },
    { name: "smelter", cost: { "rock": 180, "stick": 50 }, discovered: true, requires: { buildings: ["stoneQuarry"], resource: ["rock", "wood"] } },
    { name: "scrapYard", cost: { "wood": 180, "rock": 80 }, discovered: false, requires: { buildings: ["stoneQuarry"], resource: ["stick", "rock"] } },
    { name: "waterCollector", cost: { "wood": 90, "metal": 40 }, discovered: false, requires: { buildings: ["smelter"], resource: ["rock", "metal"] } },
    { name: "basicGarden", cost: { "wood": 100, "food": 40, "water": 40 }, discovered: false, requires: { buildings: ["waterCollector"], resource: ["food", "water"] } },
    { name: "forge", cost: { "metal": 130, "rock": 40 }, discovered: false, requires: { buildings: ["smelter"], resource: ["metal", "stick"] } },
    { name: "workshop", cost: { "metal": 130, "wood": 80 }, discovered: false, requires: { buildings: ["forge"], resource: ["wood", "metal"] } },
    { name: "craftingChamber", cost: { "metal": 180, "wood": 130 }, discovered: false, requires: { buildings: ["workshop"], resource: ["metal", "wood"] } },
    { name: "watchTower", cost: { "wood": 180, "rock": 80 }, discovered: false, requires: { buildings: ["stoneQuarry"], resource: ["rock", "wood"] } },
    { name: "shelter", cost: { "wood": 120, "stick": 80 }, discovered: false, requires: { buildings: ["lumberHut"], resource: ["wood", "stick"] } },
    { name: "medicalCenter", cost: { "wood": 180, "metal": 80 }, discovered: false, requires: { buildings: ["shelter"], resource: ["metal", "wood"] } },
    { name: "commonRoom", cost: { "wood": 130, "food": 80 }, discovered: false, requires: { buildings: ["basicGarden"], resource: ["food", "water"] } },
    { name: "solarPanels", cost: { "metal": 220 }, discovered: false, requires: { buildings: ["forge"], resource: ["metal"] } },
    { name: "radioTower", cost: { "metal": 260, "rock": 130 }, discovered: false, requires: { buildings: ["solarPanels"], resource: ["metal", "rock"] } },
    { name: "sealedBunker", cost: { "metal": 450, "rock": 280, "wood": 280 }, discovered: false, requires: { buildings: ["radioTower", "medicalCenter"], resource: ["metal", "rock", "wood"] } },
];
const initialBTable = structuredClone(buildTable);
// Retorune la production du batiment sous forme {ressource: production}
function getBuildCost(buildName) {
    // Récupère le building dans la table
    const build = buildTable.find(b => b.name === buildName);
    if (!build)
        return {};
    // Récupérer le nb de batiments construits
    const nbBuilt = bStateManager.bStateInstance[buildName].nbOfBuild;
    const dynCost = {};
    // Pour chaques ressources dans build.cost
    // On fait baseAmount * (nbBuilt + 1)
    for (const resource in build.cost) {
        const baseAmount = build.cost[resource];
        if (baseAmount === undefined)
            continue;
        // Prix de base * (nb deja construit + le suivant)
        dynCost[resource] = baseAmount * (nbBuilt + 1);
    }
    return dynCost;
}
;
// Check si un batiment peut être débloqué
function checkBuildingRequire() {
    var _a, _b, _c;
    for (let i = 0; i < buildTable.length; i++) {
        if (buildTable[i].discovered)
            continue;
        const buildReq = (_a = buildTable[i].requires) === null || _a === void 0 ? void 0 : _a.buildings;
        // Check les requis de tous les batiments pour les dévérouiller
        if ((buildReq === null || buildReq === void 0 ? void 0 : buildReq.some(req => { var _a; return !((_a = buildTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); }))
            || ((_c = (_b = buildTable[i].requires) === null || _b === void 0 ? void 0 : _b.resource) === null || _c === void 0 ? void 0 : _c.some(req => { var _a; return !((_a = lootManager.lootTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); })))
            continue;
        // Vérifie qu'au minimum 1 batiment requis soit construit pour débloquer le suivant
        if (buildReq === null || buildReq === void 0 ? void 0 : buildReq.some(req => bStateManager.bStateInstance[req].nbOfBuild < 1))
            continue;
        buildTable[i].discovered = true;
        render.renderLog("[UNLOCKED] You can now build " + buildTable[i].name + " for only " + JSON.stringify(buildTable[i].cost) + " !");
    }
}
;
export default {
    buildTable,
    getBuildCost,
    checkBuildingRequire,
    initialBTable,
};
