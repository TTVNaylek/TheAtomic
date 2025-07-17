import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
const MAX_LOGS_LINES = 6;
const renderLog = (message) => {
    const logBox = document.getElementById("log");
    const logMessage = document.createElement("div");
    logMessage.classList.add("log-message");
    logMessage.textContent = message;
    if (logBox === null) {
        console.log("logBox is null");
        return;
    }
    while (logBox.children.length > MAX_LOGS_LINES) {
        logBox.removeChild(logBox.firstChild);
    }
    logBox.appendChild(logMessage);
    logBox.scrollTop = logBox.scrollHeight;
};
const renderStates = (gameState, buildState) => {
    renderResources(gameState);
    renderBuildings(buildState);
};
const renderResources = (gameState) => {
    // Récupère la list des items découverts
    const discoveredItems = new Set(lManager.lootTable.filter(element => element.discovered).map(element => element.name));
    console.log(discoveredItems);
    for (const ressource of Object.keys(gameState)) {
        if ( /*!gameState[ressource] ||*/!discoveredItems.has(ressource)) {
            continue;
        }
        updateDisplay(ressource, gameState[ressource]);
    }
};
const renderBuildings = (buildState) => {
    // Récupère la list des builds découverts
    const discoveredBuilds = new Set(bManager.buildTable.filter(element => element.discovered).map(element => element.name));
    for (const build of Object.keys(buildState)) {
        if ( /*!buildState[build].nbOfBuild ||*/!discoveredBuilds.has(build)) {
            continue;
        }
        updateDisplay(build, buildState[build].nbOfBuild);
    }
};
const updateDisplay = (id, value) => {
    const element = document.getElementById(id);
    const elementCount = document.getElementById(id + "-count");
    element ? element.style.removeProperty("display") : warnMissingElement(id);
    elementCount ? elementCount.textContent = value.toString() : warnMissingElement(id + "-count");
};
const warnMissingElement = (id) => {
    console.log("This element doesn't exist " + id);
};
export default {
    renderLog,
    renderStates
};
