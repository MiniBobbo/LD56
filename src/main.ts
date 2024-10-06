import * as Phaser from "phaser";
import { Preload } from "./scenes/Preload";
import { C } from "./C";
import { GameData } from "./GameData";
import { MainMenuScene } from "./scenes/MainMenuScene";
import MergedInput from "phaser3-merged-input";
import { LevelScene } from "./scenes/LevelScene";
import { GuiScene } from "./scenes/GuiScene";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 450,
      height: 310,
      // width: 480,
      // height: 270,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
      },
      render: {
        pixelArt:true,
      },
      input:{
        gamepad:true
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
    };
    super(config);
    C.gd = new GameData();

    // this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("menu", MainMenuScene, false);
    this.scene.add('level', LevelScene, false);
    this.scene.add('gui', GuiScene, false);

    // this.scene.add("level", LevelScene, false);
    this.scene.start("preload");
    // C.setFlag('5', true);
    }

}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};