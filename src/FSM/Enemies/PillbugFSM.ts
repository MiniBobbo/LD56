import { Ant } from "../../Entities/Enemies/Ant";
import { Pillbug } from "../../Entities/Enemies/Pillbug";
import { FSMModule } from "../FSMModule";

export class PillbugFSM extends FSMModule {
    state:PillbugStates = PillbugStates.Stand;
    MaxSpeed:number = 60;
    delay:number = 1000;
    direction:Phaser.Math.Vector2 = new Phaser.Math.Vector2(1,0);
    pb:Pillbug;
    drag:number = 10;

    moduleStart(args: any): void {
        this.pb = this.parent as Pillbug;
        this.pb.shadow.setDrag(this.drag, this.drag);
    }

    update(dt: number): void {
        switch(this.state) {
            case PillbugStates.Stand:
                this.pb.shadow.setVelocity(0);
                this.pb.shadow.setAcceleration(0);
                this.pb.PlayAnimation('Stand');
                this.delay -= dt;
                if(this.delay <= 0) {
                    this.state = PillbugStates.Roll;
                    this.direction.set(this.MaxSpeed,0);
                    
                    this.direction.rotate(Phaser.Math.DegToRad(Phaser.Math.Between(-180,180)));
                    this.pb.shadow.setVelocity(this.direction.x, this.direction.y);
                    if(this.direction.y > 0) {
                        this.pb.AnimationSuffix = '_Down';
                    } else {
                        this.pb.AnimationSuffix = '_Up';
                    }
                    if(this.direction.x > 0) {
                        this.pb.sprite.flipX = false;
                    } else {
                        this.pb.sprite.flipX = true;
                    }
                    this.pb.PlayAnimation('Roll');
                    this.delay = 2000 + Phaser.Math.Between(-500,500);
                }
                break;
            case PillbugStates.Roll:
                this.delay -= dt;
                if(this.pb.shadow.body.blocked.left || this.pb.shadow.body.blocked.right) {
                    this.pb.shadow.setVelocityX(-this.pb.shadow.body.velocity.x);
                } else if(this.pb.shadow.body.blocked.up || this.pb.shadow.body.blocked.down) {
                    this.pb.shadow.setVelocityY(-this.pb.shadow.body.velocity.y);
                }

                if(this.pb.shadow.body.velocity.length() <= 5) {
                    this.state = PillbugStates.Stand;
                    this.pb.shadow.setVelocity(0);
                    this.delay = 1000;
                }
                break;
        }

    }
}

enum PillbugStates {
    Stand = 'Stand',
    Roll = 'roll',

}