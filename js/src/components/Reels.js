import {Reel} from './Reel';
import {StateMachine} from './../states/StateMachine';
import {Constants} from './Constants';
import {AppModel} from './../AppModel';
import {AppProxy} from './../AppProxy';
import {DisplayObject} from '../core/DisplayObject'
import {ReelJoint} from './ReelJoint';

export class Reels extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        AppProxy.getInstance().reels = this;
        this.setLocation();
        this.createReels();
        this.reelsStopped = 0;
        this.reelsFrozenCount = 0;
        AppProxy.getInstance().immediateStopSpinSignal.add(
            this.immediateStopSpin.bind(this));
        this.reelJoint = new ReelJoint();
    }

    stopSpin(){
        let combination = AppModel.getInstance().combination;
        for (let i = 0; i < this.reels.length; i++){
            if (!AppModel.getInstance().reelsFrozen[i]){
                let list = this.getAddStopIcons(i);
                this.reels[i].stopSpin((combination[i].concat(list).reverse()));
            }
        }
    }

    getAddStopIcons(index){
        if (this.reels[index].inJoint){
            return new Array(this.reelJoint.getReelAddIconsCount(index)).fill(null);
        }
        return new Array(index).fill(null);
    }

    immediateStopSpin(){
        let combination = AppModel.getInstance().combination;
        for (let i = 0; i < this.reels.length; i++){
            if (!AppModel.getInstance().reelsFrozen[i]){
                this.reels[i].immediateStopSpin(combination[i]);
            }
        }
    }

    onReelSpinStopComplete(reel){
        this.reelsStopped++;
        if (this.reelsStopped == this.reelsUnfrozenCount){
            AppProxy.getInstance().stopSpinSignal.dispatch();
            this.getAllIconsMatrix()
        }
    }

    startSpin(){
        for (let i = 0; i < this.reels.length; i++){
            if (!AppModel.getInstance().reelsFrozen[i]){
                let reel = this.reels[i];
                reel.startSpin();
            }
        }
        this.reelsStopped = 0;
        this.reelsUnfrozenCount = AppModel.getInstance().getUnfrozenReelsCount();
    }

    startJoint(){
        let reelIds = AppModel.getInstance().reelsJoint.slice();
        AppProxy.getInstance().reelJoint.start(reelIds);
    }

    setLocation(){
        this.x = 60;
        this.y = 90;
    }

    createReels(){
        this.reels = [];
        let combination = AppModel.getInstance().combination;
        let offset = 185;
        for (let i = 0; i < 6; i++){

            var reel = new Reel(combination[i]);
            reel.id = i;
            this.reels.push(reel);
            this.addChild(reel);
            reel.x = offset * i; if (i > 2) reel.x += 5;
            reel.stopSpinCompleteSignal.add(this.onReelSpinStopComplete.bind(this));
        }
    }

    getAllIconsMatrix(){
        let result = [];
        for (let i = 0; i < this.reels.length; i++){
            let list = [];
            for (let j = 0; j < this.reels[i].icons.length - 2; j++){
                let icon = this.reels[i].icons[j];
                list.push(icon);
            }
            result.push(list);
        }
        return result;
    }

    getReels(){
        return this.reels;
    }
}
