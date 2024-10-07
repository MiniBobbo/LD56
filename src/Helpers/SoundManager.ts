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

    PlayMusic(music:SFX) {
        let musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.scene.sound.play(music, musicConfig);
    }

    Play(sfx:SFX) {
        this.sfx.push(sfx);
    }

    static LoadSounds(scene:Phaser.Scene) {
        scene.load.audio(SFX.Stick, 'assets/sfx/Stick.wav');
        scene.load.audio(SFX.Fireball, 'assets/sfx/Fireball.wav');
        scene.load.audio(SFX.PlayerHit, 'assets/sfx/PlayerHit.wav');
        scene.load.audio(SFX.EnemyHit, 'assets/sfx/EnemyHit.wav');
        scene.load.audio(SFX.EnemyDead, 'assets/sfx/EnemyDead.wav');
        // scene.load.audio(SFX.GetItem, 'assets/sfx/GetItem.wav');
        scene.load.audio(SFX.Dungeon, 'assets/sfx/dungeon.ogg');

    }

}

export enum SFX {
    Fireball = 'Fireball',
    Stick = 'Stick',
    PlayerHit = 'PlayerHit',
    EnemyHit = 'EnemyHit',
    EnemyDead = 'EnemyDead',
    GetItem = 'GetItem',
    Dungeon = 'Dungeon',
}