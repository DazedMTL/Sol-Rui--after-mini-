// 一度に複数のメッセージウィンドウを表示するプラグイン(v2)
var Imported = Imported || {};
Imported.FTKR_EMW = true;
var FTKR = FTKR || {};
FTKR.EMW = FTKR.EMW || {};
/*:
 * @plugindesc 
 * @author フトコロ
 * 
 * @param --初期設定--
 * @desc 
 * 
 * @param Create ExWindow Number
 * @desc 拡張ウィンドウを生成する数を設定します。
 * @default 1
 * 
 * @param --シーン開始時--
 * @desc 
 * 
 * @param Scene Start Terminate
 * @desc シーン開始時にすべてのウィンドウIDを強制終了する。
 * 1 - 有効にする、0 - 無効にする
 * @default 1
 * 
 * @param --イベント終了時--
 * @desc 
 * 
 * @param Reset Window Id
 * @desc イベント終了時にウィンドウIDをリセットする。
 * 1 - 有効にする、0 - 無効にする
 * @default 0
 * 
 * @help 
*/
FTKR.EMW.parameters = PluginManager.parameters('JsScript11Set');
FTKR.EMW.nameWindows = [];
FTKR.EMW.exwindowNum = Number(FTKR.EMW.parameters['Create ExWindow Number'] || 0);
FTKR.EMW.scene = {
    startTerminate:Number(FTKR.EMW.parameters['Scene Start Terminate'] || 0),
};
FTKR.EMW.event = {
    resetWindowId:Number(FTKR.EMW.parameters['Reset Window Id'] || 0),
};
var readObjectMeta = function(obj, metacodes) {
    if (!obj) return false;
    metacodes.some(function(metacode){
        var metaReg = new RegExp('<' + metacode + ':[ ]*(.+)>', 'i');
        return obj.note.match(metaReg);
    }); 
    return RegExp.$1 ? Number(RegExp.$1) : false;
};
var convertPositionX = function(text) {
    switch(true){
    case /左/.test(text):
    case /left/i.test(text):
    case Number(text) === 0:
        return 0;
    case /中/.test(text):
    case /center/i.test(text):
    case Number(text) === 1:
        return 1;
    case /右/.test(text):
    case /right/i.test(text):
    case Number(text) === 2:
        return 2;
    default:
        return undefined;
    }
};
var matchTextToRegs = function(test, regs) {
    return regs.some( function(reg){
        return test.match(reg);
    });
};
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (!command.match(/EMW_(.+)/i)) return;
    command = RegExp.$1;
    if(!matchTextToRegs(command, [/メッセージウィンドウ(.+)/, /MessageWindow_(.+)/i])) return;
    command = (RegExp.$1 + '').toUpperCase();
    switch (command) {
    case '指定':
    case 'SET':
        this.setMessageWindowId(args);
        break;
    case 'リセット':
    case 'RESET':
        this._windowId = 0;
        break;
    case '強制クローズ':
    case '強制終了':
    case 'CLOSE':
        this.messageWindowTerminate(args);
        break;
    case '終了禁止':
    case 'NOEND':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).prohibitClose();
        break;
    case '終了許可':
    case 'CANCLOSE':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).permitClose();
        break;
    case 'サイズ設定':
    case 'SETSIZE':
        this.setMessageWindowSize(args);
        break;
    case '位置設定':
    case 'SETPOSITION':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).setPositionX(args[1]);
        break;
    case '行動許可':
    case 'CANMOVE':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).enabledCanMovePlayer(args[1]);
        break;
    case '行動禁止':
    case 'NOTMOVE':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).disabledCanMovePlayer(args[1]);
        break;
    case 'テキスト更新':
    case 'UPDATE_TEXT':
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) $gameMessageEx.window(windowId).setFinishDisp();
        break;
    }
};
Game_Interpreter.prototype.setMessageWindowId = function(args) {
    var windowId = Number(args[0] || 0);
    if (windowId >= 0) {
        this._windowId = windowId;
        var width = 0, heightLine = 0;
        for (var i = 1; i < args.length; i++) {
            var arg = (args[i] + '').toUpperCase();
            switch (arg) {
            case 'テキスト更新':
            case 'UPDATE_TEXT':
                $gameMessageEx.window(windowId).setFinishDisp();
                break;
            case '終了禁止':
            case 'NOEND':
                $gameMessageEx.window(windowId).prohibitClose();
                break;
            case '終了許可':
            case 'CANCLOSE':
                $gameMessageEx.window(windowId).permitClose();
                break;
            case '行動許可':
            case 'CANMOVE':
                $gameMessageEx.window(windowId).enabledCanMovePlayer();
                break;
            case '行動禁止':
            case 'NOTMOVE':
                $gameMessageEx.window(windowId).disabledCanMovePlayer();
                break;
            case '幅':
            case 'WIDTH':
                i++;
                width = Number(args[i]);
                break;
            case '行数':
            case 'LINES':
                i++;
                heightLine = Number(args[i]);
                break;
            default:
                if (convertPositionX(arg) !== undefined) {
                    $gameMessageEx.window(windowId).setPositionX(arg);
                }
                break;
            }
        }
        if (width || heightLine) {
            $gameMessageEx.window(windowId).setWindowSize(width, heightLine);
        }
    }
};
Game_Interpreter.prototype.messageWindowTerminate = function(args) {
    var arg = (args[0] + '').toUpperCase();
    switch (arg) {
    case 'すべて':
    case 'ALL':
        $gameMessageEx.windows().forEach( function(message){
            message.terminate();
        });
        break;
    default:
        var windowId = Number(args[0] || 0);
        if (windowId >= 0) {
            $gameMessageEx.window(windowId).terminate();
        }
        break;
    }
};
Game_Interpreter.prototype.setMessageWindowSize = function(args) {
    var windowId = Number(args[0] || 0);
    if (windowId >= 0) {
        var width = 0, heightLine = 0;
        for (var i = 1; i < args.length; i++) {
            var arg = (args[i] + '').toUpperCase();
            switch (arg) {
            case '幅':
            case 'WIDTH':
                i++;
                width = Number(args[i]);
                break;
            case '行数':
            case 'LINES':
                i++;
                heightLine = Number(args[i]);
                break;
            case 'リセット':
            case 'RESET':
                width = Graphics.boxWidth;
                heightLine = 4;
                continue;
            }
        }
        $gameMessageEx.window(windowId).setWindowSize(width, heightLine);
    }
};
FTKR.EMW.Game_Message_initialize = Game_Message.prototype.initialize;
Game_Message.prototype.initialize = function() {
    FTKR.EMW.Game_Message_initialize.call(this);
    this._permissionClose = true;
    this._canMovePlayer = false;
    this._terminate = false;
    this._finishDisp = false;
};
FTKR.EMW.Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    FTKR.EMW.Game_Message_clear.call(this);
    this._lastText = false;
    this._positionX = 0;
    this._windowWidth = 0;
    this._windowHeightLine = 0;
};
FTKR.EMW.Window_Message_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function() {
    this._windowId = this._windowId || 0;
    this._gameMessage = $gameMessageEx.window(this._windowId);
    FTKR.EMW.Window_Message_initialize.call(this);
};
FTKR.EMW.Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'EMP':
        $gameMessageEx.window(this._windowId).enabledCanMovePlayer();
        break;
    case 'DMP':
        $gameMessageEx.window(this._windowId).disabledCanMovePlayer();
        break;
    default:
        FTKR.EMW.Window_Message_processEscapeCharacter.call(this, code, textState);
        break;
    }
};
Game_Message.prototype.canMovePlayer = function() {
    return this._canMovePlayer;
};
Game_Message.prototype.enabledCanMovePlayer = function() {
    this._canMovePlayer = true;
};
Game_Message.prototype.disabledCanMovePlayer = function() {
    this._canMovePlayer = false;
};
Game_Message.prototype.isBusy = function() {
    return $gameMessageEx.windows().some(function(message){
        return message.isEmwBusy();
    });
};
Game_Message.prototype.isEmwBusy = function() {
    return this.canMovePlayer() ? false : this.isEmwEventBusy();
};
Game_Message.prototype.isEmwEventBusy = function() {
    return this.isLastText() ? false : this.isBusyBase();
};
Game_Message.prototype.isBusyBase = function() {
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
};
Window_Message.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    while (this.updateConditions()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};
Window_Message.prototype.updateConditions = function() {
    return !this.isOpening() && !this.isClosing() && !this._gameMessage.isLastText();
};
FTKR.EMW.Window_Message_updateWait = Window_Message.prototype.updateWait;
Window_Message.prototype.updateWait = function() {
    if (this._gameMessage.isFinishDisp()) {
        this.finishDisplay();
        if (this._gameMessage.isTerminate()) {
            this._gameMessage.resetTerminate();
        }
        return false;
    }
    return FTKR.EMW.Window_Message_updateWait.call(this);
};
Window_Message.prototype.finishDisplay = function() {
    this._waitCount = 0;
    if(this._textState) this._textState.index = this._textState.text.length;
    this._pauseSkip = true;
    this.pause = false;
    this._gameMessage.resetFinishDisp();
};
FTKR.EMW.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    this._gameMessage.lastText();
    if (this._gameMessage.canClose()) {
        FTKR.EMW.Window_Message_terminateMessage.call(this);
    }
};
Game_Message.prototype.isFinishDisp = function() {
    return this._finishDisp;
};
Game_Message.prototype.setFinishDisp = function() {
    this._finishDisp = true;
};
Game_Message.prototype.resetFinishDisp = function() {
    this._finishDisp = false;
};
Game_Message.prototype.isTerminate = function() {
    return this._terminate;
};
Game_Message.prototype.setTerminate = function() {
    this._terminate = true;
};
Game_Message.prototype.resetTerminate = function() {
    this._terminate = false;
};
Game_Message.prototype.terminate = function() {
    if (!this.isBusyBase()) return;
    this.permitClose();
    this.lastText();
    this.setFinishDisp();
    this.setTerminate();
    var message = this.windowMessageEx();
    if (message) {
        message.activate()
        message.terminateMessage();
    }
}
Game_Message.prototype.windowMessageEx = function() {
    return this._window_MessageEx;
}
Game_Message.prototype.isLastText = function() {
    return this._lastText;
};
Game_Message.prototype.firstText = function() {
    this._lastText = false;
};
Game_Message.prototype.lastText = function() {
    this._lastText = true;
};
Game_Message.prototype.canClose = function() {
    return this._permissionClose;
};
Game_Message.prototype.permitClose = function() {
    this._permissionClose = true;
};
Game_Message.prototype.prohibitClose = function() {
    this._permissionClose = false;
};
Game_Message.prototype.clearText = function()  {
    this._lastText = false;
    this._texts = [];
};
Game_Message.prototype.disp = function(text) {
    this.clear();
    this.add(text);
}
FTKR.EMW.Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement = function() {
    if ($gameMessage.windowWidth()) {
        this.width = $gameMessage.windowWidth();
    }
    if ($gameMessage.windowHeightLine()) {
        this.height = this.fittingHeight($gameMessage.windowHeightLine());
    }
    FTKR.EMW.Window_Message_updatePlacement.call(this);
    if ($gameMessage.windowPositionX()) {
        this._positionX = $gameMessage.windowPositionX();
        this.x = this._positionX * (Graphics.boxWidth - this.width) / 2;
    }
};
Game_Message.prototype.setWindowSize = function(width, heightLine) {
    this._windowWidth = width;
    this._windowHeightLine = heightLine;
};
Game_Message.prototype.windowWidth = function() {
    return this._windowWidth;
};
Game_Message.prototype.windowHeightLine = function() {
    return this._windowHeightLine;
};
Game_Message.prototype.setPositionX = function(positionX) {
    this._positionX = convertPositionX(positionX);
};
Game_Message.prototype.windowPositionX = function() {
    return this._positionX;
};
FTKR.EMW.Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;
Game_Interpreter.prototype.initialize = function(depth) {
    FTKR.EMW.Game_Interpreter_initialize.call(this, depth);
    this._windowId = 0;
};
Game_Interpreter.prototype.windowId = function() {
    return this._windowId;
};
FTKR.EMW.Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
Game_Interpreter.prototype.terminate = function() {
    FTKR.EMW.Game_Interpreter_terminate.call(this);
    if (FTKR.EMW.event.resetWindowId) this._windowId = 0;
};
FTKR.EMW.Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function() {
    var windowId = this.windowId();
    if (!windowId) {
        return FTKR.EMW.Game_Interpreter_command101.call(this);
    } else {
        if (!$gameMessageEx.window(windowId).isEmwEventBusy()) {
            $gameMessageEx.window(windowId).clearText();
            $gameMessageEx.window(windowId).setFaceImage(this._params[0], this._params[1]);
            $gameMessageEx.window(windowId).setBackground(this._params[2]);
            $gameMessageEx.window(windowId).setPositionType(this._params[3]);
            this.continueMessages(windowId);
            switch (this.nextEventCode()) {
            case 102:  
                this._index++;
                this.setupChoices(this.currentCommand().parameters);
                break;
            case 103:  
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104:  
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
};
Game_Interpreter.prototype.continueMessages =function(windowId) {
    if (Imported.YEP_MessageCore) {
      while (this.isContinueMessageString()) {
        this._index++;
        if (this._list[this._index].code === 401) {
          $gameMessageEx.window(windowId).addText(this.currentCommand().parameters[0]);
        }
        if ($gameMessageEx.window(windowId)._texts.length >= $gameSystem.messageRows()) break;
      }
    } else {
        while (this.nextEventCode() === 401) {  
            this._index++;
            $gameMessageEx.window(windowId).add(this.currentCommand().parameters[0]);
        }
    }
};
FTKR.EMW.Game_Interpreter_command102 = Game_Interpreter.prototype.command102;
Game_Interpreter.prototype.command102 = function() {
    var windowId = this.windowId();
    if (!windowId) {
        return FTKR.EMW.Game_Interpreter_command102.call(this);
    } else {
        if (!$gameMessageEx.window(windowId).isEmwEventBusy()) {
            this.setupChoices(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
};
FTKR.EMW.Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
Game_Interpreter.prototype.setupChoices = function(params) {
    var windowId = this.windowId();
    if (!windowId) {
        FTKR.EMW.Game_Interpreter_setupChoices.call(this, params);
    } else {
        var choices = params[0].clone();
        var cancelType = params[1];
        var defaultType = params.length > 2 ? params[2] : 0;
        var positionType = params.length > 3 ? params[3] : 2;
        var background = params.length > 4 ? params[4] : 0;
        if (cancelType >= choices.length) {
            cancelType = -2;
        }
        $gameMessageEx.window(windowId).setChoices(choices, defaultType, cancelType);
        $gameMessageEx.window(windowId).setChoiceBackground(background);
        $gameMessageEx.window(windowId).setChoicePositionType(positionType);
        $gameMessageEx.window(windowId).setChoiceCallback(function(n) {
            this._branch[this._indent] = n;
        }.bind(this));
    }
};
FTKR.EMW.Game_Interpreter_command103 = Game_Interpreter.prototype.command103;
Game_Interpreter.prototype.command103 = function() {
    var windowId = this.windowId();
    if (!windowId) {
        return FTKR.EMW.Game_Interpreter_command103.call(this);
    } else {
        if (!$gameMessageEx.window(windowId).isEmwEventBusy()) {
            this.setupNumInput(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
};
FTKR.EMW.Game_Interpreter_setupNumInput = Game_Interpreter.prototype.setupNumInput;
Game_Interpreter.prototype.setupNumInput = function(params) {
    var windowId = this.windowId();
    if (!windowId) {
        FTKR.EMW.Game_Interpreter_setupNumInput.call(this, params);
    } else {
        $gameMessageEx.window(windowId).setNumberInput(params[0], params[1]);
    }
};
FTKR.EMW.Game_Interpreter_command104 = Game_Interpreter.prototype.command104;
Game_Interpreter.prototype.command104 = function() {
    var windowId = this.windowId();
    if (!windowId) {
        return FTKR.EMW.Game_Interpreter_command104.call(this);
    } else {
        if (!$gameMessageEx.window(windowId).isEmwEventBusy()) {
            this.setupItemChoice(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
};
FTKR.EMW.Game_Interpreter_setupItemChoice = Game_Interpreter.prototype.setupItemChoice;
Game_Interpreter.prototype.setupItemChoice = function(params) {
    var windowId = this.windowId();
    if (!windowId) {
        FTKR.EMW.Game_Interpreter_setupItemChoice.call(this, params);
    } else {
        $gameMessageEx.window(windowId).setItemChoice(params[0], params[1] || 2);
    }
};
function Game_MessageEx() {
    this.initialize.apply(this, arguments);
}
Game_MessageEx.prototype.initialize = function() {
    this._data = [];
    this._data[0] = $gameMessage;
};
Game_MessageEx.prototype.window = function(windowId) {
    if (!this._data[windowId]) {
        this._data[windowId] = new Game_Message();
    }
    return this._data[windowId];
};
Game_MessageEx.prototype.windows = function() {
    return this._data;
};
function Window_MessageEx(windowId) {
    this._windowId = windowId;
    this.initialize.apply(this);
}
Window_MessageEx.prototype = Object.create(Window_Message.prototype);
Window_MessageEx.prototype.constructor = Window_MessageEx;
Window_MessageEx.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceListEx(this, this._windowId);
    this._numberWindow = new Window_NumberInputEx(this, this._windowId);
    this._itemWindow = new Window_EventItemEx(this, this._windowId);
};
Window_MessageEx.prototype.canStart = function() {
    return this._gameMessage.hasText() && !this._gameMessage.scrollMode();
};
Window_MessageEx.prototype.startMessage = function() {
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters(this._gameMessage.allText());
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
    this.activate();
};
Window_MessageEx.prototype.updatePlacement = function() {
    if (this._gameMessage.windowWidth()) {
        this.width = this._gameMessage.windowWidth();
    }
    if (this._gameMessage.windowHeightLine()) {
        this.height = this.fittingHeight(this._gameMessage.windowHeightLine());
    }
    this._positionType = this._gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    var posiX = this._gameMessage.windowPositionX();
    if (posiX) this.x = posiX * (Graphics.boxWidth - this.width) / 2;
};
Window_MessageEx.prototype.updateBackground = function() {
    this._background = this._gameMessage.background();
    this.setBackgroundType(this._background);
};
Window_MessageEx.prototype.terminateMessage = function() {
    this._gameMessage.lastText();
    if (this._gameMessage.canClose()) {
        if (Imported.YEP_MessageCore) this._nameWindow.deactivate();
        this.close();
        this._goldWindow.close();
        this._gameMessage.clear();
    } else {
        this.deactivate();
    }
};
Window_MessageEx.prototype.startInput = function() {
    if (this._gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if (this._gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if (this._gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};
Window_MessageEx.prototype.doesContinue = function() {
    return (this._gameMessage.hasText() && !this._gameMessage.scrollMode() &&
            !this.areSettingsChanged());
};
Window_MessageEx.prototype.areSettingsChanged = function() {
    return (this._background !== this._gameMessage.background() ||
            this._positionType !== this._gameMessage.positionType());
};
Window_MessageEx.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.reserveFace(this._gameMessage.faceName());
};
Window_MessageEx.prototype.drawMessageFace = function() {
    this.drawFace(this._gameMessage.faceName(), this._gameMessage.faceIndex(), 0, 0);
    ImageManager.releaseReservation(this._imageReservationId);
};
Window_MessageEx.prototype.newLineX = function() {
    return this._gameMessage.faceName() === '' ? 0 : 168;
};
function Window_ChoiceListEx() {
    this.initialize.apply(this, arguments);
}
Window_ChoiceListEx.prototype = Object.create(Window_ChoiceList.prototype);
Window_ChoiceListEx.prototype.constructor = Window_ChoiceListEx;
Window_ChoiceListEx.prototype.initialize = function(messageWindow, windowId) {
    this._windowId = windowId;
    this._gameMessage = $gameMessageEx.window(this._windowId);
    Window_ChoiceList.prototype.initialize.call(this, messageWindow);
};
Window_ChoiceListEx.prototype.selectDefault = function() {
    this.select(this._gameMessage.choiceDefaultType());
};
Window_ChoiceListEx.prototype.updatePlacement = function() {
    var positionType = this._gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};
Window_ChoiceListEx.prototype.updateBackground = function() {
    this._background = this._gameMessage.choiceBackground();
    this.setBackgroundType(this._background);
};
Window_ChoiceListEx.prototype.numVisibleRows = function() {
    var messageY = this._messageWindow.y;
    var messageHeight = this._messageWindow.height;
    var centerY = Graphics.boxHeight / 2;
    var choices = this._gameMessage.choices();
    var numLines = choices.length;
    var maxLines = 8;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        maxLines = 4;
    }
    if (numLines > maxLines) {
        numLines = maxLines;
    }
    return numLines;
};
Window_ChoiceListEx.prototype.maxChoiceWidth = function() {
    var maxWidth = 96;
    var choices = this._gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};
Window_ChoiceListEx.prototype.makeCommandList = function() {
    var choices = this._gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice');
    }
};
Window_ChoiceListEx.prototype.isCancelEnabled = function() {
    return this._gameMessage.choiceCancelType() !== -1;
};
Window_ChoiceListEx.prototype.callOkHandler = function() {
    this._gameMessage.onChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};
Window_ChoiceListEx.prototype.callCancelHandler = function() {
    this._gameMessage.onChoice(this._gameMessage.choiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};
function Window_NumberInputEx() {
    this.initialize.apply(this, arguments);
}
Window_NumberInputEx.prototype = Object.create(Window_NumberInput.prototype);
Window_NumberInputEx.prototype.constructor = Window_NumberInputEx;
Window_NumberInputEx.prototype.initialize = function(messageWindow, windowId) {
    this._windowId = windowId;
    this._gameMessage = $gameMessageEx.window(this._windowId);
    Window_NumberInput.prototype.initialize.call(this, messageWindow);
};
Window_NumberInputEx.prototype.start = function() {
    this._maxDigits = this._gameMessage.numInputMaxDigits();
    this._number = $gameVariables.value(this._gameMessage.numInputVariableId());
    this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
    this.updatePlacement();
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.createContents();
    this.refresh();
    this.open();
    this.activate();
    this.select(0);
};
Window_NumberInputEx.prototype.processOk = function() {
    SoundManager.playOk();
    $gameVariables.setValue(this._gameMessage.numInputVariableId(), this._number);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
};
function Window_EventItemEx() {
    this.initialize.apply(this, arguments);
}
Window_EventItemEx.prototype = Object.create(Window_EventItem.prototype);
Window_EventItemEx.prototype.constructor = Window_EventItemEx;
Window_EventItemEx.prototype.initialize = function(messageWindow, windowId) {
    this._windowId = windowId;
    this._gameMessage = $gameMessageEx.window(this._windowId);
    Window_EventItem.prototype.initialize.call(this, messageWindow);
};
Window_EventItemEx.prototype.includes = function(item) {
    var itypeId = this._gameMessage.itemChoiceItypeId();
    return DataManager.isItem(item) && item.itypeId === itypeId;
};
Window_EventItemEx.prototype.onOk = function() {
    var item = this.item();
    var itemId = item ? item.id : 0;
    $gameVariables.setValue(this._gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};
Window_EventItemEx.prototype.onCancel = function() {
    $gameVariables.setValue(this._gameMessage.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};
FTKR.EMW.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    FTKR.EMW.DataManager_createGameObjects.call(this);
    $gameMessageEx = new Game_MessageEx();
};
FTKR.EMW.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    this.createMessageExWindowAll();
    FTKR.EMW.Scene_Map_createAllWindows.call(this);
    this._messageExWindows[0] = this._messageWindow;
    $gameMessageEx.window(0)._window_MessageEx = this._messageExWindows[0];
    FTKR.EMW.scene.startTerminate ? $gameMessageEx.window(0).terminate() :
        $gameMessageEx.window(0).firstText();
};
Scene_Map.prototype.readMapMeta = function() {
    return readObjectMeta($dataMap, ['EMW_生成数', 'EMW_NUMBER']);
};
Scene_Map.prototype.createMessageExWindowAll = function() {
    this._messageExWindows = [];
    var number = this.readMapMeta() || FTKR.EMW.exwindowNum;
    for (var i = 1; i < number + 1; i++) {
        this.createMessageExWindow(i);
    }
};
Scene_Map.prototype.createMessageExWindow = function(windowId) {
    this._messageExWindows[windowId] = new Window_MessageEx(windowId);
    $gameMessageEx.window(windowId)._window_MessageEx = this._messageExWindows[windowId];
    FTKR.EMW.scene.startTerminate ? $gameMessageEx.window(windowId).terminate() :
        $gameMessageEx.window(windowId).firstText();
    this.addWindow(this._messageExWindows[windowId]);
    this._messageExWindows[windowId].subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};
FTKR.EMW.Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    FTKR.EMW.Scene_Map_terminate.call(this);
    if (SceneManager.isNextScene(Scene_Battle) || SceneManager.isNextScene(Scene_Map)) {
        $gameMessageEx.windows().forEach( function(message, i){
            if (i > 0) message.terminate();
        });
    }
};
FTKR.EMW.Scene_Battle_createMessagewindow = Scene_Battle.prototype.createMessageWindow;
Scene_Battle.prototype.createMessageWindow = function() {
    this.createMessageExWindowAll();
    FTKR.EMW.Scene_Battle_createMessagewindow.call(this);
    this._messageExWindows[0] = this._messageWindow;
    $gameMessageEx.window(0)._window_MessageEx = this._messageExWindows[0];
    FTKR.EMW.scene.startTerminate ? $gameMessageEx.window(0).terminate() :
        $gameMessageEx.window(0).firstText();
};
Scene_Battle.prototype.readMapMeta = function() {
    return readObjectMeta($dataMap, ['EMW_生成数', 'EMW_NUMBER']);
};
Scene_Battle.prototype.createMessageExWindowAll = function() {
    this._messageExWindows = [];
    var number = this.readMapMeta() || FTKR.EMW.exwindowNum;
    for (var i = 1; i < number + 1; i++) {
        this.createMessageExWindow(i);
    }
};
Scene_Battle.prototype.createMessageExWindow = function(windowId) {
    this._messageExWindows[windowId] = new Window_MessageEx(windowId);
    $gameMessageEx.window(windowId)._window_MessageEx = this._messageExWindows[windowId];
    FTKR.EMW.scene.startTerminate ? $gameMessageEx.window(windowId).terminate() :
        $gameMessageEx.window(windowId).firstText();
    this.addWindow(this._messageExWindows[windowId]);
    this._messageExWindows[windowId].subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};
FTKR.EMW.Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    FTKR.EMW.Scene_Battle_terminate.call(this);
    $gameMessageEx.windows().forEach( function(message, i){
        if (i > 0) message.terminate();
    });
};
if (Imported.YEP_MessageCore) {
FTKR.EMW.Window_MessageEx_createSubWindows = Window_MessageEx.prototype.createSubWindows;
Window_MessageEx.prototype.createSubWindows = function() {
    FTKR.EMW.Window_MessageEx_createSubWindows.call(this);
    this._nameWindow = new Window_NameBoxEx(this, this._windowId);
    FTKR.EMW.nameWindows[this._windowId] = this._nameWindow;
    var scene = SceneManager._scene;
    scene.addChild(this._nameWindow);
};
FTKR.EMW.Window_MessageEx_startMessage = Window_MessageEx.prototype.startMessage;
Window_MessageEx.prototype.startMessage = function() {
    this._nameWindow.deactivate();
    FTKR.EMW.Window_MessageEx_startMessage.call(this);
};
Window_MessageEx.prototype.wordwrapWidth = function(){
    if (Yanfly.Param.MSGTightWrap && this._gameMessage.faceName() !== '') {
        return this.contents.width - this.newLineX();
    }
    return Window_Base.prototype.wordwrapWidth.call(this);
};
Window_MessageEx.prototype.newLineX = function() {
    if (this._gameMessage.faceName() === '') {
        return 0;
    } else {
        return eval(Yanfly.Param.MSGFaceIndent);
    }
};
Window_MessageEx.prototype.convertNameBox = function(text) {
    var windowId = this._windowId;
    text = text.replace(/\x1bN\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 1);
    }, this);
    text = text.replace(/\x1bN1\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 1);
    }, this);
    text = text.replace(/\x1bN2\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 2);
    }, this);
    text = text.replace(/\x1bN3\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 3);
    }, this);
    text = text.replace(/\x1bNC\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 3);
    }, this);
    text = text.replace(/\x1bN4\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 4);
    }, this);
    text = text.replace(/\x1bN5\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 5);
    }, this);
    text = text.replace(/\x1bNR\<(.*?)\>/gi, function() {
        return FTKR.EMW.nameWindows[windowId].refresh(arguments[1], 5);
    }, this);
    return text;
};
Window_MessageEx.prototype.convertActorFace = function(actor) {
    this._gameMessage.setFaceImage(actor.faceName(), actor.faceIndex());
    return '';
};
if (Yanfly.Param.MSGNameBoxClose) {
Window_MessageEx.prototype.hasDifferentNameBoxText = function() {
    var texts = this._gameMessage._texts;
    var length = texts.length;
    var open = this._nameWindow.isOpen();
    for (var i = 0; i < length; ++i) {
    var text = texts[i];
    if (text.length <= 0) continue;
    if (Yanfly.MsgMacro) {
        text = this.convertMacroText(text);
        text = text.replace(/\x1b/gi, '\\');
    }
    if (text.match(/\\(?:N|N1|N2|N3|N4|N5|NC|NR)<(.*)>/i)) {
        var name = String(RegExp.$1);
    } else if (text.match(/\\(?:ND|ND1|ND2|ND3|ND4|ND5|NDC|NDR)<(.*)>/i)) {
        var name = String(RegExp.$1);
    } else if (text.match(/\\(?:NT|NT1|NT2|NT3|NT4|NT5|NTC|NTR)<(.*)>/i)) {
        var name = String(RegExp.$1);
    }
    if (name) {
        name = name.replace(/\\V\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        name = name.replace(/\\V\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        name = name.replace(/\\N\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        name = name.replace(/\\P\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        name = name.replace(/\\/gi, '\x1b');
    }
    if (name && !open) return true;
    if (name && name !== this._nameWindow._lastNameText) {
        return true;
    }
    }
    if (open && !name) return true;
    return false;
};
}
FTKR.EMW.Window_ChoiceListEx_updatePlacement = Window_ChoiceListEx.prototype.updatePlacement;
Window_ChoiceListEx.prototype.updatePlacement = function() {
    FTKR.EMW.Window_ChoiceListEx_updatePlacement.call(this);
    var messagePosType = this._gameMessage.positionType();
    if (messagePosType === 0) {
        this.y = this._messageWindow.height;
    } else if (messagePosType === 2) {
        this.y = Graphics.boxHeight - this._messageWindow.height - this.height;
    }
};
Window_NumberInputEx.prototype.updatePlacement = function() {
    Window_NumberInput.prototype.updatePlacement.call(this);
    var messageY = this._messageWindow.y;
    var messagePosType = this._gameMessage.positionType();
    if (messagePosType === 0) {
        this.y = this._messageWindow.height;
    } else if (messagePosType === 1) {
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height;
        } else {
            this.y = messageY + this._messageWindow.height;
        }
    } else if (messagePosType === 2) {
        this.y = Graphics.boxHeight - this._messageWindow.height - this.height;
    }
};
Window_EventItemEx.prototype.updatePlacement = function() {
    Window_EventItem.prototype.updatePlacement.call(this);
    var messagePosType = this._gameMessage.positionType();
    if (messagePosType === 0) {
        this.y = Graphics.boxHeight - this.height;
    } else if (messagePosType === 2) {
        this.y = 0;
    }
};
function Window_NameBoxEx() {
    this.initialize.apply(this, arguments);
}
Window_NameBoxEx.prototype = Object.create(Window_NameBox.prototype);
Window_NameBoxEx.prototype.constructor = Window_NameBoxEx;
Window_NameBoxEx.prototype.initialize = function(parentWindow, windowId) {
    this._windowId = windowId;
    this._gameMessage = $gameMessageEx.window(this._windowId);
    Window_NameBox.prototype.initialize.call(this, parentWindow);
};
Window_NameBoxEx.prototype.adjustPositionY = function() {
    if (this._gameMessage.positionType() === 0) {
      this.y = this._parentWindow.y + this._parentWindow.height;
      this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
    } else {
      this.y = this._parentWindow.y;
      this.y -= this.height;
      this.y += eval(Yanfly.Param.MSGNameBoxBufferY);
    }
    if (this.y < 0) {
      this.y = this._parentWindow.y + this._parentWindow.height;
      this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
    }
};
}
