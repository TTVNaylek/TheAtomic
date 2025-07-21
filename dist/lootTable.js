import bManager from "./buildTable.js";
const lootTable = [
    { name: "food", dropRate: 1, quantity: [3, 7], discovered: true },
    { name: "water", dropRate: 1, quantity: [3, 7], discovered: true },
    // TODO:
    { name: "electricity", dropRate: 0, quantity: [0], discovered: false },
    { name: "stick", dropRate: 1, quantity: [2, 6], discovered: false },
    { name: "wood", dropRate: 0.75, quantity: [1, 4], discovered: false, requires: { resources: ["stick"], buildings: ["lumberHut"] } },
    { name: "rock", dropRate: 0.65, quantity: [1, 3], discovered: false, requires: { resources: ["wood"], buildings: ["stoneQuarry"] } },
    { name: "metal", dropRate: 0.35, quantity: [1, 2], discovered: false, requires: { resources: ["rock"], buildings: ["smelter"] } },
];
const initialLTable = structuredClone(lootTable);
function isLootUnlocked(arg) {
    var _a, _b, _c, _d;
    const hasUndiscoveredResource = (_b = (_a = arg.requires) === null || _a === void 0 ? void 0 : _a.resources) === null || _b === void 0 ? void 0 : _b.some(req => { var _a; return !((_a = lootTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); });
    const hasUndiscoveredBuilding = (_d = (_c = arg.requires) === null || _c === void 0 ? void 0 : _c.buildings) === null || _d === void 0 ? void 0 : _d.some(req => { var _a; return !((_a = bManager.buildTable.find(item => item.name === req)) === null || _a === void 0 ? void 0 : _a.discovered); });
    return !hasUndiscoveredResource && !hasUndiscoveredBuilding;
}
;
export default {
    lootTable,
    isLootUnlocked,
    initialLTable,
};
