import { AttackInstance } from "../../attacks/AttackInstance";
import { C } from "../../C";
import { SceneMessages } from "../../enums/SceneMessages";
import { EntityInstance } from "../../map/LDtkReader";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";


export class BlockerTrigger extends Enemy {
    IdAssigned:string = '';
    constructor(scene:LevelScene, element:EntityInstance) {
        super(scene);
        this.setName('Blocker');
        this.AddAnimationSuffix = false;
        this.maxhp = 10000;
        this.hp = 10000;
        this.PlayAnimation('Down');
        this.HeightOffset = 0;
        this.IdAssigned = element.fieldInstances[0].__value;

        if(!C.gd.IDsCollected.includes(this.IdAssigned)) {
            this.gs.events.once(SceneMessages.ScreenTransitionComplete, this.Raise, this);
        }
            this.gs.events.on(SceneMessages.Trigger, this.Trigger, this);

    }

    Trigger(id:string) {
        if(id == this.IdAssigned) {
            this.Lower();
        }
    }


    dispose(): void {
        this.gs.events.off(SceneMessages.ScreenTransitionComplete, this.Raise, this);
    }

    HitByAttack(a: AttackInstance): void {
        
    }
    HitByStick(): void {
        
    }

    Raise() {
        this.PlayAnimation('Raise');
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(5, this.shadow.x, this.shadow.y);

    }

    Lower() {
        this.PlayAnimation('Lower');
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(1, this.shadow.x, this.shadow.y);
    }


    Dead() {
    }

    OverlapPlayer(): void {
        
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Blocker_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Down_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Up_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Raise', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Raise_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Lower', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Lower_', end: 3}), repeat: 0});

    }
}