import { Enemy } from "../Entities/Enemy";
import { EnemyTypes } from "../enums/EnemyTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { EntityInstance } from "../map/LDtkReader";
import { LevelScene } from "../scenes/LevelScene";

export class Cutscene extends Enemy{
    parts:CutscenePart[];
    activePart:CutscenePart;
    Name:string;

    constructor(name:string, gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.Name = name;
        this.scene = gs;
        this.parts = [];

        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;
        this.shadow.setName('Cutscene');
        this.shadow.setGravityY(0);
        // this.sprite.setOrigin(0,0);
        this.shadow.setCollideWorldBounds(true);
        this.shadow.setVisible(false);
        this.sprite.setVisible(false);

    }

    OverlapPlayer() {
        this.sprite.destroy();
        this.shadow.destroy();
        console.log(`Overlapped Cutscene: ${this.Name}`);
        this.Start();
    }


    Start() {
        this.Step();

    }

    End() {
    }

    Update(time:number, dt:number) {
        if(this.activePart != null)
            this.activePart.Update(dt);
    }

    Step() {
        if(this.parts.length > 0) {
            if(this.activePart != null) 
                this.activePart.End();
            this.activePart = this.parts.shift();
            this.activePart.Start();
        } else {
            this.activePart = null;
            this.End();
        }
    }
}

export class CutscenePart {
    cs:any;
    time:number = 1000;
    elapsed:number = 0;
    constructor(cs:Cutscene, time:number) {
        this.cs = cs;
        this.time = time;
    }
    
    Start() {

    }

    End() {

    }

    Update(dt:number) {
        this.elapsed += dt;
        if(this.elapsed >= this.time) {
            this.cs.Step();
        }
    }
}