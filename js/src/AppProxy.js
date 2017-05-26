export class AppProxy {
    constructor(){
        this.initialize();
    }

    initialize(){
        this.appView = null;
        this.stage = null;
        this.reels = null;
        this.reelJoint = null;
        this.iconAnimations = null;
        this.lines = null;
        this.lightPanel = null;
        this.lightning = null;
        this.sparkles = null;
        this.ironDudes = null;
        this.frames = null;

        this.assetsLoadedSignal = new signals.Signal();
        this.immediateStopSpinSignal = new signals.Signal();
        this.startSpinSignal = new signals.Signal();
        this.stopSpinSignal = new signals.Signal();
    }
}

AppProxy.getInstance = function(){
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
}

