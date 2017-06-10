/**
 * Created by Admin on 09.05.17.
 */
import {LightButton} from './buttons/LightButton';
import {AssetsManager} from './AssetsManager';
import {DisplayObject} from '../core/DisplayObject';
import {AppProxy} from '../AppProxy';
import {StateMachine} from '../states/StateMachine';
import {Constants} from './Constants';
import {AppModel} from './../AppModel';

export class LightPanel extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        AppProxy.getInstance().lightPanel = this;

        this.lightButtons = [];
        for (let i = 0; i < 6; i++){
            let dir = i < 3 ? 1 : 0;
            let button = new LightButton(new AssetsManager().getLightButtonTextures(dir), i);
            this.lightButtons.push(button);
            this.addChild(button);
            button.overSignal.add(this.onButtonOver.bind(this));
            button.outSignal.add(this.onButtonOut.bind(this));
            button.clickSignal.add(this.onButtonClick.bind(this));
        }
        this.buttonOverSignal = new signals.Signal();
        this.buttonOutSignal = new signals.Signal();
        this.buttonClickSignal = new signals.Signal();

        AppModel.getInstance().reelsFrozenUpdateSignal.add(
            this.reelsFrozenCountUpdate.bind(this));
    }

    onStateChange(state){
        switch (state.getName())
        {
            case (Constants.IDLE_STATE):
            case(Constants.WIN_ANIMATION_STATE):{
                this.reelsFrozenCountUpdate();
                break;
            }
        }
    }

    lockButtons(){
        for (let i = 0; i < 6; i++){
            let button = this.lightButtons[i];
            if (!button.selected){
                button.lock();
            }
        }
    }

    unlockButtons(){
        let freezable = AppModel.getInstance().freezable;
        for (let i = 0; i < 6; i++){
            let button = this.lightButtons[i];
            if (!button.selected && freezable[i]){
                button.unlock();
            }
        }
    }

    reelsFrozenCountUpdate(){
        let frozenCount = AppModel.getInstance().getFrozenReelsCount();
        let freezeValue = AppModel.getInstance().freezeValue;
        if (frozenCount == Constants.MAX_FROZEN_COUNT || freezeValue == 0){
            this.lockButtons();
        } else {
            this.unlockButtons();
        }
    }

    onButtonOver(index){
        this.buttonOverSignal.dispatch(index);
    }

    onButtonOut(index){
        this.buttonOutSignal.dispatch(index);
    }

    onButtonClick(index){
        this.buttonClickSignal.dispatch(index);
    }
}
