import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Bush extends Enemy {
    constructor(scene:LevelScene) {
        super(scene);
        this.setName('Bush');
        this.AddAnimationSuffix = false;
        this.maxhp = 1;
        this.hp = 1;
        this.PlayAnimation('Stand');
        
        

    }

    Dead() {
        this.PlayAnimation('Chopped');
    }

    OverlapPlayer(): void {
        
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Bush_Stand', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Bush_Stand_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Bush_Chopped', frameRate: 20, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Bush_Chopped_', end: 5}), repeat: 0});

    }
}