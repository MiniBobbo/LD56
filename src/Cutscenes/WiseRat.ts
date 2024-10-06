import { Enemy } from "../Entities/Enemy";
import { EntityInstance } from "../map/LDtkReader";
import { LevelScene } from "../scenes/LevelScene";

export class WiseRat extends Enemy {
    gs:LevelScene;


    constructor(name:string, gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.scene = gs;

        this.AddAnimationSuffix = false;

        this.setName('WiseRat');
        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;
        this.shadow.setGravityY(0);
        // this.sprite.setOrigin(0,0);
        this.shadow.setCollideWorldBounds(true);
        this.shadow.setVisible(false);
        this.sprite.setVisible(true);
        this.PlayAnimation('Talk');
    }

    OverlapPlayer() {

    }

    Damage(damage:number, attackLocation:Phaser.Math.Vector2): void {
    }

    HitByStick() {
    }

    static CreateAnimations(scene:Phaser.Scene) {
        scene.anims.create({ key: 'WiseRat_Talk', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'WiseRat_Talk_', end: 3}), repeat: -1});
    }
}