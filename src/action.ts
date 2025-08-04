import bManager from "./buildRegistry.js";
import bsManager, {BuildKey} from "./buildState.js";
import sManager, {ResourceKey} from "./gameState.js";
import lManager, {LootItem} from "./lootTable.js";
import render from "./render.js";
import sSManager from "./survivorsState.js";
import utils from "./utils.js";

const gState = sManager.gameStateInstance;

// Consomme les ressources food et water en fonction des survivants
/*function consumeResourceBySurvivors () : void {
    const baseConsumption = 0.125;
    const keys = sManager.consommable;
    for (let i = 0; i < keys.length; i++) {
        
        if (gState[keys[i]] <= 0) {
            gState[keys[i]] = 0;
        }

        // Plus tard créer une fonction qui check tous les besoins des survivants pour les remove si besoin
        const consNeeded = baseConsumption * (gState.survivors);
        
        // Quand les deux ressources manquent = mort d'un survivant
        if (gState["food"] < consNeeded && gState["water"] < consNeeded) {
            sSManager.removeSurvivor();
            continue;
        }

        gState[keys[i]] -= consNeeded;
    }
};*/

function consumeResourceBySurvivors() : void {
    const baseConsumption = 0.125;
    const keys = sManager.consommable;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const consNeeded = baseConsumption * gState.survivors;

        // Vérifie si les deux ressources sont insuffisantes → mort
        if (gState["food"] < consNeeded && gState["water"] < consNeeded) {
            sSManager.removeSurvivor();
            continue;
        }

        // Consomme la ressource sans descendre en dessous de 0
        gState[key] = Math.max(0, gState[key] - consNeeded);
    }
}

// Gagner une resource selon le batiment et son niveau
function gainResourceByBuilds () : void {
    const prod = bManager.getProduction();

    for (const key in prod) {
        const typedKey = key as ResourceKey;

        if (!prod[typedKey]) continue;

        // Retourne la capacité à produire
        gState[typedKey] += checkAndClampResource(typedKey, prod[typedKey]);
    }
};

function checkAndClampResource (resource: ResourceKey, toAdd: number) : number {
    const maxResourceCap = bManager.getCapacity()[resource];
    const currentResourceCap = gState[resource];

    if (!maxResourceCap) return 0;

    if (currentResourceCap + toAdd > maxResourceCap) {
        return Math.max(1, maxResourceCap - currentResourceCap);
    }

    return toAdd;
};

const handleLootDrop = (arg: LootItem) : boolean => {
    if (Math.random() > arg.dropRate) {
        render.renderLog("Nothing found...");
        return false;
    }
    return true;
};

const renderLoot = (arg: LootItem, qty: number) : void => {
    // Item découvert
    // Quand un item a été découvert afficher dans la box de logs un message
    if (!arg.discovered) {
        render.renderLog("[UNLOCKED] Wow you found " + qty + " " + arg.name + "(s) !");
    } else {
        render.renderLog("+" + qty + " " + arg.name);
    }
};

// Rechercher 1 item
function searchItems() : void {
    // Débloquer un seul item par recherche
    const potentialItem = lManager.lootTable[utils.randomValue(0, lManager.lootTable.length - 1)];

    // Vérifie si les prérequis de l'objet (ressources & bâtiments) sont remplis
    if (!lManager.isLootUnlocked(potentialItem)) {
        // Recherhce un nouvel item
        searchItems();
        return;
    }

    if (!handleLootDrop(potentialItem)) return;
    
    let quantity = potentialItem.quantity;
    if (Array.isArray(quantity)) {
        quantity = utils.randomValue(quantity[0], quantity[1]);
    }
    const clampedQty = checkAndClampResource(potentialItem.name, quantity);

    if (clampedQty === 0) {
        searchItems();
        return;
    }

    gState[potentialItem.name] += clampedQty;
        
    renderLoot(potentialItem, clampedQty);

    // Passer à true le discovered de l'item
    const item = lManager.lootTable.find(i => i.name === potentialItem.name);
    if (item)item.discovered = true;
    
    // Vérifie si on débloque un batiment
    bManager.checkBuildingRequire();
};

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

function buyBuilding(buildName: BuildKey) : void {
    // Récupérer le nom du build et son prix (getBuildCost)
    const bCost = bManager.getBuildCost(buildName);
    let canBuy = true;

    // Vérifie si on peut acheter
    for (const key in bCost) {
        const typedKey = key as ResourceKey;
        if (!bCost[typedKey]) break;
    
        // Si ressources < prix
        if (gState[typedKey] < bCost[typedKey]) {
            canBuy = false;
            break;
        }
    }

    if (!canBuy) {
        render.renderLog("Not enough resources...");
        return;
    }

    // Achat du batiment
    for (const key in bCost) {
        const typedKey = key as ResourceKey;
        if (!bCost[typedKey]) break;
        gState[typedKey] -= bCost[typedKey];
    }
    // Ajout du batiment acheté
    bsManager.bStateInstance[buildName].nbOfBuild += 1;
    render.renderLog("Built a new " + bsManager.bStateInstance[buildName]);
};


export default {
    consumeResourceBySurvivors,
    searchItems,
    gainResourceByBuilds,
    buyBuilding
};