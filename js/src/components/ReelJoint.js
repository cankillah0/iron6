/**
 * Created by Admin on 16.05.17.
 */
import {AppProxy} from './../AppProxy';
import {Constants} from './../components/Constants';
import {StateMachine} from './../states/StateMachine';

export class ReelJoint{
    constructor(){
        AppProxy.getInstance().reelJoint = this;
        this.reels = [];
        this.leftReelIds = [];
        this.reelAddIcons = [];
        this.iconsPool = [];
        this.timeout = null;
        StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
    }

    onStateChange(state){
        switch (state.getName())
        {
            case(Constants.WIN_ANIMATION_STATE):
            case(Constants.IDLE_STATE):{
                clearTimeout(this.timeout);
                this.hideSparkles();
                this.updateReelJointValues(false);
                this.reels.length = 0;
                break;
            }
        }
    }

    start(reelIds){
        ReelJoint.shuffleArray(reelIds);
        this.setReelAddIconsCount(reelIds);
        let currentIds = reelIds.splice(0, 2);
        this.leftReelIds = reelIds;
        this.timeout = setTimeout(this.addReels.bind(this, currentIds),
            Constants.JOINT_IDLE_TIME);
    }

    addReels(reelIds){
        this.updateReels(reelIds);
        this.showSparkles(reelIds);
        this.updateReelJointValues(true);
        this.updateIconsPool();

        if (this.leftReelIds.length){
            this.timeout = setTimeout(this.addReels.bind(this, [this.leftReelIds.shift()]),
                Constants.JOINT_ADD_TIME);
        }
    }

    showSparkles(reelIds){
        for (let i = 0; i < reelIds.length; i++){
            AppProxy.getInstance().sparkles.show(reelIds[i]);
        }
    }

    hideSparkles(){
        AppProxy.getInstance().sparkles.hideAll();
    }

    updateReels(reelIds){
        let reels = AppProxy.getInstance().reels.getReels();
        for (let i = 0; i < reelIds.length; i++){
            this.reels.push(reels[reelIds[i]]);
        }
    }

    updateReelJointValues(value){
        for (let i = 0; i < this.reels.length; i++){
            this.reels[i].inJoint = value;
        }
    }

    updateIconsPool(){
        this.iconsPool = [];
        let iconId = ReelJoint.getRandomInt(0, 9);
        for (let i = 0; i < this.reels.length; i++){
            this.iconsPool.push(iconId);
        }
    }

    getRandomIcon(){
        if (!this.iconsPool.length){
            this.updateIconsPool();
        }
        return this.iconsPool.shift();
    }

    setReelAddIconsCount(reelIds){
       this.reelAddIcons = [];
       let last = reelIds[reelIds.length - 1];
       for (let i = 0; i < 6; i++){
           if (reelIds.indexOf(i) > -1){
               this.reelAddIcons.push(last);
           } else {
               this.reelAddIcons.push(i);
           }
       }
    }

    getReelAddIconsCount(index){
        return this.reelAddIcons[index];
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}
