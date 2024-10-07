import { QueenAnt } from "../../../Entities/Enemies/QueenAnt";
import { LevelScene } from "../../../scenes/LevelScene";
import { FSMModule } from "../../FSMModule";

export class QueenAntWalkFSM extends FSMModule {
    MaxSpeed:number = 60;
    WalkSpeed:number = 25;
    delay:number = 1000;
    direction:Phaser.Math.Vector2 = new Phaser.Math.Vector2(-15,0);
    QueenAnt:QueenAnt;
    walkTime:number = 0;
    walkDuration:number = 2000;
    gs:LevelScene;

    moduleStart(args: any): void {
        this.QueenAnt = this.parent as QueenAnt;
        this.gs = this.QueenAnt.gs;
        this.QueenAnt.PlayAnimation('Walk');
    }

    update(dt: number): void {
        this.QueenAnt.shadow.setVelocityX(this.direction.x);
        this.walkTime -= dt;
        this.delay -= dt;
        if(this.delay <= 0) {
            Phaser.Math.Between(0,4) == 0 ? this.fsm.changeModule('charge') : this.fsm.changeModule('fire');
            this.delay = 2000 + Phaser.Math.Between(-500,500);

            return;
            // this.fsm.changeModule('charge');
            // return;
        }
        if (this.walkTime <= 0) {
            this.direction.x *= -1;
            // this.state = QueenAntStates.Stand;
            this.walkTime = this.walkDuration;
        }

    }
}
