import { AttackInstance } from "../../attacks/AttackInstance";
import { SceneMessages } from "../../enums/SceneMessages";
import { LevelScene } from "../../scenes/LevelScene";
import { Enemy } from "../Enemy";


export class BlockerKill extends Enemy {
    killsRequired:number = 1;
    totalKills:number = 0;
    constructor(scene:LevelScene, killCount:number) {
        super(scene);
        this.setName('Blocker');
        this.AddAnimationSuffix = false;
        this.maxhp = 10000;
        this.hp = 10000;
        this.PlayAnimation('Down');
        this.HeightOffset = 0;
        this.killsRequired = killCount;
        
        this.gs.events.once(SceneMessages.ScreenTransitionComplete, this.Raise, this);
        this.gs.events.on(SceneMessages.EnemyDead, this.EnemyDead, this);
        

    }

    EnemyDead(name:string) {
        this.totalKills++;
        if(this.totalKills >= this.killsRequired) {
            this.Lower();
            this.gs.events.off(SceneMessages.EnemyDead, this.EnemyDead, this);
            this.gs.events.off(SceneMessages.ScreenTransitionComplete, this.Raise, this);
        }
    }

    dispose(): void {
        this.gs.events.off(SceneMessages.EnemyDead, this.EnemyDead, this);
        this.gs.events.off(SceneMessages.ScreenTransitionComplete, this.Raise, this);
    }

    HitByAttack(a: AttackInstance): void {
        
    }
    HitByStick(): void {
        
    }

    Raise() {
        this.PlayAnimation('Raise');
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(5, this.shadow.x, this.shadow.y);

    }

    Lower() {
        this.PlayAnimation('Lower');
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(1, this.shadow.x, this.shadow.y);
    }

    PostUpdate(): void {
        super.PostUpdate();
        this.sprite.setDepth(this.shadow.y-1000);
    }


    Dead() {
    }

    OverlapPlayer(): void {
        
    }



    static CreateAnimations(scene: Phaser.Scene) {
        scene.anims.create({ key: 'Blocker_Down', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Down_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Up', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Up_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Raise', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Raise_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Lower', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Lower_', end: 3}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Lock', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Lock_', end: 0}), repeat: 0});
        scene.anims.create({ key: 'Blocker_Unlock', frameRate: 6, frames: scene.anims.generateFrameNames('atlas', { prefix: 'Blocker_Unlock_', end: 0}), repeat: 0});

    }
}