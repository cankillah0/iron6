/**
 * Created by 1 on 29.12.2016.
 */

import {BottomPanel} from './components/BottomPanel';
import {Background} from './components/Background';
import {AssetsManager} from './components/AssetsManager';
import {Reels} from './components/Reels';
import {DisplayObject} from './core/DisplayObject';
import {IconAnimations} from './components/IconAnimations'
import {Lightning} from './components/Lightning';
import {Lines} from './components/Lines';
import {Sparkles} from './components/Sparkles';
import {IronDudes} from './components/IronDudes';
import {AppProxy} from './AppProxy';

export class AppView extends DisplayObject{

    constructor() {
        super();
        AppProxy.getInstance().appView = this;
    }

    initialize(){
        this.addBackground();
        this.addBottomPanel();
        this.addLines();
        this.addReels();
        this.addIconsAnimation();
        this.addLightning();
        this.addSparkles();
        this.addIronDude();
    }

    addBottomPanel(){
        this.bottomPanel = new BottomPanel(new AssetsManager().getBottomPanelTexture());
        this.addChild(this.bottomPanel);
    }

    addBackground(){
        this.backGround = new Background(new AssetsManager().getBackgroundTexture());
        this.addChild(this.backGround);
    }

    addReels(){
        this.reels = new Reels(new AssetsManager().getReelsBackgroundTexture());
        this.addChild(this.reels);

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(69, 108, 1109, 495);
        this.reels.mask = graphics;
        this.addChild(graphics);
    }

    addIconsAnimation(){
        this.iconAnimations =  new IconAnimations();
        this.addChild(this.iconAnimations);
    }

    addLightning(){
        this.lightning = new Lightning();
        this.addChild(this.lightning);
    }

    addLines(){
        this.lines = new Lines();
        this.addChild(this.lines);
    }

    addSparkles(){
        this.sparkles = new Sparkles();
        this.addChild(this.sparkles);
    }

    addIronDude(){
        this.ironDudes = new IronDudes();
        this.addChild(this.ironDudes);
    }
}
