import {AppProxy} from './../AppProxy.js';

export class AssetsManager{
    constructor() {
        this.initialize();
    }

    initialize() {}

    loadAtlas(){
        PIXI.loader
            .add("img/description.json")
            .add("img/atlas.png")
            .add("img/icon_animations_1.json")
            .add("img/icon_animations_1.png")
            .add("img/icon_animations_2.json")
            .add("img/icon_animations_2.png")
            .add("img/icon_animations_3.json")
            .add("img/icon_animations_3.png")
            .add("img/icon_animations_4.json")
            .add("img/icon_animations_4.png")
            .add("img/back.json")
            .add("img/back.png")
            .add("img/lightning.json")
            .add("img/lightning.png")
            .add("img/temp.json")
            .add("img/temp.png")
            .add("img/dude_1_1.json")
            .add("img/dude_1_1.png")
            .add("img/dude_1_2.json")
            .add("img/dude_1_2.png")
            .add("img/dude_2_1.json")
            .add("img/dude_2_1.png")
            .add("img/dude_2_2.json")
            .add("img/dude_2_2.png")
            .load(this.onAtlasLoaded);
    }

    onAtlasLoaded(){
        self.textures = Object.assign({},
            PIXI.loader.resources["img/description.json"].textures,
            PIXI.loader.resources["img/icon_animations_1.json"].textures,
            PIXI.loader.resources["img/icon_animations_2.json"].textures,
            PIXI.loader.resources["img/icon_animations_3.json"].textures,
            PIXI.loader.resources["img/icon_animations_4.json"].textures,
            PIXI.loader.resources["img/back.json"].textures,
            PIXI.loader.resources["img/lightning.json"].textures,
            PIXI.loader.resources["img/temp.json"].textures,
            PIXI.loader.resources["img/dude_1_1.json"].textures,
            PIXI.loader.resources["img/dude_1_2.json"].textures,
            PIXI.loader.resources["img/dude_2_1.json"].textures,
            PIXI.loader.resources["img/dude_2_2.json"].textures
        );

        AppProxy.getInstance().assetsLoadedSignal.dispatch();
    }

    getIconAnimation(id){
        var list = [];
        for (let i = 0; i < 100; i++){
            let name = "icon"+ id + " (" + (i) +").png";
            if (self.textures.hasOwnProperty(name)){
                list.push(self.textures[name]);
            } else {
                return list;
            }
        }
        return list;
    }

    getLightningAnimation(type){
        let prefix = type ? "_strong" : "_weak";
        var list = [];
        for (let i = 0; i < 100; i++){
            let name = "lightning" + prefix + " (" + (i) +").png";
            if (self.textures.hasOwnProperty(name)){
                list.push(self.textures[name]);
            } else {
                return list;
            }
        }
        return list;
    }

    getSparklesAnimation(){
        let list = [];
        for (let i = 0; i < 15; i++){
            let name = "sparkles (" + i + ").png";
            list.push(self.textures[name]);
        }
        return list;
    }

    getFramesAnimation(){
        let list = [];
        let i = 0;
        let name = "frame (" + i + ").png";
        while (self.textures.hasOwnProperty(name)){
            list.push(self.textures[name]);
            name = "frame (" + ++i +").png";
        }
        return list;
    }

    getLightningTubeTexture(){
        return self.textures["tube.png"];
    }

    getLightButtonTextures(dir){
        let prefix = dir ? "left" : "right";
        return [
            self.textures["light_" + prefix + "_button_over.png"],
            self.textures["light_" + prefix + "_button_default.png"],
            self.textures["light_" + prefix + "_button_click.png"],
            self.textures["light_" + prefix + "_button_disabled.png"],
        ];
    }

    getLinesButtonTextures(){
        return [
            self.textures["lines_button_over.png"],
            self.textures["lines_button_default.png"],
            self.textures["lines_button_click.png"],
            self.textures["lines_button_disabled.png"]
        ];
    }

    getSliderButtonTextures(){
        return [
            self.textures["slider_button_over.png"],
            self.textures["slider_button_default.png"],
            self.textures["slider_button_click.png"],
            self.textures["slider_button_disabled.png"]
        ];
    }

    getSpinButtonTextures(){
        return [
            self.textures["spin_button_default.png"],
            self.textures["spin_button_over.png"],
            self.textures["spin_button_click.png"],
            self.textures["spin_button_disabled.png"]
        ];
    }

    getStartButtonTextures(){
        return [
            self.textures["start_button_default.png"],
            self.textures["start_button_over.png"],
            self.textures["start_button_click.png.png"],
            self.textures["start_button_disabled.png"]
        ];
    }

    getStopButtonTextures(){
        return [
            self.textures["stop_button_over.png"],
            self.textures["stop_button_default.png"],
            self.textures["stop_button_click.png"],
            self.textures["stop_button_disabled.png"]
        ]
    }

    getInfoButtonTextures(){
        return [
            self.textures["info_button_over.png"],
            self.textures["info_button_default.png"],
            self.textures["info_button_click.png"],
            self.textures["info_button_disabled.png"]
        ]
    }

    getIconTextures(){
        return [
            self.textures["icon0.png"],
            self.textures["icon1.png"],
            self.textures["icon2.png"],
            self.textures["icon3.png"],
            self.textures["icon4.png"],
            self.textures["icon5.png"],
            self.textures["icon6.png"],
            self.textures["icon7.png"],
            self.textures["icon8.png"],
            self.textures["icon9.png"],
        ];
    }

    getDudeTextures(id){
        let list = [];
        let i = 0;
        let name = "dude_" + id + " (" + i + ").png";
        while (self.textures.hasOwnProperty(name)){
            list.push(self.textures[name]);
            name = "dude_" + id + " (" + ++i +").png";
        }
        return list;
    }

    getBackgroundTexture(){
        return self.textures["301.png"];
    }

    getBottomPanelTexture(){
        return self.textures["bottom_layer.png"];
    }

    getReelsBackgroundTexture(){
        return self.textures["reels_background.png"];
    }

    getWinTextBackgroundTexture(){
        return self.textures["win_field.png"]
    }

    getLinesBetBackgroundTexture(){
        return self.textures["linebet_panel.png"];
    }

    getTotalBetBackgroundTexture(){
        return self.textures["totalbet_panel.png"];
    }
}

AssetsManager.getInstance = function(){
    if (!this.instance){
        this.instance = new this();
    }
    return this.instance;
}
