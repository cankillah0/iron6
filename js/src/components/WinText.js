/**
 * Created by Admin on 17.05.17.
 */
import {DisplayObject} from './../core/DisplayObject';
import {StateMachine} from './../states/StateMachine';
import {Constants} from './Constants';
import {AppModel} from './../AppModel';

export class WinText extends DisplayObject{
    constructor(texture){
        super();

        this.container = new PIXI.Sprite(texture);
        this.addChild(this.container);

        this.container.scale.x = 1.7;
        this.container.scale.y = 1.7;

        this.setLocation();

        this.text = new PIXI.Text('0',
            {
                fontFamily : 'Arial',
                fontSize: 40,
                fill : 0x66DFF4,
                align : 'center'
            });
        this.text.anchor.x = 0.5;
        this.text.x = 160;
        this.text.y = 31;
        this.text.alpha = 0.7;
        this.text.text = AppModel.getInstance().balance;
        this.addChild(this.text);

        this.textObject = {"value" : AppModel.getInstance().balance};

        StateMachine.getInstance().stateChangeSignal.add(
            this.onStateChange.bind(this));
        AppModel.getInstance().balanceUpdateSignal.add(
            this.onBalanceUpdate.bind(this));
    }

    onStateChange(state){
        switch (state.getName()){
            case(Constants.WIN_ANIMATION_STATE):
            case(Constants.IDLE_STATE):{
                //this.startWinAnimation();
                break;
            }
        }
    }

    onBalanceUpdate(value){
        var currentBalance = Math.round(this.textObject.value);
        if (value < currentBalance){
            this.text.text = value;
            this.textObject.value = value;
        } else {
            this.startWinAnimation();
        }
    }

    startWinAnimation(){
        TweenLite.to(this.textObject, 2, {"value" : AppModel.getInstance().balance,
            onUpdate : this.onTweenUpdate.bind(this)});
    }

    onTweenUpdate(){
        this.text.text = Math.round(this.textObject.value);
    }

    setLocation(){
        this.x = 432;
        this.y = 65;
    }
}
