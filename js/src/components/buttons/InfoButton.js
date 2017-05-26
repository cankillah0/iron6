/**
 * Created by Admin on 24.05.17.
 */
import {Button} from './Button';
import {AppProxy} from '../../AppProxy';
import {Constants} from '../Constants';

export class InfoButton extends Button {
    constructor(textures) {
        super(textures);
        this.setLocation();
        this.setActive(false);
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.SPIN_START_STATE):{
                this.setActive(false);
                break;
            }
            case (Constants.SPIN_STOP_STATE):{
                this.setActive(false);
                break;
            }
            case (Constants.IDLE_STATE):{
                this.setActive(false);
                break;
            }
            case (Constants.WIN_ANIMATION_STATE):{
                this.setActive(false);
                break;
            }
        }
    }

    setLocation(){
        this.x = 86;
        this.y = 75;
    }
}
