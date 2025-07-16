import stateManager from "./gameState.js";
import bStateManager from "./buildState.js";
import render from "./render.js";
import action from "./action.js";
import bManager from "./buildTable.js";
const gState = stateManager.gameStateInstance;
const bState = bStateManager.bStateInstance;
setInterval(() => {
    action.gainResourceByBuilds(gState, bState);
    render.renderStates(gState, bState);
    action.consumeResourceBySurvivors(gState);
}, 1000);
// Interaction with buttons
document.addEventListener('click', (event) => {
    var _a;
    const clickedElement = event.target;
    if (!clickedElement.id)
        return;
    switch (clickedElement.id) {
        case "searchButton":
            action.searchItems();
            break;
        case (_a = bManager.buildTable.find(build => build.name === clickedElement.id)) === null || _a === void 0 ? void 0 : _a.name:
            console.log("BUY BUILD");
            action.buyBuilding(clickedElement.id);
            break;
        default:
            break;
    }
});
