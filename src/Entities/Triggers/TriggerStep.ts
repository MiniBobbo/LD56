import { AttackInstance } from "../../attacks/AttackInstance";
import { C } from "../../C";
import { SceneMessages } from "../../enums/SceneMessages";
import { EntityInstance } from "../../map/LDtkReader";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";


export class TriggerStep extends Enemy {
    keyTypeRequired:number = 0;
    IdAssigned:string = '';
    Opened:boolean = false;
    constructor(scene:LevelScene, element:EntityInstance) {
        super(scene);
        this.setName('Blocker');
        this.AddAnimationSuffix = false;
        this.maxhp = 10000;
        this.hp = 10000;
        this.PlayAnimation('Unlock');

        this.HeightOffset = 0;
        this.IdAssigned = element.fieldInstances[0].__value;

        this.Interactable = false;
    }


    dispose(): void {
        this.gs.events.off(SceneMessages.ScreenTransitionComplete, this.Raise, this);
    }


    HitByAttack(a: AttackInstance): void {
    }

    HitByStick(): void {
    }

    Raise() {
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(1, this.shadow.x, this.shadow.y);
    }

    Lower() {
        this.PlayAnimation('Unlock');
        this.Opened = true;
        C.gd.IDsCollected.push(this.IdAssigned);
    }

    Dead() {
    }

    OverlapPlayer(): void {
        this.gs.events.emit(SceneMessages.Trigger, this.IdAssigned);
    }

    PostUpdate(): void {
        super.PostUpdate();
        this.sprite.setDepth(this.shadow.y-1000);
    }

}