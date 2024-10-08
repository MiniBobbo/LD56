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
import { BlockerKill } from "../Entities/Enemies/BlockerKill";
import { RedAnt } from "../Entities/Enemies/RedAnt";
import { BlockerTrigger } from "../Entities/Enemies/BlockerTrigger";
import { BlockerKey } from "../Entities/Enemies/BlockerKey";
import { QueenAnt } from "../Entities/Enemies/QueenAnt";
import { SacredSwiss } from "../Entities/SacredSwiss";
import { TriggerAttack } from "../Entities/Triggers/TriggerAttack";
import { TriggerStep } from "../Entities/Triggers/TriggerStep";

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
                case 'Pillbug':
                        let pb = new Pillbug(gs);
                        pb.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(pb);
                break;
                case 'RedAnt':
                        let redant = new RedAnt(gs);
                        redant.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(redant);
                break;
                case 'Boss':
                        if(!C.gd.IDsCollected.includes(element.fieldInstances[0].__value)) {
                            let queen = new QueenAnt(gs, element);
                            queen.shadow.setPosition(worldposition.x, worldposition.y);
                            mo.mapEntities.push(queen);
                        }
                break;
                case 'WiseRat':
                        let wr = new WiseRat('WiseRat', gs, element);
                        wr.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(wr);
                break;
                case 'SacredSwiss':
                        if(!C.gd.IDsCollected.includes(element.iid)) {
                            let ss = new SacredSwiss(gs, element);
                            ss.shadow.setPosition(worldposition.x, worldposition.y);
                            mo.mapEntities.push(ss);
                            maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
                        }
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
                case 'BlockerKill':
                        let blockKill = new BlockerKill(gs, parseInt(element.fieldInstances[0].__value));
                        blockKill.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(blockKill);
                        maps.collideLayer.putTileAtWorldXY(1, worldposition.x, worldposition.y);
                break;
                case 'BlockerTrigger':
                        let blockTrigger = new BlockerTrigger(gs, element);
                        blockTrigger.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(blockTrigger);
                        maps.collideLayer.putTileAtWorldXY(1, worldposition.x, worldposition.y);
                break;
                case 'BlockerKey':
                        let blockKey = new BlockerKey(gs, element);
                        blockKey.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(blockKey);
                        maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
                break;
                case 'TriggerAttack':
                        let tAttack = new TriggerAttack(gs, element);
                        tAttack.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(tAttack);
                        maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
                break;
                case 'TriggerStep':
                        let tStep = new TriggerStep(gs, element);
                        tStep.shadow.setPosition(worldposition.x, worldposition.y);
                        mo.mapEntities.push(tStep);
                        // maps.collideLayer.putTileAtWorldXY(5, worldposition.x, worldposition.y);
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
                        o.flipX = element.fieldInstances[1].__value as boolean;
                        switch (element.fieldInstances[0].__value) {
                            case 'Flower':
                                o.setFrame('OutdoorObstacles_1');
                            break;
                            case 'Rock':
                                o.setFrame('OutdoorObstacles_2');
                            break;
                            case 'AntStatue':
                                o.setFrame('OutdoorObstacles_3');
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