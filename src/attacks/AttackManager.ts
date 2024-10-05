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
            this.scene.Midground.add(a.s);
            a.s.setData('AttackInstance', a);
        }
        a.s.angle = 0;
        a.s.setAngularVelocity(0);
        a.damage = 2;
        a.lifetime = 5000;
        a.FirstFrame = true;
        switch (type) {
            case AttackTypes.StickSwing:
                a.alive = true;
                a.damage = 1;
                a.lifetime = 200;
                a.s.setFrame('StickAttack_0')
                a.s.setCircle(8)
                // .setOrigin(.5,.5)
                // .setFrame('StickAttack_0')
                .setVisible(false)
                // .setOffset(0,0)
                .setOrigin(.5,.5)

                // .setRotation(origin.angle)
                
                // .setOffset(.5,.5)
                .enableBody()
                .setPosition(origin.x, origin.y)
                // .enableBody(true, origin.x - a.s.body.width/2, origin.y - a.s.body.height/2, true,true)
                .setVelocity(0,0);
                this.scene.events.emit('debug', `Attack position: ${a.s.x}, ${a.s.y}`); 
        
            break;
            case AttackTypes.Stick:
                let vel = new Phaser.Math.Vector2(C.STICK_VELOCITY, 0);
                vel.rotate(origin.angle);
                a.alive = true;
                a.damage = 1;
                a.lifetime = 200;
                a.s.setCircle(6)
                .setOrigin(.5,.5)
                .setFrame('StickAttack_0')
                // .setOffset(15,25)

                .setRotation(origin.angle)
                
                // .setOffset(.5,.5)
                .enableBody(true, origin.x, origin.y, true,true)
                .setVelocity(vel.x, vel.y);

                break;
        }
        
        
    }
    CollideWallDefault(a:AttackInstance) {
        this.scene.events.emit('effect', {x:a.s.body.x, y:a.s.body.y, right:true}, EffectTypes.Generic);
        a.dead();
    }
}

export interface IAttackData {
    damage:number,
    type:DamageTypes
}