/**
 * Created by Admin on 08.05.17.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {AppModel} from '../AppModel';
import {StateMachine} from './StateMachine';

export class WinAnimationState{
    constructor(){}

    execute(){
        AppProxy.getInstance().startSpinSignal.addOnce(this.onStartSpin.bind(this));
        AppProxy.getInstance().iconAnimations.visible = true;
        AppProxy.getInstance().iconAnimations.playAnimation();
        AppProxy.getInstance().lines.showLines();
        //AppProxy.getInstance().reels.visible = false;
        //AppModel.getInstance().dropFrozenReels();
    }


    onStartSpin(){
        AppProxy.getInstance().reels.visible = true;
        AppProxy.getInstance().iconAnimations.stopAnimation();
        AppProxy.getInstance().iconAnimations.visible = false;
        StateMachine.getInstance().setState(Constants.SPIN_START_STATE);
    }

    getName(){
        return Constants.WIN_ANIMATION_STATE;
    }
}
