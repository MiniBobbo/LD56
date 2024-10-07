import { AttackManager } from "../attacks/AttackManager";
import { C } from "../C";
import { WiseRat } from "../Cutscenes/WiseRat";
import { EffectManager } from "../effects/EffectManager";
import { Ant } from "../Entities/Enemies/Ant";
import { BlockerKill } from "../Entities/Enemies/BlockerKill";
import { Bush } from "../Entities/Enemies/Bush";
import { Pillbug } from "../Entities/Enemies/Pillbug";
import { QueenAnt } from "../Entities/Enemies/QueenAnt";
import { RedAnt } from "../Entities/Enemies/RedAnt";
import { MM } from "../Entities/MM";
import { GameData } from "../GameData";
import { GamepadButtons, IH, IHVI } from "../IH/IH";

export class Preload extends Phaser.Scene {
    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value:any) {
            //@ts-ignore
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file:any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            //@ts-ignore
            this.scene.start('menu');
            //@ts-ignore
            // this.scene.launch('gui');

        }, this);
    
        this.load.setBaseURL('./assets/')
        this.load.bitmapFont('6px', 'munro_0.png', 'munro.fnt');
        this.load.bitmapFont('8px', 'smallfont_0.png', 'smallfont.fnt');
        this.load.multiatlas('atlas', 'atlas.json');
        this.load.json('start', 'MainLevel.ldtk');
        this.load.image('mapts', 'Tiles.png');
        this.load.image('pointer', 'pointer.png');
        this.load.image('9box', '9box.png');
        this.load.image('shadow', 'shadow.png');
        this.load.image('bgs', 'bgs_1.png');
    }


    create() {
        C.gd = new GameData();

        MM.CreateAnimations(this);
        Pillbug.CreateAnimations(this);
        Ant.CreateAnimations(this);
        RedAnt.CreateAnimations(this);
        Bush.CreateAnimations(this);
        QueenAnt.CreateAnimations(this);
        BlockerKill.CreateAnimations(this);
        WiseRat.CreateAnimations(this);
        AttackManager.CreateAnimations(this);
        EffectManager.CreateAnimations(this);

        IH.AddVirtualInput(IHVI.Up);
        IH.AddVirtualInput(IHVI.Down);
        IH.AddVirtualInput(IHVI.Left);
        IH.AddVirtualInput(IHVI.Right);
        IH.AddVirtualInput(IHVI.Dash);
        IH.AddVirtualInput(IHVI.Jump);
        IH.AddVirtualInput(IHVI.Fire);
        IH.AddVirtualInput(IHVI.Pause);
        IH.AddVirtualInput(IHVI.Map);

        IH.AssignKeyToVirtualInput('W', IHVI.Up);
        IH.AssignKeyToVirtualInput('A', IHVI.Left);
        IH.AssignKeyToVirtualInput('S', IHVI.Down);
        IH.AssignKeyToVirtualInput('D', IHVI.Right);
        IH.AssignKeyToVirtualInput('E', IHVI.Map);
        IH.AssignKeyToVirtualInput('J', IHVI.Fire);
        IH.AssignKeyToVirtualInput('K', IHVI.Jump);
        IH.AssignKeyToVirtualInput('L', IHVI.Dash);
        IH.AssignKeyToVirtualInput('ENTER', IHVI.Pause);

        IH.AssignKeyToVirtualInput('UP', IHVI.Up);
        IH.AssignKeyToVirtualInput('LEFT', IHVI.Left);
        IH.AssignKeyToVirtualInput('DOWN', IHVI.Down);
        IH.AssignKeyToVirtualInput('RIGHT', IHVI.Right);
        IH.AssignKeyToVirtualInput('Z', IHVI.Fire);
        IH.AssignKeyToVirtualInput('X', IHVI.Jump);
        IH.AssignKeyToVirtualInput('C', IHVI.Dash);
        IH.AssignKeyToVirtualInput('', IHVI.Pause);

        IH.MapMouseToVirtualInput(IHVI.Fire);

        IH.AssignPadButtonToVirtualInput(GamepadButtons.Up, IHVI.Up);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.Down, IHVI.Down);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.Left, IHVI.Left);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.Right, IHVI.Right);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.X, IHVI.Fire);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.A, IHVI.Jump);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.RightTrigger, IHVI.Map);
        IH.AssignPadButtonToVirtualInput(GamepadButtons.Plus, IHVI.Pause);
    }
}