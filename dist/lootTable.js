const lootTable = [
    { name: "food", dropRate: 1, quantity: [3, 7], discovered: true },
    { name: "water", dropRate: 1, quantity: [3, 7], discovered: true },
    // TODO:
    { name: "electricity", dropRate: 0, quantity: [0], discovered: false },
    { name: "stick", dropRate: 1, quantity: [2, 6], discovered: false },
    { name: "wood", dropRate: 0.75, quantity: [1, 4], discovered: false, requires: { resource: ["stick"], building: ["lumberHut"] } },
    { name: "rock", dropRate: 0.65, quantity: [1, 3], discovered: false, requires: { resource: ["wood"], building: ["stoneQuarry"] } },
    { name: "metal", dropRate: 0.35, quantity: [1, 2], discovered: false, requires: { resource: ["rock"], building: ["smelter"] } },
];
export default {
    lootTable
};
