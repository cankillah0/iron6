/**
 * Created by Admin on 24.05.17.
 */
import {DisplayObject} from './../core/DisplayObject';
import {AssetsManager} from './AssetsManager';
import {AppModel} from './../AppModel';

export class BetPanel extends DisplayObject{
    constructor(){
        super();
        this.initialize();
        this.setLocation();
    }

    initialize(){
        this.linebet = new PIXI.Sprite(new AssetsManager().getLinesBetBackgroundTexture());
        this.addChild(this.linebet);
        this.linebet.scale.y = 1.2;

        this.lineText1 = this.getText(22);
        this.lineText1 .y += -15;
        this.lineText1 .x += -68;
        this.addChild(this.lineText1);

        this.lineText2 = this.getText(22);
        this.lineText2 .y += -15;
        this.lineText2 .x += -68 + 112;
        this.lineText2.text = "1";
        this.addChild(this.lineText2);


        this.totalbet = new PIXI.Sprite(new AssetsManager().getTotalBetBackgroundTexture());
        this.addChild(this.totalbet);
        this.totalbet.y += 37;
        this.totalbet.scale.y = 1.2;

        this.betText = this.getText(24);
        this.betText .y += 20;
        this.betText .x += 15;
        this.addChild(this.betText);

        AppModel.getInstance().reelsFrozenUpdateSignal.add(
            this.onReelsFrozenUpdate.bind(this));

        this.onReelsFrozenUpdate();
    }

    onReelsFrozenUpdate(){
        this.betText.text = AppModel.getInstance().getSpinPrice();
    }

    getText(fontSize){
        let text = new PIXI.Text('000',
            {
                fontFamily : 'Arial',
                fontSize: fontSize,
                fill : 0x66DFF4,
                align : 'center'
            });
        text.anchor.x = 0.5;
        text.x = 160;
        text.y = 31;
        text.alpha = 0.8;
        return text;
        //addChild(this.text);
    }

    setLocation(){
        this.x = 192;
        this.y = 64;
    }
}
