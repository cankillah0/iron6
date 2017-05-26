/**
 * Created by 1 on 29.12.2016.
 */

import {AssetsManager} from './AssetsManager';
import {SpinButton} from './buttons/SpinButton';
import {StopButton} from './buttons/StopButton';
import {StartButton} from './buttons/StartButton';
import {InfoButton} from './buttons/InfoButton';
import {LightPanel} from './LightPanel';
import {WinText} from './WinText';
import {BetPanel} from './BetPanel';

export class BottomPanel extends PIXI.Sprite{
    constructor(texture){
        super();
        this.bgtexture = texture;
        this.initialize();
        this.setLocation();
    }

    setLocation(){
        this.x = 30;
        this.y = 590;
    }

    initialize(){
        this.background = new PIXI.Sprite(this.bgtexture);
        this.background.scale.x = 1.4;
        this.background.scale.y = 1.6;
        this.background.y -= 15;
        this.background.alpha = 0.6;
        this.addChild(this.background);

        this.spinButton = new SpinButton(new AssetsManager().getSpinButtonTextures());
        this.addChild(this.spinButton);

        this.stopButton = new StopButton(new AssetsManager().getStopButtonTextures());
        this.addChild(this.stopButton);

        this.startButton = new StartButton(new AssetsManager().getStartButtonTextures());
        this.addChild(this.startButton);

        this.infoButton = new InfoButton(new AssetsManager().getInfoButtonTextures());
        this.addChild(this.infoButton);

        this.lightPanel = new LightPanel();
        this.addChild(this.lightPanel);

        this.winText = new WinText(new AssetsManager().getWinTextBackgroundTexture());
        this.addChild(this.winText);

        this.betPanel = new BetPanel();
        this.addChild(this.betPanel);
    }
}
