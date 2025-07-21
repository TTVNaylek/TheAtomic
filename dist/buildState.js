;
const bStateInstance = {
    lumberHut: { nbOfBuild: 1, production: { stick: 1, wood: 1 }, assignedSurvivors: 0 },
    stoneQuarry: { nbOfBuild: 0, production: { rock: 1 }, consumption: ["wood"], assignedSurvivors: 0 },
    scrapYard: { nbOfBuild: 0 },
    waterCollector: { nbOfBuild: 0, production: { water: 1 }, assignedSurvivors: 0 },
    basicGarden: { nbOfBuild: 0, production: { food: 1 }, consumption: ["water", "food"], assignedSurvivors: 0 },
    forge: { nbOfBuild: 0, production: { metal: 1 }, consumption: ["wood", "metal"], assignedSurvivors: 0 },
    workshop: { nbOfBuild: 0, consumption: ["wood", "rock"], assignedSurvivors: 0 },
    smelter: { nbOfBuild: 0, consumption: ["rock", "metal"], assignedSurvivors: 0 },
    craftingChamber: { nbOfBuild: 0, consumption: ["stick", "metal"], assignedSurvivors: 0 },
    watchTower: { nbOfBuild: 0, assignedSurvivors: 0 },
    shelter: { nbOfBuild: 0, consumption: ["food", "water", "electricity"] },
    medicalCenter: { nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0, },
    commonRoom: { nbOfBuild: 0, consumption: ["electricity"] },
    solarPanels: { nbOfBuild: 0, production: { electricity: 1 } },
    radioTower: { nbOfBuild: 0, consumption: ["electricity"], assignedSurvivors: 0, },
    sealedBunker: { nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0 },
};
const initialBState = structuredClone(bStateInstance);
function getProduction(buildState) {
    var _a, _b;
    const buildKeys = Object.keys(buildState);
    const dynProd = {};
    for (let i = 0; i < buildKeys.length; i++) {
        const nbBuilt = buildState[buildKeys[i]].nbOfBuild;
        const prodTable = buildState[buildKeys[i]].production;
        if (nbBuilt < 1 || !prodTable) {
            continue;
        }
        // Récupère chaque ressources de prodTable dans ressource
        for (const ressource in prodTable) {
            const typedResource = ressource;
            const production = prodTable[typedResource];
            if (!production) {
                continue;
            }
            // Survivant assigné = boost la production
            // + 10% par survivants assignés
            const survivors = (_a = buildState[buildKeys[i]].assignedSurvivors) !== null && _a !== void 0 ? _a : 0;
            const multiplier = (1 + (0.1 * survivors));
            dynProd[typedResource] = ((_b = dynProd[typedResource]) !== null && _b !== void 0 ? _b : 0) + production * nbBuilt * multiplier;
        }
    }
    return dynProd;
}
;
export default {
    bStateInstance,
    getProduction,
    initialBState,
};
