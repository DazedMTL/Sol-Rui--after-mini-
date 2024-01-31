// (C)2015 Triacontane
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param 透明色を考慮
 * @desc クリックされた箇所が透明色だった場合は、クリックを無効にする。
 * @default true
 * @type boolean
 *
 * @param ピクチャ番号の変数番号
 * @desc ピクチャクリック時にピクチャ番号を格納するゲーム変数の番号。
 * @default 0
 * @type variable
 *
 * @param ポインタX座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のX座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param ポインタY座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のY座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param タッチ操作抑制
 * @desc トリガー条件を満たした際にタッチ情報をクリアします。(ON/OFF)
 * 他のタッチ操作と動作が重複する場合にONにします。
 * @default false
 * @type boolean
 *
 * @param 戦闘中常にコモン実行
 * @desc 戦闘中にピクチャをクリックしたとき、常にコモンイベントを実行します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param 無効スイッチ
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help 
 */
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param TransparentConsideration
 * @desc if click position is transparent, click is disabled.
 * @default true
 * @type boolean
 *
 * @param GameVariablePictureNum
 * @desc Game variable number that stores the picture number when common event called.
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchX
 * @desc Game variable number that stores touch x position
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchY
 * @desc Game variable number that stores touch y position
 * @default 0
 * @type variable
 *
 * @param SuppressTouch
 * @desc Suppress touch event for others(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AlwaysCommonInBattle
 * @desc Always execute common event in battle(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param InvalidSwitchId
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help 
 */
(function() {
    'use strict';
    var pluginName = 'JsScript40Set';
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };
    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };
    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };
    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };
    var paramGameVariableTouchX       = getParamNumber(['GameVariableTouchX', 'ポインタX座標の変数番号'], 0);
    var paramGameVariableTouchY       = getParamNumber(['GameVariableTouchY', 'ポインタY座標の変数番号'], 0);
    var paramGameVariablePictNum      = getParamNumber(['GameVariablePictureNum', 'ピクチャ番号の変数番号'], 0);
    var paramTransparentConsideration = getParamBoolean(['TransparentConsideration', '透明色を考慮']);
    var paramSuppressTouch            = getParamBoolean(['SuppressTouch', 'タッチ操作抑制']);
    var paramAlwaysCommonInBattle     = getParamBoolean(['AlwaysCommonInBattle', '戦闘中常にコモン実行']);
    var paramInvalidSwitchId          = getParamNumber(['InvalidSwitchId', '無効スイッチ'], 0);
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pictureId, touchParam, trigger, variableNum, transparent;
        switch (getCommandName(command)) {
            case 'P_CALL_CE' :
            case 'ピクチャのボタン化':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = getArgNumber(args[1], 1, $dataCommonEvents.length - 1);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam, trigger, transparent);
                break;
            case 'P_CALL_SWITCH' :
            case 'ピクチャのスイッチ化':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = getArgNumber(args[1], 1);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam * -1, trigger, transparent);
                break;
            case 'P_CALL_KEY_BIND' :
            case 'ピクチャのキーバインド':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = convertEscapeCharacters(args[1]);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam, trigger, transparent);
                break;
            case 'P_CALL_CE_REMOVE' :
            case 'ピクチャのボタン化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPictureRemoveCommon(pictureId);
                break;
            case 'P_STROKE' :
            case 'ピクチャのなでなで設定':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                variableNum = getArgNumber(args[1], 1, $dataSystem.variables.length - 1);
                transparent = (args.length > 2 ? getArgBoolean(args[2]) : null);
                $gameScreen.setPictureStroke(pictureId, variableNum, transparent);
                break;
            case 'P_STROKE_REMOVE' :
            case 'ピクチャのなでなで解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePictureStroke(pictureId);
                break;
            case 'P_POINTER' :
            case 'ピクチャのポインタ化':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPicturePointer(pictureId);
                break;
            case 'P_POINTER_REMOVE' :
            case 'ピクチャのポインタ化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePicturePointer(pictureId);
                break;
        }
    };
    var _Game_Interpreter_terminate      = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        this._setupFromPicture = false;
    };
    Game_Interpreter.prototype.setupFromPicture = function(eventList, commonId) {
        this.setup(eventList, null);
        if (this.setEventInfo) {
            this.setEventInfo({ eventType: 'common_event', commonEventId: commonId });
        }
        this._setupFromPicture = true;
    };
    Game_Interpreter.prototype.isSetupFromPicture = function() {
        return this._setupFromPicture;
    };
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearPictureCallInfo();
    };
    Game_Temp.prototype.clearPictureCallInfo = function() {
        this._pictureCommonId = 0;
        this._touchPictureId  = 0;
    };
    Game_Temp.prototype.setPictureCallInfo = function(pictureCommonId) {
        this._pictureCommonId = pictureCommonId;
    };
    Game_Temp.prototype.pictureCommonId = function() {
        if (!$gameScreen.picture(this._touchPictureId)) {
            this.clearPictureCallInfo();
        }
        return this._pictureCommonId;
    };
    Game_Temp.prototype.onTouchPicture = function(param, pictureId) {
        this._touchPictureParam = param;
        if (this.isTouchPictureSetSwitch()) {
            $gameSwitches.setValue(param * -1, true);
        }
        if (this.isTouchPictureCallCommon()) {
            if ($gameMap.isEventRunning() && !$gameParty.inBattle()) {
                this._touchPictureParam = null;
                return;
            }
            this.setPictureCallInfo(param);
        }
        if (this.isTouchPictureButtonTrigger()) {
            Input.bindKeyState(param);
        }
        if (paramGameVariablePictNum > 0) {
            $gameVariables.setValue(paramGameVariablePictNum, pictureId);
        }
        this._touchPictureId = pictureId;
    };
    Game_Temp.prototype.isTouchPictureButtonTrigger = function() {
        return isNaN(this._touchPictureParam);
    };
    Game_Temp.prototype.isTouchPictureSetSwitch = function() {
        return !isNaN(this._touchPictureParam) && this._touchPictureParam < 0;
    };
    Game_Temp.prototype.isTouchPictureCallCommon = function() {
        return !isNaN(this._touchPictureParam) && this._touchPictureParam > 0;
    };
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameScreen.initPictureArray();
    };
    var _Game_Map_setupStartingEvent      = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.call(this);
        return result || this.setupPictureCommonEvent();
    };
    Game_Map.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp.pictureCommonId();
        var event    = $dataCommonEvents[commonId];
        var result   = false;
        if (commonId > 0 && !this.isEventRunning() && event) {
            this._interpreter.setupFromPicture(event.list, commonId);
            result = true;
        }
        $gameTemp.clearPictureCallInfo();
        return result;
    };
    Game_Troop.prototype.setupPictureCommonEvent = Game_Map.prototype.setupPictureCommonEvent;
    Game_Troop.prototype.isExistPictureCommon = function() {
        return this._interpreter.isSetupFromPicture();
    };
    var _Game_Screen_initialize      = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.apply(this, arguments);
        this.initPictureArray();
    };
    Game_Screen.prototype.initPictureArray = function() {
        this._pictureCidArray         = this._pictureCidArray || [];
        this._pictureSidArray         = this._pictureSidArray || [];
        this._picturePidArray         = this._picturePidArray || [];
        this._pictureTransparentArray = this._pictureTransparentArray || [];
    };
    var _Game_Screen_update      = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.apply(this, arguments);
        this.updatePointer();
    };
    Game_Screen.prototype.updatePointer = function() {
        if (paramGameVariableTouchX)
            $gameVariables._data[paramGameVariableTouchX] = TouchInput.x;
        if (paramGameVariableTouchY)
            $gameVariables._data[paramGameVariableTouchY] = TouchInput.y;
    };
    Game_Screen.prototype.setPictureCallCommon = function(pictureId, touchParameter, trigger, transparent) {
        var realPictureId = this.realPictureId(pictureId);
        if (this._pictureCidArray[realPictureId] == null) this._pictureCidArray[realPictureId] = [];
        this._pictureCidArray[realPictureId][trigger] = touchParameter;
        this._pictureTransparentArray[realPictureId]  = transparent;
    };
    Game_Screen.prototype.setPictureRemoveCommon = function(pictureId) {
        this._pictureCidArray[this.realPictureId(pictureId)] = [];
    };
    Game_Screen.prototype.setPictureStroke = function(pictureId, variableNum, transparent) {
        var realPictureId = this.realPictureId(pictureId);
        this._pictureSidArray[realPictureId] = variableNum;
        this._pictureTransparentArray[realPictureId] = transparent;
    };
    Game_Screen.prototype.removePictureStroke = function(pictureId) {
        this._pictureSidArray[this.realPictureId(pictureId)] = null;
    };
    Game_Screen.prototype.setPicturePointer = function(pictureId) {
        this._picturePidArray[this.realPictureId(pictureId)] = true;
    };
    Game_Screen.prototype.removePicturePointer = function(pictureId) {
        this._picturePidArray[this.realPictureId(pictureId)] = null;
    };
    Game_Screen.prototype.getPictureCid = function(pictureId) {
        return this._pictureCidArray[this.realPictureId(pictureId)];
    };
    Game_Screen.prototype.getPictureSid = function(pictureId) {
        return this._pictureSidArray[this.realPictureId(pictureId)];
    };
    Game_Screen.prototype.getPicturePid = function(pictureId) {
        return this._picturePidArray[this.realPictureId(pictureId)];
    };
    Game_Screen.prototype.getPictureTransparent = function(pictureId) {
        return this._pictureTransparentArray[this.realPictureId(pictureId)];
    };
    Game_Screen.prototype.disConvertPositionX = function(x) {
        return Math.round((x + this.zoomX() - this.shake()) / this.zoomScale());
    };
    Game_Screen.prototype.disConvertPositionY = function(y) {
        return Math.round((y + this.zoomY()) / this.zoomScale());
    };
    Game_Screen.prototype.disConvertPositionY = function(y) {
        return Math.round((y + this.zoomY()) / this.zoomScale());
    };
    Game_Screen.prototype.isPointerInnerPicture = function(pictureId) {
        var picture = SceneManager.getPictureSprite(pictureId);
        return picture ? picture.isIncludePointer() : false;
    };
    SceneManager.getPictureSprite = function(pictureId) {
        return this._scene.getPictureSprite(pictureId);
    };
    BattleManager.updatePictureCommon = function() {
        if ($gameTroop.isExistPictureCommon() && paramAlwaysCommonInBattle) {
            this.updateEventMain();
            return true;
        }
        return false;
    };
    Scene_Base.prototype.updateTouchPictures = function() {
        if (paramInvalidSwitchId && $gameSwitches.value(paramInvalidSwitchId)) {
            return;
        }
        this._spriteset.iteratePictures(function(picture) {
            if (typeof picture.callTouch === 'function') picture.callTouch();
            return $gameTemp.pictureCommonId() === 0;
        });
    };
    Scene_Base.prototype.getPictureSprite = function(pictureId) {
        var result = null;
        this._spriteset.iteratePictures(function(picture) {
            if (picture.isIdEquals(pictureId)) {
                result = picture;
                return false;
            }
            return true;
        });
        return result;
    };
    var _Scene_Map_update      = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        this.updateTouchPictures();
        _Scene_Map_update.apply(this, arguments);
    };
    var _Scene_Map_processMapTouch      = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        _Scene_Map_processMapTouch.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && $gameTemp.pictureCommonId() > 0) {
            $gameTemp.clearDestination();
        }
    };
    var _Scene_Map_terminate      = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.apply(this, arguments);
        $gameTemp.clearPictureCallInfo();
    };
    var _Scene_Battle_update      = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        this.updateTouchPictures();
        $gameTroop.setupPictureCommonEvent();
        _Scene_Battle_update.apply(this, arguments);
    };
    var _Scene_Battle_updateBattleProcess      = Scene_Battle.prototype.updateBattleProcess;
    Scene_Battle.prototype.updateBattleProcess = function() {
        var result = BattleManager.updatePictureCommon();
        if (result) return;
        _Scene_Battle_updateBattleProcess.apply(this, arguments);
    };
    var _Scene_Battle_terminate      = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.apply(this, arguments);
        $gameTemp.clearPictureCallInfo();
    };
    Spriteset_Base.prototype.iteratePictures = function(callBackFund) {
        var containerChildren = this._pictureContainer.children;
        if (!Array.isArray(containerChildren)) {
            iterate(this._pictureContainer, function(property) {
                if (this._pictureContainer[property].hasOwnProperty('children')) {
                    containerChildren = this._pictureContainer[property].children;
                    this._iteratePicturesSub(containerChildren, callBackFund);
                }
            }.bind(this));
        } else {
            this._iteratePicturesSub(containerChildren, callBackFund);
        }
    };
    Spriteset_Base.prototype._iteratePicturesSub = function(containerChildren, callBackFund) {
        for (var i = containerChildren.length - 1; i >= 0; i--) {
            if (!callBackFund(containerChildren[i])) {
                break;
            }
        }
    };
    var _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._triggerHandler     = [];
        this._triggerHandler[1]  = this.isTriggered;
        this._triggerHandler[2]  = this.isCancelled;
        this._triggerHandler[3]  = this.isLongPressed;
        this._triggerHandler[4]  = this.isOnFocus;
        this._triggerHandler[5]  = this.isOutFocus;
        this._triggerHandler[6]  = this.isReleased;
        this._triggerHandler[7]  = this.isRepeated;
        this._triggerHandler[8]  = this.isPressed;
        this._triggerHandler[9]  = this.isWheelTriggered;
        this._triggerHandler[10] = this.isDoubleTriggered;
        this._triggerHandler[11] = this.isMoved;
        this._triggerHandler[12] = this.isMovedAndPressed;
        this._onMouse            = false;
        this._outMouse           = false;
        this._wasOnMouse         = false;
    };
    var _Sprite_update              = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_update.apply(this, arguments);
        this.updateTouch();
    };
    Sprite_Picture.prototype.updateTouch = function() {
        this.updateMouseMove();
        this.updateStroke();
        this.updatePointer();
    };
    Sprite_Picture.prototype.updateMouseMove = function() {
        if (this.isIncludePointer()) {
            if (!this._wasOnMouse) {
                this._onMouse    = true;
                this._wasOnMouse = true;
            }
        } else if (this._wasOnMouse) {
                this._outMouse   = true;
                this._wasOnMouse = false;
            }
    };
    Sprite_Picture.prototype.isIncludePointer = function() {
        return this.isTouchable() && this.isTouchPosInRect() && !this.isTransparent();
    };
    Sprite_Picture.prototype.updateStroke = function() {
        var strokeNum = $gameScreen.getPictureSid(this._pictureId);
        if (strokeNum > 0 && TouchInput.isPressed() && this.isIncludePointer()) {
            var value = $gameVariables.value(strokeNum);
            $gameVariables.setValue(strokeNum, value + TouchInput.pressedDistance);
        }
    };
    Sprite_Picture.prototype.updatePointer = function() {
        var strokeNum = $gameScreen.getPicturePid(this._pictureId);
        if (strokeNum > 0) {
            this.opacity  = TouchInput.isPressed() ? 255 : 0;
            this.x        = TouchInput.x;
            this.y        = TouchInput.y;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };
    Sprite_Picture.prototype.callTouch = function() {
        var commandIds = $gameScreen.getPictureCid(this._pictureId);
        if (!commandIds || SceneManager.isNextScene(Scene_Battle)) {
            return;
        }
        for (var i = 0, n = this._triggerHandler.length; i < n; i++) {
            var handler = this._triggerHandler[i];
            if (handler && commandIds[i] && handler.call(this) && (this.triggerIsFocus(i) || !this.isTransparent())) {
                this.fireTouchEvent(commandIds, i);
            }
        }
    };
    Sprite_Picture.prototype.fireTouchEvent = function(commandIds, i) {
        if (paramSuppressTouch) TouchInput.suppressEvents();
        if (this.triggerIsLongPressed(i)) TouchInput._pressedTime = -60;
        if (this.triggerIsOnFocus(i)) this._onMouse = false;
        if (this.triggerIsOutFocus(i)) this._outMouse = false;
        $gameTemp.onTouchPicture(commandIds[i], this._pictureId);
    };
    Sprite_Picture.prototype.triggerIsLongPressed = function(triggerId) {
        return triggerId === 3;
    };
    Sprite_Picture.prototype.triggerIsOnFocus = function(triggerId) {
        return triggerId === 4;
    };
    Sprite_Picture.prototype.triggerIsOutFocus = function(triggerId) {
        return triggerId === 5;
    };
    Sprite_Picture.prototype.triggerIsFocus = function(triggerId) {
        return this.triggerIsOnFocus(triggerId) || this.triggerIsOutFocus(triggerId);
    };
    Sprite_Picture.prototype.isTransparent = function() {
        if (this.isTouchPosInFrameWindow()) return false;
        if (!this.isValidTransparent()) return false;
        if (this.opacity === 0) return true;
        var dx  = this.getTouchScreenX() - this.x;
        var dy  = this.getTouchScreenY() - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var bx  = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
        var by  = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
        return this.bitmap.getAlphaPixel(bx, by) === 0;
    };
    Sprite_Picture.prototype.isValidTransparent = function() {
        var transparent = $gameScreen.getPictureTransparent(this._pictureId);
        return transparent !== null ? transparent : paramTransparentConsideration;
    };
    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };
    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };
    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };
    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };
    Sprite_Picture.prototype.minX = function() {
        return Math.min(this.screenX(), this.screenX() + this.screenWidth());
    };
    Sprite_Picture.prototype.minY = function() {
        return Math.min(this.screenY(), this.screenY() + this.screenHeight());
    };
    Sprite_Picture.prototype.maxX = function() {
        return Math.max(this.screenX(), this.screenX() + this.screenWidth());
    };
    Sprite_Picture.prototype.maxY = function() {
        return Math.max(this.screenY(), this.screenY() + this.screenHeight());
    };
    Sprite_Picture.prototype.isTouchPosInRect = function() {
        if (this.isTouchPosInFrameWindow()) return true;
        var dx  = this.getTouchScreenX() - this.x;
        var dy  = this.getTouchScreenY() - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var rx  = this.x + Math.floor(dx * cos + dy * -sin);
        var ry  = this.y + Math.floor(dx * sin + dy * cos);
        return (rx >= this.minX() && rx <= this.maxX() && ry >= this.minY() && ry <= this.maxY());
    };
    Sprite_Picture.prototype.isTouchPosInFrameWindow = function() {
        if (!this._frameWindow) return false;
        var frame = this._frameWindow;
        var x     = this.getTouchScreenX();
        var y     = this.getTouchScreenY();
        return frame.x <= x && frame.x + frame.width >= x && frame.y <= y && frame.y + frame.height >= y;
    };
    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };
    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };
    Sprite_Picture.prototype.isCancelled = function() {
        return this.isTouchEvent(TouchInput.isCancelled);
    };
    Sprite_Picture.prototype.isLongPressed = function() {
        return this.isTouchEvent(TouchInput.isLongPressed);
    };
    Sprite_Picture.prototype.isPressed = function() {
        return this.isTouchEvent(TouchInput.isPressed);
    };
    Sprite_Picture.prototype.isReleased = function() {
        return this.isTouchEvent(TouchInput.isReleased);
    };
    Sprite_Picture.prototype.isRepeated = function() {
        return this.isTouchEvent(TouchInput.isRepeated);
    };
    Sprite_Picture.prototype.isOnFocus = function() {
        return this._onMouse;
    };
    Sprite_Picture.prototype.isOutFocus = function() {
        return this._outMouse;
    };
    Sprite_Picture.prototype.isMoved = function() {
        return this.isTouchEvent(TouchInput.isMoved);
    };
    Sprite_Picture.prototype.isMovedAndPressed = function() {
        return this.isTouchEvent(TouchInput.isMoved) && TouchInput.isPressed();
    };
    Sprite_Picture.prototype.isWheelTriggered = function() {
        return this.isTouchEvent(TouchInput.isWheelTriggered);
    };
    Sprite_Picture.prototype.isDoubleTriggered = function() {
        return this.isTouchEvent(TouchInput.isDoubleTriggered);
    };
    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };
    Sprite_Picture.prototype.getTouchScreenX = function() {
        return $gameScreen.disConvertPositionX(TouchInput.x);
    };
    Sprite_Picture.prototype.getTouchScreenY = function() {
        return $gameScreen.disConvertPositionY(TouchInput.y);
    };
    Sprite_Picture.prototype.isIdEquals = function(pictureId) {
        return this._pictureId === pictureId;
    };
    Input._bindKeyStateFrames = new Map();
    Input.bindKeyState        = function(name) {
        this._currentState[name] = true;
        this._bindKeyStateFrames.set(name, 5);
    };
    var _Input_update = Input.update;
    Input.update      = function() {
        _Input_update.apply(this, arguments);
        this._updateBindKeyState();
    };
    Input._updateBindKeyState = function() {
        this._bindKeyStateFrames.forEach(function(frame, keyName) {
            frame--;
            if (frame === 0 || !this._currentState[keyName]) {
                this._currentState[keyName] = false;
                this._bindKeyStateFrames.delete(keyName);
            } else {
                this._bindKeyStateFrames.set(keyName, frame);
            }
        }, this);
    };
    TouchInput.keyDoubleClickInterval = 300;
    TouchInput._pressedDistance       = 0;
    TouchInput._prevX                 = -1;
    TouchInput._prevY                 = -1;
    Object.defineProperty(TouchInput, 'pressedDistance', {
        get         : function() {
            return this._pressedDistance;
        },
        configurable: true
    });
    TouchInput.suppressEvents = function() {
        this._triggered       = false;
        this._cancelled       = false;
        this._released        = false;
        this._wheelTriggered  = false;
        this._doubleTriggered = false;
    };
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    var _TouchInput_clear = TouchInput.clear;
    TouchInput.clear      = function() {
        _TouchInput_clear.apply(this, arguments);
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };
    var _TouchInput_update = TouchInput.update;
    TouchInput.update      = function() {
        _TouchInput_update.apply(this, arguments);
        this._wheelTriggered         = this._events.wheelTriggered;
        this._doubleTriggered        = this._events.doubleTriggered;
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };
    TouchInput.isWheelTriggered = function() {
        return this._wheelTriggered;
    };
    TouchInput.isDoubleTriggered = function() {
        return this._doubleTriggered;
    };
    var _TouchInput_onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown     = function(event) {
        _TouchInput_onMiddleButtonDown.apply(this, arguments);
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onWheelTrigger(x, y);
        }
    };
    TouchInput._onWheelTrigger = function(x, y) {
        this._events.wheelTriggered = true;
        this._x                     = x;
        this._y                     = y;
    };
    var _TouchInput_onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger     = function(x, y) {
        if (this._date && Date.now() - this._date < this.keyDoubleClickInterval)
            this._events.doubleTriggered = true;
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onTrigger.apply(this, arguments);
    };
    var _TouchInput_onMove = TouchInput._onMove;
    TouchInput._onMove     = function(x, y) {
        if (this.isPressed()) this._pressedDistance = Math.abs(this._prevX - x) + Math.abs(this._prevY - y);
        this._prevX = x;
        this._prevY = y;
        _TouchInput_onMove.apply(this, arguments);
    };
    var _TouchInput_onRelease = TouchInput._onRelease;
    TouchInput._onRelease     = function(x, y) {
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onRelease.apply(this, arguments);
    };
})();
