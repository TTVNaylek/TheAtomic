import utils from "./utils.js";
import stateManager from "./gameState.js";
import bStateManager from "./buildState.js";
import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";
// Consomme les ressources food et water en fonction des survivants
const consumeResourceBySurvivors = (state) => {
    const baseConsumption = 0.25;
    const keys = stateManager.consommable;
    for (let i = 0; i < keys.length; i++) {
        if (state[keys[i]] <= 0) {
            state[keys[i]] = 0;
            continue;
        }
        state[keys[i]] -= baseConsumption * (state.survivors + 1);
    }
};
// Gagner une resource selon le batiment et son niveau
const gainResourceByBuilds = (gameState, buildState) => {
    var _a;
    const prod = bStateManager.getProduction(buildState);
    for (const key in prod) {
        const typedKey = key;
        if (!prod[typedKey]) {
            continue;
        }
        gameState[typedKey] = ((_a = gameState[typedKey]) !== null && _a !== void 0 ? _a : 0) + prod[typedKey];
    }
};
// Récupérer 1 à 3 items
function searchItems() {
    var _a, _b, _c, _d;
    const gState = stateManager.gameStateInstance;
    // Permet de récupérer 1 à 3 index d'items
    const itemsIndex = [];
    for (let i = 0; i < utils.randomValue(1, 3); i++) {
        itemsIndex[i] = utils.randomValue(0, lManager.lootTable.length - 1);
    }
    for (let i = 0; i < itemsIndex.length; i++) {
        const potentialItem = lManager.lootTable[itemsIndex[i]];
        // Check si le ou les objet(s) précédents requis est/sont discovered: true
        // some() parcourt requires qui va permettre de check chaques requis avec find
        if (((_b = (_a = potentialItem.requires) === null || _a === void 0 ? void 0 : _a.building) === null || _b === void 0 ? void 0 : _b.some(req => { var _a; return !((_a = bManager.buildTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); }))
            || ((_d = (_c = potentialItem.requires) === null || _c === void 0 ? void 0 : _c.resource) === null || _d === void 0 ? void 0 : _d.some(req => { var _a; return !((_a = lManager.lootTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); }))) {
            continue;
        }
        if (Math.random() > potentialItem.dropRate) {
            render.renderLog("Nothing found...");
            break;
        }
        let quantity = potentialItem.quantity;
        if (Array.isArray(quantity)) {
            quantity = utils.randomValue(quantity[0], quantity[1]);
        }
        gState[potentialItem.name] += quantity;
        // Item découvert
        // Quand un item a été découvert afficher dans la box de logs un message
        if (!potentialItem.discovered) {
            render.renderLog("[UNLOCKED] Wow you found " + quantity + " " + potentialItem.name + "s !");
        }
        else {
            render.renderLog("+" + quantity + " " + potentialItem.name);
        }
        // Passer à true le discovered de l'item
        const item = lManager.lootTable.find(i => i.name === potentialItem.name);
        if (item) {
            item.discovered = true;
        }
    }
    // Vérifie si on débloque un batiment
    bManager.checkBuildingRequire();
}
function buyBuilding(buildName) {
    // Récupérer le nom du build et son prix (getBuildCost)
    const build = buildName;
    const bCost = bManager.getBuildCost(build);
    let canBuy = true;
    // Vérifie si on peut acheter
    for (const key in bCost) {
        const typedKey = key;
        if (!bCost[typedKey])
            break;
        // Si ressources < prix
        if (stateManager.gameStateInstance[typedKey] < bCost[typedKey]) {
            canBuy = false;
            break;
        }
    }
    if (!canBuy) {
        console.log("CANT BUY");
        return;
    }
    // Achat du batiment
    for (const key in bCost) {
        const typedKey = key;
        if (!bCost[typedKey])
            break;
        stateManager.gameStateInstance[typedKey] -= bCost[typedKey];
    }
    // Ajout du batiment acheté
    bStateManager.bStateInstance[build].nbOfBuild += 1;
}
export default {
    consumeResourceBySurvivors,
    searchItems,
    gainResourceByBuilds,
    buyBuilding
};
