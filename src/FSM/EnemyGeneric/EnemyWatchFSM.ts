import { FSM, IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class EnemyWatchFSM extends FSMModule {
    nextFSM:string;

    constructor(parent:IFSM, fsm:FSM, attackFSM:string) {
        super(parent, fsm);
        this.nextFSM = attackFSM;
    }


    moduleStart(args: any): void {

    }

    update(dt: number): void {
        
    }

}