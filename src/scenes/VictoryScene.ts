export class VictoryScene extends Phaser.Scene {
    c:Phaser.GameObjects.Container;
    create() {
        this.c = this.add.container();
        let  i = this.add.image(225-60,0, 'atlas', 'SacredSwiss_2').setOrigin(0,0);
        let glow = i.postFX.addGlow(0xffffbb, 1);
        let t = this.tweens.add({

            targets: glow,
            outerStrength: 3,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        this.c.add(this.add.image(225-17,110, 'atlas', 'Mouse_Hold_Down_0').setOrigin(0,0));
        this.c.add(i);
        this.c.add(this.add.bitmapText(100,160, '8px', 'Congratulations!\nYou have found the\nSacred Swiss').setOrigin(0,0).setCenterAlign().setMaxWidth(300).setScale(3));
        this.c.add(this.add.bitmapText(20,260, '8px', 'A game for Ludum Dare 56\nArt, Coding and Sound by MiniBobbo.\nDid not quite make the compo\nSo submitted to the jam.').setOrigin(0,0).setMaxWidth(300));
        this.cameras.main.fadeIn(3000, 0, 0, 0);
    }
    update(time, dt) {
    }
}