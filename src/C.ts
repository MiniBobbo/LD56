import MergedInput, { Player } from "phaser3-merged-input";
import { GameData } from "./GameData";

export class C {
    static GAME_NAME = 'InitialGame';
    static gd:GameData;
    static FLAG_COUNT:number = 100;

    static GRAVITY:number = 0;
    static DRAG:number = 1000;
    static MOVE_SPEED:number = 100;
    static MOVE_ACCEL:number = 500;
    static LONG_FLASH:number = 1500;
    static SHORT_FLASH:number = 200;
    static MOUSE_SENSITIVITY:number = .8;


    static KNOCKBACK:number = 50;

    static SCREEN_TRANSITION_TIME:number = 500;
    static STICK_VELOCITY:number = 200;

    static KNOCKBACK_DURATION:number = 500;

    static checkFlag(flag:string):boolean {
        //@ts-ignore
        return this.gd.flags[flag];
    }
    static setFlag(flag:string, value:boolean) {
        //@ts-ignore
        this.gd.flags[flag] = value;
    }

}