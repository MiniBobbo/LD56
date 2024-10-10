import { C } from "../../../C";
import { QueenAnt } from "../../../Entities/Enemies/QueenAnt";
import { AttackTypes } from "../../../enums/AttackTypes";
import { SFX } from "../../../Helpers/SoundManager";
import { LevelScene } from "../../../scenes/LevelScene";
import { FSMModule } from "../../FSMModule";

export class QueenAntFireFSM extends FSMModule {
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
        this.QueenAnt.PlayAnimation('Roar');
        this.delay = 500;
        this.stage = 0;
    }

    update(dt: number): void {
        // this.QueenAnt.shadow.setVelocityX(this.direction.x);
        this.delay -= dt;
        if(this.delay <= 0) {
            switch(this.stage) {
                case 0:
                    let fireLocation = {x:this.QueenAnt.shadow.x - 10, y:this.QueenAnt.shadow.y - 10};
                    let angle = Phaser.Math.Angle.BetweenPoints(fireLocation, this.gs.mm.shadow.getCenter());
                    this.gs.sound.play(SFX.Fireball, {volume:C.VolumeMult});
                    this.gs.BA.LaunchAttack({x:fireLocation.x, y:fireLocation.y - 10, angle:angle }, AttackTypes.Fireball);
                    this.gs.BA.LaunchAttack({x:fireLocation.x, y:fireLocation.y - 10, angle:angle-.5 }, AttackTypes.Fireball);
                    this.gs.BA.LaunchAttack({x:fireLocation.x, y:fireLocation.y - 10, angle:angle+.5 }, AttackTypes.Fireball);
                    this.delay = 1000;
                    this.stage++;
                break;
                case 1:
                    let angle2 = Phaser.Math.Angle.BetweenPoints(this.QueenAnt.shadow, this.gs.mm.shadow);
                    this.gs.BA.LaunchAttack({x:this.QueenAnt.shadow.x - 10, y:this.QueenAnt.shadow.y - 10, angle:angle2 }, AttackTypes.Fireball);
                    this.gs.sound.play(SFX.Fireball, {volume:C.VolumeMult});

                    this.delay = 500 + Phaser.Math.Between(-200,200);
                    this.stage++;
                break;
                case 2:
                    this.fsm.changeModule('walk');
                    return;
                break;


            }
        }

    }
}
