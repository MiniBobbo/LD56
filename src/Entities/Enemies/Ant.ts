import { AntFSM } from "../../FSM/Enemies/AntFSM";
import { EnemyKnockbackFSM } from "../../FSM/EnemyGeneric/EnemyKnockbackFSM";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class Ant extends Enemy {

    constructor(scene:LevelScene) {
        super(scene);
        this.setName('Ant');
        this.maxhp = 3;
        this.hp = 3;
        this.PlayAnimation('Stand');
        this.shadow.setCollideWorldBounds(true);
        this.shadow.setVelocityX(0);
        this.fsm.addModule('default', new AntFSM(this, this.fsm));
        this.fsm.addModule('knockback', new EnemyKnockbackFSM(this, this.fsm));
        this.changeFSM('default');
    }

    Update(time: number, dt: number): void {
        super.Update(time, dt);
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Ant_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Walk_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Walk_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Run_Down', frameRate: 10, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Ant_Run_Up', frameRate: 10, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Ant_Walk_Up_', end: 3}), repeat: -1});

    }
}

