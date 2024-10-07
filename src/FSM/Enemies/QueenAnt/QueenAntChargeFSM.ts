import { QueenAnt } from "../../../Entities/Enemies/QueenAnt";
import { LevelScene } from "../../../scenes/LevelScene";
import { FSMModule } from "../../FSMModule";

export class QueenAntChargeFSM extends FSMModule {
    delay:number = 1000;
    direction:Phaser.Math.Vector2 = new Phaser.Math.Vector2(-120,0);
    QueenAnt:QueenAnt;
    ChargeSpeed:number = 300;
    walkTime:number = 0;
    walkDuration:number = 2000;
    gs:LevelScene;
    stage:number = 0;

    moduleStart(args: any): void {
        this.QueenAnt = this.parent as QueenAnt;
        this.gs = this.QueenAnt.gs;
        this.QueenAnt.shadow.setVelocity(0,0);
        this.QueenAnt.PlayAnimation('Crouch');
        this.delay = 500;
        this.stage = 0;
    }

    update(dt: number): void {
        // this.QueenAnt.shadow.setVelocityX(this.direction.x);
        this.delay -= dt;
        if(this.delay <= 0) {
            switch(this.stage) {
                case 0:
                    this.stage++;
                    this.QueenAnt.shadow.setVelocityX(-this.ChargeSpeed);
                    this.QueenAnt.PlayAnimation('Run');
                break;
                case 1:
                    if(this.QueenAnt.shadow.body.blocked.left || this.QueenAnt.shadow.body.blocked.right) { 
                        this.gs.cameras.main.shake(100, 0.01);
                        this.QueenAnt.shadow.setVelocityX(0);
                        this.QueenAnt.PlayAnimation('Roar');
                        this.delay = 500;
                        this.stage++;
                    }
                break;
                case 2:
                    this.QueenAnt.PlayAnimation('Run');
                    this.QueenAnt.shadow.setVelocityX(this.ChargeSpeed);
                    this.delay = 500;
                    this.stage++;
                break;
                case 3:
                    if(this.QueenAnt.shadow.body.blocked.left || this.QueenAnt.shadow.body.blocked.right) { 
                        this.gs.cameras.main.shake(100, 0.01);
                        this.QueenAnt.shadow.setVelocityX(0);
                        this.delay = 500;
                        this.QueenAnt.PlayAnimation('Roar');
                        this.stage++;
                    }
                break;
                case 4:
                    this.fsm.changeModule('walk');
                    return;
                break;


            }
        }

    }
}
