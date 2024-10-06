import { Enemy } from "../Entities/Enemy";
import { EntityInstance } from "../map/LDtkReader";
import { LevelScene } from "../scenes/LevelScene";

export class AppearText extends Enemy {
    gs:LevelScene;
    text:string;
    speed:number = 50;
    display:string;
    position:number;

    bt:Phaser.GameObjects.BitmapText;
    t:Phaser.Time.TimerEvent;

    constructor(name:string, gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.scene = gs;

        this.text = instance.fieldInstances[0].__value;
        this.display = '';
        this.bt = this.gs.add.bitmapText(150,80,'8px', '').setMaxWidth(300).setScrollFactor(0,0);
        this.position = 0;

        this.setName('Appear Text');
        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;
        this.shadow.setGravityY(0);
        // this.sprite.setOrigin(0,0);
        this.shadow.setCollideWorldBounds(true);
        this.shadow.setVisible(false);
        this.sprite.setVisible(false);

        this.gs.GuiLayer.add(this.bt);

    }

    OverlapPlayer() {
        this.sprite.destroy();
        this.shadow.destroy();
        console.log(`Overlapped : ${this.shadow.name}`);
        this.t = this.gs.time.addEvent({
            delay: this.speed,
            callback: this.NextLetter,
            callbackScope: this,
            loop: true
        });
    }

    dispose(): void {
        this.t.remove();
        this.bt.destroy();
        super.dispose();
    }

    NextLetter() {
        this.bt.text += this.text[this.position];
        this.bt.x = 170 - this.bt.width/2;
        this.position++;
        if(this.position == this.text.length-1) {
            this.t.remove();
        }
    }
}