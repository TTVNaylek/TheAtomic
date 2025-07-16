import utils from "./utils.js"
import stateManager, { GameState, ResourceKey } from "./gameState.js"; 
import bStateManager, { BuildKey, BuildState } from "./buildState.js";
import lManager from "./lootTable.js"
import bManager from "./buildTable.js"
import render from "./render.js"

// Consomme les ressources food et water en fonction des survivants
const consumeResourceBySurvivors = (state: GameState) : void => {
  const baseConsumption = 0.25;
  const keys = stateManager.consommable;
  for (let i = 0; i < keys.length; i++) {
    if (state[keys[i]] <= 0){
      state[keys[i]] = 0;
      continue;
    }

    state[keys[i]] -= baseConsumption * (state.survivors + 1);
  }
}

// Gagner une resource selon le batiment et son niveau
const gainResourceByBuilds = (gameState : GameState, buildState: BuildState) : void => {
  const prod = bStateManager.getProduction(buildState);

  for (const key in prod) {
    const typedKey = key as ResourceKey;

    if (!prod[typedKey]) {
      continue;
    }

    gameState[typedKey] = (gameState[typedKey] ?? 0) + prod[typedKey];
  }
}

// Récupérer 1 à 3 items
function searchItems() : void {
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
}

function buyBuilding(buildName : string) : void {
  // Récupérer le nom du build et son prix (getBuildCost)
  const build = buildName as BuildKey;
  const bCost = bManager.getBuildCost(build);
  let canBuy = true;

  // Vérifie si on peut acheter
  for (const key in bCost) {
    const typedKey = key as ResourceKey;
    if (!bCost[typedKey])break;
    
    // Si ressources < prix
    if (stateManager.gameStateInstance[typedKey] < bCost[typedKey]) {
      canBuy = false;
      break;
    }
  }

  if (!canBuy){
    console.log("CANT BUY");
    return;
  }

  // Achat du batiment
  for (const key in bCost) {
    const typedKey = key as ResourceKey;
    if (!bCost[typedKey])break;
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
}