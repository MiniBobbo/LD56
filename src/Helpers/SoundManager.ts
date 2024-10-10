import { C } from "../C";
import { SceneMessages } from "../enums/SceneMessages";

export class SM {
    scene:Phaser.Scene;
    private sfx:SFX[] = [];



    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.scene.events.on(SceneMessages.SOUND, (sfx:SFX)=> {this.Play(sfx);}, this);
        this.scene.events.on('preupdate', this.update, this);
    }

    update() {
        let uniqueSfx = Array.from(new Set(this.sfx));
        uniqueSfx.forEach(element => {
            this.scene.sound.play(element, {volume:C.VolumeMult});            
        });
        this.sfx = [];
    }

    PlayMusic(music:SFX) {
        if (C.Music && C.Music.key == music) {
            return;
        } 
        if (C.Music && C.Music.key != music) {
            C.Music.destroy();
        } 
        let musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        C.Music = this.scene.sound.add(music, musicConfig);
        C.Music.play();
    }

    Play(sfx:SFX) {
        this.sfx.push(sfx);
    }

    static LoadSounds(scene:Phaser.Scene) {
        scene.load.audio(SFX.Stick, 'sfx/Stick.wav');
        scene.load.audio(SFX.Fireball, 'sfx/Fireball.wav');
        scene.load.audio(SFX.PlayerHit, 'sfx/Hit.wav');
        scene.load.audio(SFX.EnemyHit, 'sfx/EnemyHit.wav');
        scene.load.audio(SFX.EnemyDead, 'sfx/EnemyDead.wav');
        // scene.load.audio(SFX.GetItem, 'assets/sfx/GetItem.wav');
        scene.load.audio(SFX.Dungeon, 'sfx/dungeon.ogg');
        scene.load.audio(SFX.Adventure, 'sfx/adventure.ogg');
        scene.load.audio(SFX.FoundItem, 'sfx/FoundItem.wav');
        scene.load.audio(SFX.OldMan, 'sfx/OldMan.wav');

    }

}

export enum SFX {
    Fireball = 'Fireball',
    Stick = 'Stick',
    PlayerHit = 'PlayerHit',
    EnemyHit = 'EnemyHit',
    EnemyDead = 'EnemyDead',
    Dungeon = 'Dungeon',
    FoundItem = "FoundItem",
    OldMan = 'OldMan',
    Adventure = "Adventure",
}