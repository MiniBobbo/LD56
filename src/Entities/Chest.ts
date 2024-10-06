import { C } from "../C";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { EntityInstance } from "../map/LDtkReader";
import { GuiEvents } from "../scenes/GuiScene";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class Chest extends Entity {
    ID:string;
    KeyNum:number;
    PickupType:string;
    Opened:boolean = false;
    t:Phaser.GameObjects.BitmapText;
    constructor(gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.scene = gs;
        this.setName('Chest');
        this.ID = instance.iid;
        this.sprite.setFrame('Chest_0');
        this.Interactable = true;
        this.KeyNum = parseInt(instance.fieldInstances[0].__value);
        this.PickupType = instance.fieldInstances[1].__value;
        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;

        this.t = this.scene.add.bitmapText(this.shadow.x, this.shadow.y-16, '8px', 'You need a key to open').setVisible(false);
        this.gs.GuiLayer.add(this.t);
        if(C.gd.IDsCollected.includes(this.ID)) {
            this.sprite.setFrame('Chest_1');
            this.Opened = true;
        }

    }

    dispose(): void {
        this.t.destroy();
        super.dispose();
    }

    Interact(): void {
        if(this.Opened) {
            return;
        }
        if(C.gd.keys[this.KeyNum] == 0) {
            this.t.setVisible(true);
            // this.gs.mm.changeFSM('pickup', ['Chest', `This chest is locked!` ]);
            return;
        }

        let message = '';
        let frame = '';
        switch(this.PickupType) {
            case 'Cheese':
                C.gd.MaxHP++;
                this.gs.mm.maxhp = C.gd.MaxHP;
                this.gs.mm.hp = C.gd.MaxHP;
                message = `You got a small piece of Cheese!\nYou have gained extra health!`;
                frame = 'Icons_1';
                break;
            default:
                break;
        }

        this.sprite.setFrame('Chest_1');
        C.gd.keys[this.KeyNum]--;
        C.gd.keys[this.KeyNum]--;
        this.gs.mm.changeFSM('pickup', [frame, message ]);
        C.gd.IDsCollected.push(this.ID);
        C.gd.keys[this.KeyNum]--;
        this.gs.guiScene.events.emit(GuiEvents.UPDATE_KEYS);
        this.gs.guiScene.events.emit(EntityMessages.CHANGE_HP, this.gs.mm.hp, C.gd.MaxHP);
        
        this.Opened = true;
    }

}