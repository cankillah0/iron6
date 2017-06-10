/**
 * Created by Admin on 12.05.17.
 */
import {DisplayObject} from '../core/DisplayObject';
import {SliderButton} from '../components/buttons/SliderButton';
import {AssetsManager} from '../components/AssetsManager';
import {AppProxy} from '../AppProxy';
import {StateMachine} from '../states/StateMachine';
import {Constants} from './Constants';

export class Slider extends PIXI.Container{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        this.sliderHeight = 520;
        this.defValue = 239;
        this.value = this.defValue;
        this.locked = false;

        this.createSlideSprite();

        this.button = new SliderButton(new AssetsManager().getSlideButtonTexture());
        this.addChild(this.button);

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.button.clickSignal.add(this.onButtonClick.bind(this));

        this.valueUpdateSignal = new signals.Signal();
        this.loseFocusSignal = new signals.Signal();

        StateMachine.getInstance().stateChangeSignal.add(
            this.onStateChange.bind(this));
    }

    createSlideSprite(){
        let t1 = new AssetsManager().getSlideDefaultTexture();
        this.downSprite = new PIXI.Sprite(t1);
        this.downSprite.y = 162;
        this.addChild(this.downSprite);

        this.upSprite = new PIXI.Sprite(t1);
        this.upSprite.scale.y = -1;
        this.upSprite.y = 361;
        this.addChild(this.upSprite);

        this.spriteTextures = [
            new AssetsManager().getSlideDefaultTexture(),
            new AssetsManager().getSlideActiveTexture(),
            new AssetsManager().getSlideDisabledTexture()
        ];
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.SPIN_START_STATE):{
                this.lock();
                break;
            }
            case (Constants.SPIN_STOP_STATE):{

                break;
            }
            case (Constants.IDLE_STATE):
            case (Constants.WIN_ANIMATION_STATE):{
                this.unlock();
                break;
            }
        }
    }

    redrawLine(active, locked = false){
        let texture = active ? this.spriteTextures[1] : this.spriteTextures[0];
        if (locked) texture = this.spriteTextures[2];
        this.downSprite.texture = texture;
        this.upSprite.texture = texture;
    }

    lock(){
        this.button.lock();
        this.redrawLine(false, true);
        this.locked = true;
    }

    unlock(){
        this.button.unlock();
        this.redrawLine(false, false);
        this.locked = false;
    }

    onButtonClick(){
        if (this.locked) return;
        this.button.mousemove = this.onMouseMove.bind(this);
        AppProxy.getInstance().stage.mouseup = this.onMouseUp.bind(this);
        AppProxy.getInstance().stage.mouseout = this.onMouseOut.bind(this);
        this.redrawLine(true);
    }

    onMouseOut(){
        if (this.locked) return;
        this.button.mousemove = null;
        this.button.setSelected(false);
        this.redrawLine(false);
        this.loseFocusSignal.dispatch();
    }

    onMouseUp(){
        if (this.locked) return;
        this.button.mousemove = null;
        this.button.setSelected(false);
        this.redrawLine(false);
        this.loseFocusSignal.dispatch();
    }

    onMouseMove(event){
        if (this.locked) return;
        let ny = event.data.getLocalPosition(this).y - this.button.width/2;
        this.setPosition(ny);
        this.setValue();
    }

    setValue(){
        let value = Math.round(this.defValue - this.defValue * this.button.y / (this.sliderHeight - this.button.height/2) );
        if (this.value != value){
            this.value = value;
            if (this.value == 0) this.value = 1;
            this.valueUpdateSignal.dispatch(this.value);
        }

    }

    setPosition(ny){
        this.button.y = ny;
        if (ny < 0){
            this.button.y = 0;
        }
        if (ny > this.sliderHeight - this.button.height/2){
            this.button.y = this.sliderHeight - this.button.height/2;
        }
    }
}
