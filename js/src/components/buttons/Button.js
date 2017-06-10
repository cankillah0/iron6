/**
 * Created by Admin on 06.05.17.
 */
import {StateMachine} from '../../states/StateMachine.js';
import {AppProxy} from '../../AppProxy.js';
import {Constants} from '../Constants.js';

export class Button extends PIXI.extras.AnimatedSprite {
    constructor(textures){
        super(textures);
        this.initialize();
    }

    onStateChange(state){}
    setLocation(){}

    initialize(){
        this.interactive = true;
        this.on('mouseover', this.onMouseOver.bind(this));
        this.on('mouseout', this.onMouseOut.bind(this));
        this.on('pointerdown', this.onMouseDown.bind(this));
        StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
    }

    setActive(value){
        this.interactive = value;
        let v = value ? 0 : 3;
        this.gotoAndStop(v);
    }

    setVisible(value){
        this.visible = value;
    }

    onMouseOver(){
        this.gotoAndStop(1);
    }

    onMouseOut(){
        this.gotoAndStop(0);
    }

    onMouseDown(){
        this.gotoAndStop(2);
    }
}
