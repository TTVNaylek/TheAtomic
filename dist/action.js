import utils from "./utils.js";
import stateManager from "./gameState.js";
import bStateManager from "./buildState.js";
import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
import render from "./render.js";
// Consomme les ressources food et water en fonction des survivants
function consumeResourceBySurvivors(state) {
    const baseConsumption = 0.25;
    const keys = stateManager.consommable;
    for (let i = 0; i < keys.length; i++) {
        if (state[keys[i]] <= 0) {
            state[keys[i]] = 0;
            continue;
        }
        state[keys[i]] -= baseConsumption * (state.survivors + 1);
    }
}
;
// Gagner une resource selon le batiment et son niveau
function gainResourceByBuilds(gameState, buildState) {
    var _a;
    const prod = bStateManager.getProduction(buildState);
    for (const key in prod) {
        const typedKey = key;
        if (!prod[typedKey]) {
            continue;
        }
        gameState[typedKey] = ((_a = gameState[typedKey]) !== null && _a !== void 0 ? _a : 0) + prod[typedKey];
    }
}
;
const handleLootDrop = (arg) => {
    if (Math.random() > arg.dropRate) {
        render.renderLog("Nothing found...");
        return false;
    }
    return true;
};
const renderLoot = (arg, qty) => {
    // Item découvert
    // Quand un item a été découvert afficher dans la box de logs un message
    if (!arg.discovered) {
        render.renderLog("[UNLOCKED] Wow you found " + qty + " " + arg.name + "(s) !");
    }
    else {
        render.renderLog("+" + qty + " " + arg.name);
    }
};
// Rechercher 1 item
function searchItems() {
    const gState = stateManager.gameStateInstance;
    // Débloquer un seul item par recherche
    const potentialItem = lManager.lootTable[utils.randomValue(0, lManager.lootTable.length - 1)];
    // Vérifie si les prérequis de l'objet (ressources & bâtiments) sont remplis
    if (!lManager.isLootUnlocked(potentialItem))
        return;
    if (!handleLootDrop(potentialItem)) {
        return;
    }
    let quantity = potentialItem.quantity;
    if (Array.isArray(quantity)) {
        quantity = utils.randomValue(quantity[0], quantity[1]);
    }
    gState[potentialItem.name] += quantity;
    renderLoot(potentialItem, quantity);
    // Passer à true le discovered de l'item
    const item = lManager.lootTable.find(i => i.name === potentialItem.name);
    if (item) {
        item.discovered = true;
    }
    // Vérifie si on débloque un batiment
    bManager.checkBuildingRequire();
}
;
// Rechercher plusieurs items
/*function searchItems() {
    // Permet de récupérer 1 à 3 index d'items
    const itemsIndex = [];
    for (let i = 0; i < utils.randomValue(1, 3); i++) {
        itemsIndex[i] = utils.randomValue(0, lManager.lootTable.length - 1);
    }
    
    for (let i = 0; i < itemsIndex.length; i++) {
        const potentialItem = lManager.lootTable[itemsIndex[i]];

        // Check si le ou les objet(s) précédents requis est/sont discovered: true
        // some() parcourt requires qui va permettre de check chaques requis avec find
        if (potentialItem.requires?.building?.some(req => !bManager.buildTable.find(item => item.name === req)?.discovered)
        || potentialItem.requires?.resource?.some(req => !lManager.lootTable.find(item => item.name === req)?.discovered)) {
            continue;
        }

        if (Math.random() > potentialItem.dropRate) {
            render.renderLog("Nothing found...");
            break;
        }

        let quantity = potentialItem.quantity;
        if (Array.isArray(quantity)){
            quantity = utils.randomValue(quantity[0], quantity[1]);
        }

        gState[potentialItem.name] += quantity;
        
        // Item découvert
        // Quand un item a été découvert afficher dans la box de logs un message
        if (!potentialItem.discovered) {
            render.renderLog("[UNLOCKED] Wow you found " + quantity + " " + potentialItem.name + "s !");
        }else{
            render.renderLog("+" + quantity + " " + potentialItem.name);
        }

        // Passer à true le discovered de l'item
        const item = lManager.lootTable.find(i => i.name === potentialItem.name);
        if (item){
            item.discovered = true;
        }
    }
    
    // Vérifie si on débloque un batiment
    bManager.checkBuildingRequire();
}*/
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
        render.renderLog("Not enough resources...");
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
    render.renderLog("Built a new " + bStateManager.bStateInstance[build]);
}
;
export default {
    consumeResourceBySurvivors,
    searchItems,
    gainResourceByBuilds,
    buyBuilding
};
