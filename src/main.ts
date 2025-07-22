import sManager from "./gameState.js";
import bSManager from "./buildState.js";
import bManager from "./buildTable.js";
import render from "./render.js";
import action from "./action.js";
import store from "./storage.js";

const gState = sManager.gameStateInstance;
const bState = bSManager.bStateInstance;
// Compteur pour la save
let i = 0;

setInterval(() => {
    action.gainResourceByBuilds(gState, bState);
    action.consumeResourceBySurvivors(gState);
    render.renderStates(gState, bState);

    // TODO: Améliorer ceci (Auto-save)
    if (i === 30) {
        store.saveGame();
        i = 0;
    }
    i++;
}, 1000);


// Interaction with buttons
document.addEventListener('click', (event) => {
    const clickedElement = event.target as HTMLElement;

    if (!clickedElement.id)return;

    if (bManager.buildTable.find(build => build.name === clickedElement.id)?.name) {
        console.log("BUY BUILD");
        action.buyBuilding(clickedElement.id);
    }

    switch (clickedElement.id) {
        case "searchButton":
            action.searchItems();
            break;
    
        case "saveButton":
            console.log("SAVED");
            store.saveGame();
            break;

        case "loadButton":
            console.log("LOADED");
            store.loadGame(true);
            break;
        
        case "clearButton":
            console.log("CLEARED");
            store.clearGame();
            break;
        
        default:
            break;
    }
});

// Auto load save while page load
window.onload = function() {
    console.log("GAME AUTO LOADED");
    store.loadGame();
};