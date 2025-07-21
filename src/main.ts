import stateManager from "./gameState.js";
import bStateManager from "./buildState.js";
import render from "./render.js";
import action from "./action.js";
import bManager from "./buildTable.js";
import store from "./storage.js";

const gState = stateManager.gameStateInstance;
const bState = bStateManager.bStateInstance;

setInterval(() => {
    action.gainResourceByBuilds(gState, bState);
    action.consumeResourceBySurvivors(gState);
    render.renderStates(gState, bState);
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
            console.log("SAVE");
            store.saveGame(gState, bState);
            break;

        case "loadButton":
            console.log("LOAD");
            store.loadGame();
            break;
        
        case "clearButton":
            console.log("CLEAR");
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