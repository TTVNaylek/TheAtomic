import stateManager from "./gameState.js"
import bStateManager from "./buildState.js"
import render from "./render.js"
import action from "./action.js"
import bManager from "./buildTable.js"

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

  switch (clickedElement.id) {
    case "searchButton":
      action.searchItems();
      break;
  
    case bManager.buildTable.find(build => build.name === clickedElement.id)?.name:
      console.log("BUY BUILD");
      action.buyBuilding(clickedElement.id);
      break;
    
    default:
      break;
  }

});