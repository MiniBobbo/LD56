import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMKnockbackFSM extends FSMModule {
    mm:MM;
    firstFrame:boolean;

    moduleStart() {
        this.mm = this.parent as MM;
        this.mm.sprite.setAcceleration(0,0);
        this.mm.sprite.setDrag(0,0);
        this.mm.sprite.setMaxVelocity(2000,2000);
        this.mm.sprite.setGravityY(C.GRAVITY);
        this.firstFrame = true;
        
        //Play the knockback animation
        if(this.mm.Facing == FacingEnum.Left) {
            this.mm.sprite.setVelocity(C.KNOCKBACK.x, C.KNOCKBACK.y);
        } else {
            this.mm.sprite.setVelocity(-C.KNOCKBACK.x, C.KNOCKBACK.y);
        }
        this.mm.sprite.y -= 2;
        this.mm.sprite.body.blocked.down = false;
    }

    update(dt:number) {
        if(this.mm.sprite.body.blocked.down && !this.firstFrame) {
            this.parent.changeFSM('move');
            return;
        }
        if(this.firstFrame) {
            if(this.mm.Facing == FacingEnum.Left) {
                this.mm.sprite.setVelocity(C.KNOCKBACK.x, C.KNOCKBACK.y);
            } else {
                this.mm.sprite.setVelocity(-C.KNOCKBACK.x, C.KNOCKBACK.y);
            }
        }
        this.firstFrame = false;
        this.mm.flashingRemaining = C.LONG_FLASH;
    }

    moduleEnd(args: any): void {
    }
}