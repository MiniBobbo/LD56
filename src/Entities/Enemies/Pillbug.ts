import { PillbugFSM } from "../../FSM/Enemies/PillbugFSM";
import { EnemyKnockbackFSM } from "../../FSM/EnemyGeneric/EnemyKnockbackFSM";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Pillbug extends Enemy {
    state:PillbugStates = PillbugStates.Stand;
    constructor(scene:LevelScene) {
        super(scene);
        this.maxhp = 3;
        this.hp = 3;
        this.PlayAnimation('Stand');
        this.shadow.setCollideWorldBounds(true);

        this.fsm.addModule('default', new PillbugFSM(this, this.fsm));
        this.fsm.addModule('knockback', new EnemyKnockbackFSM(this, this.fsm));
        this.changeFSM('default');

    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Pillbug_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Roll_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Roll_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Pillbug_Roll_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Pillbug_Roll_Up_', end: 3}), repeat: -1});

    }
}

enum PillbugStates {
    Stand = 'Stand',
    Roll = 'Roll'
}