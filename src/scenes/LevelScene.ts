import { AttackInstance } from "../attacks/AttackInstance";
import { AttackManager } from "../attacks/AttackManager";
import { C } from "../C";
import { EffectManager } from "../effects/EffectManager";
import { Entity, FacingEnum } from "../Entities/Entity";
import { MM } from "../Entities/MM";
import { AttackMessages } from "../enums/AttackMessages";
import { EffectTypes } from "../enums/EffectTypes";
import { EntityMessages } from "../enums/EntityMessages";
import { PowerTypes } from "../enums/PowerTypes";
import { SceneMessages } from "../enums/SceneMessages";
import { GemBar } from "../gui/GemBar";
import { Lifebar } from "../gui/Lifebar";
import { LocationMessage } from "../gui/LocationMessage";
import { Minimap } from "../gui/Minimap";
import { SetupMapHelper } from "../Helpers/SetupMapHelper";
import { IH, IHVI } from "../IH/IH";
import { LDtkMapPack, LdtkReader, Level } from "../map/LDtkReader";
import { MapObjects } from "../map/MapObjects";

export class LevelScene extends Phaser.Scene {
    player!:Entity;
    ih:IH;
    mm:MM;
    reader:LdtkReader;
    cam:Phaser.GameObjects.Image;
    CollideMap:Phaser.Physics.Arcade.Group;
    CollidePlayer:Phaser.Physics.Arcade.Group;
    CollideEnemy:Phaser.Physics.Arcade.Group;
    Powerups:Phaser.Physics.Arcade.Group;
    Enemies:Phaser.Physics.Arcade.Group;
    Players:Phaser.Physics.Arcade.Group;
    IntMaps:Phaser.Physics.Arcade.Group;
    CurrentMapObjects:MapObjects;
    NextMapObjects:MapObjects;
    checkpointEmitter:Phaser.GameObjects.Particles.ParticleEmitter;

    Paused:boolean = false;

    Map:Minimap;

    BG:Phaser.GameObjects.TileSprite;

    debugGraphics:Phaser.GameObjects.Graphics;

    GuiLayer:Phaser.GameObjects.Layer;
    Foreground:Phaser.GameObjects.Layer;
    Midground:Phaser.GameObjects.Layer;
    Background:Phaser.GameObjects.Layer;
    customEvents:string[] = [];
    currentMap:string;
    currentMapPack:LDtkMapPack;
    private nextMapPack:LDtkMapPack;
    LevelTransition:boolean = false;
    BA:AttackManager;
    EM:EffectManager;

    debug:Phaser.GameObjects.Text;
    PointerOffset: { x: number; y: number; };
    Pointer: Phaser.GameObjects.Image;
    currentMapCollider: Phaser.Physics.Arcade.Collider;



    create(levelData:{levelName:string}) {

        this.cameras.main.setSize(340,300).setBackgroundColor(0xff0000).setPosition(5,5);
        this.PointerOffset = {x:0, y:0};
        this.Pointer = this.add.image(150,150, 'pointer').setDepth(1000).setScrollFactor(0,0);
        this.input.on('pointerdown', (pointer) => {

            this.input.mouse.requestPointerLock();
    
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', (pointer) => {
    
            if (this.input.mouse.locked)
            {
                this.PointerOffset.x += pointer.movementX * C.MOUSE_SENSITIVITY;
                this.PointerOffset.y += pointer.movementY * C.MOUSE_SENSITIVITY;
            }
        }, this);
    
        this.scene.launch('gui').bringToTop('gui');
        this.CollideMap = this.physics.add.group();
        this.CollidePlayer = this.physics.add.group();
        this.CollideEnemy = this.physics.add.group();
        this.Enemies = this.physics.add.group();
        this.Players = this.physics.add.group();
        this.IntMaps = this.physics.add.group();
        this.Powerups = this.physics.add.group();
        this.CurrentMapObjects = new MapObjects();
        //Add layers
        this.GuiLayer = this.add.layer().setDepth(5);
        this.Foreground = this.add.layer().setDepth(4);
        this.Midground = this.add.layer().setDepth(3);
        this.Background = this.add.layer().setDepth(2);

        //Add Emitter
        this.reader = new LdtkReader(this,this.cache.json.get('start'));
        this.Map = new Minimap(this, this.reader);

        this.cam = this.add.image(0,0,'atlas').setVisible(false);

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);

