import { C } from "./C";
import { PowerTypes } from "./enums/PowerTypes";
import { EntityInstance } from "./map/LDtkReader";

export class GameData {
    debug:boolean = false;
    flags:Array<boolean>;
    brokenBlocks:Array<{level:string, x:number, y:number}>;
    CollectedPowerups:Array<{level:string, type:PowerTypes}>;
    ExploredLevels:string[];
    MaxHP:number = 6;
    CurrentLevel:string = 'Level_1';
    SaveLevel:string = 'Level_1';
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

        if(this.debug) {
            this.CurrentLevel = 'Level_27';
            this.SaveLevel = 'Level_27';
            this.IDsCollected.push('Stick');
        }
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