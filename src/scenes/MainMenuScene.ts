import Phaser from "phaser";
import MergedInput, { Player } from "phaser3-merged-input";
import { C } from "../C";
import { LevelScene } from "./LevelScene";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;
    private mergedInput?: MergedInput;
    p1:Player;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));

        }

        // this.cameras.main.setBackgroundColor(0xff00ff);

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);

    }

    StartGame(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.scene.add('level', LevelScene, false);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ 
            this.scene.start('level', {levelName:'levels'});
            // this.scene.start('level', 'test');
        })
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {
        if (['DOWN'].filter(x => this.p1.interaction.pressed.includes(x)).length) {
            // Player one has just pressed one of the following buttons - B8, B9 or B0.
            // The 'pressed' interaction flag differs from interrogating the buttons directly. It will contain the button(s) pressed for a single update tick, as it happens.
            // Here we're comparing an array of button names to the array of buttons pressed in the step.
            console.log('JustPressed Down');
        }        if(this.p1.direction.DOWN)
            console.log('Pressing down');
    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text).setInteractive();
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}