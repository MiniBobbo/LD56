import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Ant extends Enemy {
    state:AntStates = AntStates.Stand;
    constructor(scene:LevelScene) {
        super(scene);
        this.setName('Ant');
        this.maxhp = 3;
        this.hp = 3;
        this.PlayAnimation('Stand');
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Ant_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Walk_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Walk_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Up_', end: 3}), repeat: -1});

    }
}

enum AntStates {
    Stand = 'Stand',
    Roll = 'Roll'
}