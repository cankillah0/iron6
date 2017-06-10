/**
 * Created by me on 02.06.2017.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {StateMachine} from './StateMachine'

export class BigWinState{
    constructor(){}

    execute(){
        AppProxy.getInstance().bigwin.animationCompleteSignal.addOnce(
            this.onAnimationComplete.bind(this));
        AppProxy.getInstance().bigwin.show();
    }

    onAnimationComplete(){
        AppProxy.getInstance().bigwin.hide();
        StateMachine.getInstance().setState(Constants.WIN_ANIMATION_STATE);
    }

    getName(){
        return Constants.BIG_WIN_STATE;
    }
}
