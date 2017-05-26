import {AssetsManager} from './AssetsManager';
import {AppProxy} from './../AppProxy';
import {Constants} from './Constants';
import {Icon} from './Icon';
import {Utils} from './Utils';
import {DisplayObject} from '../core/DisplayObject';

export class Reel extends DisplayObject{
    constructor(combination){
        super();

        this.combination = combination;
        this.inJoint = false;

        this.initialize();

        this.startSpin = this.startSpin.bind(this);
        this.stopSpin = this.stopSpin.bind(this);
        this.onStopSpinUpdate = this.onStopSpinUpdate.bind(this);
        this.onStopSpinComplete = this.onStopSpinComplete.bind(this);
        this.stopSpinCompleteSignal = new signals.Signal();
    }

    initialize(){
        this.createIcons();
    }

    createIcons(){
        this.icons = [];
        let textures = new AssetsManager().getIconTextures();
        for (let i = 0; i < 5; i++){
            let icon = new Icon(textures);
            this.addChild(icon);
            this.icons.push(icon);
            icon.y = (i - 1) * (Constants.ICON_HEIGHT);
            if (i > 0 && i < 4){
                icon.setFrame(this.combination[i - 1])
            } else {
                icon.setRandomFrame();
            }
        }
    }

    startSpin(){
        this.speed =  this.dy = this.ypos = 0;
        this.stops = false;
        this.stopIcons = null;
        this.limit = Constants.ICON_HEIGHT * 4;
        this.spinning = true;

        TweenLite.to(this, 0.5, { speed:Constants.SPEED_LIMIT, ease: Back.easeIn });
    }


    stopSpin(combination){
        this.stopIcons = combination;
        TweenLite.to(this, 0.4, { speed:25 });
    }

    immediateStopSpin(combination){
        this.spinning = false;
        this.setFinalPositions();
        if (this.stopTween){
            this.stopTween.kill();
        }
        for (let i = 0; i < 3; i++){
            let icon = this.icons[i];
            icon.setFrame(combination[i]);
        }
        this.stopSpinCompleteSignal.dispatch();
    }

    update(){
        if (!this.spinning) return;

        if (this.stopIcons && this.stopIcons.length == 0){
            if (this.stops){
                return;
            }
            this.stops = true;
            this.stopTween = TweenLite.to(this, 0.5, {ypos : Constants.ICON_HEIGHT - Utils.get0delta(this.icons),
                onUpdate: this.onStopSpinUpdate.bind(this),
                onComplete : this.onStopSpinComplete.bind(this),
                ease:  Back.easeOut.config(3.7)});
            return;
        }

        let delta = this.speed;

        for (let i = 0; i < 5; i++){
            let icon = this.icons[i];

            icon.y += delta;
            if (icon.y > this.limit){
                icon.y -= Constants.ICON_HEIGHT * 5;

                if (this.stopIcons){
                    icon.setFrame(this.stopIcons.shift());
                } else {
                    if (this.inJoint){
                        icon.setFrame(AppProxy.getInstance().reelJoint.getRandomIcon());
                    } else {
                        icon.setRandomFrame();
                    }
                }
            }
        }
    }

    onStopSpinUpdate(){
        let delta = this.ypos - this.dy;
        for (let i = 0; i < 5; i++) {
            let icon = this.icons[i];
            icon.y += delta;
        }
        this.dy = this.ypos;
    }

    onStopSpinComplete(){
        this.spinning = false;
        this.setFinalPositions();
        this.stopSpinCompleteSignal.dispatch();
    }

    setFinalPositions(){
        this.icons.sort(function(a, b){
            if (a.y > b.y) return 1;
            if (a.y < b.y) return -1;
        });

        for (let i = 0; i < this.icons.length; i++){
            this.icons[i].y = i * Constants.ICON_HEIGHT;
        }
        this.icons[this.icons.length - 1].y = -Constants.ICON_HEIGHT;
    }
}

