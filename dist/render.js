import lManager from "./lootTable.js";
import bManager from "./buildTable.js";
const MAX_LOGS_LINES = 6;
const tabsState = { jobsVisible: false };
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
    renderTabs(gameState);
    renderResources(gameState);
    renderBuildings(buildState);
};
const renderTabs = (gameState) => {
    if (gameState.survivors >= 1 && tabsState.jobsVisible === false) {
        const element = document.getElementById("jobs-nav");
        if (element) {
            element.style.display = "unset";
            tabsState.jobsVisible = true;
        }
        else {
            warnMissingElement("jobs-nav");
        }
    }
};
const renderResources = (gameState) => {
    // Récupère la list des items découverts
    const discoveredItems = new Set(lManager.lootTable.filter(element => element.discovered).map(element => element.name));
    for (const ressource of Object.keys(gameState)) {
        if ( /*!gameState[ressource] ||*/!discoveredItems.has(ressource)) {
            // Hide element if not discovered (prevent from reset function)
            const element = document.getElementById(ressource);
            if (element) {
                element.style.display = "none";
            }
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
            // Hide element if not discovered (prevent from reset function)
            const element = document.getElementById(build);
            if (element) {
                element.style.display = "none";
            }
            continue;
        }
        updateDisplay(build, buildState[build].nbOfBuild);
    }
};
const updateDisplay = (id, value) => {
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
const warnMissingElement = (id) => {
    console.log("This element doesn't exist " + id);
};
export default {
    renderLog,
    renderStates,
};
