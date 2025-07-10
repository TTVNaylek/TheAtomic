import utils from "./utils.js"
import { GameState } from "./gameState.js"; 
import stateManager from "./gameState.js"
import lootManager from "./lootTable.js"
import render from "./render.js"

const gState = stateManager.gameStateInstance;

const baseConsumption = 0.25;

const consumeResource = (state: GameState, type: keyof GameState) : void => {
  if (state[type] <= 0){
    state[type] = 0;
    return;
  }

  if (utils.isNotNullAndSuperior(state.survivors)){
    state[type] -= baseConsumption * state.survivors;
    return;
  }

  state[type] -= baseConsumption;
  return;
}

const searchBtn = document.getElementById("searchButton");
searchBtn?.addEventListener('click', (event: MouseEvent) => {
  searchItems();
})

function searchItems() : void {
  // TODO faire une fonction de recherche d'item avec une proba
  
  // Permet de récupérer 1 à 3 index d'items
  const itemsIndex = [];
  for (let i = 0; i < utils.randomValue(1, 3); i++) {
    itemsIndex[i] = utils.randomValue(0, lootManager.lootTable.length - 1);
  }

  console.log("ITEMS INDEX: " + itemsIndex);
  

  for (let i = 0; i < itemsIndex.length; i++) {
    const potentialItem = lootManager.lootTable[itemsIndex[i]];

    // Check si le ou les objet(s) précédent requis est discovered: true
    // some() parcourt requires qui va permettre de check chaques requis avec find
    if (potentialItem.requires?.some(req => !lootManager.lootTable.find(item => item.name === req)?.discovered)) {
      continue;
    }

    let quantity = potentialItem.quantity;
    if (typeof quantity !== "number"){ 
      quantity = utils.randomValue(quantity[0], quantity[1]);
    }

    console.log("--- Résultats de recherche ---");
    // TODO: Faire la méthode pour ajouter les items
    if (Math.random() > potentialItem.dropRate) {
      console.log("NOTHING");
      
      break;
    }
    console.log("TROUVÉ: " + potentialItem.name);
    console.log("  - QUANTITÉ: " + quantity);
    console.log("  - DROP RATE: " + potentialItem.dropRate);
    console.log("  - DISCOVERED: " + potentialItem.discovered);
    console.log("  - Requis: " + potentialItem.requires);

    gState[potentialItem.name] += quantity;
    
    // Item découvert
    // TODO: Quand un item a été découvert afficher dans la box de logs un message
    if (!potentialItem.discovered) {
      render.renderLog("Wow you found " + quantity + " " + potentialItem.name + "s !");
      render.renderStorage(potentialItem.name);
    }else{
      render.renderLog("+" + quantity + " " + potentialItem.name);
    }

    const item = lootManager.lootTable.find(i => i.name === potentialItem.name);
    item ? item.discovered = true : false;

    console.log("STATE: "+ gState[potentialItem.name]);
    console.log("------------------------");
  }
}

function renderGameState(state: GameState) : void{
  
  //DEBUG MODE

  /*console.log("---CURRENT GAME STATE---");

  for (let i = 0; i < stateManager.keys.length; i++) {
    console.log(stateManager.keys[i] + ": " + state[stateManager.keys[i]])
  }

  console.log("------------------------");*/

  // Affiche dans le DOM
  const updateData = (id: string, value: number) : void => {
    const doc = document.getElementById(id);
    doc ? doc.textContent = value.toString() : "NULL DATA";
  };

  // Parcours le tableau de clés pour afficher les data
  for (let i = 0; i < stateManager.keys.length; i++) {
    updateData(stateManager.keys[i] + "-count", state[stateManager.keys[i]])
  }
}

// 1 Sec
setInterval(() => {

  // Consomme les ressources selon les survivants
  for (let i = 0; i < stateManager.consommable.length; i++) {
    consumeResource(gState, stateManager.consommable[i])
  }

  renderGameState(gState);
}, 1000);