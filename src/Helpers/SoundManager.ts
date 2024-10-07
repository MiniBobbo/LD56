import { SceneMessages } from "../enums/SceneMessages";

export class SM {
    scene:Phaser.Scene;
    private sfx:SFX[] = [];

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.scene.events.on(SceneMessages.SOUND, (sfx:SFX)=> {this.Play(sfx);}, this);
        this.scene.events.on('update', this.update, this);
    }

    update() {
        let uniqueSfx = Array.from(new Set(this.sfx));
        uniqueSfx.forEach(element => {
            this.scene.sound.play(element);            
        });
        this.sfx = [];
    }

    Play(sfx:SFX) {
        this.sfx.push(sfx);
    }

    static LoadSounds(scene:Phaser.Scene) {
        scene.load.audio(SFX.Fireball, 'assets/sfx/Fireball.wav');
    }


}

export enum SFX {
    Fireball = 'Fireball',
}