export class GuiScene extends Phaser.Scene {
    create() {
        this.cameras.main.setBackgroundColor(0x000000)
        .setSize(100, 300)
        .setPosition(348,5);
        this.add.text(0,0,"");
        this.add.nineslice(0,0, '9box', null, 100, 300, 6,6,6,6).setOrigin(0,0);
    }
}