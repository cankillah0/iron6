import {IdleState} from './IdleState';
import {InitState} from './InitState';
import {SpinStartState} from './SpinStartState';
import {SpinStopState} from './SpinStopState';
import {WinAnimationState} from './WinAnimationState';
import {Constants} from '../components/Constants'

export class StateMachine{
    constructor(){
        this.stateChangeSignal = new signals.Signal();

        this.stateMap = Object.create(null);
        this.stateMap[Constants.INIT_STATE] = new InitState();
        this.stateMap[Constants.IDLE_STATE] = new IdleState();
        this.stateMap[Constants.SPIN_START_STATE] = new SpinStartState();
        this.stateMap[Constants.SPIN_STOP_STATE] = new SpinStopState();
        this.stateMap[Constants.WIN_ANIMATION_STATE] = new WinAnimationState();
    }

    initialize(){
        this.setState(Constants.INIT_STATE);
    }

    setState(stateName){
        this.currentState = this.stateMap[stateName];
        this.stateChangeSignal.dispatch(this.currentState);
        this.currentState.execute();
    }

    getCurrentState(){
        return this.currentState;
    }
}

StateMachine.getInstance = function(){
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
}

