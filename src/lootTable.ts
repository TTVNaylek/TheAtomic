import {BuildKey} from "./buildState.js";
import {ResourceKey} from "./gameState.js";
import bManager from "./buildTable.js";

export type LootItem = {
    name: ResourceKey;
    dropRate: number;
    quantity: number | number[];
    discovered: boolean;
    requires? : {
        resources?: Array<ResourceKey>,
        buildings?: Array<BuildKey>
    };
};

const lootTable: LootItem[] = [
    {name: "food", dropRate: 1, quantity: [3, 7], discovered: true},
    {name: "water", dropRate: 1, quantity: [3, 7], discovered: true},

    // TODO:
    {name: "electricity", dropRate: 0, quantity: [0], discovered: false},

    {name: "stick", dropRate: 1, quantity: [2, 6], discovered: false},
    {name: "wood", dropRate: 0.75, quantity: [1, 4], discovered: false, requires: {resources: ["stick"], buildings: ["lumberHut"]}},
    {name: "rock", dropRate: 0.65, quantity: [1, 3], discovered: false, requires: {resources: ["wood"], buildings: ["stoneQuarry"]}},
    {name: "metal", dropRate: 0.35, quantity: [1, 2], discovered: false, requires: {resources: ["rock"], buildings: ["smelter"]}},
];

const initialLTable: LootItem[] = structuredClone(lootTable);

function isLootUnlocked(arg: LootItem) : boolean {
    const hasUndiscoveredResource = arg.requires?.resources?.some(
        req => !lootTable.find(item => item.name === req)?.discovered
    );

    const hasUndiscoveredBuilding = arg.requires?.buildings?.some(
        req => !bManager.buildTable.find(item => item.name === req)?.discovered
    );

    return !hasUndiscoveredResource && !hasUndiscoveredBuilding;
};

export default {
    lootTable,
    isLootUnlocked,
    initialLTable,
};