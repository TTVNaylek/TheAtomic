const lootTable = [
    { name: "food", dropRate: 1, quantity: [5, 15], discovered: true },
    { name: "water", dropRate: 1, quantity: [5, 15], discovered: true },
    { name: "stick", dropRate: 1, quantity: [5, 15], discovered: false },
    { name: "wood", dropRate: 0.75, quantity: [2, 10], discovered: false, requires: { resource: ["stick"], building: ["lumberHut"] } },
    { name: "rock", dropRate: 0.70, quantity: [1, 10], discovered: false, requires: { resource: ["wood"], building: ["stoneQuarry"] } },
    { name: "metal", dropRate: 0.35, quantity: [1, 3], discovered: false, requires: { resource: ["rock"], building: ["smelter"] } },
];
export default {
    lootTable
};
