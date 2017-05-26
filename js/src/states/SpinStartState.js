/**
 * Created by Admin on 06.05.17.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {AppModel} from '../AppModel';
import {StateMachine} from './StateMachine';

export class SpinStartState{
    constructor(){}

    execute(){
        AppProxy.getInstance().reels.startSpin();
        AppModel.getInstance().spinReceivedSignal.addOnce(
            this.spinDataReceived.bind(this));
        AppModel.getInstance().getSpinData();
        AppModel.getInstance().reduceBalance();
    }

    spinDataReceived(){
        StateMachine.getInstance().setState(Constants.SPIN_STOP_STATE);
    }

    getName(){
        return Constants.SPIN_START_STATE;
    }
}
