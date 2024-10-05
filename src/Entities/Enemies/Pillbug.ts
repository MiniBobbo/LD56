import { Enemy } from "../Enemy";

export class Pillbug extends Enemy {



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Pillbug_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Roll_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Roll_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Roll_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Roll_Up_', end: 3}), repeat: -1});

    }
}