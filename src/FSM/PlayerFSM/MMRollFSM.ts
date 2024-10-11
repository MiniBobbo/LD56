import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMRollFSM extends FSMModule {
    mm:MM;

    RollSpeed: number = 250;
    PrimaryRollLength: number = 300;
    SecondaryRollLength: number = 400;
    delay: number = 0;
    rollSpeed:Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    state:number = 0;
    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.rollSpeed.set(this.RollSpeed, 0);
        this.rollSpeed.rotate(this.mm.MovementAngle);
        this.mm.shadow.setVelocity(this.rollSpeed.x, this.rollSpeed.y);
        this.delay = this.PrimaryRollLength;
        this.state = 0;
    }

    update(dt: number): void {
        this.delay -= dt;
        this.mm.shadow.setVelocity(this.rollSpeed.x, this.rollSpeed.y);
        if(this.delay <= 0) {
            switch(this.state) {
                case 0:
                    this.state = 1;
                    this.rollSpeed.scale(.5);
                    this.mm.shadow.setVelocity(this.rollSpeed.x, this.rollSpeed.y);
                    this.delay = this.SecondaryRollLength;
                break;
                case 1:
                    this.mm.shadow.setVelocity(0,0);
                    this.parent.changeFSM('move');
                break;
                
            }
        }
    }
}