        this.ih = new IH(this);

        this.debug = this.add.text(0,0,"").setFontSize(12).setDepth(1000).setScrollFactor(0,0).setVisible(false);
        this.debugGraphics = this.add.graphics()
        // .setVisible(false)
        .setDepth(5);
        this.GuiLayer.add(this.debugGraphics);
        let level = this.reader.ldtk.levels.find((l: any) => l.identifier === C.gd.CurrentLevel);
        this.CreateNextMap(level);
        this.EndScreenTransition();
        let m = this.currentMapPack;
        // let m = this.reader.CreateMap(C.gd.CurrentLevel, 'mapts');
        // this.currentMap = m.level.identifier;
        // this.Map.ExploreLevel(m.level.identifier);
        // m.collideLayer.setCollision([2, 3, 4, 5, 6]);
        // this.currentMapPack = m;

        // this.currentMapPack.displayLayers.forEach(element => {
        //     if(element.name == 'Fg')
        //         this.Foreground.add(element);
        //     if(element.name == 'Floor')
        //         this.Background.add(element);
        //     if(element.name == 'Mg')
        //         this.Midground.add(element);
            

        // });

        // m.displayLayers.forEach(element => {
        // });

        this.mm = new MM(this, this.ih)
        this.BA = new AttackManager(this);
        this.EM = new EffectManager(this);

        // C.setFlag(PowerTypes.LIGHT, true);

        let startpos = this.currentMapPack.entityLayers.entityInstances.find(e=>e.__identifier == 'PlayerStart');
        if(startpos === undefined)
            this.mm.shadow.setPosition(300,300);
        else
            this.mm.shadow.setPosition(startpos.px[0] + m.level.worldX+10, startpos.px[1] + m.level.worldY);

        this.CollideMap.add(this.mm.shadow);

        this.physics.world.setBounds(m.worldX,m.worldY,m.width, m.height);

        let by = m.height;
        if(m.height == 140)
            by = 135;
        this.cameras.main.setBounds(m.worldX,m.worldY,m.width, by);
        this.cameras.main.startFollow(this.mm.sprite);

