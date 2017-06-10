/**
 * Created by me on 02.06.2017.
 */
import {DisplayObject} from '../core/DisplayObject';
import {AssetsManager} from './AssetsManager';
import {AppProxy} from './../AppProxy';
import {Constants} from './Constants';

export class BigWin extends DisplayObject{
    constructor(){
        super();
        this.initialize();
        this.setLocation();
    }

    initialize(){
        AppProxy.getInstance().bigwin = this;
        let textures = new AssetsManager().getBigWinAnimation();
        this.container = new PIXI.extras.AnimatedSprite(textures);
        this.addChild(this.container);
        this.container.visible = false;
        this.container.animationSpeed = 0.5;
        this.animationCompleteSignal = new signals.Signal();
    }

    setLocation(){
        this.x = 372;
        this.y = 456;
    }

    onAnimationComplete(){
        this.hide();
        this.animationCompleteSignal.dispatch();
    }

    show(){
        this.container.visible = true;
        this.container.gotoAndStop(0);
        this.container.play();

        setTimeout(this.onAnimationComplete.bind(this), Constants.BIG_WIN_TIME);
    }

    hide(){
        this.container.visible = false;
        this.container.stop();
    }
}
