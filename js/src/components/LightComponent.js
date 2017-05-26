/**
 * Created by Admin on 09.05.17.
 */
import {DisplayObject} from '../core/DisplayObject';
import {AssetsManager} from './AssetsManager';
import {StateMachine} from '../states/StateMachine';
import {Constants} from './Constants';

export class LightComponent extends DisplayObject{
    constructor(index){
        super();
        this.index = index;
        this.frozen = false;
        this.tween = null;
        this.initialize();
    }

    initialize(){
        this.movieTextures = [
            new AssetsManager().getLightningAnimation(0),
            new AssetsManager().getLightningAnimation(1)
        ];
        this.movieClip = new PIXI.extras.AnimatedSprite(this.movieTextures[0]);
        this.addChild(this.movieClip);
        this.movieClip.x = 100 + (this.index * 185);
        this.movieClip.y = 90;
        this.movieClip.scale.y = 1.13;
        this.movieClip.visible = false;

        let tubeTexture = new AssetsManager().getLightningTubeTexture();
        this.sprite = new PIXI.Sprite(tubeTexture);
        this.sprite.scale.y = -1;
        this.sprite.x = 80 + (this.index * 185);
        this.sprite.y = -100;
        this.addChild(this.sprite);

        StateMachine.getInstance().stateChangeSignal.add(
            this.onStateChange.bind(this));
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.SPIN_START_STATE):{
                this.movieClip.textures = this.movieTextures[1];
                break;
            }
            case (Constants.SPIN_STOP_STATE):{

                break;
            }
            case (Constants.IDLE_STATE):
            case (Constants.WIN_ANIMATION_STATE):{
                this.movieClip.textures = this.movieTextures[0];
                break;
            }
        }
    }

    show(){
        if (!this.frozen){
            this.tween = TweenLite.to(this.sprite, 0.2, {y : 105,
                onComplete : this.onShowComplete.bind(this)});
        }
    }

    onShowComplete(){
        if (!this.frozen){
            this.movieClip.visible = true;
            this.movieClip.play();
        }
    }

    hide(force = false){
        if (!this.frozen || force == true){
            TweenLite.to(this.sprite, 0.2, {y : -105});
            this.movieClip.stop();
            this.movieClip.visible = false;
            if (this.tween){
                this.tween.kill();
            }
        }
    }

    hideLight(){
        this.movieClip.visible = false;
    }

    showLight(){
        this.movieClip.visible = true;
    }

    freeze(){
        if (this.sprite.y < 0){
            this.sprite.y = 105;
        }
        this.movieClip.textures = this.movieTextures[0];
        this.movieClip.visible = true;
        this.movieClip.play();
        this.frozen = true;
    }

    unfreeze(){
        this.movieClip.stop();
        this.movieClip.visible = false;
        this.movieClip.textures = this.movieTextures[0];
        TweenLite.to(this.sprite, 0.2, {y : -105});
        this.frozen = false;
    }
}
