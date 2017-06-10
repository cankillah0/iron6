import {ServiceProxy} from './components/ServiceProxy';
import {Constants} from './components/Constants';
import {StateMachine} from './states/StateMachine';


export class AppModel{
    constructor(){
        this.service = new ServiceProxy();
        this.reelsFrozen = [false,false,false,false,false,false];
        this.freezable = [true, true, true, true, true, true];
        this.reelsJoint = [];
        this.combination = [];
        this.balance = 10000;
        this.linesCount = 239;

        this.spinReceivedSignal = new signals.Signal();
        this.initReceivedSignal = new signals.Signal();
        this.balanceUpdateSignal = new signals.Signal();
        this.linesCountUpdateSignal = new signals.Signal();
        this.reelsFrozenUpdateSignal = new signals.Signal();
        this.reelsFrozenExceedSignal = new signals.Signal();

        StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
    }

    onStateChange(state){
        switch (state.getName()){
            case (Constants.BIG_WIN_STATE):
            case (Constants.IDLE_STATE):
            case (Constants.WIN_ANIMATION_STATE):{
                this.handleFreezeValue();
                break;
            }
        }
    }



    //-----------------------spin request-response handling-------------------------------//
    getSpinData(){
        this.service.spinResponseSignal.addOnce(this.onSpinResponseReceived.bind(this));
        this.service.sendSpinRequest(this.getSpinRequestData());
    }

    getSpinRequestData() {
        var data = Object.create(null);
        data.frozen    = this.parseFreezable(this.reelsFrozen, 0);
        data.sessionId = this.sessionId;
        return data;
    }

    onSpinResponseReceived(data){
        this.combination = data.combination;
        this.lines       = data.lines;
        this.freezable   = this.parseFreezable(data.freezable, 1);
        this.reelsJoint  = data.joint;
        this.showDudes   = data.dudes;
        this.freezeValue = data.freezevalue;
        this.bigwin      = data.bigwin;
        this.balance     = data.balance;
        this.spinReceivedSignal.dispatch();
    }
    //----------------------init request-response handling---------------------------------//

    getInitData(){
        this.service.initResponseSignal.addOnce(this.onInitResponseReceived.bind(this));
        this.service.sendInitRequest(Object.create(null));
    }

    onInitResponseReceived(data){
        this.combination = data.combination;
        this.freezable   = this.parseFreezable(data.freezable, 1);
        this.sessionId   = data.sessionId;
        this.freezeValue = data.freezeValue;
        this.balance     = data.balance;
        this.initReceivedSignal.dispatch();
    }

    //-------------------------------------------------------------------------------------//
    handleFreezeValue(){
        var value = this.freezeValue - this.getFrozenReelsCount();
        if (value < 0){
            this.dropFrozenReels();
            this.reelsFrozenExceedSignal.dispatch();

        } else {
            this.freezeValue = value;
            this.reelsFrozenUpdateSignal.dispatch();
        }
    }

    parseFreezable(raw, direction){
        let result = [];
        if (direction == 1){
            for (let i = 0; i < 6; i++){
                if (raw.indexOf(i) < 0){
                    result.push(false);
                } else {
                    result.push(true);
                }
            }
        } else {
            for (let i = 0; i < 6; i++){
                if (raw[i]){
                    result.push(i);
                }
            }
        }
        return result;
    }


    splitFrozenCombination(combination){
        for (let i = 0; i < this.reelsFrozen.length; i++){
            if (this.reelsFrozen[i]){
                combination[i] = this.combination[i];
            }
        }
        return combination;
    }

    freezeReel(index, value){
        this.reelsFrozen[index] = value;
        if (value){
            this.freezeValue -= 1;
        } else {
            this.freezeValue += 1;
        }
        this.reelsFrozenUpdateSignal.dispatch();
    }

    dropFrozenReels(){
        this.reelsFrozen = [false,false,false,false,false,false];
    }

    getUnfrozenReelsCount(){
        let count = 0;
        for (let i = 0; i < this.reelsFrozen.length; i++){
            if (!this.reelsFrozen[i]){
                count++;
            }
        }
        return count;
    }

    getFrozenReelsCount(){
        let count = 0;
        for (let i = 0; i < this.reelsFrozen.length; i++){
            if (this.reelsFrozen[i]){
                count++;
            }
        }
        return count;
    }

    getSpinTime(){
        let time = Constants.SPIN_TIME;
        if (this.showDudes){
            time += Constants.DUDES_TIME;
        }
        if (this.reelsJoint.length){
            time += this.reelsJoint.length * Constants.JOINT_ADD_TIME;
            if (this.showDudes){
                time -= Constants.DUDES_TIME;
            }
        }
        return time;
    }

    updateLinesCount(value){
        this.linesCount = value;
        this.linesCountUpdateSignal.dispatch(value);
    }

    updateBalance(){
        this.balanceUpdateSignal.dispatch(this.balance);
    }

    reduceBalance(){
        this.balance -= this.getSpinPrice();
        this.balanceUpdateSignal.dispatch(this.balance);
    }

    getSpinPrice(){
        return 100 + this.getFrozenReelsCount() * 100;
    }
}

AppModel.getInstance = function(){
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};
