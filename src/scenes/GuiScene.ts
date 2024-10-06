import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "./LevelScene";

export class GuiScene extends Phaser.Scene {
    cheeses:Phaser.GameObjects.Image[];
    weapon:Phaser.GameObjects.Image;
    create() {
        this.cameras.main.setBackgroundColor(0x000000)
        .setSize(100, 300)
        .setPosition(348,5);
        this.add.nineslice(0,0, '9box', null, 100, 300, 6,6,6,6).setOrigin(0,0);
        let lifeText = this.add.bitmapText(10,10, '6px', '- LIFE -', 12)
        // .setScale(1.5)
        .setTint(0xff0000)
        .setCenterAlign();
        lifeText.x = (100 - lifeText.displayWidth) / 2;
        let weaponText = this.add.bitmapText(25,70, '6px', '- WEAPON -', 12)
        // .setScale(1.5)
        .setTint(0xff0000);
        weaponText.x = (100 - weaponText.displayWidth) / 2;
        this.weapon = this.add.image(30, 90, 'atlas', 'Stick_0');
        this.weapon.postFX.addGlow();


        this.cheeses = [];
        for(let i =0; i < 6; i++) {
            let c = this.add.image(0,0,'atlas', 'Icons_1');
            this.cheeses.push(c);
        }

        Phaser.Actions.GridAlign(this.cheeses, {
            width: 3,
            height: 2,
            cellWidth: 30,
            cellHeight: 25,
            x: 10,
            y: 20
        });


        this.events.on(EntityMessages.CHANGE_HP, (hp:number, maxhp:number)=> {
            this.ChangeHP(hp, maxhp);
        });

        let gs = this.scene.get('level') as LevelScene;
        this.ChangeHP(3,3);
    }

    ChangeHP(hp:number, maxhp:number) {
        for(let i = 0; i < this.cheeses.length; i++) {
            if(i < hp) {
                this.cheeses[i].setVisible(true);
                this.cheeses[i].setFrame('Icons_1');
            } else if(i < maxhp) {
                this.cheeses[i].setVisible(true);
                this.cheeses[i].setFrame('Icons_0');
            } else {
                this.cheeses[i].setVisible(false);
            }
        }

    }
}