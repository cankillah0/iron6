/**
 * Created by Admin on 05.05.17.
 */
import {Renderer} from './Renderer.js';

export class DisplayObject extends PIXI.Sprite{
    constructor(){
        super();
        Renderer.getInstance().onUpdateSignal.add(this.update.bind(this));
    }

    update(){}
}
