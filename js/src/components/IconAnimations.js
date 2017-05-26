/**
 * Created by Admin on 08.05.17.
 */

import {DisplayObject} from '../core/DisplayObject';
import {IconAnimation} from './IconAnimation';
import {AppProxy} from '../AppProxy';
import {AppModel} from '../AppModel';
import {Constants} from './Constants';

export class IconAnimations extends DisplayObject{
    constructor(){
        super();
        this.initialize();
        this.setLocation();
        AppProxy.getInstance().iconAnimations = this;
    }

    initialize(){
        this.animationsList = [];
        this.animationsMatrix = [];
        this.linesIndex = 0;
        this.lineDelay = Constants.LINE_DEF_DELAY;
        this.timeout = null;

        for (let i = 0; i < 6; i++){
            let list = [];
            for (let j = 0; j < 3; j++){
                let animation = new IconAnimation(i, j);
                this.addChild(animation);
                this.animationsList.push(animation);
                list.push(animation);
            }
            this.animationsMatrix.push(list);
        }
    }

    setLocation(){
        this.x = 160;
        this.y = 20;
    }

    prepareAnimation(){
        let combination = AppModel.getInstance().combination;
        for (let i = 0; i < 6; i++){
            for (let j = 0; j < 3; j++){
                this.animationsMatrix[i][j].prepare(combination[i][j]);
            }
        }
    }

    playAnimation(){
        let lines = AppModel.getInstance().lines;
        let combination = AppModel.getInstance().combination;
        AppProxy.getInstance().frames.setToCenter();
        this.linesIndex = 0;
        if (lines.length){
             this.playNext(lines, combination);
        }
    }

   // getLinesDiff(lines){
       // for (let i = 0; )
   // }

    playNext(lines, combination){
        let line = lines[this.linesIndex];
        this.stopAnimation();
        this.showFrames(line);
        this.hideIcons(line);
        for (let i = 0; i < line.length; i++){
            this.animationsMatrix[i][line[i]].play(combination[i][line[i]]);
        }
        if (this.linesIndex < lines.length - 1){
            this.linesIndex++;
        } else {
            this.linesIndex = 0;
            this.lineDelay = Constants.LINE_SHORT_DELAY;
        }

        this.lineDelay = Constants.ANIMATION_DURATION_MAP[this.__getLineId(line,combination)] * 1000;
        this.timeout = setTimeout(this.playNext.bind(this), this.lineDelay, lines, combination);
    }

//TODO transfer this shit to server
    __getLineId(line, combination){
        let list = [];
        for (let i = 0; i < line.length; i++){
            list.push(combination[i][line[i]]);
        }
        list = list.sort();
        return list[0];
    }

    stopAnimation(){
        for (let i = 0; i < this.animationsList.length; i++){
            this.animationsList[i].stop();
        }
        AppProxy.getInstance().frames.hideAll();
        let icons = AppProxy.getInstance().reels.getAllIconsMatrix();
        for (let i = 0; i < icons.length; i++){
            for (let j = 0; j < icons[i].length; j++){
                icons[i][j].visible = true;
                icons[i][j].alpha = 1;
            }
        }
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    hideIcons(line){
        let icons = AppProxy.getInstance().reels.getAllIconsMatrix();

        for (let i = 0; i < icons.length; i++){
            for (let j = 0; j < icons[i].length; j++){
                icons[i][j].visible = true;
                icons[i][j].alpha = 0.6;
            }
        }
        for (let i = 0; i < line.length; i++){
            icons[i][line[i]].visible = false;
        }
    }

    showFrames(line){
        AppProxy.getInstance().frames.hideAll();
        AppProxy.getInstance().frames.showLine(line);
    }
}
