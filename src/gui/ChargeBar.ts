import { threadId } from "worker_threads";
import { Entity } from "../Entities/Entity";
import { EntityMessages } from "../enums/EntityMessages";
import { LevelScene } from "../scenes/LevelScene";

export class Chargebar {
    c:Phaser.GameObjects.Container;
    s:LevelScene;
    maxValue:number;
    currentValue:number;
    private percent:number;
    private mainbar:Phaser.GameObjects.Graphics;
    private followbar:Phaser.GameObjects.Graphics;

    private width:number;
    private height:number;
    constructor(s:LevelScene, width:number = 10, height:number = 100) {
        this.width = width;
        this.height = height;
        this.s = s;
        this.c = s.add.container(0,0).setScrollFactor(0,0);
        s.GuiLayer.add(this.c);
        let bg = s.add.graphics({
            lineStyle:{width:1, color:0xfffffff},
            fillStyle:{color:0}
        });
        bg.fillRect(1,1,width-2,height-2);
        bg.strokeRect(0,0,width,height);
        this.c.add(bg);
        this.s.GuiLayer.add(this.c);
        this.mainbar = s.add.graphics( {
            fillStyle:{color:0xffcccc00}
        });
        this.mainbar.fillRect(0,1,width-1,height-1);
        this.mainbar.scaleY = 0;
        this.c.add(this.mainbar);   

    }

    SetPosition(x:number, y:number):Chargebar {
        this.c.setPosition(x, y);
        return this;
    }
    LinkEntity(e:Entity, eventMessage:EntityMessages, minValue:number, maxValue:number) {
        this.maxValue = minValue;
        this.currentValue = maxValue;
        e.sprite.on(eventMessage, (newValue:number) => {
            this.currentValue = newValue;
            this.percent = newValue/this.maxValue;
            this.mainbar.scaleY = this.percent;
        });

        
    }   
}