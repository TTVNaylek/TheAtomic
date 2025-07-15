import { BuildState } from "./buildState.js";
import bstateManager  from "./buildState.js";
import { GameState } from "./gameState.js";
import lootManager from "./lootTable.js"
import render from "./render.js";

type Build = {
    name: keyof BuildState;
    // Prix sous forme {ressource: prix}
    cost: {[resource in keyof GameState]? : number};
    discovered: boolean;
    requires? : {
        buildings? : Array<keyof BuildState>, 
        resource? : Array<keyof GameState>
        };
}

const buildTable: Build[] = [
  { name: "lumberHut", cost: {"stick": 100}, discovered: false, requires: {resource: ["stick"]}},
  { name: "stoneQuarry", cost: {"rock": 100}, discovered: false, requires: {buildings: ["lumberHut"], resource: ["rock"]}},
  
  // TODO: reflechire aux requis et aux prix
  /*{ name: "scrapYard", cost: [["stick"], 100], discovered: false},
  { name: "waterCollector", cost: [["wood", "metal"], 100], discovered: false},
  { name: "basicGarden", cost: [["wood", "food", "water"], 100], discovered: false},

  { name: "forge", cost: [["stick"], 100], discovered: false},
  { name: "workshop", cost: [["stick"], 100], discovered: false},
  { name: "smelter", cost: [["stick"], 100], discovered: false},
  { name: "craftingChamber", cost: [["stick"], 100], discovered: false},

  { name: "watchTower", cost: [["stick"], 100], discovered: false},

  { name: "shelter", cost: [["stick"], 100], discovered: false},
  { name: "medicalCenter", cost: [["stick"], 100], discovered: false},
  { name: "commonRoom", cost: [["stick"], 100], discovered: false},
  { name: "solarPanels", cost: [["stick"], 100], discovered: false},
  { name: "radioTower", cost: [["stick"], 100], discovered: false},
  { name: "sealedBunker", cost: [["stick"], 100], discovered: false},*/
];

// Retorune le prix du batiment sous forme {ressource: prix}
function getBuildCost(buildName: keyof BuildState) : {[resources in keyof GameState]? : number} {
    // Récupère le building dans la table
    const build = buildTable.find(b => b.name === buildName);
    if (!build)return {};

    // Récupérer le nb de batiments construits
    const nbBuilt = bstateManager.bStateInstance[buildName].nbOfBuild;

    const dynCost: {[resource in keyof GameState]?: number} = {};
    // Pour chaques ressources dans build.cost
    // On fait baseAmount * (nbBuilt + 1)
    for (const resource in build.cost) {
        const baseAmount = build.cost[resource as keyof GameState];
        if (baseAmount === undefined) return {};
        // Prix de base * (nb deja construit + le suivant)
        dynCost[resource as keyof GameState] = baseAmount * (nbBuilt + 1);
    }
    return dynCost;
}

function checkBuildingRequire() : void{
    for (let i = 0; i < buildTable.length; i++) {

        if (buildTable[i].discovered)break;

        // Check les requis de tous les batiments pour les dévérouiller
        if (buildTable[i].requires?.buildings?.some(req => !buildTable.find(item => item.name === req)?.discovered)
        || buildTable[i].requires?.resource?.some(req => !lootManager.lootTable.find(item => item.name === req)?.discovered)) {
            continue;
        }

        render.renderUnlocked(buildTable[i].name)
        render.renderLog("[UNLOCKED] You can now build " + buildTable[i].name + " for only " + buildTable[i].cost + " !");
    }
}

export default {
    buildTable,
    getBuildCost,
    checkBuildingRequire,
}