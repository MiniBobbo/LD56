import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMKnockbackFSM extends FSMModule {
    mm:MM;
    firstFrame:boolean;

    moduleStart() {
        this.mm = this.parent as MM;
        this.mm.shadow.setAcceleration(0,0);
        this.mm.shadow.setDrag(0,0);
        this.mm.shadow.setMaxVelocity(2000,2000);
        this.mm.shadow.setGravityY(C.GRAVITY);
        this.firstFrame = true;
        
        //Play the knockback animation
        if(this.mm.Facing == FacingEnum.Left) {
            this.mm.shadow.setVelocity(C.KNOCKBACK.x, C.KNOCKBACK.y);
        } else {
            this.mm.shadow.setVelocity(-C.KNOCKBACK.x, C.KNOCKBACK.y);
        }
        this.mm.sprite.y -= 2;
        this.mm.shadow.body.blocked.down = false;
    }

    update(dt:number) {
        if(this.mm.shadow.body.blocked.down && !this.firstFrame) {
            this.parent.changeFSM('move');
            return;
        }
        if(this.firstFrame) {
            if(this.mm.Facing == FacingEnum.Left) {
                this.mm.shadow.setVelocity(C.KNOCKBACK.x, C.KNOCKBACK.y);
            } else {
                this.mm.shadow.setVelocity(-C.KNOCKBACK.x, C.KNOCKBACK.y);
            }
        }
        this.firstFrame = false;
        this.mm.flashingRemaining = C.LONG_FLASH;
    }

    moduleEnd(args: any): void {
    }
}