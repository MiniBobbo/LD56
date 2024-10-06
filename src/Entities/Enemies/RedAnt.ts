import { RedAntFSM } from "../../FSM/Enemies/RedAntFSM";
import { EnemyKnockbackFSM } from "../../FSM/EnemyGeneric/EnemyKnockbackFSM";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";

export class RedAnt extends Enemy {

    constructor(scene:LevelScene) {
        super(scene);
        this.setName('RedAnt');
        this.maxhp = 6;
        this.hp = 6;
        this.PlayAnimation('Stand');
        this.shadow.setCollideWorldBounds(true);
        this.shadow.setVelocityX(0);
        this.fsm.addModule('default', new RedAntFSM(this, this.fsm));
        // this.fsm.addModule('knockback', new EnemyKnockbackFSM(this, this.fsm));
        this.changeFSM('default');
    }

    Update(time: number, dt: number): void {
        super.Update(time, dt);
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'RedAnt_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'RedAnt_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'RedAnt_Walk_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'RedAnt_Walk_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Walk_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'RedAnt_Run_Down', frameRate: 10, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'RedAnt_Run_Up', frameRate: 10, frames: scene.anims.generateFrameNames('atlas', { prefix: 'RedAnt_Walk_Up_', end: 3}), repeat: -1});

    }
}

