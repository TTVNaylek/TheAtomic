import bManager from "./buildRegistry.js";
import bSManager, {BuildKey} from "./buildState.js";
import sManager from "./gameState.js";
import render from "./render.js";
import utils from "./utils.js";

interface SurvivorState {
    id: string;
    name: string;
    assignedTo?: null | BuildKey;
};

type SurvivorsKey = keyof SurvivorState;

const survivorStateInstance: SurvivorState[] = [];


let survivorFlag = false;
async function addSurvivor() : Promise<void> {
    // Si capacité survivor ne permet pas on return
    // Sinon ajoute un survivant
    if (sManager.gameStateInstance.survivors === bManager.getSurvivorCapacity()) {
        if (!survivorFlag) {
            render.renderLog("There is no place anymore for survivors..");
            survivorFlag = true;
        }
        return;
    }
    survivorFlag = false;
    
    // Récupère le nom des survivants dans le json et en prend un au hasard
    const names = await utils.getJsonData<{name: string}[]>("./public/datas/SurvivorNames.json");
    const survivor = names[utils.randomValue(0, names.length)].name;

    // Crée le survivant avec comme ID la date de l'instant
    survivorStateInstance.push({id: Date.now().toString(), name: survivor});

    sManager.gameStateInstance.survivors = survivorStateInstance.length;
    render.renderLog(survivor + " has arrived in the camp !");
    return;
};

// FOR TESTS ONLY
setInterval(() => {
    addSurvivor();
}, 10000);

function removeSurvivor() : void {
    if (!survivorStateInstance.length) return;
    sManager.gameStateInstance.survivors -= 1;
    survivorStateInstance.splice(utils.randomValue(0, survivorStateInstance.length), 1);
    
    render.renderLog("A survivor has disappear..");
};

function assignOneSurvivor(build: BuildKey) : void {
    for (let i = 0; i < survivorStateInstance.length; i++) {

        const survivor = survivorStateInstance[i];
        if (survivor.assignedTo) {
            console.log("Survivor already assigned");
            continue;
        }

        console.log("Assigning survivor to " + build);
        survivor.assignedTo = build;
        bSManager.bStateInstance[build].assignedSurvivors += 1;
        render.renderLog(survivor.name + " has been assigned to " + build);
        break;
    }
    return;
};

function unassignOneSurvivor(build: BuildKey) : void {
    for (let i = 0; i < survivorStateInstance.length; i++) {
        const survivor = survivorStateInstance[i];

        if (survivor.assignedTo !== build) {
            continue;
        }

        console.log("Unassigning survivor to " + build);
        survivor.assignedTo = null;
        render.renderLog(survivor.name + " has been unassigned from " + build);
        bSManager.bStateInstance[build].assignedSurvivors -= 1;
        break;
    }
    return;
};


export default {
    survivorStateInstance,
    addSurvivor,
    removeSurvivor,
    assignOneSurvivor,
    unassignOneSurvivor,
};

export {
    SurvivorsKey, SurvivorState
};
