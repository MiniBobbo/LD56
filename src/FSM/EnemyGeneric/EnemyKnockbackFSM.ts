import { C } from "../../C";
import { Enemy } from "../../Entities/Enemy";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM";
import { FSMModule } from "../FSMModule";

export class EnemyKnockbackFSM extends FSMModule {
    e:Enemy;
    firstFrame:boolean;
    direction:Phaser.Math.Vector2;
    duration:number = C.KNOCKBACK_DURATION;

    moduleStart(attackLocation:Phaser.Math.Vector2) {
        this.e = this.parent as Enemy;
        this.e.shadow.setAcceleration(0,0);
        this.e.shadow.setDrag(0,0);
        this.e.shadow.setMaxVelocity(2000,2000);
        this.firstFrame = true;

        this.duration = C.ENEMY_KNOCKBACK_DURATION;

        this.direction = new Phaser.Math.Vector2(1,0);
        this.direction = this.direction.rotate(Phaser.Math.Angle.BetweenPoints(attackLocation, this.e.shadow));
        this.direction.scale(C.SHORT_FLASH);
        this.e.shadow.setVelocity(this.direction.x, this.direction.y);
        this.firstFrame = false;
        this.e.flashingRemaining = C.SHORT_FLASH;
    
    }

    update(dt:number) {
        this.duration -= dt;
        if(this.duration <= 0) {
            this.parent.changeFSM('default');
            return;
        }
    }

    moduleEnd(args: any): void {
    }
}