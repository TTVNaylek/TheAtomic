import {GameState, ResourceKey} from "./gameState.js";
import {BuildKey, BuildState} from "./buildState.js";
import lManager from "./lootTable.js";
import bManager from "./buildTable.js";

const MAX_LOGS_LINES = 6;

const renderLog = (message: string) : void => {
    const logBox = document.getElementById("log");
    const logMessage = document.createElement("div");
    logMessage.classList.add("log-message");
    logMessage.textContent = message;

    if (logBox === null) {
        console.log("logBox is null");
        return;
    }

    while(logBox.children.length > MAX_LOGS_LINES){
        logBox.removeChild(logBox.firstChild!);
    }
    
    logBox.appendChild(logMessage);
    logBox.scrollTop = logBox.scrollHeight;
};

const renderStates = (gameState : GameState, buildState: BuildState) : void => {
    renderResources(gameState);
    renderBuildings(buildState);
};

const renderResources = (gameState : GameState) : void => {
    // Récupère la list des items découverts
    const discoveredItems = new Set(lManager.lootTable.filter(element => element.discovered).map(element => element.name));
    
    for (const ressource of Object.keys(gameState) as Array<ResourceKey>) {
        if (/*!gameState[ressource] ||*/
            !discoveredItems.has(ressource)) {
            continue;
        }
        updateDisplay(ressource, gameState[ressource]);
    }
};

const renderBuildings = (buildState: BuildState) : void => {
    // Récupère la list des builds découverts
    const discoveredBuilds = new Set(bManager.buildTable.filter(element => element.discovered).map(element => element.name));
    for (const build of Object.keys(buildState) as Array<BuildKey>) {
        if (/*!buildState[build].nbOfBuild ||*/
            !discoveredBuilds.has(build)) {
            continue;
        }
        updateDisplay(build, buildState[build].nbOfBuild);
    }
};

const updateDisplay = (id: string, value : number) : void => {
    const element = document.getElementById(id);
    const elementCount = document.getElementById(id + "-count");

    if (!element) {
        warnMissingElement(id);
        return;
    }
    element.style.removeProperty("display");

    if (!elementCount) {
        warnMissingElement(id + "-count");
        return;
    }
    elementCount.textContent = value.toString();
};

const warnMissingElement = (id: string) : void => {
    console.log("This element doesn't exist " + id);
};

export default {
    renderLog,
    renderStates
};