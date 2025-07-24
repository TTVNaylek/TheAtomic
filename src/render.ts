import bSManager, {BuildKey} from "./buildState.js";
import bManager from "./buildTable.js";
import sManager, {ResourceKey} from "./gameState.js";
import lManager from "./lootTable.js";

const MAX_LOGS_LINES = 6;
const tabsState = {jobsVisible: false};

const renderLog = (message: string, color?: string) : void => {
    const logBox = document.getElementById("log");
    const logMessage = document.createElement("div");
    logMessage.classList.add("log-message");
    logMessage.textContent = message;

    if (logBox === null) {
        console.log("logBox is null");
        return;
    }

    while (logBox.children.length > MAX_LOGS_LINES) {
        logBox.removeChild(logBox.firstChild!);
    }
    
    logBox.appendChild(logMessage);
    //if (color) logBox.style.color = color;
    
    logBox.scrollTop = logBox.scrollHeight;
};

const renderStates = () : void => {
    renderTabs();
    renderResources();
    renderBuildings();

    const id = "survivors-cap";
    const elementCap = document.getElementById(id);
    if (!elementCap) {
        warnMissingElement(id);
        return;
    }
    elementCap.textContent = "/" + bManager.getSurvivorCapacity();
};

const renderTabs = () : void => {
    if (sManager.gameStateInstance.survivors >= 1 && tabsState.jobsVisible === false) {
        const element = document.getElementById("jobs-nav") as HTMLElement;
        if (element) {
            element.style.display = "unset";
            tabsState.jobsVisible = true;
        } else {
            warnMissingElement("jobs-nav");
        }
    }
};

const renderResources = () : void => {
    // Récupère la list des items découverts
    const discoveredItems = new Set(lManager.lootTable.filter(element => element.discovered).map(element => element.name));
    
    for (const ressource of Object.keys(sManager.gameStateInstance) as Array<ResourceKey>) {
        if (/*!gameState[ressource] ||*/
            !discoveredItems.has(ressource)) {
            // Hide element if not discovered (prevent from reset function)
            const element = document.getElementById(ressource);
            if (element) element.style.display = "none";
            continue;
        }
        updateDisplay(ressource, sManager.gameStateInstance[ressource]);
    }
};

const renderBuildings = () : void => {
    // Récupère la list des builds découverts
    const discoveredBuilds = new Set(bManager.buildTable.filter(element => element.discovered).map(element => element.name));

    for (const build of Object.keys(bSManager.bStateInstance) as Array<BuildKey>) {
        if (/*!buildState[build].nbOfBuild ||*/
            !discoveredBuilds.has(build)) {
            // Hide element if not discovered (prevent from reset function)
            const element = document.getElementById(build);
            if (element) element.style.display = "none";
            continue;
        }
        updateDisplay(build, bSManager.bStateInstance[build].nbOfBuild);
    }
};

const updateDisplay = (id: string, value: number) : void => {
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
    renderStates,
};