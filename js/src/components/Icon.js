

export class Icon extends PIXI.extras.AnimatedSprite{
    constructor(textures){
        super(textures);
        this.setFrame = this.setFrame.bind(this);
    }

    setRandomFrame(){
        this.gotoAndStop(Icon.getRandomInt(0, this.textures.length - 1));
    }

    setFrame(frame){
        if (frame < 0){
            this.setRandomFrame();
        } else {
            this.gotoAndStop(frame);
        }
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

