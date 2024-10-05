import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMKnockbackFSM extends FSMModule {
    mm:MM;
    firstFrame:boolean;
    direction:Phaser.Math.Vector2;
    duration:number = C.KNOCKBACK_DURATION;

    moduleStart(attackLocation:Phaser.Math.Vector2) {
        this.mm = this.parent as MM;
        this.mm.shadow.setAcceleration(0,0);
        this.mm.shadow.setDrag(0,0);
        this.mm.shadow.setMaxVelocity(2000,2000);
        this.firstFrame = true;

        this.duration = C.SHORT_FLASH;

        this.direction = new Phaser.Math.Vector2(1,0);
        this.direction = this.direction.rotate(Phaser.Math.Angle.BetweenPoints(attackLocation, this.mm.shadow));
        this.direction.scale(C.SHORT_FLASH);
        this.mm.shadow.setVelocity(this.direction.x, this.direction.y);
        this.firstFrame = false;
        this.mm.flashingRemaining = C.SHORT_FLASH;
    
    }

    update(dt:number) {
        this.duration -= dt;
        if(this.duration <= 0) {
            this.parent.changeFSM('move');
            return;
        }
        // if(this.mm.shadow.body.blocked.down && !this.firstFrame) {
        //     this.parent.changeFSM('move');
        //     return;
        // }
        // if(this.firstFrame) {
        //     this.direction.scale(C.KNOCKBACK);
        //     this.mm.shadow.setVelocity(this.direction.x, this.direction.y);
        //     this.firstFrame = false;
        //     this.mm.flashingRemaining = C.LONG_FLASH;
        // }
    }

    moduleEnd(args: any): void {
    }
}