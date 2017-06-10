/**
 * Created by Admin on 20.05.17.
 */
import {Constants} from '../components/Constants';
import {AppProxy} from '../AppProxy';
import {StateMachine} from './StateMachine';
import {AppModel} from '../AppModel';
import {AssetsManager} from '../components/AssetsManager';

export class InitState{
    constructor(){}

    execute(){
        AppModel.getInstance().initReceivedSignal.addOnce(
            this.initDataReceived.bind(this));
        AppModel.getInstance().getInitData();

        AppProxy.getInstance().assetsLoadedSignal.addOnce(
            this.onAssetsLoadComplete.bind(this));
        this.manager = new AssetsManager();
        this.manager.loadAtlas();

        this.assetsLoadComplete = false;
        this.initResponseReceived = false;
    }

    onAssetsLoadComplete(){
        this.assetsLoadComplete = true;
        if (this.initResponseReceived){
            this.initComplete();
        }
    }

    initDataReceived(){
        this.initResponseReceived = true;
        if (this.assetsLoadComplete){
            this.initComplete();
        }
    }

    initComplete(){
        AppProxy.getInstance().appView.initialize();
        StateMachine.getInstance().setState(Constants.IDLE_STATE);
    }
}
