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
        this.setName('Pillbug');
        this.hp = 5;
        this.maxhp = 5;
        this.scene.CollideMap.add(this.shadow);
        this.scene.Enemies.add(this.shadow);
        this.scene.Background.add(this.shadow);
        this.scene.Midground.add(this.sprite);

        

        // this.Facing = FacingEnum.Left;

        this.shadow.on(EntityMessages.OVERLAP_PLAYER, this.OverlapPlayer, this);
    }

    HitByAttack(a:AttackInstance): void {
        a.dead();
        this.sprite.emit(EntityMessages.TAKE_DAMAGE, a.damage);
    }

    OverlapPlayer() {
        if (!this.flashing)
            this.scene.mm.emit(EntityMessages.TAKE_DAMAGE, this.CollideDamage, this.shadow.getCenter());
    }

    Damage(damage:number, attackLocation:Phaser.Math.Vector2): void {
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