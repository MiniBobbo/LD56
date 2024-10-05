import { C } from "./C";
import { PowerTypes } from "./enums/PowerTypes";
import { EntityInstance } from "./map/LDtkReader";

export class GameData {
    flags:Array<boolean>;
    brokenBlocks:Array<{level:string, x:number, y:number}>;
    CollectedPowerups:Array<{level:string, type:PowerTypes}>;
    ExploredLevels:string[];
    MaxHP:number = 3;
    Gold:number = 0;
    Emerald:number = 0;
    Diamond:number = 0;
    CurrentLevel:string = 'Level_0';
    SaveLevel:string = 'Level_0';

    constructor() {
        this.ExploredLevels = [];
        this.flags = [];
        for(let i = 0; i < C.FLAG_COUNT; i++)
            this.flags.push(false);
        this.brokenBlocks = [];
        this.CollectedPowerups = [];
    }

    IsBlockBroken(level:string, b:EntityInstance):boolean {
        let found = this.brokenBlocks.find(block=>block.level == level && block.x == b.px[0] && block.y == b.px[1]);
        return !(found === undefined);
    }

    IsPowerupCollected(level:string, t:PowerTypes):boolean {
        let found = this.CollectedPowerups.find(block=>block.level == level && block.type == t);
        return !(found === undefined);
    }
}