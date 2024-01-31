// (C) 2015 Triacontane
// 1.10.1 2018/05/30 アウトラインカラー取得で0およびその他の文字列を指定したときに正しく色が設定されない問題を修正(by奏ねこまさん)
/*:
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param itemIconSwitchId
 * @text アイテムアイコンスイッチID
 * @desc 指定した番号のスイッチがONのとき\ITEM[n]でアイコンが表示されます。指定しない場合、常に表示されます。
 * @default 0
 * @type switch
 *
 * @help 
 */
(function() {
    'use strict';
    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg.toString())) || 0).clamp(min, max);
    };
    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };
    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };
    var connectArgs = function(args, startIndex, endIndex) {
        if (arguments.length < 2) startIndex = 0;
        if (arguments.length < 3) endIndex = args.length;
        var text = '';
        for (var i = startIndex; i < endIndex; i++) {
            text += args[i];
            if (i < endIndex - 1) text += ' ';
        }
        return text;
    };
    var convertEscapeCharacters = function(text) {
        if (text === undefined || text === null) text = '';
        var window = SceneManager.getHiddenWindow();
        return window ? window.convertEscapeCharacters(text) : text;
    };
    var getUsingVariables = function(text) {
        var usingVariables = [];
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+),\s*(\d+)]/gi, function() {
            var number = parseInt(arguments[1], 10);
            usingVariables.push(number);
            return $gameVariables.value(number);
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            var number = parseInt(arguments[1], 10);
            usingVariables.push(number);
            return $gameVariables.value(number);
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            var number = parseInt(arguments[1], 10);
            usingVariables.push(number);
            return $gameVariables.value(number);
        }.bind(this));
        return usingVariables;
    };
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var textDecParam          = createPluginParameter('TextDecoration');
    var param                 = createPluginParameter('JsScript8Set');
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandDTextPicture(command, args);
    };
    Game_Interpreter.textAlignMapper = {
        LEFT: 0, CENTER: 1, RIGHT: 2, 左: 0, 中央: 1, 右: 2
    };
    Game_Interpreter.prototype.pluginCommandDTextPicture = function(command, args) {
        switch (getCommandName(command)) {
            case 'D_TEXT' :
                if (isNaN(args[args.length - 1]) || args.length === 1) args.push($gameScreen.dTextSize || 28);
                var fontSize = getArgNumber(args.pop());
                $gameScreen.setDTextPicture(connectArgs(args), fontSize);
                break;
            case 'D_TEXT_SETTING':
                switch (getCommandName(args[0])) {
                    case 'ALIGN' :
                        $gameScreen.dTextAlign = isNaN(args[1]) ?
                            Game_Interpreter.textAlignMapper[getArgString(args[1], true)] : getArgNumber(args[1], 0, 2);
                        break;
                    case 'BG_COLOR' :
                        $gameScreen.dTextBackColor = getArgString(connectArgs(args, 1));
                        break;
                    case 'BG_GRADATION_LEFT' :
                        $gameScreen.dTextGradationLeft = getArgNumber(args[1], 0);
                        break;
                    case 'BG_GRADATION_RIGHT' :
                        $gameScreen.dTextGradationRight = getArgNumber(args[1], 0);
                        break;
                    case 'FONT':
                        args.shift();
                        $gameScreen.setDtextFont(getArgString(connectArgs(args)));
                        break;
                    case 'REAL_TIME' :
                        $gameScreen.dTextRealTime = getArgBoolean(args[1]);
                        break;
                    case 'WINDOW':
                        $gameScreen.dWindowFrame = getArgBoolean(args[1]);
                        break;
                }
                break;
            case 'D_TEXT_WINDOW_CURSOR' :
                var windowRect = null;
                if (getArgBoolean(args[1])) {
                    windowRect = {
                        x     : getArgNumber(args[3] || '', 0),
                        y     : getArgNumber(args[4] || '', 0),
                        width : getArgNumber(args[5] || '', 0),
                        height: getArgNumber(args[6] || '', 0)
                    };
                }
                $gameScreen.setDTextWindowCursor(getArgNumber(args[0], 0), windowRect);
                break;
            case 'D_TEXT_WINDOW_CURSOR_ACTIVE' :
                $gameScreen.setDTextWindowCursorActive(getArgNumber(args[0], 0), getArgBoolean(args[1]));
                break;
        }
    };
    var _Game_Variables_setValue      = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        variableId = parseInt(variableId);
        if (this.value(variableId) !== value) {
            this._changedVariables = this.getChangedVariables();
            if (!this._changedVariables.contains(variableId)) {
                this._changedVariables.push(variableId);
            }
        }
        _Game_Variables_setValue.apply(this, arguments);
    };
    Game_Variables.prototype.getChangedVariables = function() {
        return this._changedVariables || [];
    };
    Game_Variables.prototype.clearChangedVariables = function() {
        return this._changedVariables = [];
    };
    var _Game_Screen_clear      = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.clearDTextPicture();
    };
    Game_Screen.prototype.clearDTextPicture = function() {
        this.dTextValue          = null;
        this.dTextOriginal       = null;
        this.dTextRealTime       = null;
        this.dTextSize           = 0;
        this.dTextAlign          = 0;
        this.dTextBackColor      = null;
        this.dTextFont           = null;
        this.dUsingVariables     = null;
        this.dWindowFrame        = null;
        this.dTextGradationRight = 0;
        this.dTextGradationLeft  = 0;
    };
    Game_Screen.prototype.setDTextPicture = function(value, size) {
        if (typeof TranslationManager !== 'undefined') {
            TranslationManager.translateIfNeed(value, function(translatedText) {
                value = translatedText;
            });
        }
        this.dUsingVariables = (this.dUsingVariables || []).concat(getUsingVariables(value));
        this.dTextValue      = (this.dTextValue || '') + getArgString(value, false) + '\n';
        this.dTextOriginal   = (this.dTextOriginal || '') + value + '\n';
        this.dTextSize       = size;
    };
    Game_Screen.prototype.setDTextWindowCursor = function(pictureId, rect) {
        var picture = this.picture(pictureId);
        if (picture) {
            picture.setWindowCursor(rect);
            picture.setWindowCursorActive(true);
        }
    };
    Game_Screen.prototype.setDTextWindowCursorActive = function(pictureId, value) {
        var picture = this.picture(pictureId);
        if (picture) {
            picture.setWindowCursorActive(value);
        }
    };
    Game_Screen.prototype.getDTextPictureInfo = function() {
        return {
            value         : this.dTextValue,
            size          : this.dTextSize || 0,
            align         : this.dTextAlign || 0,
            color         : this.dTextBackColor,
            font          : this.dTextFont,
            usingVariables: this.dUsingVariables,
            realTime      : this.dTextRealTime,
            originalValue : this.dTextOriginal,
            windowFrame   : this.dWindowFrame,
            gradationLeft : this.dTextGradationLeft,
            gradationRight: this.dTextGradationRight,
        };
    };
    Game_Screen.prototype.isSettingDText = function() {
        return !!this.dTextValue;
    };
    Game_Screen.prototype.setDtextFont = function(name) {
        this.dTextFont = name;
    };
    var _Game_Screen_updatePictures      = Game_Screen.prototype.updatePictures;
    Game_Screen.prototype.updatePictures = function() {
        _Game_Screen_updatePictures.apply(this, arguments);
        $gameVariables.clearChangedVariables();
    };
    var _Game_Picture_initBasic      = Game_Picture.prototype.initBasic;
    Game_Picture.prototype.initBasic = function() {
        _Game_Picture_initBasic.call(this);
        this.dTextValue = null;
        this.dTextInfo  = null;
    };
    var _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen.isSettingDText() && !name) {
            arguments[0]   = Date.now().toString();
            this.dTextInfo = $gameScreen.getDTextPictureInfo();
            $gameScreen.clearDTextPicture();
        } else {
            this.dTextInfo = null;
        }
        _Game_Picture_show.apply(this, arguments);
    };
    var _Game_Picture_update      = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.apply(this, arguments);
        if (this.dTextInfo && this.dTextInfo.realTime) {
            this.updateDTextVariable();
        }
    };
    Game_Picture.prototype.updateDTextVariable = function() {
        $gameVariables.getChangedVariables().forEach(function(variableId) {
            if (this.dTextInfo.usingVariables.contains(variableId)) {
                this._name           = Date.now().toString();
                this.dTextInfo.value = getArgString(this.dTextInfo.originalValue, false);
            }
        }, this);
    };
    Game_Picture.prototype.setWindowCursor = function(rect) {
        this._windowCursor = rect;
    };
    Game_Picture.prototype.getWindowCursor = function() {
        return this._windowCursor;
    };
    Game_Picture.prototype.setWindowCursorActive = function(value) {
        this._windowCursorActive = value;
    };
    Game_Picture.prototype.getWindowCursorActive = function() {
        return this._windowCursorActive;
    };
    SceneManager.getHiddenWindow = function() {
        if (!this._hiddenWindow) {
            this._hiddenWindow = new Window_Hidden(1, 1, 1, 1);
        }
        return this._hiddenWindow;
    };
    SceneManager.getSpriteset = function() {
        return this._scene._spriteset;
    };
    var _Window_Base_convertEscapeCharacters      = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        text = text.replace(/\x1bV\[(\d+),\s*(\d+)]/gi, function() {
            return this.getVariablePadZero($gameVariables.value(parseInt(arguments[1], 10)), arguments[2]);
        }.bind(this));
        text = text.replace(/\x1bITEM\[(\d+)]/gi, function() {
            var item = $dataItems[getArgNumber(arguments[1], 1, $dataItems.length)];
            return this.getItemInfoText(item);
        }.bind(this));
        text = text.replace(/\x1bWEAPON\[(\d+)]/gi, function() {
            var item = $dataWeapons[getArgNumber(arguments[1], 1, $dataWeapons.length)];
            return this.getItemInfoText(item);
        }.bind(this));
        text = text.replace(/\x1bARMOR\[(\d+)]/gi, function() {
            var item = $dataArmors[getArgNumber(arguments[1], 1, $dataArmors.length)];
            return this.getItemInfoText(item);
        }.bind(this));
        text = text.replace(/\x1bSKILL\[(\d+)]/gi, function() {
            var item = $dataSkills[getArgNumber(arguments[1], 1, $dataSkills.length)];
            return this.getItemInfoText(item);
        }.bind(this));
        text = text.replace(/\x1bSTATE\[(\d+)]/gi, function() {
            var item = $dataStates[getArgNumber(arguments[1], 1, $dataStates.length)];
            return this.getItemInfoText(item);
        }.bind(this));
        return text;
    };
    Window_Base.prototype.getItemInfoText = function(item) {
        if (!item) {
            return '';
        }
        return (this.isValidDTextIconSwitch() ? '\x1bi[' + item.iconIndex + ']' : '') + item.name;
    };
    Window_Base.prototype.isValidDTextIconSwitch = function() {
        return !param.itemIconSwitchId || $gameSwitches.value(param.itemIconSwitchId);
    };
    Window_Base.prototype.getVariablePadZero = function(value, digit) {
        return (value < 0 ? '-' : '') + Math.abs(value).padZero(digit);
    };
    var _Sprite_Picture_update      = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.apply(this, arguments);
        if (this._frameWindow) {
            this.updateFrameWindow();
        }
    };
    Sprite_Picture.prototype.updateFrameWindow = function() {
        var padding               = this._frameWindow.standardPadding();
        this._frameWindow.x       = this.x - (this.anchor.x * this.width * this.scale.x) - padding;
        this._frameWindow.y       = this.y - (this.anchor.y * this.height * this.scale.y) - padding;
        this._frameWindow.opacity = this.opacity;
        if (!this.visible) {
            this.removeFrameWindow();
            return;
        }
        if (!this._addFrameWindow) {
            this.addFrameWindow();
        }
        if (Graphics.frameCount % 2 === 0) {
            this.adjustScaleFrameWindow();
        }
        this.updateFrameWindowCursor();
    };
    Sprite_Picture.prototype.updateFrameWindowCursor = function() {
        var picture = this.picture();
        if (!picture) {
            return;
        }
        var rect = picture.getWindowCursor();
        if (rect) {
            var width  = rect.width || this._frameWindow.contentsWidth();
            var height = rect.width || this._frameWindow.contentsHeight();
            this._frameWindow.setCursorRect(0, 0, width, height);
            this._frameWindow.active = picture.getWindowCursorActive();
        } else {
            this._frameWindow.setCursorRect(0, 0, 0, 0);
        }
    };
    Sprite_Picture.prototype.adjustScaleFrameWindow = function() {
        var padding        = this._frameWindow.standardPadding();
        var newFrameWidth  = Math.floor(this.width * this.scale.x + padding * 2);
        var newFrameHeight = Math.floor(this.height * this.scale.x + padding * 2);
        if (this._frameWindow.width !== newFrameWidth || this._frameWindow.height !== newFrameHeight) {
            this._frameWindow.move(this._frameWindow.x, this._frameWindow.y, newFrameWidth, newFrameHeight);
        }
    };
    Sprite_Picture.prototype.addFrameWindow = function() {
        var parent = this.parent;
        if (parent) {
            var index = parent.getChildIndex(this);
            parent.addChildAt(this._frameWindow, index);
            this._addFrameWindow = true;
        }
    };
    Sprite_Picture.prototype.removeFrameWindow = function() {
        var parent = this.parent;
        if (parent) {
            parent.removeChild(this._frameWindow);
            this._frameWindow    = null;
            this._addFrameWindow = false;
        }
    };
    var _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        this.dTextInfo = this.picture().dTextInfo;
        if (this.dTextInfo) {
            this.makeDynamicBitmap();
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };
    Sprite_Picture.prototype.makeDynamicBitmap = function() {
        this.textWidths   = [];
        this.hiddenWindow = SceneManager.getHiddenWindow();
        this.hiddenWindow.resetFontSettings(this.dTextInfo);
        var bitmapVirtual = new Bitmap_Virtual();
        this._processText(bitmapVirtual);
        this.hiddenWindow.resetFontSettings(this.dTextInfo);
        this.bitmap = new Bitmap(bitmapVirtual.width, bitmapVirtual.height);
        this.applyTextDecoration();
        this.bitmap.fontFace = this.hiddenWindow.contents.fontFace;
        if (this.dTextInfo.color) {
            this.bitmap.fillAll(this.dTextInfo.color);
            var h             = this.bitmap.height;
            var w             = this.bitmap.width;
            var gradationLeft = this.dTextInfo.gradationLeft;
            if (gradationLeft > 0) {
                this.bitmap.clearRect(0, 0, gradationLeft, h);
                this.bitmap.gradientFillRect(0, 0, gradationLeft, h, 'rgba(0, 0, 0, 0)', this.dTextInfo.color, false);
            }
            var gradationRight = this.dTextInfo.gradationRight;
            if (gradationRight > 0) {
                this.bitmap.clearRect(w - gradationRight, 0, gradationRight, h);
                this.bitmap.gradientFillRect(w - gradationRight, 0, gradationRight, h, this.dTextInfo.color, 'rgba(0, 0, 0, 0)', false);
            }
        }
        this._processText(this.bitmap);
        this._colorTone = [0, 0, 0, 0];
        if (this._frameWindow) {
            this.removeFrameWindow();
        }
        if (this.dTextInfo.windowFrame) {
            var scaleX = this.picture().scaleX() / 100;
            var scaleY = this.picture().scaleY() / 100;
            this.makeFrameWindow(bitmapVirtual.width * scaleX, bitmapVirtual.height * scaleY);
        }
        this.hiddenWindow = null;
    };
    Sprite_Picture.prototype.applyTextDecoration = function() {
        if (textDecParam.Mode >= 0) {
            this.bitmap.outlineColor   =
                'rgba(%1,%2,%3,%4)'.format(textDecParam.Red, textDecParam.Green, textDecParam.Blue, textDecParam.Alpha / 255);
            this.bitmap.decorationMode = textDecParam.Mode;
        }
    };
    Sprite_Picture.prototype.makeFrameWindow = function(width, height) {
        var padding       = this.hiddenWindow.standardPadding();
        this._frameWindow = new Window_Base(0, 0, width + padding * 2, height + padding * 2);
    };
    Sprite_Picture.prototype._processText = function(bitmap) {
        var textState = {index: 0, x: 0, y: 0, text: this.dTextInfo.value, left: 0, line: -1, height: 0};
        this._processNewLine(textState, bitmap);
        textState.height = this.hiddenWindow.calcTextHeight(textState, false);
        textState.index  = 0;
        while (textState.text[textState.index]) {
            this._processCharacter(textState, bitmap);
        }
    };
    Sprite_Picture.prototype._processCharacter = function(textState, bitmap) {
        if (textState.text[textState.index] === '\x1b') {
            var code = this.hiddenWindow.obtainEscapeCode(textState);
            switch (code) {
                case 'C':
                    bitmap.textColor = this.hiddenWindow.textColor(this.hiddenWindow.obtainEscapeParam(textState));
                    break;
                case 'I':
                    this._processDrawIcon(this.hiddenWindow.obtainEscapeParam(textState), textState, bitmap);
                    break;
                case '{':
                    this.hiddenWindow.makeFontBigger();
                    break;
                case '}':
                    this.hiddenWindow.makeFontSmaller();
                    break;
                case 'F':
                    switch (this.hiddenWindow.obtainEscapeParamString(textState).toUpperCase()) {
                        case 'I':
                            bitmap.fontItalic = true;
                            break;
                        case 'B':
                            bitmap.fontBoldFotDtext = true;
                            break;
                        case '/':
                        case 'N':
                            bitmap.fontItalic       = false;
                            bitmap.fontBoldFotDtext = false;
                            break;
                    }
                    break;
                case 'OC':
                    var colorCode  = this.hiddenWindow.obtainEscapeParamString(textState);
                    var colorIndex = Number(colorCode);
                    if (!isNaN(colorIndex)) {
                        bitmap.outlineColor = this.hiddenWindow.textColor(colorIndex);
                    } else {
                        bitmap.outlineColor = colorCode;
                    }
                    break;
                case 'OW':
                    bitmap.outlineWidth = this.hiddenWindow.obtainEscapeParam(textState);
                    break;
            }
        } else if (textState.text[textState.index] === '\n') {
            this._processNewLine(textState, bitmap);
        } else {
            var c = textState.text[textState.index++];
            var w = this.hiddenWindow.textWidth(c);
            bitmap.fontSize = this.hiddenWindow.contents.fontSize;
            bitmap.drawText(c, textState.x, textState.y, w * 2, textState.height, 'left');
            textState.x += w;
        }
    };
    Sprite_Picture.prototype._processNewLine = function(textState, bitmap) {
        if (bitmap instanceof Bitmap_Virtual)
            this.textWidths[textState.line] = textState.x;
        this.hiddenWindow.processNewLine(textState);
        textState.line++;
        if (bitmap instanceof Bitmap)
            textState.x = (bitmap.width - this.textWidths[textState.line]) / 2 * this.dTextInfo.align;
    };
    Sprite_Picture.prototype._processDrawIcon = function(iconIndex, textState, bitmap) {
        var iconBitmap = ImageManager.loadSystem('IconSet');
        var pw         = Window_Base._iconWidth;
        var ph         = Window_Base._iconHeight;
        var sx         = iconIndex % 16 * pw;
        var sy         = Math.floor(iconIndex / 16) * ph;
        bitmap.blt(iconBitmap, sx, sy, pw, ph, textState.x + 2, textState.y + (textState.height - ph) / 2);
        textState.x += Window_Base._iconWidth + 4;
    };
    function Bitmap_Virtual() {
        this.initialize.apply(this, arguments);
    }
    Bitmap_Virtual.prototype.initialize = function() {
        this.window = SceneManager.getHiddenWindow();
        this.width  = 0;
        this.height = 0;
    };
    Bitmap_Virtual.prototype.drawText = function(text, x, y) {
        var baseWidth = this.window.textWidth(text);
        var fontSize  = this.window.contents.fontSize;
        if (this.fontItalic) {
            baseWidth += Math.floor(fontSize / 6);
        }
        if (this.fontBoldFotDtext) {
            baseWidth += 2;
        }
        this.width  = Math.max(x + baseWidth, this.width);
        this.height = Math.max(y + fontSize + 8, this.height);
    };
    Bitmap_Virtual.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.width  = Math.max(dx + (dw || sw), this.width);
        this.height = Math.max(dy + (dh || sh), this.height);
    };
    function Window_Hidden() {
        this.initialize.apply(this, arguments);
    }
    Window_Hidden.prototype.backOpacity = null;
    Window_Hidden.prototype             = Object.create(Window_Base.prototype);
    Window_Hidden.prototype.constructor = Window_Hidden;
    Window_Hidden.prototype._createAllParts = function() {
        this._windowBackSprite      = {};
        this._windowSpriteContainer = {};
        this._windowContentsSprite  = new Sprite();
        this.addChild(this._windowContentsSprite);
    };
    Window_Hidden.prototype._refreshAllParts = function() {};
    Window_Hidden.prototype._refreshBack = function() {};
    Window_Hidden.prototype._refreshFrame = function() {};
    Window_Hidden.prototype._refreshCursor = function() {};
    Window_Hidden.prototype._refreshArrows = function() {};
    Window_Hidden.prototype._refreshPauseSign = function() {};
    Window_Hidden.prototype.updateTransform = function() {};
    Window_Hidden.prototype.resetFontSettings = function(dTextInfo) {
        if (dTextInfo) {
            var customFont         = dTextInfo.font ? dTextInfo.font + ',' : '';
            this.contents.fontFace = customFont + this.standardFontFace();
            this.contents.fontSize = dTextInfo.size || this.standardFontSize();
        } else {
            Window_Base.prototype.resetFontSettings.apply(this, arguments);
        }
    };
    Window_Hidden.prototype.obtainEscapeParamString = function(textState) {
        var arr = /^\[.+?]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].substring(1, arr[0].length - 1);
        } else {
            return '';
        }
    };
    var _Bitmap__makeFontNameText      = Bitmap.prototype._makeFontNameText;
    Bitmap.prototype._makeFontNameText = function() {
        return (this.fontBoldFotDtext ? 'bold ' : '') + _Bitmap__makeFontNameText.apply(this, arguments);
    };
})();
