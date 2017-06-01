(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AppController = require('./src/AppController');

var controller = new _AppController.AppController();

},{"./src/AppController":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by 1 on 25.12.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _AssetsManager = require('./components/AssetsManager');

var _AppProxy = require('./AppProxy');

var _AppView = require('./AppView');

var _StateMachine = require('./states/StateMachine');

var _Renderer = require('./core/Renderer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = exports.AppController = function () {
    function AppController() {
        _classCallCheck(this, AppController);

        this.initialize();
    }

    _createClass(AppController, [{
        key: 'initialize',
        value: function initialize() {
            var view = new _AppView.AppView();
            _Renderer.Renderer.getInstance().stage.addChild(view);
            _StateMachine.StateMachine.getInstance().initialize();
        }
    }]);

    return AppController;
}();

},{"./AppProxy":4,"./AppView":5,"./components/AssetsManager":6,"./core/Renderer":38,"./states/StateMachine":43}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ServiceProxy = require('./components/ServiceProxy');

var _Constants = require('./components/Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppModel = exports.AppModel = function () {
    function AppModel() {
        _classCallCheck(this, AppModel);

        this.service = new _ServiceProxy.ServiceProxy();
        this.reelsFrozen = [false, false, false, false, false, false];
        this.freezable = [true, true, true, true, true, true];
        this.reelsJoint = [];
        this.combination = this.service.localCombination;
        this.balance = 10000;

        this.spinReceivedSignal = new signals.Signal();
        this.initReceivedSignal = new signals.Signal();
        this.balanceUpdateSignal = new signals.Signal();
        this.reelsFrozenUpdateSignal = new signals.Signal();
    }

    //-----------------------spin request-response handling-------------------------------//


    _createClass(AppModel, [{
        key: 'getSpinData',
        value: function getSpinData() {
            this.service.spinResponseSignal.addOnce(this.onSpinResponseReceived.bind(this));
            this.service.sendSpinRequest(this.getSpinRequestData());
        }
    }, {
        key: 'getSpinRequestData',
        value: function getSpinRequestData() {
            var data = Object.create(null);
            data.frozen = this.reelsFrozen;
            return data;
        }
    }, {
        key: 'onSpinResponseReceived',
        value: function onSpinResponseReceived(data) {
            this.combination = data.combination;
            this.lines = data.lines;
            this.freezable = data.freezable;
            this.reelsJoint = data.joint;
            this.showDudes = data.dudes;
            this.spinReceivedSignal.dispatch();
        }
        //----------------------init request-response handling---------------------------------//

    }, {
        key: 'getInitData',
        value: function getInitData() {
            this.service.initResponseSignal.addOnce(this.onInitResponseReceived.bind(this));
            this.service.sendInitRequest(Object.create(null));
        }
    }, {
        key: 'onInitResponseReceived',
        value: function onInitResponseReceived(data) {
            this.combination = data.combination;
            this.freezable = data.freezable;
            this.initReceivedSignal.dispatch();
        }

        //-------------------------------------------------------------------------------------//

    }, {
        key: 'splitFrozenCombination',
        value: function splitFrozenCombination(combination) {
            for (var i = 0; i < this.reelsFrozen.length; i++) {
                if (this.reelsFrozen[i]) {
                    combination[i] = this.combination[i];
                }
            }
            return combination;
        }
    }, {
        key: 'freezeReel',
        value: function freezeReel(index, value) {
            this.reelsFrozen[index] = value;
            this.reelsFrozenUpdateSignal.dispatch();
        }
    }, {
        key: 'dropFrozenReels',
        value: function dropFrozenReels() {
            this.reelsFrozen = [false, false, false, false, false, false];
        }
    }, {
        key: 'getUnfrozenReelsCount',
        value: function getUnfrozenReelsCount() {
            var count = 0;
            for (var i = 0; i < this.reelsFrozen.length; i++) {
                if (!this.reelsFrozen[i]) {
                    count++;
                }
            }
            return count;
        }
    }, {
        key: 'getFrozenReelsCount',
        value: function getFrozenReelsCount() {
            var count = 0;
            for (var i = 0; i < this.reelsFrozen.length; i++) {
                if (this.reelsFrozen[i]) {
                    count++;
                }
            }
            return count;
        }
    }, {
        key: 'getSpinTime',
        value: function getSpinTime() {
            var time = _Constants.Constants.SPIN_TIME;
            if (this.showDudes) {
                time += _Constants.Constants.DUDES_TIME;
            }
            if (this.reelsJoint.length) {
                time += this.reelsJoint.length * _Constants.Constants.JOINT_ADD_TIME;
                if (this.showDudes) {
                    time -= _Constants.Constants.DUDES_TIME;
                }
            }
            return time;
        }
    }, {
        key: 'updateBalance',
        value: function updateBalance() {
            this.balance += this.lines.length * 1000;
            this.balanceUpdateSignal.dispatch(this.balance);
        }
    }, {
        key: 'reduceBalance',
        value: function reduceBalance() {
            this.balance -= this.getSpinPrice();
            this.balanceUpdateSignal.dispatch(this.balance);
        }
    }, {
        key: 'getSpinPrice',
        value: function getSpinPrice() {
            return 100 + this.getFrozenReelsCount() * 100;
        }
    }]);

    return AppModel;
}();

AppModel.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};

},{"./components/Constants":10,"./components/ServiceProxy":24}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppProxy = exports.AppProxy = function () {
    function AppProxy() {
        _classCallCheck(this, AppProxy);

        this.initialize();
    }

    _createClass(AppProxy, [{
        key: "initialize",
        value: function initialize() {
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
    }]);

    return AppProxy;
}();

AppProxy.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BottomPanel = require('./components/BottomPanel');

var _Background = require('./components/Background');

var _AssetsManager = require('./components/AssetsManager');

var _Reels = require('./components/Reels');

var _DisplayObject2 = require('./core/DisplayObject');

var _IconAnimations = require('./components/IconAnimations');

var _Lightning = require('./components/Lightning');

var _Lines = require('./components/Lines');

var _Sparkles = require('./components/Sparkles');

var _IronDudes = require('./components/IronDudes');

var _AppProxy = require('./AppProxy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by 1 on 29.12.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var AppView = exports.AppView = function (_DisplayObject) {
    _inherits(AppView, _DisplayObject);

    function AppView() {
        _classCallCheck(this, AppView);

        var _this = _possibleConstructorReturn(this, (AppView.__proto__ || Object.getPrototypeOf(AppView)).call(this));

        _AppProxy.AppProxy.getInstance().appView = _this;
        return _this;
    }

    _createClass(AppView, [{
        key: 'initialize',
        value: function initialize() {
            this.addBackground();
            this.addBottomPanel();
            this.addLines();
            this.addReels();
            this.addIconsAnimation();
            this.addLightning();
            this.addSparkles();
            this.addIronDude();
        }
    }, {
        key: 'addBottomPanel',
        value: function addBottomPanel() {
            this.bottomPanel = new _BottomPanel.BottomPanel(new _AssetsManager.AssetsManager().getBottomPanelTexture());
            this.addChild(this.bottomPanel);
        }
    }, {
        key: 'addBackground',
        value: function addBackground() {
            this.backGround = new _Background.Background(new _AssetsManager.AssetsManager().getBackgroundTexture());
            this.addChild(this.backGround);
        }
    }, {
        key: 'addReels',
        value: function addReels() {
            this.reels = new _Reels.Reels(new _AssetsManager.AssetsManager().getReelsBackgroundTexture());
            this.addChild(this.reels);

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0x000000);
            graphics.drawRect(69, 108, 1109, 495);
            this.reels.mask = graphics;
            this.addChild(graphics);
        }
    }, {
        key: 'addIconsAnimation',
        value: function addIconsAnimation() {
            this.iconAnimations = new _IconAnimations.IconAnimations();
            this.addChild(this.iconAnimations);
        }
    }, {
        key: 'addLightning',
        value: function addLightning() {
            this.lightning = new _Lightning.Lightning();
            this.addChild(this.lightning);
        }
    }, {
        key: 'addLines',
        value: function addLines() {
            this.lines = new _Lines.Lines();
            this.addChild(this.lines);
        }
    }, {
        key: 'addSparkles',
        value: function addSparkles() {
            this.sparkles = new _Sparkles.Sparkles();
            this.addChild(this.sparkles);
        }
    }, {
        key: 'addIronDude',
        value: function addIronDude() {}
    }]);

    return AppView;
}(_DisplayObject2.DisplayObject);

},{"./AppProxy":4,"./components/AssetsManager":6,"./components/Background":7,"./components/BottomPanel":9,"./components/IconAnimations":14,"./components/IronDudes":16,"./components/Lightning":19,"./components/Lines":20,"./components/Reels":23,"./components/Sparkles":26,"./core/DisplayObject":37}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AssetsManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppProxy = require("./../AppProxy.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssetsManager = exports.AssetsManager = function () {
    function AssetsManager() {
        _classCallCheck(this, AssetsManager);

        this.initialize();
    }

    _createClass(AssetsManager, [{
        key: "initialize",
        value: function initialize() {}
    }, {
        key: "loadAtlas",
        value: function loadAtlas() {
            PIXI.loader.add("img/description.json").add("img/atlas.png").add("img/icon_animations_1.json").add("img/icon_animations_1.png").add("img/icon_animations_2.json").add("img/icon_animations_2.png").add("img/icon_animations_3.json").add("img/icon_animations_3.png").add("img/icon_animations_4.json").add("img/icon_animations_4.png").add("img/back.json").add("img/back.png").add("img/lightning.json").add("img/lightning.png").add("img/temp.json").add("img/temp.png")
            //.add("img/dude_1_1.json")
            //.add("img/dude_1_1.png")
            //.add("img/dude_1_2.json")
            //.add("img/dude_1_2.png")
            //.add("img/dude_2_1.json")
            //.add("img/dude_2_1.png")
            //.add("img/dude_2_2.json")
            //.add("img/dude_2_2.png")
            .load(this.onAtlasLoaded);
        }
    }, {
        key: "onAtlasLoaded",
        value: function onAtlasLoaded() {
            self.textures = Object.assign({}, PIXI.loader.resources["img/description.json"].textures, PIXI.loader.resources["img/icon_animations_1.json"].textures, PIXI.loader.resources["img/icon_animations_2.json"].textures, PIXI.loader.resources["img/icon_animations_3.json"].textures, PIXI.loader.resources["img/icon_animations_4.json"].textures, PIXI.loader.resources["img/back.json"].textures, PIXI.loader.resources["img/lightning.json"].textures, PIXI.loader.resources["img/temp.json"].textures);

            _AppProxy.AppProxy.getInstance().assetsLoadedSignal.dispatch();
        }
    }, {
        key: "getIconAnimation",
        value: function getIconAnimation(id) {
            var list = [];
            for (var i = 0; i < 100; i++) {
                var name = "icon" + id + " (" + i + ").png";
                if (self.textures.hasOwnProperty(name)) {
                    list.push(self.textures[name]);
                } else {
                    return list;
                }
            }
            return list;
        }
    }, {
        key: "getLightningAnimation",
        value: function getLightningAnimation(type) {
            var prefix = type ? "_strong" : "_weak";
            var list = [];
            for (var i = 0; i < 100; i++) {
                var name = "lightning" + prefix + " (" + i + ").png";
                if (self.textures.hasOwnProperty(name)) {
                    list.push(self.textures[name]);
                } else {
                    return list;
                }
            }
            return list;
        }
    }, {
        key: "getSparklesAnimation",
        value: function getSparklesAnimation() {
            var list = [];
            for (var i = 0; i < 15; i++) {
                var name = "sparkles (" + i + ").png";
                list.push(self.textures[name]);
            }
            return list;
        }
    }, {
        key: "getFramesAnimation",
        value: function getFramesAnimation() {
            var list = [];
            var i = 0;
            var name = "frame (" + i + ").png";
            while (self.textures.hasOwnProperty(name)) {
                list.push(self.textures[name]);
                name = "frame (" + ++i + ").png";
            }
            return list;
        }
    }, {
        key: "getLightningTubeTexture",
        value: function getLightningTubeTexture() {
            return self.textures["tube.png"];
        }
    }, {
        key: "getLightButtonTextures",
        value: function getLightButtonTextures(dir) {
            var prefix = dir ? "left" : "right";
            return [self.textures["light_" + prefix + "_button_over.png"], self.textures["light_" + prefix + "_button_default.png"], self.textures["light_" + prefix + "_button_click.png"], self.textures["light_" + prefix + "_button_disabled.png"]];
        }
    }, {
        key: "getLinesButtonTextures",
        value: function getLinesButtonTextures() {
            return [self.textures["lines_button_over.png"], self.textures["lines_button_default.png"], self.textures["lines_button_click.png"], self.textures["lines_button_disabled.png"]];
        }
    }, {
        key: "getSliderButtonTextures",
        value: function getSliderButtonTextures() {
            return [self.textures["slider_button_over.png"], self.textures["slider_button_default.png"], self.textures["slider_button_click.png"], self.textures["slider_button_disabled.png"]];
        }
    }, {
        key: "getSpinButtonTextures",
        value: function getSpinButtonTextures() {
            return [self.textures["spin_button_default.png"], self.textures["spin_button_over.png"], self.textures["spin_button_click.png"], self.textures["spin_button_disabled.png"]];
        }
    }, {
        key: "getStartButtonTextures",
        value: function getStartButtonTextures() {
            return [self.textures["start_button_default.png"], self.textures["start_button_over.png"], self.textures["start_button_click.png.png"], self.textures["start_button_disabled.png"]];
        }
    }, {
        key: "getStopButtonTextures",
        value: function getStopButtonTextures() {
            return [self.textures["stop_button_over.png"], self.textures["stop_button_default.png"], self.textures["stop_button_click.png"], self.textures["stop_button_disabled.png"]];
        }
    }, {
        key: "getInfoButtonTextures",
        value: function getInfoButtonTextures() {
            return [self.textures["info_button_over.png"], self.textures["info_button_default.png"], self.textures["info_button_click.png"], self.textures["info_button_disabled.png"]];
        }
    }, {
        key: "getIconTextures",
        value: function getIconTextures() {
            return [self.textures["icon0.png"], self.textures["icon1.png"], self.textures["icon2.png"], self.textures["icon3.png"], self.textures["icon4.png"], self.textures["icon5.png"], self.textures["icon6.png"], self.textures["icon7.png"], self.textures["icon8.png"], self.textures["icon9.png"]];
        }
    }, {
        key: "getDudeTextures",
        value: function getDudeTextures(id) {
            var list = [];
            var i = 0;
            var name = "dude_" + id + " (" + i + ").png";
            while (self.textures.hasOwnProperty(name)) {
                list.push(self.textures[name]);
                name = "dude_" + id + " (" + ++i + ").png";
            }
            return list;
        }
    }, {
        key: "getBackgroundTexture",
        value: function getBackgroundTexture() {
            return self.textures["301.png"];
        }
    }, {
        key: "getBottomPanelTexture",
        value: function getBottomPanelTexture() {
            return self.textures["bottom_layer.png"];
        }
    }, {
        key: "getReelsBackgroundTexture",
        value: function getReelsBackgroundTexture() {
            return self.textures["reels_background.png"];
        }
    }, {
        key: "getWinTextBackgroundTexture",
        value: function getWinTextBackgroundTexture() {
            return self.textures["win_field.png"];
        }
    }, {
        key: "getLinesBetBackgroundTexture",
        value: function getLinesBetBackgroundTexture() {
            return self.textures["linebet_panel.png"];
        }
    }, {
        key: "getTotalBetBackgroundTexture",
        value: function getTotalBetBackgroundTexture() {
            return self.textures["totalbet_panel.png"];
        }
    }]);

    return AssetsManager;
}();

