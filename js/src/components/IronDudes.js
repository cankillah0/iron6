/**
 * Created by Admin on 20.05.17.
 */
import {DisplayObject} from './../core/DisplayObject';
import {IronDude} from './IronDude';
import {AppProxy} from './../AppProxy';


export class IronDudes extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        AppProxy.getInstance().ironDudes = this;

        this.firstDude = new IronDude(1);
        this.addChild(this.firstDude);

        this.secondDude = new IronDude(2);
        this.addChild(this.secondDude);
    }

    show(){
        this.firstDude.show();
        this.secondDude.show();
        this.firstDude.animationCompleteSignal.addOnce(this.hide.bind(this));
        AppProxy.getInstance().lightning.hideSide();
        let reels = AppProxy.getInstance().reels.getReels();
        TweenLite.to([reels[0], reels[5]], 1, {alpha : 0});
    }

    hide(){
        this.firstDude.hide();
        this.secondDude.hide();
        AppProxy.getInstance().lightning.showSide();
        let reels = AppProxy.getInstance().reels.getReels();
        TweenLite.to([reels[0], reels[5]], 0.5, {alpha : 1});
    }
}
