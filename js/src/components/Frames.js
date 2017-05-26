/**
 * Created by Admin on 21.05.17.
 */
import {DisplayObject} from './../core/DisplayObject';
import {AssetsManager} from './AssetsManager';
import {Constants} from './Constants';
import {AppProxy} from './../AppProxy';

export class Frames extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        AppProxy.getInstance().frames = this;
        this.points = [];
        let xpos = [7, 192, 380, 566, 754, 938];
        for (let i = 0; i < xpos.length; i++){
            let list = [];
            for (let j = 0; j < 3; j++){
                let xp = xpos[i];
                let yp = 42 + j * Constants.ICON_HEIGHT;
                let point = {"x" : xp, "y" : yp};
                list.push(point);
            }
            this.points.push(list);
        }

        this.movieclips = [];
        for (let i = 0; i < xpos.length; i++){
            let point = this.points[i][0];
            let movieClip = new PIXI.extras.AnimatedSprite(
                new AssetsManager().getFramesAnimation());
            this.addChild(movieClip);
            this.movieclips.push(movieClip);
            movieClip.x = point.x;
            movieClip.y = point.y;
            movieClip.play();
            movieClip.scale.x = 1.2;
            movieClip.scale.y = 1.2;
            movieClip.visible = false;
        }
    }

    showLine(line){
        for (let i = 0; i < line.length; i++){
            let py = this.points[i][line[i]].y;
            let px = this.points[i][0].x;
            let clip = this.movieclips[i];
            TweenLite.to(clip, 0.3, {y : py, x: px})
            clip.visible = true;
            clip.play();
        }
    }

    setToCenter(){
        for (let i = 0; i < this.movieclips.length; i++){
            let clip = this.movieclips[i];
            clip.x = 470;
            clip.y = 42 + Constants.ICON_HEIGHT;
        }
    }

    hideAll(){
        for (let i = 0; i < this.movieclips.length; i++){
            let clip = this.movieclips[i];
            clip.visible = false;
            clip.stop();
        }
    }
}
