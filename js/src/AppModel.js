import {ServiceProxy} from './components/ServiceProxy';
import {Constants} from './components/Constants';


export class AppModel{
    constructor(){
        this.service = new ServiceProxy();
        this.reelsFrozen = [false,false,false,false,false,false];
        this.freezable = [true, true, true, true, true, true];
        this.reelsJoint = [];
        this.combination = this.service.localCombination;
        this.balance = 10000;

        this.spinReceivedSignal = new signals.Signal();
        this.initReceivedSignal = new signals.Signal();
        this.balanceUpdateSignal = new signals.Signal();
        this.reelsFrozenUpdateSignal = new signals.Signal();
    }

    //-----------------------spin request-response handling-------------------------------//
    getSpinData(){
        this.service.spinResponseSignal.addOnce(this.onSpinResponseReceived.bind(this));
        this.service.sendSpinRequest(this.getSpinRequestData());
    }

    getSpinRequestData() {
        var data = Object.create(null);
        data.frozen = this.reelsFrozen;
        return data;
    }

    onSpinResponseReceived(data){
        this.combination = data.combination;
        this.lines       = data.lines;
        this.freezable   = data.freezable;
        this.reelsJoint  = data.joint;
        this.showDudes   = data.dudes;
        this.spinReceivedSignal.dispatch();
    }
    //----------------------init request-response handling---------------------------------//

    getInitData(){
        this.service.initResponseSignal.addOnce(this.onInitResponseReceived.bind(this));
        this.service.sendInitRequest(Object.create(null));
    }

    onInitResponseReceived(data){
        this.combination = data.combination;
        this.freezable   = data.freezable;
        this.initReceivedSignal.dispatch();
    }

    //-------------------------------------------------------------------------------------//
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

    updateBalance(){
        this.balance += this.lines.length * 1000;
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
