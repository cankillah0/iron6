/**
 * Created by Admin on 06.05.17.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {StateMachine} from './StateMachine'

export class IdleState{
    constructor(){}

    execute(){
        AppProxy.getInstance().startSpinSignal.addOnce(this.onStartSpin.bind(this));
    }

    onStartSpin(){
        StateMachine.getInstance().setState(Constants.SPIN_START_STATE);
    }

    getName(){
        return Constants.IDLE_STATE;
    }
}
