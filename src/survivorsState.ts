import {BuildKey} from "./buildState.js";
import stateManager, {GameState, ResourceKey} from "./gameState.js";
import render from "./render.js";
import utils from "./utils.js";
import names from "./datas/SurvivorNames.json";

interface Survivor {
    id: string;
    name: string;
    assignedTo?: null | BuildKey;
};

type SurvivorsKey = keyof Survivor;

const survivorState: Survivor[] = [];

function addSurvivor() : void {

    // Si capacité survivor le permet on ajoute un survivant
    // Sinon return

    const survivor = names[utils.randomValue(0, names.length)].name;

    survivorState.push({id: Date.now().toString(), name: survivor});
    // Ou
    survivorState.push({id: Date.now().toString(), name: ""});

    stateManager.gameStateInstance.survivors = survivorState.length;
    // Ou
    stateManager.gameStateInstance.survivors += 1;

    render.renderLog(survivor + " has arrived in the camp !");
    return;
}