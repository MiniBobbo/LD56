import { C } from "../C";
import { EntityMessages } from "../enums/EntityMessages";
import { SceneMessages } from "../enums/SceneMessages";
import { LevelScene } from "./LevelScene";

export class GuiScene extends Phaser.Scene {
    cheeses:Phaser.GameObjects.Image[];
    weapon:Phaser.GameObjects.Image;
    keyTexts:Phaser.GameObjects.BitmapText[] = [];
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
        let weaponText = this.add.bitmapText(25,90, '6px', '- WEAPON -', 12)
        // .setScale(1.5)
        .setTint(0xff0000);
        weaponText.x = (100 - weaponText.displayWidth) / 2;
        this.weapon = this.add.image(30, 110, 'atlas', 'Stick_0').setVisible(false);
        this.weapon.postFX.addGlow();
        let keyText = this.add.bitmapText(25,260, '6px', '- KEYS -', 12)
        // .setScale(1.5)
        .setTint(0xff0000);
        keyText.x = (100 - keyText.displayWidth) / 2;
        let keys:Phaser.GameObjects.Image[] = [];
        for(let i = 0; i < 4; i++) {
            let key = this.add.image(10+ i * 10, 90 , 'atlas', `Key_${i}`);
            keys.push(key);
            let kt = this.add.bitmapText(10, 90 + i * 10, '6px', '0', 12);
            kt.x = (100 - kt.displayWidth) / 2;
            this.keyTexts.push(kt);
        }
        Phaser.Actions.GridAlign(keys, {
            width: 4,
            height: 1,
            cellWidth: 20,
            cellHeight: 20,
            x: 10,
            y: 270
        });
        Phaser.Actions.GridAlign(this.keyTexts, {
            width: 4,
            height: 1,
            cellWidth: 20,
            cellHeight: 20,
            x: 12,
            y: 270
        });


        this.cheeses = [];
        for(let i =0; i < 12; i++) {
            let c = this.add.image(0,0,'atlas', 'Icons_1');
            this.cheeses.push(c);
        }

        Phaser.Actions.GridAlign(this.cheeses, {
            width: 4,
            height: 3,
            cellWidth: 20,
            cellHeight: 20,
            x: 10,
            y: 20
        });


        this.events.on(EntityMessages.CHANGE_HP, (hp:number, maxhp:number)=> {
            this.ChangeHP(hp, maxhp);
        });
        this.events.on(GuiEvents.ChangeWeapon, (weapon:string)=> {
            this.weapon.setVisible(true);
            this.weapon.setFrame(weapon + '_0');
        });

        this.events.on(GuiEvents.UPDATE_KEYS, ()=> {
            for(let i = 0; i < this.keyTexts.length; i++) {
                this.keyTexts[i].setText(C.gd.keys[i] + "");
            }
        });

        let gs = this.scene.get('level') as LevelScene;
        this.ChangeHP(8,8);

        this.MakeSwiss();
    }

    swiss:Phaser.GameObjects.Image[] = [];
    swissStart:number = 190;
    MakeSwiss() {
        let swissText = this.add.bitmapText(25,150, '6px', '- THE SACRED SWISS -', 12)
        // .setScale(1.5)
        .setTint(0xff0000);
        swissText.x = (100 - swissText.displayWidth) / 2;
        let s1 = this.add.image(51,this.swissStart, 'atlas', 'SacredSwiss_0');
        let s2 = this.add.image(30,this.swissStart+40, 'atlas', 'SacredSwiss_0');
        let s3 = this.add.image(70,this.swissStart+40, 'atlas', 'SacredSwiss_0');
        this.swiss.push(s1);
        this.swiss.push(s2);
        this.swiss.push(s3);

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

    ChangeSwissNumber(count:number) {
        for(let i = 0; i < 3; i++) {
            if(i < count) {
                this.swiss[i].setFrame('SacredSwiss_1');
            } else {
                this.swiss[i].setFrame('SacredSwiss_0');
            }        
        }
    }
}

export enum GuiEvents {
    ChangeHP = 'change_hp',
    ChangeWeapon = 'change_weapon',
    UPDATE_KEYS = 'update_keys'
}