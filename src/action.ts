import bsManager, {BuildKey} from "./buildState.js";
import bManager from "./buildTable.js";
import sManager, {ResourceKey} from "./gameState.js";
import lManager, {LootItem} from "./lootTable.js";
import render from "./render.js";
import sSManager from "./survivorsState.js";
import utils from "./utils.js";

// Consomme les ressources food et water en fonction des survivants
function consumeResourceBySurvivors () : void {
    const baseConsumption = 0.25;
    const keys = sManager.consommable;
    for (let i = 0; i < keys.length; i++) {
        if (sManager.gameStateInstance[keys[i]] <= 0) {
            sManager.gameStateInstance[keys[i]] = 0;
            continue;
        }

        // Plus tard créer une fonction qui check tous les besoins des survivants pour les remove si besoin
        const consNeeded = baseConsumption * (sManager.gameStateInstance.survivors + 1);

        // Quand les deux ressources manquent = mort d'un survivant
        if (sManager.gameStateInstance["food"] < consNeeded && sManager.gameStateInstance["water"] < consNeeded) {
            sSManager.removeSurvivor();
            continue;
        }

        sManager.gameStateInstance[keys[i]] -= consNeeded;
    }
};

// Gagner une resource selon le batiment et son niveau
function gainResourceByBuilds () : void {
    const prod = bsManager.getProduction();
    const cap = bsManager.getCapacity();

    for (const key in prod) {
        const typedKey = key as ResourceKey;

        // Ne produit pas si la capacité est atteinte
        /* if (!cap[typedKey] || gameState[typedKey] >= cap[typedKey]) {
            continue;
        }*/

        if (!prod[typedKey]) continue;
        sManager.gameStateInstance[typedKey] = (sManager.gameStateInstance[typedKey] ?? 0) + prod[typedKey];
    }
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
    const gState = sManager.gameStateInstance;

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

    gState[potentialItem.name] += quantity;
        
    renderLoot(potentialItem, quantity);

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

function buyBuilding(buildName: string) : void {
    // Récupérer le nom du build et son prix (getBuildCost)
    const build = buildName as BuildKey;
    const bCost = bManager.getBuildCost(build);
    let canBuy = true;

    // Vérifie si on peut acheter
    for (const key in bCost) {
        const typedKey = key as ResourceKey;
        if (!bCost[typedKey]) break;
    
        // Si ressources < prix
        if (sManager.gameStateInstance[typedKey] < bCost[typedKey]) {
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
        const typedKey = key as ResourceKey;
        if (!bCost[typedKey]) break;
        sManager.gameStateInstance[typedKey] -= bCost[typedKey];
    }
    // Ajout du batiment acheté
    bsManager.bStateInstance[build].nbOfBuild += 1;
    render.renderLog("Built a new " + bsManager.bStateInstance[build]);
};

export default {
    consumeResourceBySurvivors,
    searchItems,
    gainResourceByBuilds,
    buyBuilding
};