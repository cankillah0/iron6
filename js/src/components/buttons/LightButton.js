/**
 * Created by Admin on 09.05.17.
 */
import {Constants} from '../Constants';
import {Button} from './Button';
import {StateMachine} from '../../states/StateMachine';
import {AppModel} from './../../AppModel';

export class LightButton extends Button{
    constructor(textures, index){
        super(textures);
        this.index = index;
        this.selected = false;
        this.locked = false;
        this.overSignal = new signals.Signal();
        this.outSignal = new signals.Signal();
        this.clickSignal = new signals.Signal();
        this.setLocation();

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
                this.lock();
                break;
            }
            case (Constants.IDLE_STATE):
            case (Constants.WIN_ANIMATION_STATE):{
                if (AppModel.getInstance().freezable[this.index]){
                    this.unlock();
                    this.onMouseOut();
                }
                break;
            }
        }
    }

    setLocation(){
        this.x = this.index * 190 + 55;
        this.y = 20;
        this.scale.y = 0.6;
        this.scale.x = 1.5;
    }

    onMouseOver(){
        super.onMouseOver();
        this.overSignal.dispatch(this.index);
    }

    onMouseOut(){
        if (!this.selected){
            this.gotoAndStop(0);
            this.outSignal.dispatch(this.index);
        } else {
            this.gotoAndStop(2);
        }
    }

    onMouseDown(){
        super.onMouseDown();
        this.selected = !this.selected;
        this.clickSignal.dispatch(this.index);
    }

    lock(){
        this.locked = true;
        this.setActive(false);
    }

    unlock(){
        this.locked = false;
        this.setActive(true);
    }
}
