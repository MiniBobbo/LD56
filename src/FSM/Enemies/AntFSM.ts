import { Ant } from "../../Entities/Enemies/Ant";
import { FSMModule } from "../FSMModule";

export class AntFSM extends FSMModule {
    state:AntStates = AntStates.Stand;
    MaxSpeed:number = 60;
    WalkSpeed:number = 25;
    delay:number = 1000;
    direction:Phaser.Math.Vector2 = new Phaser.Math.Vector2(1,0);
    ant:Ant;

    moduleStart(args: any): void {
        this.ant = this.parent as Ant;
    }

    update(dt: number): void {
        switch(this.state) {
            case AntStates.Stand:
                this.ant.shadow.setVelocity(0);
                this.ant.shadow.setAcceleration(0);
                this.ant.PlayAnimation('Stand');
                this.delay -= dt;
                if(this.delay <= 0) {
                    this.state = AntStates.Walk;
                    this.direction.set(this.MaxSpeed,0);
                    this.direction.rotate(Phaser.Math.DegToRad(Phaser.Math.Between(-180,180)));
                    this.ant.shadow.setVelocity(this.direction.x, this.direction.y);
                    if(this.direction.y > 0) {
                        this.ant.AnimationSuffix = '_Down';
                    } else {
                        this.ant.AnimationSuffix = '_Up';
                    }
                    if(this.direction.x > 0) {
                        this.ant.sprite.flipX = false;
                    } else {
                        this.ant.sprite.flipX = true;
                    }
                    this.ant.PlayAnimation('Walk');
                    this.delay = 2000 + Phaser.Math.Between(-500,500);
                }
                break;
            case AntStates.Walk:
                this.delay -= dt;
                this.ant.shadow.setVelocity(this.direction.x, this.direction.y);

                if(this.delay <= 0) {
                    this.state = AntStates.Stand;
                    this.delay = 1000;
                }
                break;
        }

    }
}

enum AntStates {
    Stand = 'Stand',
    Walk = 'Walk',
    Chase = 'Chase',

}