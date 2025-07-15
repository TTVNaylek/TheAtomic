;
const bStateInstance = {
    lumberHut: { nbOfBuild: 0, assignedSurvivors: 0 },
    stoneQuarry: { nbOfBuild: 0, consumption: ["wood"], assignedSurvivors: 0 },
    scrapYard: { nbOfBuild: 0 },
    waterCollector: { nbOfBuild: 0 },
    basicGarden: { nbOfBuild: 0, consumption: ["water", "food"], assignedSurvivors: 0 },
    forge: { nbOfBuild: 0, consumption: ["wood", "metal"], assignedSurvivors: 0 },
    workshop: { nbOfBuild: 0, consumption: ["wood", "rock"], assignedSurvivors: 0 },
    smelter: { nbOfBuild: 0, consumption: ["rock", "metal"], assignedSurvivors: 0 },
    craftingChamber: { nbOfBuild: 0, consumption: ["stick", "metal"], assignedSurvivors: 0 },
    watchTower: { nbOfBuild: 0, assignedSurvivors: 0 },
    shelter: { nbOfBuild: 0, consumption: ["food", "water", "electricity"] },
    medicalCenter: { nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0 },
    commonRoom: { nbOfBuild: 0, consumption: ["electricity"] },
    solarPanels: { nbOfBuild: 0 },
    radioTower: { nbOfBuild: 0, consumption: ["electricity"], assignedSurvivors: 0 },
    sealedBunker: { nbOfBuild: 0, consumption: ["food", "water", "electricity"], assignedSurvivors: 0 },
};
/*function getProduction(buildName: keyof BuildState) : {[resources in keyof GameState]? : number} {
  //Checker si le batiment est construit 1 fois minimum
  // Si non return
  // Si oui produire la ressource * (batiment + 1)


    // Récupère le building dans la table
    const build = bStateInstance.find(b => b.name === buildName);
    if (!build)return {};

    // Récupérer le nb de batiments construits
    const nbBuilt = bstateManager.bStateInstance[buildName].nbOfBuild;

    const dynCost: {[resource in keyof GameState]?: number} = {};
    // Pour chaques ressources dans build.cost
    // On fait baseAmount * (nbBuilt + 1)
    for (const resource in build.cost) {
        const baseAmount = build.cost[resource as keyof GameState];
        if (baseAmount === undefined) return {};
        // Prix de base * (nb deja construit + le suivant)
        dynCost[resource as keyof GameState] = baseAmount * (nbBuilt + 1);
    }
    return dynCost;
}*/
export default {
    bStateInstance,
    //keys,
};
