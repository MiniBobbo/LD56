import { RedAnt } from "../../Entities/Enemies/RedAnt";
import { FSMModule } from "../FSMModule";

export class RedAntFSM extends FSMModule {
    state:RedAntStates = RedAntStates.Stand;
    MaxSpeed:number = 85;
    WalkSpeed:number = 50;
    delay:number = 1000;
    direction:Phaser.Math.Vector2 = new Phaser.Math.Vector2(1,0);
    RedAnt:RedAnt;

    moduleStart(args: any): void {
        this.RedAnt = this.parent as RedAnt;
    }

    update(dt: number): void {
        switch(this.state) {
            case RedAntStates.Stand:
                this.RedAnt.shadow.setVelocity(0);
                this.RedAnt.shadow.setAcceleration(0);
                this.RedAnt.PlayAnimation('Stand');
                this.delay -= dt;
                if(this.delay <= 0) {
                    this.state = RedAntStates.Walk;
                    // this.RedAnt.shadow.setVelocity(this.direction.x, this.direction.y);
                    this.RedAnt.PlayAnimation('Walk');
                    this.delay = 3000 + Phaser.Math.Between(-500,500);
                }
                break;
            case RedAntStates.Walk:
                if(this.RedAnt.shadow.body.velocity.y > 0) {
                    this.RedAnt.AnimationSuffix = '_Down';
                } else {
                    this.RedAnt.AnimationSuffix = '_Up';
                }
                if(this.RedAnt.shadow.body.velocity.x > 0) {
                    this.RedAnt.sprite.flipX = false;
                } else {
                    this.RedAnt.sprite.flipX = true;
                }
                this.delay -= dt;
                this.RedAnt.PlayAnimation('Walk');
                this.RedAnt.shadow.setAcceleration(0,0);
                this.RedAnt.gs.physics.accelerateToObject(this.RedAnt.shadow, this.RedAnt.gs.mm.shadow, 120);
                if(this.RedAnt.shadow.body.velocity.length() > this.MaxSpeed) 
                    this.RedAnt.shadow.body.velocity.normalize().scale(this.MaxSpeed);
                // this.direction.set(this.MaxSpeed,0);
                // this.RedAnt.shadow.setAcceleration(this.direction.x, this.direction.y);

                if(this.delay <= 0) {
                    this.state = RedAntStates.Stand;
                    this.delay = 1000;
                }
                break;
        }

    }
}

enum RedAntStates {
    Stand = 'Stand',
    Walk = 'Walk',
    Chase = 'Chase',

}