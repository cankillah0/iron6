/**
 * Created by Admin on 16.05.17.
 */
import {DisplayObject} from '../core/DisplayObject';
import {AppProxy} from './../AppProxy';
import {AssetsManager} from './AssetsManager';

export class Sparkles extends DisplayObject{
    constructor(){
        super();
        this.initialize();
        AppProxy.getInstance().sparkles = this;
    }

    initialize(){
        this.sparkles = [];
        let textures = new AssetsManager().getSparklesAnimation();
        for (let i = 0; i < 6; i++){
            let sparkle = new PIXI.extras.AnimatedSprite(textures);
            this.addChild(sparkle);
            sparkle.x = 45 + (i * 185);
            sparkle.y = 79;
            sparkle.scale.x = 1.213;
            sparkle.scale.y = 1.247;
            sparkle.visible = false;
            this.sparkles.push(sparkle);
        }
    }

    show(index){
        this.sparkles[index].visible = true;
        this.sparkles[index].play();
    }

    hideAll(){
        for (let i = 0; i < this.sparkles.length; i++){
            this.sparkles[i].visible = false;
            this.sparkles[i].stop();
        }
    }
}
