import { forEachLeadingCommentRange } from "typescript";
import { C } from "../C";
import { Cutscene } from "../Cutscenes/Cutscene";
import { BasicBaddie } from "../Entities/Enemies/BasicBaddie";
import { Enemy } from "../Entities/Enemy";
import { EnemyTypes } from "../enums/EnemyTypes";
import { PowerTypes } from "../enums/PowerTypes";
import { EntityInstance, LDtkMapPack } from "../map/LDtkReader";
import { MapObjects } from "../map/MapObjects";
import { LevelScene } from "../scenes/LevelScene";
import { Pillbug } from "../Entities/Enemies/Pillbug";

export class SetupMapHelper {
    static CurrentCollider:Phaser.Physics.Arcade.Collider;


    static SetupMap(gs:LevelScene, maps:LDtkMapPack):MapObjects {
        var mo = new MapObjects();

        // maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
        //     if(l.name == 'Bg')
        //         l.setDepth(0);
        //     if(l.name == 'Mg')
        //         l.setDepth(100);
        //     if(l.name == 'Fg')
        //         l.setDepth(200);
        // });

        maps.collideLayer.setCollision([2, 5]);

        this.CreateEntities(gs, maps, mo);
        // this.CreatePhysics(gs,maps);

        return mo;
    }
    static CreateEntities(gs: LevelScene, maps: LDtkMapPack, mo:MapObjects) {
        maps.entityLayers.entityInstances.forEach(element => {
            let worldposition = {x:element.px[0] + maps.worldX, y:element.px[1] + maps.worldY};
            switch (element.__identifier) {
                case 'Cutscene':
                        let name = element.fieldInstances[0].__value;
                        let cs:Cutscene;
                        if(!C.checkFlag(name)) {
                            switch (name) {
                                default:
                                    break;
                            }
                            // let cs = new Cutscene(name, gs, element);
                            cs.sprite.setPosition(worldposition.x + element.width/2, worldposition.y + element.height/2);
                            mo.mapEntities.push(cs);

                        }
                
                break;
                case 'Text':
                        let message = element.fieldInstances[0];
                        let t = gs.add.bitmapText(worldposition.x, worldposition.y, '8px', message.__value as string)
                        .setMaxWidth(element.width).setDepth(150).setCenterAlign();
                        mo.mapGameObjects.push(t);
                break;
                case 'Pillbug':
                        let pillbug = new Pillbug(gs);
                        pillbug.shadow.setPosition(worldposition.x, worldposition.y);
                break;
                default:
                    break;
            }
        });

    }

    static CreateEnemy(scene:LevelScene, e:EntityInstance):Enemy {
        let i = e.fieldInstances.find(e=>e.__identifier == 'EnemyType');
        switch (i.__value) {
            default:
                return new Enemy(scene);
                break;
        }

    }
}