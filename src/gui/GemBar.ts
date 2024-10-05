import { C } from "../C";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "../scenes/LevelScene";

export class GemBar {
    c:Phaser.GameObjects.Container;
    s:LevelScene;
    Diamond:Phaser.GameObjects.BitmapText;
    Emerald:Phaser.GameObjects.BitmapText;
    Gold:Phaser.GameObjects.BitmapText;

    constructor(s:LevelScene) {
        this.s = s;
        this.c = s.add.container(0,0).setScrollFactor(0,0);
        s.GuiLayer.add(this.c);
        //Diamond
        let d = s.add.image(0,0, 'atlas', 'upgrade_diamond_0').setOrigin(0,0);
        this.c.add(s.add.bitmapText(13,0, '8px', 'X'));
        this.Diamond = s.add.bitmapText(18,0, '6px', C.gd.Diamond.toString());
        this.c.add(d);
        this.c.add(this.Diamond);

        //Gold
        let g = s.add.image(0,14, 'atlas', 'upgrade_gold_0').setOrigin(0,0);
        this.c.add(s.add.bitmapText(13,15, '8px', 'X'));
        this.Gold = s.add.bitmapText(18,15, '6px', C.gd.Gold.toString());
        this.c.add(g);
        this.c.add(this.Gold);
        //Emerald
        let e = s.add.image(0,28, 'atlas', 'upgrade_emerald_0').setOrigin(0,0);
        this.c.add(s.add.bitmapText(13,30, '8px', 'X'));
        this.Emerald = s.add.bitmapText(18,30, '6px', C.gd.Emerald.toString());
        // this.Emerald = s.add.bitmapText(30,30, '8px', '0');
        this.c.add(e);
        this.c.add(this.Emerald);

        s.events.on(SceneMessages.ChangeGems, this.UpdateGraphics, this);
    }

    SetPosition(x:number, y:number):GemBar {
        this.c.setPosition(x, y);
        return this;
    }

    UpdateGraphics() {
        let gd = C.gd;
        this.Diamond.setText(C.gd.Diamond + "");
        this.Gold.setText(C.gd.Gold + "");
        this.Emerald.setText(C.gd.Emerald + "");
    }

}