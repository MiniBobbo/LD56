import { QueenAntChargeFSM } from "../../FSM/Enemies/QueenAnt/QueenAntChargeFSM";
import { QueenAntFireFSM } from "../../FSM/Enemies/QueenAnt/QueenAntFireFSM";
import { QueenAntWalkFSM } from "../../FSM/Enemies/QueenAnt/QueenAntWalkFSM";
import { QueenAntFSM } from "../../FSM/Enemies/QueenAntFSM";
import { EntityInstance } from "../../map/LDtkReader";
import { LevelScene } from "../../scenes/LevelScene";
import { Boss } from "./Boss";

export class QueenAnt extends Boss {
    ForwardPosition:boolean = true;

    constructor(scene:LevelScene, element:EntityInstance) {
        super(scene, element);
        this.setName('QueenAnt');
        this.maxhp = 30;
        this.hp = 30;
        this.AddAnimationSuffix = false;
        this.PlayAnimation('Stand');
        this.HeightOffset = 15;
        this.shadow.setScale(2);
        // this.fsm.addModule('default', new QueenAntFSM(this, this.fsm));
        this.fsm.addModule('walk', new QueenAntWalkFSM(this, this.fsm));
        this.fsm.addModule('charge', new QueenAntChargeFSM(this, this.fsm));
        this.fsm.addModule('fire', new QueenAntFireFSM(this, this.fsm));
        this.fsm.changeModule('walk');
    }



    static CreateAnimations(scene:Phaser.Scene) {
        scene.anims.create({ key: 'QueenAnt_Stand', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'QueenAnt_Stand_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'QueenAnt_Walk', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'QueenAnt_Walk_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'QueenAnt_Run', frameRate: 18, frames: scene.anims.generateFrameNames('atlas', { prefix: 'QueenAnt_Walk_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'QueenAnt_Roar', frameRate: 12, frames: scene.anims.generateFrameNames('atlas', { prefix: 'QueenAnt_Roar_', end: 1}), repeat: -1});
        scene.anims.create({ key: 'QueenAnt_Crouch', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'QueenAnt_Crouch_', end: 0}), repeat: 0});
    }

}

