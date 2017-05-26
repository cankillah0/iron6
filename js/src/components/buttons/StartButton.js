/**
 * Created by Admin on 16.05.17.
 */
import {Button} from './Button';
import {AppProxy} from '../../AppProxy';
import {Constants} from '../Constants';

export class StartButton extends Button{
    constructor(textures){
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
        this.x = 780;
        this.y = 75;
    }
}
