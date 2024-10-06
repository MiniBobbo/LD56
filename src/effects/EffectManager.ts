import { EffectTypes } from "../enums/EffectTypes";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "../scenes/LevelScene";

export class EffectManager {
    scene:LevelScene;
    active:boolean;
    EffectGroup:Phaser.GameObjects.Sprite[];

    constructor(scene:LevelScene) {
        this.scene = scene;
        this.EffectGroup = [];
        this.scene.events.on(SceneMessages.Effect, (o:{x:number, y:number}, type:EffectTypes)=> {
            this.LaunchEffect(o, type);
        });
    }
    
    LaunchEffect(origin:{x:number, y:number}, type:EffectTypes) {
        let a = this.EffectGroup.find(e=>!e.anims.isPlaying);  
        if(a == undefined) {
            a = this.scene.add.sprite(0,0,'atlas', 0);
            this.EffectGroup.push(a);
            this.scene.Midground.add(a);
        }

        a.setAngle(0).setFlip(false, false).setScale(1,1).setDepth(origin.y).setVisible(true);
        a.once('animationcomplete', ()=>{a.setVisible(false)});

        switch (type) {
            case EffectTypes.Poof:
                a.setPosition(origin.x, origin.y).setScale(2)
                .anims.play(type);
                break;
        
            default:
                break;
        }

    }

    static CreateAnimations(scene:Phaser.Scene) { 
        scene.anims.create({ key: EffectTypes.Poof, frameRate: 90, frames: scene.anims.generateFrameNames('atlas', { prefix: 'poof_', end: 31}), repeat: 0});

    }
}