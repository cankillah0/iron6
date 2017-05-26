/**
 * Created by Admin on 11.05.17.
 */
import {Button} from './Button';

export class LinesButton extends Button{
    constructor(textures, index){
        super(textures);

        this.index = index;

        this.overSignal = new signals.Signal();
        this.outSignal = new signals.Signal();
        this.clickSignal = new signals.Signal();
    }

    onMouseOver(){
        super.onMouseOver();
        this.overSignal.dispatch(this.index);
    }

    onMouseOut(){
        if (!this.selected){
            this.gotoAndStop(0);
            this.outSignal.dispatch(this.index);
        } else {
            this.gotoAndStop(2);
        }
    }

    onMouseDown(){
        super.onMouseDown();
        this.selected = !this.selected;
        this.clickSignal.dispatch(this.index);
    }
}
