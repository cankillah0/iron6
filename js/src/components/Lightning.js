/**
 * Created by Admin on 09.05.17.
 */
import {DisplayObject} from '../core/DisplayObject';
import {AssetsManager} from '../components/AssetsManager';
import {AppProxy} from '../AppProxy';
import {LightComponent} from './LightComponent';
import {AppModel} from '../AppModel';
import {StateMachine} from '../states/StateMachine';
import {Constants} from './Constants';

export class Lightning extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    onStateChange(state){
        switch (state.getName())
        {
            case(Constants.WIN_ANIMATION_STATE):{

                break;
            }
        }
    }

    initialize(){
        AppProxy.getInstance().lightning = this;
        this.createComponents();
        AppProxy.getInstance().lightPanel.buttonOverSignal.add(
            this.onPanelButtonOver.bind(this));
        AppProxy.getInstance().lightPanel.buttonOutSignal.add(
            this.onPanelButtonOut.bind(this));
        AppProxy.getInstance().lightPanel.buttonClickSignal.add(
            this.onPanelButtonClick.bind(this));
    }

    createComponents(){
        this.components = [];
        for (let i = 0; i < 6; i++){
            let component = new LightComponent(i);
            this.components.push(component);
            this.addChild(component);
        }
    }

    hideSide(){
        this.components[0].hideLight();
        this.components[this.components.length - 1].hideLight();
    }

    showSide(){
        this.components[0].showLight();
        this.components[this.components.length - 1].showLight();
    }

    hideAll(){
        for (let i = 0; i < 6; i++){
            let component = this.components[i];
            component.hide(true);
        }
    }

    onPanelButtonOver(index){
        this.components[index].show();
    }

    onPanelButtonOut(index){
        this.components[index].hide();
    }

    onPanelButtonClick(index){
        if (this.components[index].frozen){
            this.components[index].unfreeze();
            AppModel.getInstance().freezeReel(index, false);
        } else {
            this.components[index].freeze();
            AppModel.getInstance().freezeReel(index, true);
        }
    }
}
