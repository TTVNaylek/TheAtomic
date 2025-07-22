import {BuildKey} from "./buildState.js";
import bManager from "./buildTable.js";
import sManager from "./gameState.js";
import render from "./render.js";
//import names from "./datas/SurvivorNames.json";

interface SurvivorState {
    id: string;
    name: string;
    assignedTo?: null | BuildKey;
};

type SurvivorsKey = keyof SurvivorState;

const survivorStateInstance: SurvivorState[] = [];

const initialSState = structuredClone(survivorStateInstance);

function addSurvivor() : void {

    // Si capacité survivor le permet on ajoute un survivant
    // Sinon return
    if (bManager.getSurvivorCapacity() === sManager.gameStateInstance.survivors) {
        console.log("Vous n'avez plus assez de place...");
        render.renderLog("There is no place anymore for survivors..");
        return;
    }
    

    //const survivor = names[utils.randomValue(0, names.length)].name;

    //survivorStateInstance.push({id: Date.now().toString(), name: survivor});
    // Ou
    survivorStateInstance.push({id: Date.now().toString(), name: ""});

    sManager.gameStateInstance.survivors = survivorStateInstance.length;
    // Ou
    sManager.gameStateInstance.survivors += 1;

    //render.renderLog(survivor + " has arrived in the camp !");
    return;
}

export default {
    survivorStateInstance,
    initialSState,
};

export {
    SurvivorsKey, SurvivorState
};
