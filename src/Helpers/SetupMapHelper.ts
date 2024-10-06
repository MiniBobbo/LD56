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
import { TravelPoint } from "../Entities/TravelPoint";
import { Ant } from "../Entities/Enemies/Ant";
import { Bush } from "../Entities/Enemies/Bush";
import { Chest } from "../Entities/Chest";
import { Key } from "../Entities/Key";
import { WiseRat } from "../Cutscenes/WiseRat";
import { AppearText } from "../Cutscenes/AppearText";

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
            let worldposition = {x:element.px[0] + maps.worldX + 10, y:element.px[1] + maps.worldY + 10};
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
                        mo.mapEntities.push(pillbug);
                break;
                case 'Ant':
                        let ant = new Ant(gs);
                        ant.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(ant);
                break;
                case 'WiseRat':
                        let wr = new WiseRat('WiseRat', gs, element);
                        wr.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(wr);
                break;
                case 'AppearText':
                        let at = new AppearText('AppearText', gs, element);
                        at.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(at);
                break;
                case 'Bush':
                        let bush = new Bush(gs);
                        bush.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(bush);
                        maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);

                break;
                case 'Travel':
                        let travelPoint = new TravelPoint(gs, element, element.fieldInstances[0].__value, element.fieldInstances[1].__value);
                        travelPoint.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(travelPoint);
                break;
                case 'Chest':
                        let chest = new Chest(gs, element);
                        chest.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(chest);
                        maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
                break;
                case 'Key':
                        if(!C.gd.IDsCollected.includes(element.iid)) {
                            let key = new Key(gs, element);
                            key.shadow.setPosition(worldposition.x, worldposition.y);
                            mo.mapEntities.push(key);
                            maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
                        }

                break;
                case 'Obstacle':
                        let o = gs.add.image(worldposition.x, worldposition.y, 'atlas', 'OutdoorObstacles_0').setDepth(worldposition.y).setOrigin(.5,.8);
                        switch (element.fieldInstances[0].__value) {
                            case 'Flower':
                                o.setFrame('OutdoorObstacles_1');
                            break;
                        }
                        gs.Midground.add(o);
                        let tile = maps.collideLayer.getTileAtWorldXY(worldposition.x, worldposition.y);
                        maps.collideLayer.putTileAt(5, tile.x, tile.y);

                        // pillbug.shadow.setPosition(worldposition.x, worldposition.y);
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