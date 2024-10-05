import { MM } from "../../Entities/MM";
import { EntityMessages } from "../../enums/EntityMessages";
import { IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class MMAttackFSM extends FSMModule {
    mm:MM;
    delay:number = 0;

    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.mm.shadow.setVelocity(0,0);
        this.delay = 200;
        this.mm.PlayAnimation('Attack', false);
    }

    update(dt: number): void {
        this.delay -= dt;
        if(this.delay < 0) {
            this.parent.changeFSM('move');
            return;
        }
    }

    moduleEnd(args: any): void {
        this.mm.attackSprite.setVisible(false);
    }
}