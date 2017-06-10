import {AppProxy} from '../../AppProxy';
import {Constants} from '../Constants';
import {Button} from './Button';

export class SpinButton extends Button {
    constructor(textures){
        super(textures);
        this.setLocation();
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.SPIN_START_STATE):{
                this.setVisible(false);
                break;
            }
            case (Constants.SPIN_STOP_STATE):{
                this.setVisible(false);
                break;
            }
            case (Constants.IDLE_STATE):{
                this.setActive(true);
                this.setVisible(true);
                break;
            }
            case (Constants.BIG_WIN_STATE):{
                this.setVisible(true);
                this.setActive(false);
                break;
            }
            case (Constants.WIN_ANIMATION_STATE):{
                this.setVisible(true);
                this.setActive(true);
                break;
            }
        }
    }

    setLocation(){
        this.x = 940;
        this.y = 75;
    }

    onMouseDown(){
        super.onMouseDown();
        AppProxy.getInstance().startSpinSignal.dispatch();
    }
}

