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
        this.sliderHeight = 500;
        this.value = 239;
        this.locked = false;
        this.initialize();
    }

    initialize(){
        this.button = new SliderButton(new AssetsManager().getSliderButtonTextures());
        this.addChild(this.button);

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
        this.redrawLine(false);

        this.button.clickSignal.add(this.onButtonClick.bind(this));

        this.valueUpdateSignal = new signals.Signal();
        this.loseFocusSignal = new signals.Signal();

        StateMachine.getInstance().stateChangeSignal.add(
            this.onStateChange.bind(this));
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
        let color = active ? 0x9C8137 : 0x468DBC; //
        if (locked) color = 0x6B7B86;
        this.graphics.clear();
        this.graphics.lineStyle(5, color);
        this.graphics.drawCircle(20, this.button.height/2, 3,3);
        this.graphics.drawCircle(20, this.sliderHeight, 3,3);
        this.graphics.moveTo(20, this.button.height/2);
        this.graphics.lineTo(20, this.sliderHeight);
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
        let value = Math.round(239 * this.button.y/(this.sliderHeight-this.button.height/2));
        //if (value == 0) value = 1;
        if (this.value != value){
            this.value = value;
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
