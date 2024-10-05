import { C } from "../../C";
import { FacingEnum } from "../../Entities/Entity";
import { MM } from "../../Entities/MM"
import { EffectTypes } from "../../enums/EffectTypes";
import { IHVI } from "../../IH/IH";
import { FSMModule } from "../FSMModule"

export class MMGroundFSM extends FSMModule {
    mm:MM;
    moduleStart(args: any): void {
        this.mm = this.parent as MM;
        this.mm.sprite.on('animationupdate', this.AnimationUpdate, this);
        // this.mm.scene.events.on('mergedInput', this.CheckInput, this);
        this.mm.AddAnimationSuffix = true;
    }


    AnimationUpdate(animation:Phaser.Animations.Animation, frame:Phaser.Animations.AnimationFrame, go:Phaser.GameObjects.GameObject, framekey:string) {
        // let frames = ['smalldwarf_run_1', 'smalldwarf_run_4'];
        // if(frames.find(f=>f == framekey) != undefined)
        //     this.mm.scene.events.emit('effect', {x:this.mm.sprite.body.x, y:this.mm.sprite.body.y, right:this.mm.Facing == FacingEnum.Right}, EffectTypes.Generic);

    }

    moduleEnd(args: any): void {
        // this.mm.scene.events.removeListener('mergedInput', this.CheckInput, this);
        this.mm.sprite.removeListener('animationupdate', this.AnimationUpdate, this);
    }

    // CheckInput(i:{ device:string, value:number, player:number, action:string, state:string }) {
    //     if(i.state = 'DOWN') {
    //         console.log(`Pressed`);
    //     }
    // }

    update(dt:number) {
        let input = this.mm.ih;
        // this.mm.sprite.setAcceleration(0,0);
        this.mm.shadow.setAcceleration(this.mm.ExternalAcceleration.x,this.mm.ExternalAcceleration.y);
        this.mm.shadow.setDrag(1000);
        // this.mm.sprite.setMaxVelocity(C.MOVE_SPEED,C.MOVE_SPEED);


        let speed = 1000;
        let xdir = 0;
        let ydir = 0;
        if(input.IsPressed(IHVI.Left)) {
            xdir -=1;
        }
        if(input.IsPressed(IHVI.Right)) {
            xdir +=1;
        } 
        if(input.IsPressed(IHVI.Up)) {
            ydir -=1;
        }
        if(input.IsPressed(IHVI.Down)) {
            ydir +=1;
        } 

        // if(input.IsJustPressed(IHVI.Jump)) {
        //     this.mm.ZVel = this.mm.JumpStrength;
        // }


        this.mm.shadow.setAcceleration(C.MOVE_ACCEL * xdir, C.MOVE_ACCEL * ydir);

        let velocity = this.mm.shadow.body.velocity; 
        //Normalize the player speed
        if(velocity.length() > C.MOVE_SPEED) {
            velocity = velocity.normalize().scale(C.MOVE_SPEED);
            this.mm.shadow.setVelocity(velocity.x, velocity.y);
        }


        this.SetAnimation(); 

        // if(xdir != 0)
        //     this.mm.PlayAnimation('run'); 
        // else
        //     this.mm.PlayAnimation('stand'); 

    }
    SetAnimation() {
        

    }
}
