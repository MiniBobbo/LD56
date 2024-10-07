import { C } from "../../C";
import { SceneMessages } from "../../enums/SceneMessages";
import { EntityInstance } from "../../map/LDtkReader";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Boss extends Enemy {
    Trigger:string = '';

    constructor(scene:LevelScene, element:EntityInstance) {
        super(scene);
        this.setName('Boss');
        this.AddAnimationSuffix = false;
        this.maxhp = 10;
        this.hp = 10;
        // this.PlayAnimation('Down');
        this.HeightOffset = 20;
        this.shadow.setScale(2);
        this.Trigger = element.fieldInstances[0].__value;

    }

    Dead(): void {
        super.Dead();
        this.gs.events.emit(SceneMessages.Trigger, this.Trigger, this);
        C.gd.IDsCollected.push(this.Trigger);
    }
}