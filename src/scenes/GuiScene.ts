export class GuiScene extends Phaser.Scene {
    cheeses:Phaser.GameObjects.Image[];

    create() {
        this.cameras.main.setBackgroundColor(0x000000)
        .setSize(100, 300)
        .setPosition(348,5);
        this.add.nineslice(0,0, '9box', null, 100, 300, 6,6,6,6).setOrigin(0,0);
        this.add.bitmapText(10,10, '6px', '- LIFE -', 12)
        // .setScale(1.5)
        .setTint(0xff0000)
        .setCenterAlign();

        this.cheeses = [];
        for(let i =0; i < 8; i++) {
            let c = this.add.image(0,0,'atlas', 'Icons_1');
            this.cheeses.push(c);
        }

        Phaser.Actions.GridAlign(this.cheeses, {
            width: 4,
            height: 2,
            cellWidth: 20,
            cellHeight: 20,
            x: 10,
            y: 20
        })
    
    }
}