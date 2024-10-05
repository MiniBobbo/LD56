import { AttackInstance } from "../attacks/AttackInstance";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { MMAttackFSM } from "../FSM/PlayerFSM/MMAttackFSM";
import { MMGroundFSM } from "../FSM/PlayerFSM/MMGroundFSM";
import { MMKnockbackFSM } from "../FSM/PlayerFSM/MMKnockbackFSM";
import { IH } from "../IH/IH";
import { LevelScene } from "../scenes/LevelScene";
import { Entity, FacingEnum } from "./Entity";

export class MM extends Entity {
    attacking:boolean;
    ih:IH;

    JumpStrength:number = 1;

    attackSprite:Phaser.GameObjects.Sprite;
    PointerAngleDeg:number;

    private attackCooldown:number = 0;
    constructor(scene:LevelScene, ih:IH) {
        super(scene);
        // this.hp = this.maxhp = 10;
        this.ih = ih;
        this.setName('Mouse');
        this.PlayAnimation('Stand');
        // this.sprite.setGravityY(100);
        this.fsm.addModule('attack', new MMAttackFSM(this, this.fsm));
        this.fsm.addModule('move', new MMGroundFSM(this, this.fsm));
        this.fsm.addModule('knockback', new MMKnockbackFSM(this, this.fsm));
        this.fsm.changeModule('move');

        this.attackSprite = scene.add.sprite(0,0, 'atlas', 'Stick_0');

        this.scene.Players.add(this.shadow);

        

        this.on(EntityMessages.POINTER_POS, (p:{x:number, y:number})=> {this.PointerAngleDeg = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(this.shadow, p));
            this.scene.events.emit('debug', `Pointer angle: ${this.PointerAngleDeg}`, true);
        }, this);

        this.emit(EntityMessages.CHANGE_HP, 5,5);
    }


    HitByAttack(a:AttackInstance): void {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, a.damage);
    }

    Damage(damage: number, attackLocation:Phaser.Math.Vector2): void {
        if(this.flashing)
            return;
        this.fsm.changeModule('knockback', attackLocation);    
        this.scene.cameras.main.shake(100,.02);    
        super.Damage(damage, attackLocation);
        if(this.hp <=0) {
            // this.gs.physics.pause();
            this.gs.events.emit(EntityMessages.PLAYER_DEAD);
        }
    }

    changeFSM(nextFSM:string) {
        // console.log(`Changing to ${nextFSM}`);
        this.fsm.changeModule(nextFSM);
    }


    TryAttack() {
        if(this.attackCooldown > 0)
            return;
        let angle = Phaser.Math.Angle.Between(this.shadow.x, this.shadow.y, this.gs.Pointer.x, this.gs.Pointer.y);
        let position = new Phaser.Math.Vector2(8, 0);
        position.rotate(angle);
        this.scene.debugGraphics.clear();

        let o = {x:this.shadow.x + position.x, y:this.shadow.y + position.y, angle:angle};
        this.scene.debugGraphics.strokeCircle(o.x, o.y, 8);
        // this.scene.BA.LaunchAttack(o, AttackTypes.StickSwing);

        // let o = {x:this.shadow.body.x + position.x, y:this.shadow.body.y + position.y, angle:angle};
        position = new Phaser.Math.Vector2(20, 0);
        position.rotate(angle);
        o = {x:this.shadow.body.center.x + position.x, y:this.shadow.body.center.y + position.y, angle:angle};
        
        this.scene.debugGraphics.strokeCircle(o.x, o.y, 8);

        this.attackSprite.setPosition(this.shadow.x, this.shadow.y);
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
        scene.anims.create({ key: 'Mouse_Attack_Down', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Attack_Down_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Mouse_Attack_Up', frameRate: 30, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Mouse_Attack_Up_', end: 3}), repeat: 0});
        
    }

}