import Phaser from "phaser";
import MergedInput, { Player } from "phaser3-merged-input";
import { C } from "../C";
import { LevelScene } from "./LevelScene";
import { SFX, SM } from "../Helpers/SoundManager";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.BitmapText;
    StartButton:Phaser.GameObjects.Container;
    HintButton:Phaser.GameObjects.BitmapText;
    p1:Player;
    Hints:string[] = [
        'Avoid enemies until you find a weapon',
        'There is only a single chest on the start screen',
        'There is only one dungeon in the game in the game',
        'You have to find the dungeon on your own',
        'You can find cheese in chests.  It gives you more health.',
        'Want to refill your health?  Try dying!',
        'If you have trouble with the boss go find more cheese.',
        'If you are still having trouble with the boss, try playing better!',
        'There are 4 keys in the GUI because there were originally going to be 3 dungeons',
        'That plan went out the window pretty early on',
        'The game is a bit of a Zelda clone',
        'Go left from the start to find the key',
        'It is on an island',
        'There are bushes.  Hit them with the stick',
        'Why are you still reading these?',
        'I am running out of ideas',
    ]
    currentHint:number = 0;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));

        }

        C.sm = new SM(this);
        C.sm.PlayMusic(SFX.Dungeon);

        let  i = this.add.image(20,-20, 'atlas', 'SacredSwiss_2').setOrigin(0,0).setScale(2);
        let glow = i.postFX.addGlow(0xffffbb, 1);
        let t = this.tweens.add({

            targets: glow,
            outerStrength: 3,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });

        this.Title = this.add.bitmapText(20,50, '8px', 'Mortimer Mouse\nand the search for the\nSacred Swiss').setOrigin(0,0).setCenterAlign().setMaxWidth(300).setScale(3);
        this.Title.postFX.addGlow(0x000000);
        this.add.bitmapText(50,185,'8px','Definitely not a Zelda Ripoff').setTint(0xff0000);
        this.StartButton = this.CreateButton('Start Game', this.StartGame).setScale(2).setPosition(95,200);
        this.CreateButton('SFX Volume Up', ()=>{ C.VolumeMult = Phaser.Math.Clamp(C.VolumeMult += .1, 0,1); C.sm.Play(SFX.Fireball); }).setPosition(250,200);
        this.CreateButton('SFX Volume Down', ()=>{ C.VolumeMult = Phaser.Math.Clamp(C.VolumeMult -= .1, 0,1); C.sm.Play(SFX.Fireball); }).setPosition(250,215);
        this.CreateButton('Music Volume Up', ()=>{ C.MusicVolumeMult = Phaser.Math.Clamp(C.MusicVolumeMult += .1, 0,1); C.Music.setVolume(C.MusicVolumeMult);}).setPosition(350,200);
        this.CreateButton('Music Volume Down', ()=>{ C.MusicVolumeMult = Phaser.Math.Clamp(C.MusicVolumeMult -= .1, 0,1); C.Music.setVolume(C.MusicVolumeMult);}).setPosition(350,215);
        this.HintButton = this.add.bitmapText(50, 250, '8px', 'Click on me to get some hints before you start the game!').setInteractive().setTint(0x55ff55);
        this.HintButton.on('pointerdown', this.NextHint, this);

        this.add.bitmapText(300, 50, '6px', 'A game for LD56\n - Tiny Creatures - \nBy MiniBobbo').setOrigin(0,0).setMaxWidth(300);
        this.add.bitmapText(300, 100, '6px', 'Controls\nWASD or Arrow Keys Move\nMouse Attacks and Interacts').setOrigin(0,0).setMaxWidth(300);
    }

    StartGame(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        // this.scene.add('level', LevelScene, false);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ 
            this.scene.start('level');
            // this.scene.start('level', 'test');
        })
    }

    update(time:number, dt:number) {

    }

    NextHint(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        this.HintButton.setText(this.Hints[this.currentHint]);
        this.currentHint++;
        if(this.currentHint >= this.Hints.length)
            this.currentHint = 0;
    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.bitmapText(0,0,'8px',text).setInteractive().setTint(0x55ff55);
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}