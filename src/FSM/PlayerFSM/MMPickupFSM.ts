import { C } from "../../C";
import { MM } from "../../Entities/MM";
import { EntityMessages } from "../../enums/EntityMessages";
import { SFX } from "../../Helpers/SoundManager";
import { FSMModule } from "../FSMModule";

export class MMPickupFSM extends FSMModule {
    mm:MM;
    PickupFrame:string;
    PickupDescription:string;
    PickupTime:number = 1000;


    image:Phaser.GameObjects.Image;
    text:Phaser.GameObjects.BitmapText;
    holding:boolean = false;

    
    moduleStart(args: any[]): void {
        this.PickupTime = 1000;
        this.mm = this.parent as MM;
        this.holding = false;
        this.mm.shadow.setAcceleration(0);
        this.mm.shadow.setVelocity(0);
        if(args != undefined) {
            this.PickupFrame = args[0] as string;
            this.PickupDescription = args[1] as string;
            this.mm.PlayAnimation('Pickup');
        }
    }

    update(dt: number): void {
        if(this.holding)
            return;
        this.PickupTime -= dt;
        if(this.PickupTime <= 0) {
            this.holding = true;
            this.mm.PlayAnimation('Hold');
            this.mm.gs.sound.play(SFX.FoundItem, {volume:C.VolumeMult});
            this.image = this.mm.scene.add.image(this.mm.shadow.x, this.mm.shadow.y - 30, 'atlas', this.PickupFrame);
            this.image.postFX.addGlow();
            this.text = this.mm.scene.add.bitmapText(170,150, '8px', this.PickupDescription).setCenterAlign().setScrollFactor(0,0);
            this.text.x -= this.text.displayWidth/2;
            this.text.y -= (this.text.displayHeight/2);
            this.text.setTint(0xffffff);
            this.text.postFX.addGlow(0x000000,1,0,false, 1,5);
            this.mm.on(EntityMessages.TRY_ATTACK, ()=> {this.mm.changeFSM('move')}, this);
            this.mm.gs.GuiLayer.add(this.image);
            this.mm.gs.GuiLayer.add(this.text);
        }
    }

    moduleEnd(): void {
        this.mm.shadow.setAcceleration(0);
        this.mm.shadow.setVelocity(0);
        this.mm.shadow.setDrag(C.DRAG);
        this.image.destroy();
        this.text.destroy();
        this.mm.removeListener(EntityMessages.TRY_ATTACK, this.moduleEnd, this);
    }

}