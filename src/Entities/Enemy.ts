import { AttackInstance } from "../attacks/AttackInstance";
import { C } from "../C";
import { AttackTypes } from "../enums/AttackTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";
import { Entity, FacingEnum } from "./Entity";

export class Enemy extends Entity {
    CollideDamage:number = 1;
    
    constructor(scene:LevelScene) {
        super(scene);
        this.sprite.setSize(24, 24);
        this.sprite.setName('BasicBaddie');
        this.hp = 5;
        this.maxhp = 5;
        this.scene.CollideMap.add(this.sprite);
        this.scene.Enemies.add(this.sprite);
        this.scene.Midground.add(this.sprite);

        

        // this.Facing = FacingEnum.Left;

        this.sprite.setData(this);

        this.sprite.on(EntityMessages.OVERLAP_PLAYER, this.OverlapPlayer, this);
    }

    HitByAttack(a:AttackInstance): void {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, a.damage);
    }

    OverlapPlayer() {
        if (!this.flashing)
            this.scene.mm.sprite.emit(EntityMessages.TAKE_DAMAGE, this.CollideDamage);
    }

    Damage(damage:number, type:AttackTypes): void {
        if(this.flashing)
            return;
        this.Flash(C.SHORT_FLASH);
        this.hp -= damage;
        this.hp = Phaser.Math.Clamp(this.hp, 0, this.maxhp);
        this.sprite.emit(EntityMessages.CHANGE_HP, this.hp, this.maxhp);
        if(this.hp == 0) {
            this.sprite.emit('dead');
        }
    }

}