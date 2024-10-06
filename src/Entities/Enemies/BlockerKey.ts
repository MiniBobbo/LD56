import { AttackInstance } from "../../attacks/AttackInstance";
import { C } from "../../C";
import { SceneMessages } from "../../enums/SceneMessages";
import { EntityInstance } from "../../map/LDtkReader";
import { GuiEvents } from "../../scenes/GuiScene";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";


export class BlockerKey extends Enemy {
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
        this.keyTypeRequired = parseInt(element.fieldInstances[0].__value);
        this.IdAssigned = element.fieldInstances[1].__value;

        this.Interactable = true;

        if(!C.gd.IDsCollected.includes(this.IdAssigned)) {
            this.gs.events.once(SceneMessages.ScreenTransitionComplete, this.Raise, this);
        }

    }


    dispose(): void {
        this.gs.events.off(SceneMessages.ScreenTransitionComplete, this.Raise, this);
    }

    Interact(): void {
        if(this.Opened) {
            return;
        }
        if(C.gd.keys[this.keyTypeRequired] == 0) {
            return;
        }

        C.gd.keys[this.keyTypeRequired]--;
        C.gd.IDsCollected.push(this.IdAssigned);
        this.gs.guiScene.events.emit(GuiEvents.UPDATE_KEYS);
        this.gs.events.emit(SceneMessages.Trigger, this.IdAssigned);
        this.Lower();
    }

    HitByAttack(a: AttackInstance): void {
        
    }
    HitByStick(): void {
        
    }

    Raise() {
        this.PlayAnimation('Lock');
        this.Opened = false;
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(5, this.shadow.x, this.shadow.y);


    }

    Lower() {
        this.PlayAnimation('Unlock');
        this.Opened = true;
        C.gd.IDsCollected.push(this.IdAssigned);
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