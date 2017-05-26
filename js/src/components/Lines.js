/**
 * Created by Admin on 10.05.17.
 */
import {DisplayObject} from '../core/DisplayObject';
import {Constants} from './Constants';
import {LinesButton} from '../components/buttons/LinesButton';
import {AssetsManager} from './AssetsManager';
import {Slider} from './Slider';
import {Frames} from './Frames';
import {AppModel} from '../AppModel';
import {AppProxy} from '../AppProxy';

export class Lines extends DisplayObject{
    constructor(){
        super();
        this.initialize();
    }

    initialize(){
        AppProxy.getInstance().lines = this;

        this.points = [];
        for (let i = 0; i < 6; i++){
            let list = [];
            for (let j = 0; j < 3; j++){
                let xp = i * 185 + 160;
                let yp = j * Constants.ICON_HEIGHT + 190;
                let point = {"x" : xp, "y" : yp};
                list.push(point);
            }
            this.points.push(list);
        }

        this.graphics = new PIXI.Graphics();
        this.graphics.clear();
        this.addChild(this.graphics);

        this.slider = new Slider();
        this.addChild(this.slider);
        this.slider.x = 1190;
        this.slider.y = 90;
        this.slider.valueUpdateSignal.add(this.onSliderValueUpdate.bind(this));
        this.slider.loseFocusSignal.add(this.onSliderLoseFocus.bind(this));

        this.frames = new Frames(this.points);
        this.addChild(this.frames);
    }

    drawLine(list){
        let point = this.points[0][list[0]];
        this.graphics.clear();
        this.graphics.lineStyle(5, 0x9C8137);
        this.graphics.moveTo(point.x, point.y);

        for (let i = 1; i < list.length; i++){
            point = this.points[i][list[i]];
            this.graphics.lineTo(point.x, point.y);
        }
    }

    showLines(){
        //this.frames.showLine(AppModel.getInstance().lines[0]);
    }

    hideLines(){
        this.graphics.clear();
    }

    onSliderLoseFocus(){
        this.hideLines();
    }

    onSliderValueUpdate(value){
        //this.drawLine(AppModel.LINES_MAP[value]);
    }
}