AssetsManager.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};

},{"./../AppProxy.js":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by 1 on 30.12.2016.
 */
var Background = exports.Background = function (_PIXI$Sprite) {
    _inherits(Background, _PIXI$Sprite);

    function Background(texture) {
        _classCallCheck(this, Background);

        return _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).call(this, texture));
    }

    return Background;
}(PIXI.Sprite);

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BetPanel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('./../core/DisplayObject');

var _AssetsManager = require('./AssetsManager');

var _AppModel = require('./../AppModel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 24.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var BetPanel = exports.BetPanel = function (_DisplayObject) {
    _inherits(BetPanel, _DisplayObject);

    function BetPanel() {
        _classCallCheck(this, BetPanel);

        var _this = _possibleConstructorReturn(this, (BetPanel.__proto__ || Object.getPrototypeOf(BetPanel)).call(this));

        _this.initialize();
        _this.setLocation();
        return _this;
    }

    _createClass(BetPanel, [{
        key: 'initialize',
        value: function initialize() {
            this.linebet = new PIXI.Sprite(new _AssetsManager.AssetsManager().getLinesBetBackgroundTexture());
            this.addChild(this.linebet);
            this.linebet.scale.y = 1.2;

            this.lineText1 = this.getText(22);
            this.lineText1.y += -15;
            this.lineText1.x += -68;
            this.addChild(this.lineText1);

            this.lineText2 = this.getText(22);
            this.lineText2.y += -15;
            this.lineText2.x += -68 + 112;
            this.lineText2.text = "1";
            this.addChild(this.lineText2);

            this.totalbet = new PIXI.Sprite(new _AssetsManager.AssetsManager().getTotalBetBackgroundTexture());
            this.addChild(this.totalbet);
            this.totalbet.y += 37;
            this.totalbet.scale.y = 1.2;

            this.betText = this.getText(24);
            this.betText.y += 20;
            this.betText.x += 15;
            this.addChild(this.betText);

            _AppModel.AppModel.getInstance().reelsFrozenUpdateSignal.add(this.onReelsFrozenUpdate.bind(this));

            this.onReelsFrozenUpdate();
        }
    }, {
        key: 'onReelsFrozenUpdate',
        value: function onReelsFrozenUpdate() {
            this.betText.text = _AppModel.AppModel.getInstance().getSpinPrice();
        }
    }, {
        key: 'getText',
        value: function getText(fontSize) {
            var text = new PIXI.Text('000', {
                fontFamily: 'Arial',
                fontSize: fontSize,
                fill: 0x66DFF4,
                align: 'center'
            });
            text.anchor.x = 0.5;
            text.x = 160;
            text.y = 31;
            text.alpha = 0.8;
            return text;
            //addChild(this.text);
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 192;
            this.y = 64;
        }
    }]);

    return BetPanel;
}(_DisplayObject2.DisplayObject);

},{"./../AppModel":3,"./../core/DisplayObject":37,"./AssetsManager":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.BottomPanel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AssetsManager = require('./AssetsManager');

var _SpinButton = require('./buttons/SpinButton');

var _StopButton = require('./buttons/StopButton');

var _StartButton = require('./buttons/StartButton');

var _InfoButton = require('./buttons/InfoButton');

var _LightPanel = require('./LightPanel');

var _WinText = require('./WinText');

var _BetPanel = require('./BetPanel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by 1 on 29.12.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BottomPanel = exports.BottomPanel = function (_PIXI$Sprite) {
        _inherits(BottomPanel, _PIXI$Sprite);

        function BottomPanel(texture) {
                _classCallCheck(this, BottomPanel);

                var _this = _possibleConstructorReturn(this, (BottomPanel.__proto__ || Object.getPrototypeOf(BottomPanel)).call(this));

                _this.bgtexture = texture;
                _this.initialize();
                _this.setLocation();
                return _this;
        }

        _createClass(BottomPanel, [{
                key: 'setLocation',
                value: function setLocation() {
                        this.x = 30;
                        this.y = 590;
                }
        }, {
                key: 'initialize',
                value: function initialize() {
                        this.background = new PIXI.Sprite(this.bgtexture);
                        this.background.scale.x = 1.4;
                        this.background.scale.y = 1.6;
                        this.background.y -= 15;
                        this.background.alpha = 0.6;
                        this.addChild(this.background);

                        this.spinButton = new _SpinButton.SpinButton(new _AssetsManager.AssetsManager().getSpinButtonTextures());
                        this.addChild(this.spinButton);

                        this.stopButton = new _StopButton.StopButton(new _AssetsManager.AssetsManager().getStopButtonTextures());
                        this.addChild(this.stopButton);

                        this.startButton = new _StartButton.StartButton(new _AssetsManager.AssetsManager().getStartButtonTextures());
                        this.addChild(this.startButton);

                        this.infoButton = new _InfoButton.InfoButton(new _AssetsManager.AssetsManager().getInfoButtonTextures());
                        this.addChild(this.infoButton);

                        this.lightPanel = new _LightPanel.LightPanel();
                        this.addChild(this.lightPanel);

                        this.winText = new _WinText.WinText(new _AssetsManager.AssetsManager().getWinTextBackgroundTexture());
                        this.addChild(this.winText);

                        this.betPanel = new _BetPanel.BetPanel();
                        this.addChild(this.betPanel);
                }
        }]);

        return BottomPanel;
}(PIXI.Sprite);

},{"./AssetsManager":6,"./BetPanel":8,"./LightPanel":18,"./WinText":28,"./buttons/InfoButton":30,"./buttons/SpinButton":34,"./buttons/StartButton":35,"./buttons/StopButton":36}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by 1 on 31.12.2016.
 */
var Constants = exports.Constants = function Constants() {
    _classCallCheck(this, Constants);
};

exports.default = Constants;


Constants.ICON_HEIGHT = 165;
Constants.REEL_UPD_FREQ = 17;
Constants.SPEED_LIMIT = 70;
Constants.SPIN_TIME = 1500;
Constants.JOINT_IDLE_TIME = 1000;
Constants.DUDES_TIME = 3000;
Constants.JOINT_ADD_TIME = 2000;
Constants.LINE_DEF_DELAY = 3000;
Constants.LINE_SHORT_DELAY = 2000;
Constants.MAX_FROZEN_COUNT = 4;
Constants.ANIMATION_DURATION_MAP = [1, 1, 1, 1, 1, 1, 1.55, 1.3, 2.05, 1.05];

Constants.INIT_STATE = "InitState";
Constants.IDLE_STATE = "IdleState";
Constants.SPIN_START_STATE = "SpinStartState";
Constants.SPIN_STOP_STATE = "SpinStopState";
Constants.WIN_ANIMATION_STATE = "WinAnimationState";

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Frames = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('./../core/DisplayObject');

var _AssetsManager = require('./AssetsManager');

var _Constants = require('./Constants');

