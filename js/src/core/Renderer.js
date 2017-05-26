/**
 * Created by Admin on 05.05.17.
 */
import {AppProxy} from '../AppProxy';

export class Renderer{
    constructor(){
        this.initialize();
    }

    initialize(){
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight);
        document.body.appendChild(this.renderer.view);
        this._stage = new PIXI.Container();
        this._stage.hitArea = new PIXI.Rectangle(0, 0, 1262, 760);
        this._stage.interactive = true;
        this.renderer.render(this._stage);
        this._onUpdateSignal = new signals.Signal();
        AppProxy.getInstance().stage = this._stage;
        this.animate();
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this));
        this._onUpdateSignal.dispatch();
        this.renderer.render(this._stage);
    }

    get onUpdateSignal(){
        return this._onUpdateSignal;
    }

    get stage(){
        return this._stage;
    }
}

Renderer.getInstance = function(){
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
}
