import { threadId } from "worker_threads";
import { Entity } from "../Entities/Entity";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";

export class Lifebar {
    c:Phaser.GameObjects.Container;
    s:LevelScene;
    maxHP:number;
    currentHP:number;
    percent:number;
    hearts:Array<Phaser.GameObjects.Sprite>;

    //Lazy.  The highest number of hearts we can display.
    MAX_HEALTH:number = 10;
    constructor(s:LevelScene) {
        this.s = s;
        this.hearts = [];
        this.c = s.add.container(0,0).setScrollFactor(0,0);
        s.GuiLayer.add(this.c);

        //I'm going to just make 10 hearts and only display the ones that I need because I'm lazy.
        for(let i = 0 ; i < this.MAX_HEALTH; i++) {
            let h = s.add.sprite(i*14, 0,'atlas', 'Hearts_0')
            .setOrigin(0,0)
            .setVisible(false);
            this.c.add(h);
            this.hearts.push(h);
        }
    }

    SetPosition(x:number, y:number):Lifebar {
        this.c.setPosition(x, y);
        return this;
    }
    LinkEntity(e:Entity) {
        this.maxHP = e.maxhp;
        this.currentHP = e.hp;
        this.UpdateGraphics();
        e.sprite.on(EntityMessages.CHANGE_HP, (hp:number, maxhp:number) => {
            this.maxHP = maxhp;
            this.currentHP = hp;
            this.UpdateGraphics();
        });
    }   

    UpdateGraphics() {
        for(let i = 0; i < this.hearts.length; i++) {
            if(i < this.currentHP) {
                this.hearts[i].setVisible(true).setFrame('Hearts_0');
            } else if ( i < this.maxHP) {
                this.hearts[i].setVisible(true).setFrame('Hearts_1');
            } else
                this.hearts[i].setVisible(false);
        }
    }
}