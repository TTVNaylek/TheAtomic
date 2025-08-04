import utils from "./utils.js";

type BuildInstance = {
    nbOfBuild: number;
    assignedSurvivors: number;
};

interface BuildState {
    lumberHut: BuildInstance;
    stoneQuarry: BuildInstance;
    scrapYard: BuildInstance;
    waterCollector: BuildInstance;
    basicGarden: BuildInstance;

    forge: BuildInstance;
    workshop: BuildInstance;
    smelter: BuildInstance;
    craftingChamber: BuildInstance;

    watchTower: BuildInstance;

    shelter: BuildInstance;
    medicalCenter: BuildInstance;
    commonRoom: BuildInstance;

    solarPanels: BuildInstance;
    radioTower: BuildInstance;
    sealedBunker: BuildInstance;
};

type BuildKey = keyof BuildState;

const bStateInstance: BuildState = await utils.getJsonData<BuildState>("./public/datas/BuildState.json");

const initialBState: BuildState = structuredClone(bStateInstance);

export default {
    bStateInstance,
    initialBState,
};

export {
    BuildKey, BuildState
};
