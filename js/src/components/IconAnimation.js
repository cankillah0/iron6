/**
 * Created by Admin on 08.05.17.
 */

import {DisplayObject} from '../core/DisplayObject';
import {AssetsManager} from '../components/AssetsManager';
import {Constants} from './Constants';

export class IconAnimation extends DisplayObject {
    constructor(i, j){
        super();
        this.i = i;
        this.j = j;

        this.initialize();
        this.setLocation();

        //document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    initialize(){
        let textures = new AssetsManager().getIconAnimation(0);
        this.container = new PIXI.extras.AnimatedSprite(textures);
        this.container.visible = false;
        this.container.animationSpeed = 0.5;
        this.addChild(this.container);

        this.locationMap = [
            [53,25], [53,25], [14,27], [52,24], [18,27],
            [53,26], [-33,-7],[-31,-5],[-42,-2],[-21,-15]
        ];
    }

    setLocation(){
        this.defaultX = this.i * 185 - 100; if (this.i > 2) this.defaultX += 5;
        this.defaultY = this.j * Constants.ICON_HEIGHT + 70;
        this.x = this.defaultX;
        this.y = this.defaultY;
    }

    prepare(id){
        this.container.textures = new AssetsManager().getIconAnimation(id);
        this.container.updateTexture();
        this.x = this.defaultX + this.locationMap[id][0];
        this.y = this.defaultY + this.locationMap[id][1];
    }

    play(id){
        this.container.visible = true;
        this.container.play();
    }

    stop(){
        this.container.visible = false;
        this.container.gotoAndStop(0);
    }

    hide(){
        this.container.visible = false;
    }

    /*
     onKeyUp(event){
     var code = event.keyCode;
     if (code == 37){
     this.dx -= 1;
     this.x -=1;
     }
     if (code == 38){
     this.dy -= 1;
     this.y -=1;
     }
     if (code == 39){
     this.dx += 1;
     this.x +=1;
     }
     if (code == 40){
     this.dy += 1;
     this.y +=1;
     }
     if (code == 13){
     alert("x:"+this.dx +":y:"+this.dy);
     }
     }
     */
}