var _AppProxy = require('./../AppProxy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 21.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Frames = exports.Frames = function (_DisplayObject) {
    _inherits(Frames, _DisplayObject);

    function Frames() {
        _classCallCheck(this, Frames);

        var _this = _possibleConstructorReturn(this, (Frames.__proto__ || Object.getPrototypeOf(Frames)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(Frames, [{
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().frames = this;
            this.points = [];
            var xpos = [7, 192, 380, 566, 754, 938];
            for (var i = 0; i < xpos.length; i++) {
                var list = [];
                for (var j = 0; j < 3; j++) {
                    var xp = xpos[i];
                    var yp = 42 + j * _Constants.Constants.ICON_HEIGHT;
                    var point = { "x": xp, "y": yp };
                    list.push(point);
                }
                this.points.push(list);
            }

            this.movieclips = [];
            for (var _i = 0; _i < xpos.length; _i++) {
                var _point = this.points[_i][0];
                var movieClip = new PIXI.extras.AnimatedSprite(new _AssetsManager.AssetsManager().getFramesAnimation());
                this.addChild(movieClip);
                this.movieclips.push(movieClip);
                movieClip.x = _point.x;
                movieClip.y = _point.y;
                movieClip.play();
                movieClip.scale.x = 1.2;
                movieClip.scale.y = 1.2;
                movieClip.visible = false;
            }
        }
    }, {
        key: 'showLine',
        value: function showLine(line) {
            for (var i = 0; i < line.length; i++) {
                var py = this.points[i][line[i]].y;
                var px = this.points[i][0].x;
                var clip = this.movieclips[i];
                TweenLite.to(clip, 0.3, { y: py, x: px });
                clip.visible = true;
                clip.play();
            }
        }
    }, {
        key: 'setToCenter',
        value: function setToCenter() {
            for (var i = 0; i < this.movieclips.length; i++) {
                var clip = this.movieclips[i];
                clip.x = 470;
                clip.y = 42 + _Constants.Constants.ICON_HEIGHT;
            }
        }
    }, {
        key: 'hideAll',
        value: function hideAll() {
            for (var i = 0; i < this.movieclips.length; i++) {
                var clip = this.movieclips[i];
                clip.visible = false;
                clip.stop();
            }
        }
    }]);

    return Frames;
}(_DisplayObject2.DisplayObject);

},{"./../AppProxy":4,"./../core/DisplayObject":37,"./AssetsManager":6,"./Constants":10}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Icon = exports.Icon = function (_PIXI$extras$Animated) {
    _inherits(Icon, _PIXI$extras$Animated);

    function Icon(textures) {
        _classCallCheck(this, Icon);

        var _this = _possibleConstructorReturn(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).call(this, textures));

        _this.setFrame = _this.setFrame.bind(_this);
        return _this;
    }

    _createClass(Icon, [{
        key: "setRandomFrame",
        value: function setRandomFrame() {
            this.gotoAndStop(Icon.getRandomInt(0, this.textures.length - 1));
        }
    }, {
        key: "setFrame",
        value: function setFrame(frame) {
            if (frame < 0) {
                this.setRandomFrame();
            } else {
                this.gotoAndStop(frame);
            }
        }
    }], [{
        key: "getRandomInt",
        value: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }]);

    return Icon;
}(PIXI.extras.AnimatedSprite);

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IconAnimation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _AssetsManager = require('../components/AssetsManager');

var _Constants = require('./Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 08.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var IconAnimation = exports.IconAnimation = function (_DisplayObject) {
    _inherits(IconAnimation, _DisplayObject);

    function IconAnimation(i, j) {
        _classCallCheck(this, IconAnimation);

        var _this = _possibleConstructorReturn(this, (IconAnimation.__proto__ || Object.getPrototypeOf(IconAnimation)).call(this));

        _this.i = i;
        _this.j = j;

        _this.initialize();
        _this.setLocation();

        //document.addEventListener("keyup", this.onKeyUp.bind(this));
        return _this;
    }

    _createClass(IconAnimation, [{
        key: 'initialize',
        value: function initialize() {
            var textures = new _AssetsManager.AssetsManager().getIconAnimation(0);
            this.container = new PIXI.extras.AnimatedSprite(textures);
            this.container.visible = false;
            this.container.animationSpeed = 0.5;
            this.addChild(this.container);

            this.locationMap = [[53, 25], [53, 25], [14, 27], [52, 24], [18, 27], [53, 26], [-33, -7], [-31, -5], [-42, -2], [-21, -15]];
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.defaultX = this.i * 185 - 100;if (this.i > 2) this.defaultX += 5;
            this.defaultY = this.j * _Constants.Constants.ICON_HEIGHT + 70;
            this.x = this.defaultX;
            this.y = this.defaultY;
        }
    }, {
        key: 'prepare',
        value: function prepare(id) {
            this.container.textures = new _AssetsManager.AssetsManager().getIconAnimation(id);
            this.container.updateTexture();
            this.x = this.defaultX + this.locationMap[id][0];
            this.y = this.defaultY + this.locationMap[id][1];
        }
    }, {
        key: 'play',
        value: function play(id) {
            this.container.visible = true;
            this.container.play();
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.container.visible = false;
            this.container.gotoAndStop(0);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.container.visible = false;
        }

        /*
         onKeyUp(event){
         var code = event.keyCode;
         if (code == 37){
         this.dx -= 1;
         this.x -=1;
         }
         if (code == 38){
         this.dy -= 1;
         this.y -=1;
         }
         if (code == 39){
         this.dx += 1;
         this.x +=1;
         }
         if (code == 40){
         this.dy += 1;
         this.y +=1;
         }
         if (code == 13){
         alert("x:"+this.dx +":y:"+this.dy);
         }
         }
         */

    }]);

    return IconAnimation;
}(_DisplayObject2.DisplayObject);

},{"../components/AssetsManager":6,"../core/DisplayObject":37,"./Constants":10}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IconAnimations = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _IconAnimation = require('./IconAnimation');

var _AppProxy = require('../AppProxy');

var _AppModel = require('../AppModel');

var _Constants = require('./Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 08.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var IconAnimations = exports.IconAnimations = function (_DisplayObject) {
    _inherits(IconAnimations, _DisplayObject);

    function IconAnimations() {
        _classCallCheck(this, IconAnimations);

        var _this = _possibleConstructorReturn(this, (IconAnimations.__proto__ || Object.getPrototypeOf(IconAnimations)).call(this));

        _this.initialize();
        _this.setLocation();
        _AppProxy.AppProxy.getInstance().iconAnimations = _this;
        return _this;
    }

    _createClass(IconAnimations, [{
        key: 'initialize',
        value: function initialize() {
            this.animationsList = [];
            this.animationsMatrix = [];
            this.linesIndex = 0;
            this.lineDelay = _Constants.Constants.LINE_DEF_DELAY;
            this.timeout = null;

            for (var i = 0; i < 6; i++) {
                var list = [];
                for (var j = 0; j < 3; j++) {
                    var animation = new _IconAnimation.IconAnimation(i, j);
                    this.addChild(animation);
                    this.animationsList.push(animation);
                    list.push(animation);
                }
                this.animationsMatrix.push(list);
            }
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 160;
            this.y = 20;
        }
    }, {
        key: 'prepareAnimation',
        value: function prepareAnimation() {
            var combination = _AppModel.AppModel.getInstance().combination;
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 3; j++) {
                    this.animationsMatrix[i][j].prepare(combination[i][j]);
                }
            }
        }
    }, {
        key: 'playAnimation',
        value: function playAnimation() {
            var lines = _AppModel.AppModel.getInstance().lines;
            var combination = _AppModel.AppModel.getInstance().combination;
            _AppProxy.AppProxy.getInstance().frames.setToCenter();
            this.linesIndex = 0;
            if (lines.length) {
                this.playNext(lines, combination);
            }
        }

        // getLinesDiff(lines){
        // for (let i = 0; )
        // }

    }, {
        key: 'playNext',
        value: function playNext(lines, combination) {
            var line = lines[this.linesIndex];
            this.stopAnimation();
            this.showFrames(line);
            this.hideIcons(line);
            for (var i = 0; i < line.length; i++) {
                this.animationsMatrix[i][line[i]].play(combination[i][line[i]]);
            }
            if (this.linesIndex < lines.length - 1) {
                this.linesIndex++;
            } else {
                this.linesIndex = 0;
                this.lineDelay = _Constants.Constants.LINE_SHORT_DELAY;
            }

            this.lineDelay = _Constants.Constants.ANIMATION_DURATION_MAP[this.__getLineId(line, combination)] * 1000;
            this.timeout = setTimeout(this.playNext.bind(this), this.lineDelay, lines, combination);
        }

        //TODO transfer this shit to server

    }, {
        key: '__getLineId',
        value: function __getLineId(line, combination) {
            var list = [];
            for (var i = 0; i < line.length; i++) {
                list.push(combination[i][line[i]]);
            }
            list = list.sort();
            return list[0];
        }
    }, {
        key: 'stopAnimation',
        value: function stopAnimation() {
            for (var i = 0; i < this.animationsList.length; i++) {
                this.animationsList[i].stop();
            }
            _AppProxy.AppProxy.getInstance().frames.hideAll();
            var icons = _AppProxy.AppProxy.getInstance().reels.getAllIconsMatrix();
            for (var _i = 0; _i < icons.length; _i++) {
                for (var j = 0; j < icons[_i].length; j++) {
                    icons[_i][j].visible = true;
                    icons[_i][j].alpha = 1;
                }
            }
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }, {
        key: 'hideIcons',
        value: function hideIcons(line) {
            var icons = _AppProxy.AppProxy.getInstance().reels.getAllIconsMatrix();

            for (var i = 0; i < icons.length; i++) {
                for (var j = 0; j < icons[i].length; j++) {
                    icons[i][j].visible = true;
                    icons[i][j].alpha = 0.6;
                }
            }
            for (var _i2 = 0; _i2 < line.length; _i2++) {
                icons[_i2][line[_i2]].visible = false;
            }
        }
    }, {
        key: 'showFrames',
        value: function showFrames(line) {
            _AppProxy.AppProxy.getInstance().frames.hideAll();
            _AppProxy.AppProxy.getInstance().frames.showLine(line);
        }
    }]);

    return IconAnimations;
}(_DisplayObject2.DisplayObject);

},{"../AppModel":3,"../AppProxy":4,"../core/DisplayObject":37,"./Constants":10,"./IconAnimation":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IronDude = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('./../core/DisplayObject');

var _AssetsManager = require('./AssetsManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 20.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var IronDude = exports.IronDude = function (_DisplayObject) {
    _inherits(IronDude, _DisplayObject);

    function IronDude(index) {
        _classCallCheck(this, IronDude);

        var _this = _possibleConstructorReturn(this, (IronDude.__proto__ || Object.getPrototypeOf(IronDude)).call(this));

        _this.index = index;
        _this.initialize();
        _this.setLocation();
        return _this;
    }

    _createClass(IronDude, [{
        key: 'setLocation',
        value: function setLocation() {
            if (this.index == 1) {
                this.x = 24;
            } else {
                this.x = 916;
            }
            this.y = 97;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var textures = new _AssetsManager.AssetsManager().getDudeTextures(this.index);
            this.container = new PIXI.extras.AnimatedSprite(textures);
            this.addChild(this.container);
            this.container.visible = false;
            this.container.loop = false;
            this.container.animationSpeed = 0.5;
            this.container.onComplete = this.onAnimationComplete.bind(this);
            this.animationCompleteSignal = new signals.Signal();
        }
    }, {
        key: 'onAnimationComplete',
        value: function onAnimationComplete() {
            this.animationCompleteSignal.dispatch();
        }
    }, {
        key: 'show',
        value: function show() {
            this.container.visible = true;
            this.container.gotoAndStop(0);
            this.container.play(false);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.container.visible = false;
            this.container.stop();
        }
    }]);

    return IronDude;
}(_DisplayObject2.DisplayObject);

},{"./../core/DisplayObject":37,"./AssetsManager":6}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IronDudes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('./../core/DisplayObject');

var _IronDude = require('./IronDude');

