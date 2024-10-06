import { AttackInstance } from "../attacks/AttackInstance";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { FSM } from "../FSM/FSM";
import { LevelScene } from "../scenes/LevelScene";

export class Entity {
    //Graphics
    sprite:Phaser.GameObjects.Sprite;
    shadow:Phaser.Physics.Arcade.Image;
    
    gs:LevelScene;
    scene:LevelScene;
    lastAnim!:string;
    fsm:FSM;
    
    //Stats
    hp:number = 3;
    maxhp:number = 3;
    flashing:boolean = false;
    flashingRemaining:number = 0;
    ExternalAcceleration:Phaser.Math.Vector2;
    ExternalAccelerationApplied:boolean;
    Facing:FacingEnum= FacingEnum.Right;
    
    AddAnimationSuffix:boolean = true;
    AnimationSuffix:string = '_Down';

    isDead:boolean = false;
    

    //Is this entity Interactable?
    Interactable:boolean = false;
    
    //How high off the ground is the bottom of this entity?
    Z:number = 0;
    ZGravity:number = 5;
    ZVel:number = 0;
    //How tall is this entity?  This is used for collision checks.  
    Height:number = 10;
    HeightOffset:number = 5;

    LandTween:Phaser.Tweens.Tween;


    constructor(scene:LevelScene) {
        this.scene = this.gs = scene;
        this.ExternalAcceleration = new Phaser.Math.Vector2(0,0);
        this.sprite = scene.add.sprite(0,0, 'atlas')
        // this.sprite.setVisible(false);
        this.shadow = scene.physics.add.image(0,0,'shadow').setCircle(8).setAlpha(.5);
        
        this.scene.Background.add(this.shadow);

        this.sprite.name = '';
        this.sprite.setData('Entity', this);
        this.shadow.setData('Entity', this);
        this.sprite.setDepth(50);
        scene.Midground.add(this.sprite);
        this.fsm = new FSM(this);


        this.shadow.on(EntityMessages.TAKE_DAMAGE, this.Damage, this);
        this.shadow.on('stun', this.Stun, this);
        this.shadow.on('dead', this.Dead, this);
        this.shadow.on(EntityMessages.HIT_BY_ATTACK, this.HitByAttack, this);
        this.shadow.on(EntityMessages.ACCELERATE, this.AddExternalAcceleration, this);

        // this.scene.events.on('update',this.Update, this)
        this.scene.events.on('travel',() => {this.fsm.clearModule();}, this);
        this.scene.events.on('preupdate', this.Update, this);



        this.scene.physics.world.on('pause', this.Pause, this);
        this.scene.physics.world.on('resume', this.Resume, this);

        this.LandTween = this.scene.tweens.add({
            targets:[this.sprite],
            persist:true,
            scaleX:1, 
            scaleY:1,
            paused:true,
            duration:100
        })
    }

    setName(name:string) {
        this.sprite.setName(name);
        this.shadow.setName(name + '_shadow');
    }


    on(event:string, callback:Function, context:any) {
        this.shadow.on(event, callback, context);
    }

    emit(event:string, ...args:any[]) {
        this.shadow.emit(event, ...args );
    }

    removeListener(event:string, callback:Function, context:any) {
        this.shadow.removeListener(event, callback, context);
    }

    Resume() {
        this.fsm.paused = false;
        if(this.sprite.anims != undefined)
            this.sprite.anims.resume();
    }
    Pause() {
        this.fsm.paused = true;
        if(this.sprite.anims != undefined)
        this.sprite.anims.pause();
    }

    Interact() {

    }

    dispose() {
        this.sprite.removeListener(EntityMessages.ACCELERATE, this.AddExternalAcceleration, this);
        this.scene.events.removeListener('preupdate',this.Update, this);
        this.scene.events.removeListener('travel',() => {this.fsm.clearModule();}, this);
        this.sprite.destroy();
        this.shadow.destroy();
    }

    Update(time:number, dt:number) {
        if(!this.scene.LevelTransition) {
            this.fsm.update(time, dt);
            this.ZVel -= this.ZGravity * (dt/1000);
            this.Z += this.ZVel;
            if(this.Z <= 0) {
                this.Z = 0;
                this.ZVel = 0;
            }
        }
        if(!this.ExternalAccelerationApplied) {
            this.ExternalAcceleration.set(0,0);
        }
        this.ExternalAccelerationApplied = false;



        this.sprite.setPosition(this.shadow.x, this.shadow.y - this.Z - this.HeightOffset);
        this.sprite.setDepth(this.shadow.y);


        if(this.flashing) {
            if(this.sprite.alpha == 1)
                this.sprite.alpha = 0;
            else
                this.sprite.alpha = 1;
            this.flashingRemaining -= dt;
            if(this.flashingRemaining <= 0) {
                this.flashing = false;
                this.sprite.alpha = 1;
            }
        }
    }


    changeFSM(nextFSM:string) {
        this.fsm.changeModule(nextFSM);
    }

    Stun(args:{stunTime:number, returnFSM:string, stunDir?:{x:number, y:number}}) {
        this.fsm.changeModule('stun', args);
    }

    HitByAttack(a:AttackInstance) {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, {damage:a.damage, type:a.type});
    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        
        let combinedAnim = `${this.sprite.name}_${anim}`;
        if(this.AddAnimationSuffix)
            combinedAnim += this.AnimationSuffix;
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        this.sprite.anims.play(combinedAnim, ignoreIfPlaying);
        // this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = combinedAnim;
    }

    Damage(damage:number, attackLocation:Phaser.Math.Vector2): void {
        if(this.flashing)
            return;
        this.Flash(C.LONG_FLASH);
        this.hp -= damage;
        this.hp = Phaser.Math.Clamp(this.hp, 0, this.maxhp);
        this.sprite.emit(EntityMessages.CHANGE_HP, this.hp, this.maxhp);
        if(this.hp == 0) {
            this.sprite.emit('dead');
        }
    }

    Dead() {
        // this.sprite.body.enable = false;
        this.sprite.setVisible(false);
        this.shadow.disableBody(true,true);
        this.fsm.changeModule('nothing');
        this.isDead = true;
    }

    Flash(length:number = 1000) {
        this.flashing = true;
        this.flashingRemaining = length;
    }

    AddExternalAcceleration(x:number = 0, y:number = 0) {
        this.ExternalAcceleration.x += x;
        this.ExternalAcceleration.y += y;
        this.ExternalAccelerationApplied = true;
    }

    /**Stretch and/or squash this sprite.  The x and y parameters are what to set the tween to and
     * duration is how long it should take to set them back to one.
     */
    Land() {
        // this.sprite.scaleX = 1.3;
        // this.sprite.scaleY = .5;
        // this.LandTween.restart();
    }

    SetFacing(facing:FacingEnum) {
        this.Facing = facing;
        this.sprite.flipX = this.Facing == FacingEnum.Left;
    }
}

export enum FacingEnum {
    Right = 1,
    Left = 2, 
    None = 3
}