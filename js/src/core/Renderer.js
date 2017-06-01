/**
 * Created by Admin on 05.05.17.
 */
import {AppProxy} from '../AppProxy';

export class Renderer{
    constructor(){
        this.initialize();
    }

    initialize(){

        var canvas = document.getElementById('canvas');
        this.renderer = PIXI.autoDetectRenderer(1262, 760, canvas);
        document.body.appendChild(this.renderer.view);
        this.renderer.view.style.position = 'absolute';
        this.renderer.view.style.left = '50%';
        this.renderer.view.style.top = '50%';
        this.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';

        this.ratio = 1262/760;

        this._stage = new PIXI.Container();
        this._stage.hitArea = new PIXI.Rectangle(0, 0, 1262, 760);
        this._stage.interactive = true;
        this.renderer.render(this._stage);
        this._onUpdateSignal = new signals.Signal();
        AppProxy.getInstance().stage = this._stage;
        this.animate();

        window.onresize = this.onWindowResize.bind(this);
        this.onWindowResize(null);
    }

    onWindowResize(event){
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / this.ratio;
        }
        this.renderer.view.style.width = w/1.2 + 'px';
        this.renderer.view.style.height = h/1.2 + 'px';
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