var _AppProxy = require('./../AppProxy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 20.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var IronDudes = exports.IronDudes = function (_DisplayObject) {
    _inherits(IronDudes, _DisplayObject);

    function IronDudes() {
        _classCallCheck(this, IronDudes);

        var _this = _possibleConstructorReturn(this, (IronDudes.__proto__ || Object.getPrototypeOf(IronDudes)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(IronDudes, [{
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().ironDudes = this;

            this.firstDude = new _IronDude.IronDude(1);
            this.addChild(this.firstDude);

            this.secondDude = new _IronDude.IronDude(2);
            this.addChild(this.secondDude);
        }
    }, {
        key: 'show',
        value: function show() {
            this.firstDude.show();
            this.secondDude.show();
            this.firstDude.animationCompleteSignal.addOnce(this.hide.bind(this));
            _AppProxy.AppProxy.getInstance().lightning.hideSide();
            var reels = _AppProxy.AppProxy.getInstance().reels.getReels();
            TweenLite.to([reels[0], reels[5]], 1, { alpha: 0 });
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.firstDude.hide();
            this.secondDude.hide();
            _AppProxy.AppProxy.getInstance().lightning.showSide();
            var reels = _AppProxy.AppProxy.getInstance().reels.getReels();
            TweenLite.to([reels[0], reels[5]], 0.5, { alpha: 1 });
        }
    }]);

    return IronDudes;
}(_DisplayObject2.DisplayObject);

},{"./../AppProxy":4,"./../core/DisplayObject":37,"./IronDude":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LightComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _AssetsManager = require('./AssetsManager');

var _StateMachine = require('../states/StateMachine');

var _Constants = require('./Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 09.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LightComponent = exports.LightComponent = function (_DisplayObject) {
    _inherits(LightComponent, _DisplayObject);

    function LightComponent(index) {
        _classCallCheck(this, LightComponent);

        var _this = _possibleConstructorReturn(this, (LightComponent.__proto__ || Object.getPrototypeOf(LightComponent)).call(this));

        _this.index = index;
        _this.frozen = false;
        _this.tween = null;
        _this.initialize();
        return _this;
    }

    _createClass(LightComponent, [{
        key: 'initialize',
        value: function initialize() {
            this.movieTextures = [new _AssetsManager.AssetsManager().getLightningAnimation(0), new _AssetsManager.AssetsManager().getLightningAnimation(1)];
            this.movieClip = new PIXI.extras.AnimatedSprite(this.movieTextures[0]);
            this.addChild(this.movieClip);
            this.movieClip.x = 100 + this.index * 185;
            this.movieClip.y = 90;
            this.movieClip.scale.y = 1.13;
            this.movieClip.visible = false;

            var tubeTexture = new _AssetsManager.AssetsManager().getLightningTubeTexture();
            this.sprite = new PIXI.Sprite(tubeTexture);
            this.sprite.scale.y = -1;
            this.sprite.x = 80 + this.index * 185;
            this.sprite.y = -100;
            this.addChild(this.sprite);

            _StateMachine.StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.movieClip.textures = this.movieTextures[1];
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {

                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.movieClip.textures = this.movieTextures[0];
                        break;
                    }
            }
        }
    }, {
        key: 'show',
        value: function show() {
            if (!this.frozen) {
                this.tween = TweenLite.to(this.sprite, 0.2, { y: 105,
                    onComplete: this.onShowComplete.bind(this) });
            }
        }
    }, {
        key: 'onShowComplete',
        value: function onShowComplete() {
            if (!this.frozen) {
                this.movieClip.visible = true;
                this.movieClip.play();
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this.frozen || force == true) {
                TweenLite.to(this.sprite, 0.2, { y: -105 });
                this.movieClip.stop();
                this.movieClip.visible = false;
                if (this.tween) {
                    this.tween.kill();
                }
            }
        }
    }, {
        key: 'hideLight',
        value: function hideLight() {
            this.movieClip.visible = false;
        }
    }, {
        key: 'showLight',
        value: function showLight() {
            this.movieClip.visible = true;
        }
    }, {
        key: 'freeze',
        value: function freeze() {
            if (this.sprite.y < 0) {
                this.sprite.y = 105;
            }
            this.movieClip.textures = this.movieTextures[0];
            this.movieClip.visible = true;
            this.movieClip.play();
            this.frozen = true;
        }
    }, {
        key: 'unfreeze',
        value: function unfreeze() {
            this.movieClip.stop();
            this.movieClip.visible = false;
            this.movieClip.textures = this.movieTextures[0];
            TweenLite.to(this.sprite, 0.2, { y: -105 });
            this.frozen = false;
        }
    }]);

    return LightComponent;
}(_DisplayObject2.DisplayObject);

},{"../core/DisplayObject":37,"../states/StateMachine":43,"./AssetsManager":6,"./Constants":10}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LightPanel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LightButton = require('./buttons/LightButton');

var _AssetsManager = require('./AssetsManager');

var _DisplayObject2 = require('../core/DisplayObject');

var _AppProxy = require('../AppProxy');

var _StateMachine = require('../states/StateMachine');

var _Constants = require('./Constants');

var _AppModel = require('./../AppModel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 09.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LightPanel = exports.LightPanel = function (_DisplayObject) {
    _inherits(LightPanel, _DisplayObject);

    function LightPanel() {
        _classCallCheck(this, LightPanel);

        var _this = _possibleConstructorReturn(this, (LightPanel.__proto__ || Object.getPrototypeOf(LightPanel)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(LightPanel, [{
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().lightPanel = this;

            this.lightButtons = [];
            for (var i = 0; i < 6; i++) {
                var dir = i < 3 ? 1 : 0;
                var button = new _LightButton.LightButton(new _AssetsManager.AssetsManager().getLightButtonTextures(dir), i);
                this.lightButtons.push(button);
                this.addChild(button);
                button.overSignal.add(this.onButtonOver.bind(this));
                button.outSignal.add(this.onButtonOut.bind(this));
                button.clickSignal.add(this.onButtonClick.bind(this));
            }
            this.buttonOverSignal = new signals.Signal();
            this.buttonOutSignal = new signals.Signal();
            this.buttonClickSignal = new signals.Signal();

            _AppModel.AppModel.getInstance().reelsFrozenUpdateSignal.add(this.reelsFrozenCountUpdate.bind(this));

            _StateMachine.StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.IDLE_STATE:
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.reelsFrozenCountUpdate();
                        break;
                    }
            }
        }
    }, {
        key: 'lockButtons',
        value: function lockButtons() {
            for (var i = 0; i < 6; i++) {
                var button = this.lightButtons[i];
                if (!button.selected) {
                    button.lock();
                }
            }
        }
    }, {
        key: 'unlockButtons',
        value: function unlockButtons() {
            var freezable = _AppModel.AppModel.getInstance().freezable;
            for (var i = 0; i < 6; i++) {
                var button = this.lightButtons[i];
                if (!button.selected && freezable[i]) {
                    button.unlock();
                }
            }
        }
    }, {
        key: 'reelsFrozenCountUpdate',
        value: function reelsFrozenCountUpdate() {
            var frozenCount = _AppModel.AppModel.getInstance().getFrozenReelsCount();
            if (frozenCount == _Constants.Constants.MAX_FROZEN_COUNT) {
                _AppProxy.AppProxy.getInstance().lightPanel.lockButtons();
            } else {
                _AppProxy.AppProxy.getInstance().lightPanel.unlockButtons();
            }
        }
    }, {
        key: 'onButtonOver',
        value: function onButtonOver(index) {
            this.buttonOverSignal.dispatch(index);
        }
    }, {
        key: 'onButtonOut',
        value: function onButtonOut(index) {
            this.buttonOutSignal.dispatch(index);
        }
    }, {
        key: 'onButtonClick',
        value: function onButtonClick(index) {
            this.buttonClickSignal.dispatch(index);
        }
    }]);

    return LightPanel;
}(_DisplayObject2.DisplayObject);

},{"../AppProxy":4,"../core/DisplayObject":37,"../states/StateMachine":43,"./../AppModel":3,"./AssetsManager":6,"./Constants":10,"./buttons/LightButton":31}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Lightning = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _AssetsManager = require('../components/AssetsManager');

var _AppProxy = require('../AppProxy');

var _LightComponent = require('./LightComponent');

var _AppModel = require('../AppModel');

var _StateMachine = require('../states/StateMachine');

var _Constants = require('./Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 09.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Lightning = exports.Lightning = function (_DisplayObject) {
    _inherits(Lightning, _DisplayObject);

    function Lightning() {
        _classCallCheck(this, Lightning);

        var _this = _possibleConstructorReturn(this, (Lightning.__proto__ || Object.getPrototypeOf(Lightning)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(Lightning, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {

                        break;
                    }
            }
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().lightning = this;
            this.createComponents();
            _AppProxy.AppProxy.getInstance().lightPanel.buttonOverSignal.add(this.onPanelButtonOver.bind(this));
            _AppProxy.AppProxy.getInstance().lightPanel.buttonOutSignal.add(this.onPanelButtonOut.bind(this));
            _AppProxy.AppProxy.getInstance().lightPanel.buttonClickSignal.add(this.onPanelButtonClick.bind(this));
        }
    }, {
        key: 'createComponents',
        value: function createComponents() {
            this.components = [];
            for (var i = 0; i < 6; i++) {
                var component = new _LightComponent.LightComponent(i);
                this.components.push(component);
                this.addChild(component);
            }
        }
    }, {
        key: 'hideSide',
        value: function hideSide() {
            this.components[0].hideLight();
            this.components[this.components.length - 1].hideLight();
        }
    }, {
        key: 'showSide',
        value: function showSide() {
            this.components[0].showLight();
            this.components[this.components.length - 1].showLight();
        }
    }, {
        key: 'hideAll',
        value: function hideAll() {
            for (var i = 0; i < 6; i++) {
                var component = this.components[i];
                component.hide(true);
            }
        }
    }, {
        key: 'onPanelButtonOver',
        value: function onPanelButtonOver(index) {
            this.components[index].show();
        }
    }, {
        key: 'onPanelButtonOut',
        value: function onPanelButtonOut(index) {
            this.components[index].hide();
        }
    }, {
        key: 'onPanelButtonClick',
        value: function onPanelButtonClick(index) {
            if (this.components[index].frozen) {
                this.components[index].unfreeze();
                _AppModel.AppModel.getInstance().freezeReel(index, false);
            } else {
                this.components[index].freeze();
                _AppModel.AppModel.getInstance().freezeReel(index, true);
            }
        }
    }]);

    return Lightning;
}(_DisplayObject2.DisplayObject);

},{"../AppModel":3,"../AppProxy":4,"../components/AssetsManager":6,"../core/DisplayObject":37,"../states/StateMachine":43,"./Constants":10,"./LightComponent":17}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Lines = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _Constants = require('./Constants');

var _LinesButton = require('../components/buttons/LinesButton');

var _AssetsManager = require('./AssetsManager');

var _Slider = require('./Slider');

var _Frames = require('./Frames');

var _AppModel = require('../AppModel');

