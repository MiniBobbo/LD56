import { C } from "../C";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { EntityInstance } from "../map/LDtkReader";
import { GuiEvents } from "../scenes/GuiScene";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class SacredSwiss extends Entity {
    ID:string;
    t:Phaser.Tweens.Tween;
    constructor(gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.scene = gs;
        this.setName('Swiss');
        this.ID = instance.iid;
        this.sprite.setFrame('SacredSwiss_1');
        let glow = this.sprite.postFX.addGlow(0xffffbb, 3);
        this.t = gs.tweens.add({

            targets: glow,
            outerStrength: 6,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        this.HeightOffset = 30;
        this.Interactable = true;
        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;


    }

    Interact(): void {
        this.gs.mm.changeFSM('end');
        this.gs.guiScene.cameras.main.fadeOut(3000, 0, 0, 0,);
        this.gs.cameras.main.fadeOut(3000, 0, 0, 0, (cam:any, progress)=>{
            if(progress == 1) {
                this.gs.scene.stop('level');
                this.gs.scene.stop('gui');
                this.gs.scene.start('victory');
            }
        });
        // this.gs.guiScene.events.emit(EntityMessages.CHANGE_HP, this.gs.mm.hp, C.gd.MaxHP);
        
    }

    dispose(): void {
        this.t.destroy();
        super.dispose();
    }

}