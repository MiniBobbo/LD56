import { C } from "./C";
import { PowerTypes } from "./enums/PowerTypes";
import { EntityInstance } from "./map/LDtkReader";

export class GameData {
    flags:Array<boolean>;
    brokenBlocks:Array<{level:string, x:number, y:number}>;
    CollectedPowerups:Array<{level:string, type:PowerTypes}>;
    ExploredLevels:string[];
    MaxHP:number = 8;
    CurrentLevel:string = 'Level_21';
    SaveLevel:string = 'Level_21';
    keys:number[] = [0,0,0,0];

    SwissPiecesCollected:number = 0;

    IDsCollected:string[] = [];

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