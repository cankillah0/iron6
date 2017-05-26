/**
 * Created by Admin on 12.05.17.
 */
import {Button} from './Button';

export class SliderButton extends Button{
    constructor(textures){
        super(textures);

        this.overSignal = new signals.Signal();
        this.outSignal = new signals.Signal();
        this.clickSignal = new signals.Signal();
        this.selected = false;
    }

    onMouseOver(){
        if (!this.selected){
            super.onMouseOver();
            this.overSignal.dispatch();
        }
    }

    onMouseOut(){
        if (!this.selected){
            super.onMouseOut();
            this.outSignal.dispatch();
        }
    }

    lock(){
        this.setActive(false);
    }

    unlock(){
        this.setActive(true);
    }

    onMouseDown(){
        super.onMouseDown();
        this.selected = true;
        this.clickSignal.dispatch();
    }

    setSelected(value){
        this.selected = value;
        this.onMouseOut();
    }

}
