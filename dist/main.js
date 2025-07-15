import stateManager from "./gameState.js";
import render from "./render.js";
import action from "./action.js";
const gState = stateManager.gameStateInstance;
setInterval(() => {
    // Consomme les ressources selon les survivants
    for (let i = 0; i < stateManager.consommable.length; i++) {
        action.consumeResource(gState, stateManager.consommable[i]);
    }
    // Affiche les valeurs dans le stockage
    for (let i = 0; i < stateManager.keys.length; i++) {
        render.renderStorageValue(stateManager.keys[i], stateManager.gameStateInstance[stateManager.keys[i]]);
    }
    // TODO: Lorsque un batiment est débloqué faire en sorte de faire gagner la ressources
    // ex: batiment * resourcesByBatiment
}, 1000);