var _AppProxy = require('../AppProxy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 10.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Lines = exports.Lines = function (_DisplayObject) {
    _inherits(Lines, _DisplayObject);

    function Lines() {
        _classCallCheck(this, Lines);

        var _this = _possibleConstructorReturn(this, (Lines.__proto__ || Object.getPrototypeOf(Lines)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(Lines, [{
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().lines = this;

            this.points = [];
            for (var i = 0; i < 6; i++) {
                var list = [];
                for (var j = 0; j < 3; j++) {
                    var xp = i * 185 + 160;
                    var yp = j * _Constants.Constants.ICON_HEIGHT + 190;
                    var point = { "x": xp, "y": yp };
                    list.push(point);
                }
                this.points.push(list);
            }

            this.graphics = new PIXI.Graphics();
            this.graphics.clear();
            this.addChild(this.graphics);

            this.slider = new _Slider.Slider();
            this.addChild(this.slider);
            this.slider.x = 1190;
            this.slider.y = 90;
            this.slider.valueUpdateSignal.add(this.onSliderValueUpdate.bind(this));
            this.slider.loseFocusSignal.add(this.onSliderLoseFocus.bind(this));

            this.frames = new _Frames.Frames(this.points);
            this.addChild(this.frames);
        }
    }, {
        key: 'drawLine',
        value: function drawLine(list) {
            var point = this.points[0][list[0]];
            this.graphics.clear();
            this.graphics.lineStyle(5, 0x9C8137);
            this.graphics.moveTo(point.x, point.y);

            for (var i = 1; i < list.length; i++) {
                point = this.points[i][list[i]];
                this.graphics.lineTo(point.x, point.y);
            }
        }
    }, {
        key: 'showLines',
        value: function showLines() {
            //this.frames.showLine(AppModel.getInstance().lines[0]);
        }
    }, {
        key: 'hideLines',
        value: function hideLines() {
            this.graphics.clear();
        }
    }, {
        key: 'onSliderLoseFocus',
        value: function onSliderLoseFocus() {
            this.hideLines();
        }
    }, {
        key: 'onSliderValueUpdate',
        value: function onSliderValueUpdate(value) {
            //this.drawLine(AppModel.LINES_MAP[value]);
        }
    }]);

    return Lines;
}(_DisplayObject2.DisplayObject);

},{"../AppModel":3,"../AppProxy":4,"../components/buttons/LinesButton":32,"../core/DisplayObject":37,"./AssetsManager":6,"./Constants":10,"./Frames":11,"./Slider":25}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Reel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AssetsManager = require('./AssetsManager');

var _AppProxy = require('./../AppProxy');

var _Constants = require('./Constants');

var _Icon = require('./Icon');

var _Utils = require('./Utils');

var _DisplayObject2 = require('../core/DisplayObject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reel = exports.Reel = function (_DisplayObject) {
    _inherits(Reel, _DisplayObject);

    function Reel(combination) {
        _classCallCheck(this, Reel);

        var _this = _possibleConstructorReturn(this, (Reel.__proto__ || Object.getPrototypeOf(Reel)).call(this));

        _this.combination = combination;
        _this.inJoint = false;

        _this.initialize();

        _this.startSpin = _this.startSpin.bind(_this);
        _this.stopSpin = _this.stopSpin.bind(_this);
        _this.onStopSpinUpdate = _this.onStopSpinUpdate.bind(_this);
        _this.onStopSpinComplete = _this.onStopSpinComplete.bind(_this);
        _this.stopSpinCompleteSignal = new signals.Signal();
        return _this;
    }

    _createClass(Reel, [{
        key: 'initialize',
        value: function initialize() {
            this.createIcons();
        }
    }, {
        key: 'createIcons',
        value: function createIcons() {
            this.icons = [];
            var textures = new _AssetsManager.AssetsManager().getIconTextures();
            for (var i = 0; i < 5; i++) {
                var icon = new _Icon.Icon(textures);
                this.addChild(icon);
                this.icons.push(icon);
                icon.y = (i - 1) * _Constants.Constants.ICON_HEIGHT;
                if (i > 0 && i < 4) {
                    icon.setFrame(this.combination[i - 1]);
                } else {
                    icon.setRandomFrame();
                }
            }
        }
    }, {
        key: 'startSpin',
        value: function startSpin() {
            this.speed = this.dy = this.ypos = 0;
            this.stops = false;
            this.stopIcons = null;
            this.limit = _Constants.Constants.ICON_HEIGHT * 4;
            this.spinning = true;

            TweenLite.to(this, 0.5, { speed: _Constants.Constants.SPEED_LIMIT, ease: Back.easeIn });
        }
    }, {
        key: 'stopSpin',
        value: function stopSpin(combination) {
            this.stopIcons = combination;
            TweenLite.to(this, 0.4, { speed: 25 });
        }
    }, {
        key: 'immediateStopSpin',
        value: function immediateStopSpin(combination) {
            this.spinning = false;
            this.setFinalPositions();
            if (this.stopTween) {
                this.stopTween.kill();
            }
            for (var i = 0; i < 3; i++) {
                var icon = this.icons[i];
                icon.setFrame(combination[i]);
            }
            this.stopSpinCompleteSignal.dispatch();
        }
    }, {
        key: 'update',
        value: function update() {
            if (!this.spinning) return;

            if (this.stopIcons && this.stopIcons.length == 0) {
                if (this.stops) {
                    return;
                }
                this.stops = true;
                this.stopTween = TweenLite.to(this, 0.5, { ypos: _Constants.Constants.ICON_HEIGHT - _Utils.Utils.get0delta(this.icons),
                    onUpdate: this.onStopSpinUpdate.bind(this),
                    onComplete: this.onStopSpinComplete.bind(this),
                    ease: Back.easeOut.config(3.7) });
                return;
            }

            var delta = this.speed;

            for (var i = 0; i < 5; i++) {
                var icon = this.icons[i];

                icon.y += delta;
                if (icon.y > this.limit) {
                    icon.y -= _Constants.Constants.ICON_HEIGHT * 5;

                    if (this.stopIcons) {
                        icon.setFrame(this.stopIcons.shift());
                    } else {
                        if (this.inJoint) {
                            icon.setFrame(_AppProxy.AppProxy.getInstance().reelJoint.getRandomIcon());
                        } else {
                            icon.setRandomFrame();
                        }
                    }
                }
            }
        }
    }, {
        key: 'onStopSpinUpdate',
        value: function onStopSpinUpdate() {
            var delta = this.ypos - this.dy;
            for (var i = 0; i < 5; i++) {
                var icon = this.icons[i];
                icon.y += delta;
            }
            this.dy = this.ypos;
        }
    }, {
        key: 'onStopSpinComplete',
        value: function onStopSpinComplete() {
            this.spinning = false;
            this.setFinalPositions();
            this.stopSpinCompleteSignal.dispatch();
        }
    }, {
        key: 'setFinalPositions',
        value: function setFinalPositions() {
            this.icons.sort(function (a, b) {
                if (a.y > b.y) return 1;
                if (a.y < b.y) return -1;
            });

            for (var i = 0; i < this.icons.length; i++) {
                this.icons[i].y = i * _Constants.Constants.ICON_HEIGHT;
            }
            this.icons[this.icons.length - 1].y = -_Constants.Constants.ICON_HEIGHT;
        }
    }]);

    return Reel;
}(_DisplayObject2.DisplayObject);

},{"../core/DisplayObject":37,"./../AppProxy":4,"./AssetsManager":6,"./Constants":10,"./Icon":12,"./Utils":27}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReelJoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 16.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _AppProxy = require('./../AppProxy');

var _Constants = require('./../components/Constants');

var _StateMachine = require('./../states/StateMachine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReelJoint = exports.ReelJoint = function () {
    function ReelJoint() {
        _classCallCheck(this, ReelJoint);

        _AppProxy.AppProxy.getInstance().reelJoint = this;
        this.reels = [];
        this.leftReelIds = [];
        this.reelAddIcons = [];
        this.iconsPool = [];
        this.timeout = null;
        _StateMachine.StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
    }

    _createClass(ReelJoint, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.WIN_ANIMATION_STATE:
                case _Constants.Constants.IDLE_STATE:
                    {
                        clearTimeout(this.timeout);
                        this.hideSparkles();
                        this.updateReelJointValues(false);
                        this.reels.length = 0;
                        break;
                    }
            }
        }
    }, {
        key: 'start',
        value: function start(reelIds) {
            ReelJoint.shuffleArray(reelIds);
            this.setReelAddIconsCount(reelIds);
            var currentIds = reelIds.splice(0, 2);
            this.leftReelIds = reelIds;
            this.timeout = setTimeout(this.addReels.bind(this, currentIds), _Constants.Constants.JOINT_IDLE_TIME);
        }
    }, {
        key: 'addReels',
        value: function addReels(reelIds) {
            this.updateReels(reelIds);
            this.showSparkles(reelIds);
            this.updateReelJointValues(true);
            this.updateIconsPool();

            if (this.leftReelIds.length) {
                this.timeout = setTimeout(this.addReels.bind(this, [this.leftReelIds.shift()]), _Constants.Constants.JOINT_ADD_TIME);
            }
        }
    }, {
        key: 'showSparkles',
        value: function showSparkles(reelIds) {
            for (var i = 0; i < reelIds.length; i++) {
                _AppProxy.AppProxy.getInstance().sparkles.show(reelIds[i]);
            }
        }
    }, {
        key: 'hideSparkles',
        value: function hideSparkles() {
            _AppProxy.AppProxy.getInstance().sparkles.hideAll();
        }
    }, {
        key: 'updateReels',
        value: function updateReels(reelIds) {
            var reels = _AppProxy.AppProxy.getInstance().reels.getReels();
            for (var i = 0; i < reelIds.length; i++) {
                this.reels.push(reels[reelIds[i]]);
            }
        }
    }, {
        key: 'updateReelJointValues',
        value: function updateReelJointValues(value) {
            for (var i = 0; i < this.reels.length; i++) {
                this.reels[i].inJoint = value;
            }
        }
    }, {
        key: 'updateIconsPool',
        value: function updateIconsPool() {
            this.iconsPool = [];
            var iconId = ReelJoint.getRandomInt(0, 9);
            for (var i = 0; i < this.reels.length; i++) {
                this.iconsPool.push(iconId);
            }
        }
    }, {
        key: 'getRandomIcon',
        value: function getRandomIcon() {
            if (!this.iconsPool.length) {
                this.updateIconsPool();
            }
            return this.iconsPool.shift();
        }
    }, {
        key: 'setReelAddIconsCount',
        value: function setReelAddIconsCount(reelIds) {
            this.reelAddIcons = [];
            var last = reelIds[reelIds.length - 1];
            for (var i = 0; i < 6; i++) {
                if (reelIds.indexOf(i) > -1) {
                    this.reelAddIcons.push(last);
                } else {
                    this.reelAddIcons.push(i);
                }
            }
        }
    }, {
        key: 'getReelAddIconsCount',
        value: function getReelAddIconsCount(index) {
            return this.reelAddIcons[index];
        }
    }], [{
        key: 'getRandomInt',
        value: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }, {
        key: 'shuffleArray',
        value: function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }]);

    return ReelJoint;
}();

},{"./../AppProxy":4,"./../components/Constants":10,"./../states/StateMachine":43}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Reels = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reel = require('./Reel');

var _StateMachine = require('./../states/StateMachine');

var _Constants = require('./Constants');

var _AppModel = require('./../AppModel');

var _AppProxy = require('./../AppProxy');

var _DisplayObject2 = require('../core/DisplayObject');

