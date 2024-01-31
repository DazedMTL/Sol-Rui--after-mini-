// (C) 2015 Triacontane
/*:
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param 初期値
 * @desc 初期状態での有効/無効の設定値(ON/OFF)
 * @default OFF
 *
 * @param ピクチャ表示最大数
 * @desc ピクチャ表示最大数（デフォルト100個）を設定します。
 * 変えない場合は何も入力しないでください。
 * @default
 *
 * @help 
 */
var  PVS_MaxPicNo = 100; 
(function() {
    'use strict';
    var pluginName = 'JsScript41Set';
    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };
    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };
    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };
    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };
    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };
    PVS_MaxPicNo = getParamNumber('ピクチャ表示最大数', 0); 
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (getCommandName(command)) {
            case 'P_VARIABLE_VALID':
                $gameSystem.pictureNumVariable = true;
                break;
            case 'P_VARIABLE_INVALID':
                $gameSystem.pictureNumVariable = false;
                break;
            case 'P_D_FILENAME':
                $gameScreen.dPictureFileName = getArgString(args[0]);
                break;
            case 'P_TARGET_ALL':
                $gameScreen.setPictureTargetAll();
                break;
            case 'P_TARGET_RANGE':
                $gameScreen.setPictureTargetRange(getArgNumber(args[0], 1), getArgNumber(args[1], 1));
                break;
            case 'P_TARGET_MULTI':
                $gameScreen.setPictureTargetMulti(getArgArrayNumber(args[0], 1));
                break;
            case 'P_SPIN':
                var spinDuration = getArgNumber(args[2], 0);
                $gameScreen.spinPicture(getArgNumber(args[0], 1), getArgNumber(args[1]), spinDuration);
                if (args[3]) this.wait(spinDuration);
                break;
            case 'P_SPIN_RELATIVE':
                var spinRelativeDuration = getArgNumber(args[2], 0);
                $gameScreen.spinPictureRelative(getArgNumber(args[0], 1), getArgNumber(args[1]), spinRelativeDuration);
                if (args[3]) this.wait(spinRelativeDuration);
                break;
            case 'P_SHAKE':
                var shakeDuration = getArgNumber(args[4], 0) || Infinity;
                var power         = getArgNumber(args[1], 1, 9);
                var speed         = getArgNumber(args[2], 1, 9);
                var rotation      = getArgNumber(args[3], 0, 360);
                $gameScreen.shakePicture(getArgNumber(args[0], 1), power, speed, rotation, shakeDuration);
                if (args[5] && shakeDuration !== Infinity) this.wait(shakeDuration);
                break;
            case 'P_STOP_SHAKE':
                $gameScreen.shakePicture(getArgNumber(args[0], 1), 0, 0, 0, 0);
                break;
            case 'P_OUT_OF_SCREEN_SHAKE_ON':
                $gameScreen.setOutOfScreenShakePicture(getArgNumber(args[0], 1), true);
                break;
            case 'P_OUT_OF_SCREEN_SHAKE_OFF':
                $gameScreen.setOutOfScreenShakePicture(getArgNumber(args[0], 1), false);
                break;
        }
    };
    var _Game_Interpreter_command231      = Game_Interpreter.prototype.command231;
    Game_Interpreter.prototype.command231 = function() {
        return this.transPictureNumber(_Game_Interpreter_command231.bind(this));
    };
    var _Game_Interpreter_command232      = Game_Interpreter.prototype.command232;
    Game_Interpreter.prototype.command232 = function() {
        return this.transPictureNumber(_Game_Interpreter_command232.bind(this));
    };
    var _Game_Interpreter_command233      = Game_Interpreter.prototype.command233;
    Game_Interpreter.prototype.command233 = function() {
        return this.transPictureNumber(_Game_Interpreter_command233.bind(this));
    };
    var _Game_Interpreter_command234      = Game_Interpreter.prototype.command234;
    Game_Interpreter.prototype.command234 = function() {
        return this.transPictureNumber(_Game_Interpreter_command234.bind(this));
    };
    var _Game_Interpreter_command235      = Game_Interpreter.prototype.command235;
    Game_Interpreter.prototype.command235 = function() {
        return this.transPictureNumber(_Game_Interpreter_command235.bind(this));
    };
    Game_Interpreter.prototype.transPictureNumber = function(handler) {
        var result;
        if ($gameSystem.pictureNumVariable) {
            var oldValue    = this._params[0];
            this._params[0] = $gameVariables.value(this._params[0]).clamp(1, $gameScreen.maxPictures());
            result          = handler();
            this._params[0] = oldValue;
        } else {
            result = handler();
        }
        return result;
    };
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.pictureNumVariable = getParamBoolean('初期値');
    };
    var _Game_Screen_clear      = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.dPictureFileName      = null;
        this._pictureTargetStart   = null;
        this._pictureTargetEnd     = null;
        this._pictureTargetNumbers = null;
    };
    Game_Screen.prototype.setPictureTargetAll = function() {
        this._pictureTargetAll = 1;
    };
    Game_Screen.prototype.setPictureTargetRange = function(start, end) {
        this._pictureTargetAll   = 2;
        this._pictureTargetStart = start;
        this._pictureTargetEnd   = end;
    };
    Game_Screen.prototype.setPictureTargetMulti = function(args) {
        this._pictureTargetAll     = 3;
        this._pictureTargetNumbers = args;
    };
    var _Game_Screen_movePicture      = Game_Screen.prototype.movePicture;
    Game_Screen.prototype.movePicture = function(pictureId, origin, x, y, scaleX,
                                                 scaleY, opacity, blendMode, duration) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            _Game_Screen_movePicture.apply(this, arguments);
        }
    };
    var _Game_Screen_rotatePicture      = Game_Screen.prototype.rotatePicture;
    Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.rotate(speed);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            _Game_Screen_rotatePicture.apply(this, arguments);
        }
    };
    var _Game_Screen_tintPicture      = Game_Screen.prototype.tintPicture;
    Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.tint(tone, duration);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            _Game_Screen_tintPicture.apply(this, arguments);
        }
    };
    var _Game_Screen_erasePicture      = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function(pictureId) {
        if (this._pictureTargetAll) {
            this.iteratePictures(function(picture, pictureId) {
                var realPictureId             = this.realPictureId(pictureId);
                this._pictures[realPictureId] = null;
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            _Game_Screen_erasePicture.apply(this, arguments);
        }
    };
    Game_Screen.prototype.spinPicture = function(pictureId, rotation, duration) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.spin(rotation, duration);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            var picture = this.picture(pictureId);
            if (picture) {
                picture.spin(rotation, duration);
            }
        }
    };
    Game_Screen.prototype.spinPictureRelative = function(pictureId, relativeRotation, duration) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.spinRelative(relativeRotation, duration);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            var picture = this.picture(pictureId);
            if (picture) {
                picture.spinRelative(relativeRotation, duration);
            }
        }
    };
    Game_Screen.prototype.shakePicture = function(pictureId, power, speed, rotation, duration) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.shake(power, speed, rotation, duration);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            var picture = this.picture(pictureId);
            if (picture) {
                picture.shake(power, speed, rotation, duration);
            }
        }
    };
    Game_Screen.prototype.setOutOfScreenShakePicture = function(pictureId, value) {
        if (this._pictureTargetAll > 0) {
            this.iteratePictures(function(picture) {
                picture.setOutOfScreenShake(value);
            }.bind(this));
            this._pictureTargetAll = 0;
        } else {
            var picture = this.picture(pictureId);
            if (picture) {
                picture.setOutOfScreenShake(value);
            }
        }
    };
    Game_Screen.prototype.iteratePictures = function(callBack) {
        for (var i = 1, n = this.maxPictures(); i <= n; i++) {
            var picture = this.picture(i);
            if (picture && this.isTargetPicture(i)) {
                callBack.call(this, picture, i);
            }
        }
    };
    Game_Screen.prototype.isTargetPicture = function(number) {
        switch (this._pictureTargetAll) {
            case 2:
                return this._pictureTargetStart <= number && this._pictureTargetEnd >= number;
            case 3:
                return this._pictureTargetNumbers.contains(number);
            default:
                return true;
        }
    };
    var _Game_Screen_maxPictures      = Game_Screen.prototype.maxPictures;
    Game_Screen.prototype.maxPictures = function() {
        var max = getParamNumber('ピクチャ表示最大数', 0);
        return max > 0 ? max : _Game_Screen_maxPictures.apply(this, arguments);
    };
    var _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen.dPictureFileName != null) {
            arguments[0]                 = $gameScreen.dPictureFileName;
            $gameScreen.dPictureFileName = null;
        }
        _Game_Picture_show.apply(this, arguments);
    };
    var _Game_Picture_x      = Game_Picture.prototype.x;
    Game_Picture.prototype.x = function() {
        return _Game_Picture_x.apply(this, arguments) + this.getShakeX() -
            (this._outOfScreenShake ? Math.round($gameScreen.shake()) : 0);
    };
    var _Game_Picture_y      = Game_Picture.prototype.y;
    Game_Picture.prototype.y = function() {
        return _Game_Picture_y.apply(this, arguments) + this.getShakeY();
    };
    Game_Picture.prototype.setOutOfScreenShake = function(value) {
        this._outOfScreenShake = !!value;
    };
    Game_Picture.prototype.spin = function(targetRotation, duration) {
        this._targetRotation = targetRotation;
        this._angle          = (this._angle % 360);
        if (duration === 0) {
            this._angle = this._targetRotation;
        } else {
            this._spinDuration = duration;
        }
    };
    Game_Picture.prototype.spinRelative = function(targetRelativeRotation, duration) {
        this._angle = (this._angle % 360);
        this.spin(this._angle + targetRelativeRotation, duration);
    };
    Game_Picture.prototype.shake = function(power, speed, rotation, duration) {
        this.stopShake();
        this._shakePower     = power;
        this._shakeSpeed     = speed;
        this._shakeDuration  = duration;
        this._shakeRotation  = rotation * Math.PI / 180;
    };
    Game_Picture.prototype.stopShake = function() {
        this._shakeDirection = 1;
        this._shake          = 0;
    };
    var _Game_Picture_update      = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.apply(this, arguments);
        this.updateSpin();
        this.updateShake();
    };
    Game_Picture.prototype.updateSpin = function() {
        if (this._spinDuration > 0) {
            var d       = this._spinDuration;
            this._angle = (this._angle * (d - 1) + this._targetRotation) / d;
            this._spinDuration--;
        }
    };
    Game_Picture.prototype.updateShake = function() {
        if (this._shakeDuration > 0) {
            var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }
    };
    Game_Picture.prototype.getShakeX = function() {
        return this._shake ? this._shake * Math.cos(this._shakeRotation) : 0;
    };
    Game_Picture.prototype.getShakeY = function() {
        return this._shake ? this._shake * Math.sin(this._shakeRotation) : 0;
    };
})();
