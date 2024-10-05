import { C } from "../../C";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class MMEndFSM extends FSMModule {
    mm:MM;

    moduleStart(args: any): void {
        this.mm.shadow.setDrag(C.DRAG);
        this.mm.shadow.setAcceleration(0);
        this.mm = this.parent as MM;
        let anim = args as string;
        this.mm.PlayAnimation(anim);
    }

}