var _ReelJoint = require('./ReelJoint');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reels = exports.Reels = function (_DisplayObject) {
    _inherits(Reels, _DisplayObject);

    function Reels() {
        _classCallCheck(this, Reels);

        var _this = _possibleConstructorReturn(this, (Reels.__proto__ || Object.getPrototypeOf(Reels)).call(this));

        _this.initialize();
        return _this;
    }

    _createClass(Reels, [{
        key: 'initialize',
        value: function initialize() {
            _AppProxy.AppProxy.getInstance().reels = this;
            this.setLocation();
            this.createReels();
            this.reelsStopped = 0;
            this.reelsFrozenCount = 0;
            _AppProxy.AppProxy.getInstance().immediateStopSpinSignal.add(this.immediateStopSpin.bind(this));
            this.reelJoint = new _ReelJoint.ReelJoint();
        }
    }, {
        key: 'stopSpin',
        value: function stopSpin() {
            var combination = _AppModel.AppModel.getInstance().combination;
            for (var i = 0; i < this.reels.length; i++) {
                if (!_AppModel.AppModel.getInstance().reelsFrozen[i]) {
                    var list = this.getAddStopIcons(i);
                    this.reels[i].stopSpin(combination[i].concat(list).reverse());
                }
            }
        }
    }, {
        key: 'getAddStopIcons',
        value: function getAddStopIcons(index) {
            if (this.reels[index].inJoint) {
                return new Array(this.reelJoint.getReelAddIconsCount(index)).fill(null);
            }
            return new Array(index).fill(null);
        }
    }, {
        key: 'immediateStopSpin',
        value: function immediateStopSpin() {
            var combination = _AppModel.AppModel.getInstance().combination;
            for (var i = 0; i < this.reels.length; i++) {
                if (!_AppModel.AppModel.getInstance().reelsFrozen[i]) {
                    this.reels[i].immediateStopSpin(combination[i]);
                }
            }
        }
    }, {
        key: 'onReelSpinStopComplete',
        value: function onReelSpinStopComplete(reel) {
            this.reelsStopped++;
            if (this.reelsStopped == this.reelsUnfrozenCount) {
                _AppProxy.AppProxy.getInstance().stopSpinSignal.dispatch();
                this.getAllIconsMatrix();
            }
        }
    }, {
        key: 'startSpin',
        value: function startSpin() {
            for (var i = 0; i < this.reels.length; i++) {
                if (!_AppModel.AppModel.getInstance().reelsFrozen[i]) {
                    var reel = this.reels[i];
                    reel.startSpin();
                }
            }
            this.reelsStopped = 0;
            this.reelsUnfrozenCount = _AppModel.AppModel.getInstance().getUnfrozenReelsCount();
        }
    }, {
        key: 'startJoint',
        value: function startJoint() {
            var reelIds = _AppModel.AppModel.getInstance().reelsJoint.slice();
            _AppProxy.AppProxy.getInstance().reelJoint.start(reelIds);
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 60;
            this.y = 90;
        }
    }, {
        key: 'createReels',
        value: function createReels() {
            this.reels = [];
            var combination = _AppModel.AppModel.getInstance().combination;
            var offset = 185;
            for (var i = 0; i < 6; i++) {

                var reel = new _Reel.Reel(combination[i]);
                reel.id = i;
                this.reels.push(reel);
                this.addChild(reel);
                reel.x = offset * i;if (i > 2) reel.x += 5;
                reel.stopSpinCompleteSignal.add(this.onReelSpinStopComplete.bind(this));
            }
        }
    }, {
        key: 'getAllIconsMatrix',
        value: function getAllIconsMatrix() {
            var result = [];
            for (var i = 0; i < this.reels.length; i++) {
                var list = [];
                for (var j = 0; j < this.reels[i].icons.length - 2; j++) {
                    var icon = this.reels[i].icons[j];
                    list.push(icon);
                }
                result.push(list);
            }
            return result;
        }
    }, {
        key: 'getReels',
        value: function getReels() {
            return this.reels;
        }
    }]);

    return Reels;
}(_DisplayObject2.DisplayObject);

},{"../core/DisplayObject":37,"./../AppModel":3,"./../AppProxy":4,"./../states/StateMachine":43,"./Constants":10,"./Reel":21,"./ReelJoint":22}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Admin on 05.05.17.
 */

//, true);

var ServiceProxy = exports.ServiceProxy = function () {
    function ServiceProxy() {
        _classCallCheck(this, ServiceProxy);

        this.spinResponseSignal = new signals.Signal();
        this.initResponseSignal = new signals.Signal();

        this.request = new XMLHttpRequest();
    }

    _createClass(ServiceProxy, [{
        key: "sendSpinRequest",
        value: function sendSpinRequest(data) {
            this.request.open("POST", ServiceProxy.REQUEST_URL + "spin", true);
            this.request.setRequestHeader('Content-type', 'application/json');
            this.request.onload = this.onSpinResponse.bind(this);
            this.request.onerror = this.onSpinError.bind(this);
            this.request.send(JSON.stringify(data));
        }
    }, {
        key: "onSpinResponse",
        value: function onSpinResponse() {
            var result = JSON.parse(this.request.responseText);
            this.spinResponseSignal.dispatch(result);
        }
    }, {
        key: "onSpinError",
        value: function onSpinError() {}

        //-------------------------init----------------------------------------------//

    }, {
        key: "sendInitRequest",
        value: function sendInitRequest(data) {
            this.request.open("POST", ServiceProxy.REQUEST_URL + "init", true);
            this.request.setRequestHeader('Content-type', 'application/json');
            this.request.onload = this.onInitResponse.bind(this);
            this.request.onerror = this.onInitError.bind(this);
            this.request.send(JSON.stringify(data));
        }
    }, {
        key: "onInitResponse",
        value: function onInitResponse() {
            var result = JSON.parse(this.request.responseText);
            this.initResponseSignal.dispatch(result);
        }
    }, {
        key: "onInitError",
        value: function onInitError() {}
    }]);

    return ServiceProxy;
}();

ServiceProxy.REQUEST_URL = //"http://localhost:8080/";
"http://nodejs-mongo-persistent-test-project-cankillah1.1d35.starter-us-east-1.openshiftapps.com/";

//"http://localhost:8080/";

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject = require('../core/DisplayObject');

var _SliderButton = require('../components/buttons/SliderButton');

var _AssetsManager = require('../components/AssetsManager');

var _AppProxy = require('../AppProxy');

var _StateMachine = require('../states/StateMachine');

var _Constants = require('./Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 12.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Slider = exports.Slider = function (_PIXI$Container) {
    _inherits(Slider, _PIXI$Container);

    function Slider() {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this));

        _this.sliderHeight = 500;
        _this.value = 239;
        _this.locked = false;
        _this.initialize();
        return _this;
    }

    _createClass(Slider, [{
        key: 'initialize',
        value: function initialize() {
            this.button = new _SliderButton.SliderButton(new _AssetsManager.AssetsManager().getSliderButtonTextures());
            this.addChild(this.button);

            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);
            this.redrawLine(false);

            this.button.clickSignal.add(this.onButtonClick.bind(this));

            this.valueUpdateSignal = new signals.Signal();
            this.loseFocusSignal = new signals.Signal();

            _StateMachine.StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.lock();
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {

                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.unlock();
                        break;
                    }
            }
        }
    }, {
        key: 'redrawLine',
        value: function redrawLine(active) {
            var locked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var color = active ? 0x9C8137 : 0x468DBC; //
            if (locked) color = 0x6B7B86;
            this.graphics.clear();
            this.graphics.lineStyle(5, color);
            this.graphics.drawCircle(20, this.button.height / 2, 3, 3);
            this.graphics.drawCircle(20, this.sliderHeight, 3, 3);
            this.graphics.moveTo(20, this.button.height / 2);
            this.graphics.lineTo(20, this.sliderHeight);
        }
    }, {
        key: 'lock',
        value: function lock() {
            this.button.lock();
            this.redrawLine(false, true);
            this.locked = true;
        }
    }, {
        key: 'unlock',
        value: function unlock() {
            this.button.unlock();
            this.redrawLine(false, false);
            this.locked = false;
        }
    }, {
        key: 'onButtonClick',
        value: function onButtonClick() {
            if (this.locked) return;
            this.button.mousemove = this.onMouseMove.bind(this);
            _AppProxy.AppProxy.getInstance().stage.mouseup = this.onMouseUp.bind(this);
            _AppProxy.AppProxy.getInstance().stage.mouseout = this.onMouseOut.bind(this);
            this.redrawLine(true);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            if (this.locked) return;
            this.button.mousemove = null;
            this.button.setSelected(false);
            this.redrawLine(false);
            this.loseFocusSignal.dispatch();
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            if (this.locked) return;
            this.button.mousemove = null;
            this.button.setSelected(false);
            this.redrawLine(false);
            this.loseFocusSignal.dispatch();
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            if (this.locked) return;
            var ny = event.data.getLocalPosition(this).y - this.button.width / 2;
            this.setPosition(ny);
            this.setValue();
        }
    }, {
        key: 'setValue',
        value: function setValue() {
            var value = Math.round(239 * this.button.y / (this.sliderHeight - this.button.height / 2));
            //if (value == 0) value = 1;
            if (this.value != value) {
                this.value = value;
                this.valueUpdateSignal.dispatch(this.value);
            }
        }
    }, {
        key: 'setPosition',
        value: function setPosition(ny) {
            this.button.y = ny;
            if (ny < 0) {
                this.button.y = 0;
            }
            if (ny > this.sliderHeight - this.button.height / 2) {
                this.button.y = this.sliderHeight - this.button.height / 2;
            }
        }
    }]);

    return Slider;
}(PIXI.Container);

},{"../AppProxy":4,"../components/AssetsManager":6,"../components/buttons/SliderButton":33,"../core/DisplayObject":37,"../states/StateMachine":43,"./Constants":10}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sparkles = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('../core/DisplayObject');

var _AppProxy = require('./../AppProxy');

var _AssetsManager = require('./AssetsManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 16.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Sparkles = exports.Sparkles = function (_DisplayObject) {
    _inherits(Sparkles, _DisplayObject);

    function Sparkles() {
        _classCallCheck(this, Sparkles);

        var _this = _possibleConstructorReturn(this, (Sparkles.__proto__ || Object.getPrototypeOf(Sparkles)).call(this));

        _this.initialize();
        _AppProxy.AppProxy.getInstance().sparkles = _this;
        return _this;
    }

    _createClass(Sparkles, [{
        key: 'initialize',
        value: function initialize() {
            this.sparkles = [];
            var textures = new _AssetsManager.AssetsManager().getSparklesAnimation();
            for (var i = 0; i < 6; i++) {
                var sparkle = new PIXI.extras.AnimatedSprite(textures);
                this.addChild(sparkle);
                sparkle.x = 45 + i * 185;
                sparkle.y = 79;
                sparkle.scale.x = 1.213;
                sparkle.scale.y = 1.247;
                sparkle.visible = false;
                this.sparkles.push(sparkle);
            }
        }
    }, {
        key: 'show',
        value: function show(index) {
            this.sparkles[index].visible = true;
            this.sparkles[index].play();
        }
    }, {
        key: 'hideAll',
        value: function hideAll() {
            for (var i = 0; i < this.sparkles.length; i++) {
                this.sparkles[i].visible = false;
                this.sparkles[i].stop();
            }
        }
    }]);

    return Sparkles;
}(_DisplayObject2.DisplayObject);

},{"../core/DisplayObject":37,"./../AppProxy":4,"./AssetsManager":6}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by 1 on 03.01.2017.
 */
var Utils = exports.Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: "get0delta",
        value: function get0delta(array) {
            var i = 0;
            var minDiff = 1000;
            var ans;
            for (i in array) {
                var m = Math.abs(0 - array[i].y);
                if (m < minDiff) {
                    minDiff = m;
                    ans = array[i].y;
                }
            }
            return ans;
        }
    }]);

    return Utils;
}();

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WinText = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('./../core/DisplayObject');

var _StateMachine = require('./../states/StateMachine');

var _Constants = require('./Constants');

var _AppModel = require('./../AppModel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 17.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var WinText = exports.WinText = function (_DisplayObject) {
    _inherits(WinText, _DisplayObject);

    function WinText(texture) {
        _classCallCheck(this, WinText);

        var _this = _possibleConstructorReturn(this, (WinText.__proto__ || Object.getPrototypeOf(WinText)).call(this));

        _this.container = new PIXI.Sprite(texture);
        _this.addChild(_this.container);

        _this.container.scale.x = 1.7;
        _this.container.scale.y = 1.7;

        _this.setLocation();

        _this.text = new PIXI.Text('0', {
            fontFamily: 'Arial',
            fontSize: 40,
            fill: 0x66DFF4,
            align: 'center'
        });
        _this.text.anchor.x = 0.5;
        _this.text.x = 160;
        _this.text.y = 31;
        _this.text.alpha = 0.7;
        _this.text.text = _AppModel.AppModel.getInstance().balance;
        _this.addChild(_this.text);

        _this.textObject = { "value": _AppModel.AppModel.getInstance().balance };

        _StateMachine.StateMachine.getInstance().stateChangeSignal.add(_this.onStateChange.bind(_this));
        _AppModel.AppModel.getInstance().balanceUpdateSignal.add(_this.onBalanceUpdate.bind(_this));
        return _this;
    }

    _createClass(WinText, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.WIN_ANIMATION_STATE:
                case _Constants.Constants.IDLE_STATE:
                    {
                        //this.startWinAnimation();
                        break;
                    }
            }
        }
    }, {
        key: 'onBalanceUpdate',
        value: function onBalanceUpdate(value) {
            var currentBalance = Math.round(this.textObject.value);
            if (value < currentBalance) {
                this.text.text = value;
                this.textObject.value = value;
            } else {
                this.startWinAnimation();
            }
        }
    }, {
        key: 'startWinAnimation',
        value: function startWinAnimation() {
            TweenLite.to(this.textObject, 2, { "value": _AppModel.AppModel.getInstance().balance,
                onUpdate: this.onTweenUpdate.bind(this) });
        }
    }, {
        key: 'onTweenUpdate',
        value: function onTweenUpdate() {
            this.text.text = Math.round(this.textObject.value);
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 432;
            this.y = 65;
        }
    }]);

    return WinText;
}(_DisplayObject2.DisplayObject);

},{"./../AppModel":3,"./../core/DisplayObject":37,"./../states/StateMachine":43,"./Constants":10}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StateMachine = require('../../states/StateMachine.js');

