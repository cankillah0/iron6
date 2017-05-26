/**
 * Created by Admin on 20.05.17.
 */
import {DisplayObject} from './../core/DisplayObject';
import {AssetsManager} from './AssetsManager';

export class IronDude extends DisplayObject{
    constructor(index){
        super();
        this.index = index;
        this.initialize();
        this.setLocation();
    }

    setLocation(){
        if (this.index == 1){
            this.x = 24;
        } else {
            this.x = 916;
        }
        this.y = 97;
    }

    initialize(){
        let textures = new AssetsManager().getDudeTextures(this.index);
        this.container = new PIXI.extras.AnimatedSprite(textures);
        this.addChild(this.container);
        this.container.visible = false;
        this.container.loop = false;
        this.container.animationSpeed = 0.5;
        this.container.onComplete = this.onAnimationComplete.bind(this);
        this.animationCompleteSignal = new signals.Signal();
    }

    onAnimationComplete(){
        this.animationCompleteSignal.dispatch();
    }

    show(){
        this.container.visible = true;
        this.container.gotoAndStop(0);
        this.container.play(false);
    }

    hide(){
        this.container.visible = false;
        this.container.stop();
    }
}
