import { C } from "../C";
import { EntityInstance } from "../map/LDtkReader";
import { GuiEvents } from "../scenes/GuiScene";
import { LevelScene } from "../scenes/LevelScene";
import { Entity } from "./Entity";

export class Key extends Entity {
    ID:string;
    type:string;
    KeyNum:number;
    constructor(gs:LevelScene, instance:EntityInstance) {
        super(gs);
        this.scene = gs;
        this.setName('Key');
        this.ID = instance.iid;
        this.sprite.setFrame(`Key_${instance.fieldInstances[1].__value}`);
        this.type = `Key_${instance.fieldInstances[1].__value}`;
        this.KeyNum = parseInt(instance.fieldInstances[1].__value);
        this.Interactable = true;

        this.shadow.setSize(instance.width,instance.height-2);
        this.shadow.width = instance.width;
        this.shadow.height = instance.height-2;

    }

    Interact(): void {
        // console.log(`Interacted with Key: ${this.ID}`);
        this.gs.mm.changeFSM('pickup', [this.type, `You got a key!\nIt unlocks doors and chests in this area!` ]);
        C.gd.IDsCollected.push(this.ID);
        C.gd.keys[this.KeyNum]++;
        this.gs.guiScene.events.emit(GuiEvents.UPDATE_KEYS);
        this.Dead();
        this.gs.currentMapPack.collideLayer.putTileAtWorldXY(1, this.shadow.x, this.shadow.y);

    }

}