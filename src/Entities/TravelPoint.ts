import { Enemy } from "./Enemy";
import { EnemyTypes } from "../enums/EnemyTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { EntityInstance } from "../map/LDtkReader";
import { LevelScene } from "../scenes/LevelScene";

export class TravelPoint extends Enemy{
    Name:string;
    NextLevel:string;
    EntryPointName:string;

    constructor(gs:LevelScene, instance:EntityInstance, NextLevel:string, EntryPointName:string) {
        super(gs);
        this.scene = gs;
        this.Name = 'Travel';
        this.NextLevel = NextLevel;
        this.EntryPointName = EntryPointName;

        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;
        this.shadow.setName('Travel');
        this.shadow.setGravityY(0);
        // this.sprite.setOrigin(0,0);
        this.shadow.setVisible(false);
        this.sprite.setVisible(false);

    }

    OverlapPlayer() {
        this.sprite.destroy();
        this.shadow.destroy();
        console.log(`Overlapped Cutscene: ${this.Name}`);
        this.gs.FadeMap(this.NextLevel, this.EntryPointName);
    }

}