export class PowerupMessage {
    c:Phaser.GameObjects.Container;
    g:Phaser.GameObjects.Graphics;
    t:Phaser.GameObjects.BitmapText;

    scene:Phaser.Scene;

    constructor(message:string, scene:Phaser.Scene, layer:Phaser.GameObjects.Layer) {
        let c = scene.add.container();
        let g = scene.add.graphics({
            fillStyle:{alpha:.5, color:0x000000}
        });
        g.fillRect(0,0,200,30);
        c.add(g);
        let t = scene.add.bitmapText(0,0,'dwf', message, 24);
        t.scale = -1;
        t.setMaxWidth(200);
        c.add(t);
        t.y = (30 - t.displayHeight)/ 2;
        t.x = (200 - t.displayWidth) / 2;
        c.setScrollFactor(0,0);

        c.x = 20;
        c.y = 20;
        c.setAlpha(0);

        layer.add(c);

        scene.tweens.add({
            targets:c,
            alpha:1,
            duration:300
        });
        scene.tweens.add({
            targets:c,
            alpha:0,
            duration:300,
            delay:2300,
            onComplete:()=> {c.destroy();}

        });
    }

}