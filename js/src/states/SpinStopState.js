/**
 * Created by Admin on 06.05.17.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {AppModel} from '../AppModel';
import {StateMachine} from './StateMachine';

export class SpinStopState{
    constructor(){}

    execute(){
        AppProxy.getInstance().stopSpinSignal.addOnce(this.onSpinStopped.bind(this));
        AppProxy.getInstance().iconAnimations.prepareAnimation();

        if (AppModel.getInstance().reelsJoint.length){
            AppProxy.getInstance().reels.startJoint();
        }
        if (AppModel.getInstance().showDudes){
            AppProxy.getInstance().ironDudes.show();
        }

        this.timer = setTimeout(this.stopSpinning.bind(this),
            AppModel.getInstance().getSpinTime());
    }

    stopSpinning(){
        AppProxy.getInstance().reels.stopSpin();
    }

    onSpinStopped(){
        clearTimeout(this.timer);

        let state = Constants.IDLE_STATE;

        if (AppModel.getInstance().lines.length){
            state = Constants.WIN_ANIMATION_STATE;
        }
        if (AppModel.getInstance().bigwin){
            state = Constants.BIG_WIN_STATE;
        }
        AppModel.getInstance().updateBalance();
        StateMachine.getInstance().setState(state);
    }

    getName(){
        return Constants.SPIN_STOP_STATE;
    }
}