var _AppProxy = require('../../AppProxy.js');

var _Constants = require('../Constants.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 06.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Button = exports.Button = function (_PIXI$extras$Animated) {
    _inherits(Button, _PIXI$extras$Animated);

    function Button(textures) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, textures));

        _this.initialize();
        return _this;
    }

    _createClass(Button, [{
        key: 'onStateChange',
        value: function onStateChange(state) {}
    }, {
        key: 'setLocation',
        value: function setLocation() {}
    }, {
        key: 'initialize',
        value: function initialize() {
            this.interactive = true;
            this.on('mouseover', this.onMouseOver.bind(this));
            this.on('mouseout', this.onMouseOut.bind(this));
            this.on('mousedown', this.onMouseDown.bind(this));
            _StateMachine.StateMachine.getInstance().stateChangeSignal.add(this.onStateChange.bind(this));
        }
    }, {
        key: 'setActive',
        value: function setActive(value) {
            this.interactive = value;
            var v = value ? 0 : 3;
            this.gotoAndStop(v);
        }
    }, {
        key: 'setVisible',
        value: function setVisible(value) {
            this.visible = value;
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver() {
            this.gotoAndStop(1);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            this.gotoAndStop(0);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            this.gotoAndStop(2);
        }
    }]);

    return Button;
}(PIXI.extras.AnimatedSprite);

},{"../../AppProxy.js":4,"../../states/StateMachine.js":43,"../Constants.js":10}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InfoButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button2 = require('./Button');

var _AppProxy = require('../../AppProxy');

var _Constants = require('../Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 24.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var InfoButton = exports.InfoButton = function (_Button) {
    _inherits(InfoButton, _Button);

    function InfoButton(textures) {
        _classCallCheck(this, InfoButton);

        var _this = _possibleConstructorReturn(this, (InfoButton.__proto__ || Object.getPrototypeOf(InfoButton)).call(this, textures));

        _this.setLocation();
        _this.setActive(false);
        return _this;
    }

    _createClass(InfoButton, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
            }
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 86;
            this.y = 75;
        }
    }]);

    return InfoButton;
}(_Button2.Button);

},{"../../AppProxy":4,"../Constants":10,"./Button":29}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LightButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Constants = require('../Constants');

var _Button2 = require('./Button');

var _StateMachine = require('../../states/StateMachine');

var _AppModel = require('./../../AppModel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 09.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LightButton = exports.LightButton = function (_Button) {
    _inherits(LightButton, _Button);

    function LightButton(textures, index) {
        _classCallCheck(this, LightButton);

        var _this = _possibleConstructorReturn(this, (LightButton.__proto__ || Object.getPrototypeOf(LightButton)).call(this, textures));

        _this.index = index;
        _this.selected = false;
        _this.locked = false;
        _this.overSignal = new signals.Signal();
        _this.outSignal = new signals.Signal();
        _this.clickSignal = new signals.Signal();
        _this.setLocation();

        _StateMachine.StateMachine.getInstance().stateChangeSignal.add(_this.onStateChange.bind(_this));
        return _this;
    }

    _createClass(LightButton, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.lock();
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {
                        this.lock();
                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        if (_AppModel.AppModel.getInstance().freezable[this.index]) {
                            this.unlock();
                            this.onMouseOut();
                        }
                        break;
                    }
            }
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = this.index * 190 + 55;
            this.y = 20;
            this.scale.y = 0.6;
            this.scale.x = 1.5;
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver() {
            _get(LightButton.prototype.__proto__ || Object.getPrototypeOf(LightButton.prototype), 'onMouseOver', this).call(this);
            this.overSignal.dispatch(this.index);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            if (!this.selected) {
                this.gotoAndStop(0);
                this.outSignal.dispatch(this.index);
            } else {
                this.gotoAndStop(2);
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            _get(LightButton.prototype.__proto__ || Object.getPrototypeOf(LightButton.prototype), 'onMouseDown', this).call(this);
            this.selected = !this.selected;
            this.clickSignal.dispatch(this.index);
        }
    }, {
        key: 'lock',
        value: function lock() {
            this.locked = true;
            this.setActive(false);
        }
    }, {
        key: 'unlock',
        value: function unlock() {
            this.locked = false;
            this.setActive(true);
        }
    }]);

    return LightButton;
}(_Button2.Button);

},{"../../states/StateMachine":43,"../Constants":10,"./../../AppModel":3,"./Button":29}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LinesButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = require('./Button');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 11.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LinesButton = exports.LinesButton = function (_Button) {
    _inherits(LinesButton, _Button);

    function LinesButton(textures, index) {
        _classCallCheck(this, LinesButton);

        var _this = _possibleConstructorReturn(this, (LinesButton.__proto__ || Object.getPrototypeOf(LinesButton)).call(this, textures));

        _this.index = index;

        _this.overSignal = new signals.Signal();
        _this.outSignal = new signals.Signal();
        _this.clickSignal = new signals.Signal();
        return _this;
    }

    _createClass(LinesButton, [{
        key: 'onMouseOver',
        value: function onMouseOver() {
            _get(LinesButton.prototype.__proto__ || Object.getPrototypeOf(LinesButton.prototype), 'onMouseOver', this).call(this);
            this.overSignal.dispatch(this.index);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            if (!this.selected) {
                this.gotoAndStop(0);
                this.outSignal.dispatch(this.index);
            } else {
                this.gotoAndStop(2);
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            _get(LinesButton.prototype.__proto__ || Object.getPrototypeOf(LinesButton.prototype), 'onMouseDown', this).call(this);
            this.selected = !this.selected;
            this.clickSignal.dispatch(this.index);
        }
    }]);

    return LinesButton;
}(_Button2.Button);

},{"./Button":29}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SliderButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = require('./Button');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 12.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var SliderButton = exports.SliderButton = function (_Button) {
    _inherits(SliderButton, _Button);

    function SliderButton(textures) {
        _classCallCheck(this, SliderButton);

        var _this = _possibleConstructorReturn(this, (SliderButton.__proto__ || Object.getPrototypeOf(SliderButton)).call(this, textures));

        _this.overSignal = new signals.Signal();
        _this.outSignal = new signals.Signal();
        _this.clickSignal = new signals.Signal();
        _this.selected = false;
        return _this;
    }

    _createClass(SliderButton, [{
        key: 'onMouseOver',
        value: function onMouseOver() {
            if (!this.selected) {
                _get(SliderButton.prototype.__proto__ || Object.getPrototypeOf(SliderButton.prototype), 'onMouseOver', this).call(this);
                this.overSignal.dispatch();
            }
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            if (!this.selected) {
                _get(SliderButton.prototype.__proto__ || Object.getPrototypeOf(SliderButton.prototype), 'onMouseOut', this).call(this);
                this.outSignal.dispatch();
            }
        }
    }, {
        key: 'lock',
        value: function lock() {
            this.setActive(false);
        }
    }, {
        key: 'unlock',
        value: function unlock() {
            this.setActive(true);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            _get(SliderButton.prototype.__proto__ || Object.getPrototypeOf(SliderButton.prototype), 'onMouseDown', this).call(this);
            this.selected = true;
            this.clickSignal.dispatch();
        }
    }, {
        key: 'setSelected',
        value: function setSelected(value) {
            this.selected = value;
            this.onMouseOut();
        }
    }]);

    return SliderButton;
}(_Button2.Button);

},{"./Button":29}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SpinButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AppProxy = require('../../AppProxy');

var _Constants = require('../Constants');

var _Button2 = require('./Button');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpinButton = exports.SpinButton = function (_Button) {
    _inherits(SpinButton, _Button);

    function SpinButton(textures) {
        _classCallCheck(this, SpinButton);

        var _this = _possibleConstructorReturn(this, (SpinButton.__proto__ || Object.getPrototypeOf(SpinButton)).call(this, textures));

        _this.setLocation();
        return _this;
    }

    _createClass(SpinButton, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.setVisible(false);
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {
                        this.setVisible(false);
                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                    {
                        this.setActive(true);
                        this.setVisible(true);
                        break;
                    }
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.setVisible(true);
                        this.setActive(true);
                        break;
                    }
            }
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 940;
            this.y = 75;
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            _get(SpinButton.prototype.__proto__ || Object.getPrototypeOf(SpinButton.prototype), 'onMouseDown', this).call(this);
            _AppProxy.AppProxy.getInstance().startSpinSignal.dispatch();
        }
    }]);

    return SpinButton;
}(_Button2.Button);

},{"../../AppProxy":4,"../Constants":10,"./Button":29}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StartButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button2 = require('./Button');

var _AppProxy = require('../../AppProxy');

var _Constants = require('../Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 16.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var StartButton = exports.StartButton = function (_Button) {
    _inherits(StartButton, _Button);

    function StartButton(textures) {
        _classCallCheck(this, StartButton);

        var _this = _possibleConstructorReturn(this, (StartButton.__proto__ || Object.getPrototypeOf(StartButton)).call(this, textures));

        _this.setLocation();
        _this.setActive(false);
        return _this;
    }

    _createClass(StartButton, [{
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.setActive(false);
                        break;
                    }
            }
        }
    }, {
        key: 'setLocation',
        value: function setLocation() {
            this.x = 780;
            this.y = 75;
        }
    }]);

    return StartButton;
}(_Button2.Button);

},{"../../AppProxy":4,"../Constants":10,"./Button":29}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StopButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _StateMachine = require('../../states/StateMachine');

var _AppProxy = require('../../AppProxy');

var _Constants = require('../Constants');