        //@ts-ignore
        this.physics.add.overlap(this.CollideEnemy, this.Enemies, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            e.emit(EntityMessages.HIT_BY_ATTACK, a.getData('AttackInstance') as AttackInstance);
        });

        //@ts-ignore
        this.physics.add.overlap(this.CollidePlayer, this.Players, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            e.emit(EntityMessages.HIT_BY_ATTACK, a.getData('AttackInstance') as AttackInstance);
        });
        //@ts-ignore
        this.physics.add.overlap(this.Enemies, this.Players, (a:Phaser.Physics.Arcade.Sprite, e:Phaser.Physics.Arcade.Sprite)=>{
            a.emit(EntityMessages.OVERLAP_PLAYER);
            e.emit(EntityMessages.OVERLAP_PLAYER);
        });
        //@ts-ignore
        this.physics.add.overlap(this.Powerups, this.Players, (powerup:Phaser.Physics.Arcade.Sprite, player:Phaser.Physics.Arcade.Sprite)=>{
            powerup.emit(EntityMessages.OVERLAP_PLAYER);
        });

        //Add gui stuff

        this.CreateEvents();
        //Debug stuff
        this.events.on('destroy', ()=>{this.RemoveEvents();});       
        
        //Create GUI


    }
    


    update(time:number, dt:number) {
        //Update the mouse
        this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0, this.cameras.main.width);
        this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0,this.cameras.main.height);

        this.Pointer.setPosition(this.PointerOffset.x, this.PointerOffset.y);

        this.mm.emit(EntityMessages.POINTER_POS, {x:this.Pointer.x + this.cameras.main.scrollX, y:this.Pointer.y + this.cameras.main.scrollY});

        
        if(this.Paused) {
            if(this.ih.IsJustPressed(IHVI.Fire))
                this.TryToContinue();
                return;
        }


        if(this.ih.IsJustPressed(IHVI.Pause)) {
            if(this.physics.world.isPaused)
                this.physics.resume();
            else
                this.physics.pause();

            return;
        }

        if(this.ih.IsJustPressed(IHVI.Fire)) {
            this.mm.TryAttack();
        }

        if(this.mm.shadow.x < this.currentMapPack.worldX) {
            this.TransitionMap('w');
        } else if (this.mm.shadow.x > this.currentMapPack.worldX + this.currentMapPack.width) {
            this.TransitionMap('e');
        } else if (this.mm.shadow.y > this.currentMapPack.worldY + this.currentMapPack.height) {
            this.TransitionMap('s');
        } else if (this.mm.shadow.y < this.currentMapPack.worldY) {
            this.TransitionMap('n');
        }


        this.physics.collide(this.CollideMap, this.currentMapPack.collideLayer);
        let bounds = this.cameras.main.getBounds();

        // this.BG.tilePositionX = this.cameras.main.scrollX * .2;

    }
    TryToContinue() {
        throw new Error("Method not implemented.");
    }

    /**
     * Tries to transition the map to a new location.  This should be called when the player moves off the screen in a direction
     * 
     * @param direction The direction that the player moved off the screen.  n, e, s, or w.
     * @returns True if a map exists.  Otherwise false and it should be handled.  Kill the player or something...
     */
    TransitionMap(direction:string):boolean {
        if(this.LevelTransition)
            return false;
        this.LevelTransition = true;
        let clevel = this.reader.ldtk.levels.find(l=>l.identifier == this.currentMap);
        let nextleveluid = clevel.__neighbours.find(n=>n.dir == direction).levelIid;
        let nlevel = this.reader.ldtk.levels.find(l=>l.iid == nextleveluid);
        this.physics.pause();
        this.CreateNextMap(nlevel);
        this.cameras.main.stopFollow();
        let cam = this.cameras.main;
        cam.removeBounds();
        let sx = cam.scrollX;
        let sy = cam.scrollY;
        let px = this.mm.shadow.x;
        let py = this.mm.shadow.y;
        switch (direction) {
            case 'e':
                sx += cam.width;
                px += 15;
                break;
            case 'w':
                sx -= cam.width;
                px -= 15;
                break;
            case 'n':
                sy -= cam.height;
                py -= 15;
                break;
            case 's':
                sy += cam.height;
                py += 15;
                break;
        
            default:
                break;
        }

        this.tweens.add(
            {
                targets:cam,
                scrollX:sx,
                scrollY:sy,
                duration:C.SCREEN_TRANSITION_TIME,
                onComplete:this.EndScreenTransition,
                callbackScope:this,
            }
        );
        this.tweens.add(
            {
                targets:this.mm.shadow,
                x:px,
                y:py,
                duration:C.SCREEN_TRANSITION_TIME
            }
        );


        //Set the lights
        // let nr = nlevel.fieldInstances[0].__value;
        // let ng = nlevel.fieldInstances[1].__value;
        // let nb = nlevel.fieldInstances[2].__value;
        
        // if(nr != 1 && ng != 1 && nb != 1)
        //     this.mm.TurnOnLight();
        // else
        //     this.mm.TurnOffLight();

        // this.tweens.add({
        //     targets:this.lights.ambientColor,
        //     r:nr,
        //     g:ng,
        //     b:nb,
        //     duration:100
        // });

        return false;
    }


    CreateNextMap(nLevel:Level) {
        this.Map.ExploreLevel(nLevel.identifier);
        this.nextMapPack = this.reader.CreateMap(nLevel.identifier, 'mapts');
        // if(this.currentMapCollider != null)
        //     this.currentMapCollider.destroy();
        this.physics.world.setBounds(this.nextMapPack.worldX, this.nextMapPack.worldY, this.nextMapPack.width, this.nextMapPack.height);
        this.nextMapPack.collideLayer.setCollision([2, 5]);
        this.currentMap = nLevel.identifier;
        C.gd.CurrentLevel = nLevel.identifier;
        this.nextMapPack.displayLayers.forEach(element => {
        });
        this.nextMapPack.displayLayers.forEach(element => {
            if(element.name == 'Fg')
                this.Foreground.add(element);
            if(element.name == 'Decor')
                this.Background.add(element);
            if(element.name == 'Mg')
                this.Midground.add(element);
            

        });

        
        this.NextMapObjects = new MapObjects();
        SetupMapHelper.CreateEntities(this, this.nextMapPack, this.NextMapObjects);
        // this.IntMaps.add(this.nextMapPack.collideLayer);
        let level = this.reader.ldtk.levels.find((l: any) => l.identifier === nLevel.identifier);

        this.currentMapCollider = this.physics.add.collider(this.CollideMap, this.nextMapPack.collideLayer);

        }

    EndScreenTransition() {
        if(this.currentMapPack != null) {
            this.IntMaps.remove(this.currentMapPack.collideLayer);
            this.currentMapPack.Destroy();
        }
        this.currentMapPack = this.nextMapPack;
        this.CurrentMapObjects.Destroy();
        this.CurrentMapObjects = this.NextMapObjects;
        this.LevelTransition = false;
        // this.cameras.main.setBounds(this.currentMapPack.worldX, this.currentMapPack.worldY, this.currentMapPack.width, this.currentMapPack.height);
        // this.cameras.main.startFollow(this.mm.sprite);

        // if(this.currentMapPack.level.fieldInstances[3].__value != null && C.LastLocationMessage != this.currentMapPack.level.fieldInstances[3].__value) {
        //     new LocationMessage(this.currentMapPack.level.fieldInstances[3].__value, this, this.GuiLayer);
        // }

        this.currentMapPack.collideLayer.layer.data.length;
        this.physics.resume();
    }

    CreateEvents() {
        this.events.on('debug', (m:string, clear:boolean = false)=>{ if (clear) this.debug.text = m;
            else this.debug.text += m + '\n';
        });
        this.customEvents.push('debug');
        this.events.on('effect', (origin:{x:number, y:number, right:boolean}, type:EffectTypes)=> {this.EM.LaunchEffect(origin, type);});
        this.customEvents.push('effect');
        this.events.on(EntityMessages.PLAYER_DEAD, this.PlayerDead, this);
        this.customEvents.push(EntityMessages.PLAYER_DEAD);
        this.events.on(EntityMessages.GET_POWERUP, this.GetPowerup, this);
        this.customEvents.push(EntityMessages.GET_POWERUP);
        this.events.on(SceneMessages.HitCheckpoint, this.HitCheckpoint, this);
        this.customEvents.push(SceneMessages.HitCheckpoint);
    }

    HitCheckpoint() {
        if(this.mm.hp != this.mm.maxhp) {
            //Play a sound or something.
            this.mm.hp = this.mm.maxhp;
            this.mm.sprite.emit(EntityMessages.CHANGE_HP, this.mm.hp, this.mm.maxhp);
        }

    }
    
    GetPowerup(power:PowerTypes) {
        C.gd.CollectedPowerups.push({level:this.currentMap, type:power});
        //Display Graphics.
        if(power == PowerTypes.HEALTH) {
            this.mm.maxhp++;
            this.mm.hp++;
            this.mm.sprite.emit(EntityMessages.CHANGE_HP, this.mm.hp, this.mm.maxhp);
        } else if(power == PowerTypes.GOLD) {
            C.gd.Gold++;
            this.events.emit(SceneMessages.ChangeGems);
        }   else if(power == PowerTypes.DIAMOND) {
            C.gd.Diamond++;
            this.events.emit(SceneMessages.ChangeGems);
        }   else if(power == PowerTypes.EMERALD) {
            C.gd.Emerald++;
            this.events.emit(SceneMessages.ChangeGems);
        }
        else if(power == PowerTypes.AXES)
            C.setFlag(PowerTypes.AXES, true);
        else if(power == PowerTypes.GRAB)
            C.setFlag(PowerTypes.GRAB, true);


    }

    RemoveEvents() {
        this.customEvents.forEach(element => {
            this.events.removeListener(element);
        });
    }

    PlayerDead() {
        this.cameras.main.fadeOut(2000, 0,0,0,(cam:any, progress)=>{
            if(progress==1){
                let gd=C.gd;
                let nlevel = this.reader.GetLevelFromName(C.gd.SaveLevel);
                this.cameras.main.stopFollow();
                this.CreateNextMap(nlevel);
            this.EndScreenTransition();
            }
        
        },this);

        this.time.addEvent({
            delay:2100,
            callbackScope:this,
            callback:()=>{this.cameras.main.fadeIn(1000);}

        });
    }

    Shutdown() {

    }
}