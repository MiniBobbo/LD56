import { C } from "../C";
import { AttackMessages } from "../enums/AttackMessages";
import { AttackTypes } from "../enums/AttackTypes";
import { DamageTypes } from "../enums/DamageTypes";
import { EffectTypes } from "../enums/EffectTypes";
import { LevelScene } from "../scenes/LevelScene";
import { AttackInstance } from "./AttackInstance";

export class AttackManager {
    scene:LevelScene;
    active:boolean;
    AttackGroup:AttackInstance[];

    constructor(scene:LevelScene) {
        this.scene = scene;
        this.AttackGroup = [];
    }
    
    LaunchAttack(origin:{x:number, y:number, angle:number}, type:AttackTypes) {
        let a = this.AttackGroup.find(e=>!e.alive);  
        if(a == undefined) {
            a = new AttackInstance(this.scene);
            this.AttackGroup.push(a);
            a.s.name = 'Attack';
            this.scene.Midground.add(a.s);
            a.s.setData('AttackInstance', a);
            this.scene.CollidePlayer.add(a.s);
        }
        a.s.angle = 0;
        a.alive = true;

        a.s.setAngularVelocity(0);
        a.damage = 1;
        a.lifetime = 5000;
        a.FirstFrame = true;
        a.s.enableBody(true, origin.x, origin.y, true, true);
        switch (type) {
            case AttackTypes.Fireball:
                a.s.setCircle(4);
                a.damage = 1;
                a.PlayAnimation('Fireball');
                a.s.rotation = (origin.angle);
                let vel = new Phaser.Math.Vector2(150,0);
                vel.rotate((origin.angle));
                a.s.setVelocity(vel.x, vel.y);
            break;
        }
        
        
    }

    CollideWallDefault(a:AttackInstance) {
        this.scene.events.emit('effect', {x:a.s.body.x, y:a.s.body.y, right:true}, EffectTypes.Generic);
        a.dead();
    }

    static CreateAnimations(scene:Phaser.Scene) {
        scene.anims.create({ key: 'Attack_Fireball', frameRate: 60, frames: scene.anims.generateFrameNames('atlas', { prefix: 'fireball_', end: 29}), repeat: -1});
    }

}

export interface IAttackData {
    damage:number,
    type:DamageTypes
}