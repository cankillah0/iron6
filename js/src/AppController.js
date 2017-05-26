/**
 * Created by 1 on 25.12.2016.
 */

import {AssetsManager} from './components/AssetsManager';
import {AppProxy} from './AppProxy';
import {AppView} from './AppView';
import {StateMachine} from './states/StateMachine';
import {Renderer} from './core/Renderer'

export class AppController{
    constructor() {
        this.initialize();
    }

    initialize(){
        let view = new AppView();
        Renderer.getInstance().stage.addChild(view);
        StateMachine.getInstance().initialize();
    }
}


