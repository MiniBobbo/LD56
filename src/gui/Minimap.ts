import { C } from "../C";
import { SceneMessages } from "../enums/SceneMessages";
import { IHVI } from "../IH/IH";
import { LdtkReader } from "../map/LDtkReader";
import { LevelScene } from "../scenes/LevelScene";

export class Minimap {
    c:Phaser.GameObjects.Container;
    s:LevelScene;
    map:Phaser.GameObjects.Graphics;
    cover:Phaser.GameObjects.Graphics;
    position:Phaser.GameObjects.Graphics;

    ldtk:LdtkReader;
    

    constructor(s:LevelScene, ldtk:LdtkReader) {
        this.s = s;
        this.c = s.add.container(0,0).setScrollFactor(0,0);
        s.GuiLayer.add(this.c);
        this.ldtk = ldtk;

        this.map = s.add.graphics({lineStyle:{color:0xffffff, width:1}, fillStyle:{color:0x000000}}).setDepth(1);
        this.cover = s.add.graphics({lineStyle:{color:0x0000ff, width:1}, fillStyle:{color:0x000000}}).setDepth(2);
        this.position = s.add.graphics({lineStyle:{color:0xff0000}, fillStyle:{color:0xff0000, alpha:.5}}).setDepth(3);

        this.c.add(this.map);
        this.c.add(this.cover);
        this.c.add(this.position);
        
        this.DrawAllMap(ldtk);
        this.ExploreLevel('start');
        this.s.events.on('update', this.Update, this);
        this.s.events.on(SceneMessages.ChangeLevel, this.ExploreLevel, this);
    }

    ExploreLevel(newLevel:string) {
        //This could be better, but this is how I'm doing it for now.
        if(C.gd.ExploredLevels.find(l=>l == newLevel)==undefined) {
            C.gd.ExploredLevels.push(newLevel);
        }

        this.cover.clear();
        this.ldtk.ldtk.levels.forEach(element => {
            //If this level hasn't been explored, draw a black box over it so it can't be seen.
            if(C.gd.ExploredLevels.find(l=>l == element.identifier)== undefined) {
                this.cover.fillRect(element.worldX/12, element.worldY/12, element.pxWid/12, element.pxHei/12);
            }
        });

        this.position.clear();
        let current = this.ldtk.ldtk.levels.find(l=>l.identifier == newLevel);
        if(current == undefined)
            return;
        this.position.fillRect(current.worldX/12, current.worldY/12, current.pxWid/12, current.pxHei/12);

    }


    Update(time:number, dt:number) {
        if(this.s.ih.IsPressed(IHVI.Map))
            this.c.setAlpha(.5);
        else
        this.c.setAlpha(0);
        // this.c.alpha = Phaser.Math.Clamp(this.c.alpha, 0.0, 0.5);
        
    }

    Destroy() {

    }
    DrawAllMap(ldtk:LdtkReader) {
        ldtk.ldtk.levels.forEach(element => {
            let wx = element.worldX/12;
            let wy = element.worldY/12;
            this.map.lineStyle(1, 0x0000ff);
            let layer = element.layerInstances.find(l=>l.__type == 'IntGrid');
            let grid = layer.intGridCsv;
            this.map.fillRect(wx, wy, layer.__cWid, layer.__cHei);
            this.map.lineStyle(1, 0xffffff);
            for(let i = 0; i < grid.length; i++) {
                if(grid[i] != 0) {
                    let x = i%20;
                    let y = Math.floor(i/20);
                    this.map.strokeRect(wx+x,wy+y, 1,1);
                }
            }
        });        
    }

    
}