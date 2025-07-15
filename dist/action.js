import utils from "./utils.js";
import stateManager from "./gameState.js";
import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";
const gState = stateManager.gameStateInstance;
const baseConsumption = 0.25;
const consumeResource = (state, type) => {
    if (state[type] <= 0) {
        state[type] = 0;
        return;
    }
    if (utils.isNotNullAndSuperior(state.survivors)) {
        state[type] -= baseConsumption * state.survivors;
        return;
    }
    state[type] -= baseConsumption;
    return;
};
const gainResource = (state, type) => {
    // Gagner une resource selon le batiment et son niveau
};
const searchBtn = document.getElementById("searchButton");
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', (event) => {
    searchItems();
});
// Récupérer 1 à 3 items
function searchItems() {
    var _a, _b, _c, _d;
    // Permet de récupérer 1 à 3 index d'items
    const itemsIndex = [];
    for (let i = 0; i < utils.randomValue(1, 3); i++) {
        itemsIndex[i] = utils.randomValue(0, lManager.lootTable.length - 1);
    }
    //console.log("ITEMS INDEX: " + itemsIndex);
    for (let i = 0; i < itemsIndex.length; i++) {
        const potentialItem = lManager.lootTable[itemsIndex[i]];
        // Check si le ou les objet(s) précédents requis est/sont discovered: true
        // some() parcourt requires qui va permettre de check chaques requis avec find
        if (((_b = (_a = potentialItem.requires) === null || _a === void 0 ? void 0 : _a.building) === null || _b === void 0 ? void 0 : _b.some(req => { var _a; return !((_a = bManager.buildTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); }))
            || ((_d = (_c = potentialItem.requires) === null || _c === void 0 ? void 0 : _c.resource) === null || _d === void 0 ? void 0 : _d.some(req => { var _a; return !((_a = lManager.lootTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); }))) {
            render.renderLog("Nothing found...");
            continue;
        }
        let quantity = potentialItem.quantity;
        if (typeof quantity !== "number") {
            quantity = utils.randomValue(quantity[0], quantity[1]);
        }
        if (Math.random() > potentialItem.dropRate) {
            render.renderLog("Nothing found...");
            break;
        }
        /*console.log("TROUVÉ: " + potentialItem.name);
        console.log("  - QUANTITÉ: " + quantity);
        console.log("  - DROP RATE: " + potentialItem.dropRate);
        console.log("  - DISCOVERED: " + potentialItem.discovered);
        console.log("  - Requis: " + potentialItem.requires);*/
        gState[potentialItem.name] += quantity;
        // Item découvert
        // Quand un item a été découvert afficher dans la box de logs un message
        if (!potentialItem.discovered) {
            render.renderLog("[UNLOCKED] Wow you found " + quantity + " " + potentialItem.name + "s !");
            render.renderUnlocked(potentialItem.name);
        }
        else {
            render.renderLog("+" + quantity + " " + potentialItem.name);
        }
        // Passer à true le discovered de l'item
        const item = lManager.lootTable.find(i => i.name === potentialItem.name);
        if (item) {
            item.discovered = true;
            // Vérifie si on débloque un batiment
            bManager.checkBuildingRequire();
        }
        /*console.log("STATE: "+ gState[potentialItem.name]);*/
    }
}
export default {
    consumeResource,
    searchItems,
};
