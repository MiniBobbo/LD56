import { GameObjects } from "phaser";
import { AttackInstance } from "../attacks/AttackInstance";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { EffectTypes } from "../enums/EffectTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { MMAttackFSM } from "../FSM/PlayerFSM/MMAttackFSM";
import { MMEndFSM } from "../FSM/PlayerFSM/MMEndFSM";
import { MMGroundFSM } from "../FSM/PlayerFSM/MMGroundFSM";
import { MMKnockbackFSM } from "../FSM/PlayerFSM/MMKnockbackFSM";
import { IH } from "../IH/IH";
import { LevelScene } from "../scenes/LevelScene";
import { Entity, FacingEnum } from "./Entity";
import { MMPickupFSM } from "../FSM/PlayerFSM/MMPickupFSM";
import { SFX } from "../Helpers/SoundManager";

export class MM extends Entity {
    attacking:boolean;
    ih:IH;

    JumpStrength:number = 1;

    attackSprite:Phaser.GameObjects.Sprite;
    PointerAngleDeg:number;

    HasStick:boolean = false;

    private attackCooldown:number = 0;
    constructor(scene:LevelScene, ih:IH) {
        super(scene);
        this.hp = this.maxhp = 8;
        this.ih = ih;
        this.setName('Mouse');
        this.PlayAnimation('Stand');
        // this.sprite.setGravityY(100);
        this.fsm.addModule('attack', new MMAttackFSM(this, this.fsm));
        this.fsm.addModule('end', new MMEndFSM(this, this.fsm));
        this.fsm.addModule('move', new MMGroundFSM(this, this.fsm));
        this.fsm.addModule('pickup', new MMPickupFSM(this, this.fsm));
        this.fsm.addModule('knockback', new MMKnockbackFSM(this, this.fsm));
        this.fsm.changeModule('move');

        this.attackSprite = scene.add.sprite(0,0, 'atlas', 'Stick_0');
        this.gs.GuiLayer.add(this.attackSprite);

        this.scene.Players.add(this.shadow);

        

        this.on(EntityMessages.POINTER_POS, (p:{x:number, y:number})=> {
            this.PointerAngleDeg = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(this.shadow, p));
            this.scene.events.emit('debug', `Pointer angle: ${this.PointerAngleDeg}`, true);
        }, this);

    }


    HitByAttack(a:AttackInstance): void {
        a.dead();
        this.shadow.emit(EntityMessages.TAKE_DAMAGE, a.damage, a.s.getCenter());
    }

    Damage(damage: number, attackLocation:Phaser.Math.Vector2): void {
        if(this.flashing)
            return;
        this.fsm.changeModule('knockback', attackLocation);    
        this.scene.cameras.main.shake(100,.02);    
        super.Damage(damage, attackLocation);
        this.gs.guiScene.events.emit(EntityMessages.CHANGE_HP, this.hp, this.maxhp);
        this.gs.sound.play(SFX.PlayerHit, {volume:C.VolumeMult});
        if(this.hp <=0) {
            // this.gs.physics.pause();
            this.gs.events.emit(EntityMessages.PLAYER_DEAD);
            this.changeFSM('end');
            this.flashingRemaining = 2000;
        }
    }

    changeFSM(nextFSM:string, args?:any[]) {
        // console.log(`Changing to ${nextFSM}`);
        this.fsm.changeModule(nextFSM, args);
    }


    TryAttack() {
        if(this.attackCooldown > 0)
            return;
        //First, try to interact
        let angle = Phaser.Math.DegToRad(this.PointerAngleDeg);
        let position = new Phaser.Math.Vector2(16, 0);
        position.rotate(angle);
        this.scene.debugGraphics.clear();



        let o = {x:this.shadow.x + position.x, y:this.shadow.y + position.y, angle:angle};
        this.scene.debugGraphics.strokeCircle(o.x, o.y, 8);

        let targets = this.scene.physics.overlapCirc(o.x, o.y, 8);
        let interacted:boolean = false;
        targets.forEach(element => {
            let e = element.gameObject.getData('Entity') as Entity;
            if(e != undefined && !e.isDead && e.Interactable) {
                e.Interact();
                interacted = true;
            }
        });

        if(interacted)
            return;

        if(!this.HasStick)
            return;
        this.gs.sound.play(SFX.Stick, {volume:C.VolumeMult});

        angle = Phaser.Math.DegToRad(this.PointerAngleDeg);
        position = new Phaser.Math.Vector2(16, 0);
        position.rotate(angle);

        o = {x:this.shadow.x + position.x, y:this.shadow.y + position.y, angle:angle};
        this.scene.debugGraphics.strokeCircle(o.x, o.y, 8);
        // this.scene.BA.LaunchAttack(o, AttackTypes.StickSwing);

        // let o = {x:this.shadow.body.x + position.x, y:this.shadow.body.y + position.y, angle:angle};
        position = new Phaser.Math.Vector2(32, 0);
        position.rotate(angle);
        o = {x:this.shadow.body.center.x + position.x, y:this.shadow.body.center.y + position.y, angle:angle};
        
        this.scene.debugGraphics.strokeCircle(o.x, o.y, 8);

        targets = this.scene.physics.overlapCirc(o.x, o.y, 8);
        targets.forEach(element => {
            element.gameObject.emit(EntityMessages.HIT_BY_STICK);
        });
            
        this.attackSprite.setPosition(this.shadow.x, this.shadow.y);
        this.attackSprite.setDepth(this.attackSprite.y);
        this.attackSprite.setAngle(Phaser.Math.RadToDeg(angle));
        this.attackSprite.scaleX = .01;
        this.attackSprite.setVisible(true);
        this.scene.tweens.add({
            targets: this.attackSprite,
            scaleX: 1,
            duration: 100,
            // onComplete: ()=>{this.attackSprite.setVisible(false);}
        });
        this.shadow.setVelocity(0,0);
        this.shadow.setAcceleration(0,0);
        this.shadow.setAcceleration(0,0);
        this.changeFSM('attack');
        
        
        // this.scene.BA.LaunchAttack(o, AttackTypes.StickSwing);
        // var debugmessage = `Attacking at ${o.x}, ${o.y}\n`;
        // debugmessage += `shadow position: ${this.shadow.x}, ${this.shadow.y}\n`; 
        // debugmessage += `position: ${position.x}, ${position.y}\n`; 
        // debugmessage += `angle: ${Phaser.Math.RadToDeg(angle)}`;
        // this.scene.events.emit('debug', debugmessage, true);

    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
        // this.scene.events.emit('debug', `FSM: ${this.fsm.currentModuleName}`);
    }

    static CreateAnimations(scene:Phaser.Scene) {
        scene.anims.create({ key: 'Mouse_Stand_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Stand_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Mouse_Stand_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Stand_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Mouse_Walk_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Walk_Down_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Mouse_Walk_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Walk_Up_', end: 3}), repeat: -1});
        scene.anims.create({ key: 'Mouse_Attack_Down', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Attack_Down_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Attack_Up', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Attack_Up_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Pickup_Down', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Pickup_Down_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Pickup_Up', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Pickup_Up_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Hold_Down', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Hold_Down_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Hold_Up', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Hold_Up_', end: 0}), repeat: 0});
        
    }

}