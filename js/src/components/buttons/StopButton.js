/**
 * Created by Admin on 06.05.17.
 */
import {StateMachine} from '../../states/StateMachine';
import {AppProxy} from '../../AppProxy';
import {Constants} from '../Constants';
import {Button} from './Button';

export class StopButton extends Button {
    constructor(textures){
        super(textures);
        this.setLocation();
    }

    setLocation(){
        this.x = 940;
        this.y = 75;
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.SPIN_START_STATE):{
                this.setVisible(true);
                this.setActive(false);
                break;
            }
            case (Constants.SPIN_STOP_STATE):{
                this.setVisible(true);
                this.setActive(true);
                break;
            }
            case (Constants.IDLE_STATE):{
                this.setVisible(false);
                break;
            }
            case (Constants.WIN_ANIMATION_STATE):{
                this.setVisible(false);
                break;
            }
        }
    }

    onMouseDown(){
        super.onMouseDown();
        AppProxy.getInstance().immediateStopSpinSignal.dispatch();
    }

}
