import { GameState } from "./gameState";

type BuildInstance = {
  nbOfBuild: number;
  consumption?: Array<keyof GameState>;
  assignedSurvivors?: number;
}

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

const bStateInstance: BuildState = {
  lumberHut: {nbOfBuild: 0, assignedSurvivors: 0},
  stoneQuarry: {nbOfBuild: 0, consumption: ["wood"], assignedSurvivors: 0},
  scrapYard: {nbOfBuild: 0},
  waterCollector: {nbOfBuild: 0},
  basicGarden: {nbOfBuild: 0, consumption: ["water", "food"], assignedSurvivors: 0},

  forge: {nbOfBuild: 0, consumption: ["wood", "metal"], assignedSurvivors: 0},
  workshop: {nbOfBuild: 0, consumption: ["wood", "rock"], assignedSurvivors: 0},
  smelter: {nbOfBuild: 0, consumption: ["rock", "metal"], assignedSurvivors: 0},
  craftingChamber: {nbOfBuild: 0, consumption: ["stick", "metal"], assignedSurvivors: 0},

  watchTower: {nbOfBuild: 0, assignedSurvivors: 0},

  shelter: {nbOfBuild: 0, consumption: ["food", "water", "electricity"]},
  medicalCenter: {nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0},
  commonRoom: {nbOfBuild: 0, consumption: ["electricity"]},

  solarPanels: {nbOfBuild: 0},
  radioTower: {nbOfBuild: 0, consumption: ["electricity"], assignedSurvivors: 0},
  sealedBunker: {nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0},
};

export default {
    bStateInstance,
    //keys,
}

export {
    BuildState
}