var _Button2 = require('./Button');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 06.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var StopButton = exports.StopButton = function (_Button) {
    _inherits(StopButton, _Button);

    function StopButton(textures) {
        _classCallCheck(this, StopButton);

        var _this = _possibleConstructorReturn(this, (StopButton.__proto__ || Object.getPrototypeOf(StopButton)).call(this, textures));

        _this.setLocation();
        return _this;
    }

    _createClass(StopButton, [{
        key: 'setLocation',
        value: function setLocation() {
            this.x = 940;
            this.y = 75;
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(state) {
            switch (state.getName()) {
                case _Constants.Constants.SPIN_START_STATE:
                    {
                        this.setVisible(true);
                        this.setActive(false);
                        break;
                    }
                case _Constants.Constants.SPIN_STOP_STATE:
                    {
                        this.setVisible(true);
                        this.setActive(true);
                        break;
                    }
                case _Constants.Constants.IDLE_STATE:
                    {
                        this.setVisible(false);
                        break;
                    }
                case _Constants.Constants.WIN_ANIMATION_STATE:
                    {
                        this.setVisible(false);
                        break;
                    }
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown() {
            _get(StopButton.prototype.__proto__ || Object.getPrototypeOf(StopButton.prototype), 'onMouseDown', this).call(this);
            _AppProxy.AppProxy.getInstance().immediateStopSpinSignal.dispatch();
        }
    }]);

    return StopButton;
}(_Button2.Button);

},{"../../AppProxy":4,"../../states/StateMachine":43,"../Constants":10,"./Button":29}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DisplayObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Admin on 05.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var DisplayObject = exports.DisplayObject = function (_PIXI$Sprite) {
    _inherits(DisplayObject, _PIXI$Sprite);

    function DisplayObject() {
        _classCallCheck(this, DisplayObject);

        var _this = _possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));

        _Renderer.Renderer.getInstance().onUpdateSignal.add(_this.update.bind(_this));
        return _this;
    }

    _createClass(DisplayObject, [{
        key: 'update',
        value: function update() {}
    }]);

    return DisplayObject;
}(PIXI.Sprite);

},{"./Renderer.js":38}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Renderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 05.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _AppProxy = require('../AppProxy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = exports.Renderer = function () {
    function Renderer() {
        _classCallCheck(this, Renderer);

        this.initialize();
    }

    _createClass(Renderer, [{
        key: 'initialize',
        value: function initialize() {

            var canvas = document.getElementById('canvas');
            this.renderer = PIXI.autoDetectRenderer(1262, 760, canvas);
            document.body.appendChild(this.renderer.view);
            this.renderer.view.style.position = 'absolute';
            this.renderer.view.style.left = '50%';
            this.renderer.view.style.top = '50%';
            this.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';

            this.ratio = 1262 / 760;

            this._stage = new PIXI.Container();
            this._stage.hitArea = new PIXI.Rectangle(0, 0, 1262, 760);
            this._stage.interactive = true;
            this.renderer.render(this._stage);
            this._onUpdateSignal = new signals.Signal();
            _AppProxy.AppProxy.getInstance().stage = this._stage;
            this.animate();

            window.onresize = this.onWindowResize.bind(this);
            this.onWindowResize(null);
        }
    }, {
        key: 'onWindowResize',
        value: function onWindowResize(event) {
            if (window.innerWidth / window.innerHeight >= this.ratio) {
                var w = window.innerHeight * this.ratio;
                var h = window.innerHeight;
            } else {
                var w = window.innerWidth;
                var h = window.innerWidth / this.ratio;
            }
            this.renderer.view.style.width = w / 1.2 + 'px';
            this.renderer.view.style.height = h / 1.2 + 'px';
        }
    }, {
        key: 'animate',
        value: function animate() {
            requestAnimationFrame(this.animate.bind(this));
            this._onUpdateSignal.dispatch();
            this.renderer.render(this._stage);
        }
    }, {
        key: 'onUpdateSignal',
        get: function get() {
            return this._onUpdateSignal;
        }
    }, {
        key: 'stage',
        get: function get() {
            return this._stage;
        }
    }]);

    return Renderer;
}();

Renderer.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};

},{"../AppProxy":4}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IdleState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 06.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Constants = require('../components/Constants');

var _AppProxy = require('../AppProxy');

var _StateMachine = require('./StateMachine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdleState = exports.IdleState = function () {
    function IdleState() {
        _classCallCheck(this, IdleState);
    }

    _createClass(IdleState, [{
        key: 'execute',
        value: function execute() {
            _AppProxy.AppProxy.getInstance().startSpinSignal.addOnce(this.onStartSpin.bind(this));
        }
    }, {
        key: 'onStartSpin',
        value: function onStartSpin() {
            _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.SPIN_START_STATE);
        }
    }, {
        key: 'getName',
        value: function getName() {
            return _Constants.Constants.IDLE_STATE;
        }
    }]);

    return IdleState;
}();

},{"../AppProxy":4,"../components/Constants":10,"./StateMachine":43}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InitState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 20.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Constants = require('../components/Constants');

var _AppProxy = require('../AppProxy');

var _StateMachine = require('./StateMachine');

var _AppModel = require('../AppModel');

var _AssetsManager = require('../components/AssetsManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InitState = exports.InitState = function () {
    function InitState() {
        _classCallCheck(this, InitState);
    }

    _createClass(InitState, [{
        key: 'execute',
        value: function execute() {
            _AppModel.AppModel.getInstance().initReceivedSignal.addOnce(this.initDataReceived.bind(this));
            _AppModel.AppModel.getInstance().getInitData();

            _AppProxy.AppProxy.getInstance().assetsLoadedSignal.addOnce(this.onAssetsLoadComplete.bind(this));
            this.manager = new _AssetsManager.AssetsManager();
            this.manager.loadAtlas();

            this.assetsLoadComplete = false;
            this.initResponseReceived = false;
        }
    }, {
        key: 'onAssetsLoadComplete',
        value: function onAssetsLoadComplete() {
            this.assetsLoadComplete = true;
            new _AssetsManager.AssetsManager().getDudeTextures();
            if (this.initResponseReceived) {
                this.initComplete();
            }
        }
    }, {
        key: 'initDataReceived',
        value: function initDataReceived() {
            this.initResponseReceived = true;
            if (this.assetsLoadComplete) {
                this.initComplete();
            }
        }
    }, {
        key: 'initComplete',
        value: function initComplete() {
            _AppProxy.AppProxy.getInstance().appView.initialize();
            _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.IDLE_STATE);
        }
    }]);

    return InitState;
}();

},{"../AppModel":3,"../AppProxy":4,"../components/AssetsManager":6,"../components/Constants":10,"./StateMachine":43}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SpinStartState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 06.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Constants = require('../components/Constants');

var _AppProxy = require('../AppProxy');

var _AppModel = require('../AppModel');

var _StateMachine = require('./StateMachine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpinStartState = exports.SpinStartState = function () {
    function SpinStartState() {
        _classCallCheck(this, SpinStartState);
    }

    _createClass(SpinStartState, [{
        key: 'execute',
        value: function execute() {
            _AppProxy.AppProxy.getInstance().reels.startSpin();
            _AppModel.AppModel.getInstance().spinReceivedSignal.addOnce(this.spinDataReceived.bind(this));
            _AppModel.AppModel.getInstance().getSpinData();
            _AppModel.AppModel.getInstance().reduceBalance();
        }
    }, {
        key: 'spinDataReceived',
        value: function spinDataReceived() {
            _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.SPIN_STOP_STATE);
        }
    }, {
        key: 'getName',
        value: function getName() {
            return _Constants.Constants.SPIN_START_STATE;
        }
    }]);

    return SpinStartState;
}();

},{"../AppModel":3,"../AppProxy":4,"../components/Constants":10,"./StateMachine":43}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SpinStopState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 06.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Constants = require('../components/Constants');

var _AppProxy = require('../AppProxy');

var _AppModel = require('../AppModel');

var _StateMachine = require('./StateMachine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpinStopState = exports.SpinStopState = function () {
    function SpinStopState() {
        _classCallCheck(this, SpinStopState);
    }

    _createClass(SpinStopState, [{
        key: 'execute',
        value: function execute() {
            _AppProxy.AppProxy.getInstance().stopSpinSignal.addOnce(this.onSpinStopped.bind(this));
            _AppProxy.AppProxy.getInstance().iconAnimations.prepareAnimation();

            if (_AppModel.AppModel.getInstance().reelsJoint.length) {
                _AppProxy.AppProxy.getInstance().reels.startJoint();
            }
            if (_AppModel.AppModel.getInstance().showDudes) {
                _AppProxy.AppProxy.getInstance().ironDudes.show();
            }

            this.timer = setTimeout(this.stopSpinning.bind(this), _AppModel.AppModel.getInstance().getSpinTime());
        }
    }, {
        key: 'stopSpinning',
        value: function stopSpinning() {
            _AppProxy.AppProxy.getInstance().reels.stopSpin();
        }
    }, {
        key: 'onSpinStopped',
        value: function onSpinStopped() {
            clearTimeout(this.timer);

            if (_AppModel.AppModel.getInstance().lines.length) {
                _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.WIN_ANIMATION_STATE);
            } else {
                _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.IDLE_STATE);
            }
            _AppModel.AppModel.getInstance().updateBalance();
        }
    }, {
        key: 'getName',
        value: function getName() {
            return _Constants.Constants.SPIN_STOP_STATE;
        }
    }]);

    return SpinStopState;
}();

},{"../AppModel":3,"../AppProxy":4,"../components/Constants":10,"./StateMachine":43}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StateMachine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _IdleState = require('./IdleState');

var _InitState = require('./InitState');

var _SpinStartState = require('./SpinStartState');

var _SpinStopState = require('./SpinStopState');

var _WinAnimationState = require('./WinAnimationState');

var _Constants = require('../components/Constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateMachine = exports.StateMachine = function () {
    function StateMachine() {
        _classCallCheck(this, StateMachine);

        this.stateChangeSignal = new signals.Signal();

        this.stateMap = Object.create(null);
        this.stateMap[_Constants.Constants.INIT_STATE] = new _InitState.InitState();
        this.stateMap[_Constants.Constants.IDLE_STATE] = new _IdleState.IdleState();
        this.stateMap[_Constants.Constants.SPIN_START_STATE] = new _SpinStartState.SpinStartState();
        this.stateMap[_Constants.Constants.SPIN_STOP_STATE] = new _SpinStopState.SpinStopState();
        this.stateMap[_Constants.Constants.WIN_ANIMATION_STATE] = new _WinAnimationState.WinAnimationState();
    }

    _createClass(StateMachine, [{
        key: 'initialize',
        value: function initialize() {
            this.setState(_Constants.Constants.INIT_STATE);
        }
    }, {
        key: 'setState',
        value: function setState(stateName) {
            this.currentState = this.stateMap[stateName];
            this.stateChangeSignal.dispatch(this.currentState);
            this.currentState.execute();
        }
    }, {
        key: 'getCurrentState',
        value: function getCurrentState() {
            return this.currentState;
        }
    }]);

    return StateMachine;
}();

StateMachine.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};

},{"../components/Constants":10,"./IdleState":39,"./InitState":40,"./SpinStartState":41,"./SpinStopState":42,"./WinAnimationState":44}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WinAnimationState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Admin on 08.05.17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Constants = require('../components/Constants');

var _AppProxy = require('../AppProxy');

var _AppModel = require('../AppModel');

var _StateMachine = require('./StateMachine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WinAnimationState = exports.WinAnimationState = function () {
    function WinAnimationState() {
        _classCallCheck(this, WinAnimationState);
    }

    _createClass(WinAnimationState, [{
        key: 'execute',
        value: function execute() {
            _AppProxy.AppProxy.getInstance().startSpinSignal.addOnce(this.onStartSpin.bind(this));
            _AppProxy.AppProxy.getInstance().iconAnimations.visible = true;
            _AppProxy.AppProxy.getInstance().iconAnimations.playAnimation();
            _AppProxy.AppProxy.getInstance().lines.showLines();
            //AppProxy.getInstance().reels.visible = false;
            //AppModel.getInstance().dropFrozenReels();
        }
    }, {
        key: 'onStartSpin',
        value: function onStartSpin() {
            _AppProxy.AppProxy.getInstance().reels.visible = true;
            _AppProxy.AppProxy.getInstance().iconAnimations.stopAnimation();
            _AppProxy.AppProxy.getInstance().iconAnimations.visible = false;
            _StateMachine.StateMachine.getInstance().setState(_Constants.Constants.SPIN_START_STATE);
        }
    }, {
        key: 'getName',
        value: function getName() {
            return _Constants.Constants.WIN_ANIMATION_STATE;
        }
    }]);

    return WinAnimationState;
}();

},{"../AppModel":3,"../AppProxy":4,"../components/Constants":10,"./StateMachine":43}]},{},[1])

//# sourceMappingURL=build.js.map
