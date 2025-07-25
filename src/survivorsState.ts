import bManager from "./buildRegistry.js";
import {BuildKey} from "./buildState.js";
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

const initialSState = structuredClone(survivorStateInstance);

async function addSurvivor() : Promise<void> {

    // Si capacité survivor ne permet pas on return
    // Sinon ajoute un survivant
    if (bManager.getSurvivorCapacity() === sManager.gameStateInstance.survivors) {
        console.log("Vous n'avez plus assez de place...");
        render.renderLog("There is no place anymore for survivors..");
        return;
    }
    
    // Récupère le nom des survivants dans le json et en prend un au hasard
    const names = await utils.getJsonData<{name: string}[]>("./public/datas/SurvivorNames.json");
    const survivor = names[utils.randomValue(0, names.length)].name;

    // Crée le survivant avec comme ID la date de l'instant
    survivorStateInstance.push({id: Date.now().toString(), name: survivor});

    sManager.gameStateInstance.survivors = survivorStateInstance.length;
    render.renderLog(survivor + " has arrived in the camp !");
    return;
}

function removeSurvivor() : void {
    if (!survivorStateInstance.length) return;
    survivorStateInstance.splice(utils.randomValue(0, survivorStateInstance.length), 1);
    render.renderLog("A survivor has disappear..");
}

export default {
    survivorStateInstance,
    initialSState,
    addSurvivor,
    removeSurvivor,
};

export {
    SurvivorsKey, SurvivorState
};
