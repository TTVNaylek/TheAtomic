import utils from "./utils.js"
import { GameState } from "./gameState.js"; 
import stateManager from "./gameState.js"

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

function searchItems() : void {
    // TODO faire une fonction de recherche d'item avec une proba
}

function renderGameState(state: GameState) : void{
  /*
  DEBUG MODE

  console.log("---CURRENT GAME STATE---");

  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i] + ": " + state[keys[i]])
  }*/

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
    consumeResource(stateManager.gameStateInstance, stateManager.consommable[i])
  }

  renderGameState(stateManager.gameStateInstance);
}, 1000);