/*:ja
 * @param Talk_ZureX
 * @type string[]
 * @default ["0","50"]
 * @desc 会話のウィンドウを出した時のズレを自動設定:Talk_ZureX
 */
FstVolCkFlame = 0; 
var RuiLoading = false;
const CN_SpineEvCk = 27;
var SpineCmnEvEnd = true;
var NS_SpineEvCk = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    if (Spine_EvName.length > 0 && SpineCmnEvEnd){
        SpineCmnEvEnd = false;
        this.SetCmnEvent(CN_SpineEvCk);
        this.SetCmnEventSc(CN_SpineEvCk);
    }
    NS_SpineEvCk.call(this)
}
Game_Interpreter.prototype.PLLightOn = function (LightName, _light_size) {
    var LightName = typeof LightName !== 'undefined' ? LightName : "white";
    var _light_size = typeof _light_size !== 'undefined' ? _light_size : 100;
    var args = new Array(LightName);
    this.character(-1)._light_size = _light_size;
    this.pluginCommand("playerlantern", args);
};
Game_Interpreter.prototype.PLLightOff = function () {
    $gamePlayer.setLight(null);
}
var Nupu_BackStab_Ini = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function (mapId, eventId) {
    Nupu_BackStab_Ini.apply(this, arguments);
    this._OkEventFlg = false; 
};
var Nupu_BackStab_startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
    var _okFlg = false;
    for (var i = 0; i <= triggers.length - 1; i++) {
        if (triggers[i] == 0) _okFlg = true; 
        if (triggers[i] == 1) _okFlg = true; 
    }
    if (_okFlg) {
        var ckEvArr = $gameMap.eventsXy(x, y);
        for (var i = 0; i <= ckEvArr.length - 1; i++) {
            ckEvArr[i]._OkEventFlg = true;
        }
    }
    Nupu_BackStab_startMapEvent.apply(this, arguments);
};
Game_Interpreter.prototype.BksCharaDel = function () {
    this.N_Plgin("PSS", ["t_stop"]);
}
Game_Interpreter.prototype.OkEventBtnBks = function () {
    if (this.character(0)._OkEventFlg && this.character(0)._direction == PL_direction) {
        return true;
    }
}
var NS_Game_Event_Update = Game_Event.prototype.updateParallel;
Game_Event.prototype.updateParallel = function () {
    NS_Game_Event_Update.call(this);
    this._OkEventFlg = false;
};
var BtlEv並列確認 = function(){
    return false;
}
var _視線Arr = []; 
var _視線個数 = 0; 
var _視線Txt透明度 = 255;
class 視線 {
    constructor(_EvId) {
        this._EvId = _EvId;
        this._Kyori = 0; 
    }
};
_視線距離取得 = function (_No) {
    try {
        return _視線Arr[_No - 1]._Kyori;
    } catch (e) { return -1; }
}
Game_Interpreter.prototype._視線全削除 = function () {
    _視線Arr = [];
    _視線個数 = _視線Arr.length;
}
Game_Interpreter.prototype._視線数描画 = function () {
    _視線個数 = _視線Arr.length;
}
Game_Interpreter.prototype._視線追加 = function () {
    var _evId = this.character(0)._eventId; 
    var _skipFlg = false;
    for (var i = 0; i <= _視線Arr.length - 1; i++) {
        if (_視線Arr[i]._EvId == _evId) _skipFlg = true;
    }
    if (!_skipFlg) {
        _視線Arr.push(new 視線(_evId));
    }
    _視線個数 = _視線Arr.length;
    this._視線数描画();
}
Game_Interpreter.prototype._視線削除 = function () {
    for (var i = 0; i <= _視線Arr.length - 1; i++) {
        if (_視線Arr[i]._EvId == this.character(0)._eventId){
            _視線Arr.splice(i, 1);
            break;
        }
    }
    _視線個数 = _視線Arr.length;
    this._視線数描画();
}
Game_Interpreter.prototype._視線_戦闘終了セルフスイッチ変化 = function (_SwStr) {
    var _SwStr = typeof _SwStr !== 'undefined' ? _SwStr : "A";
    for (var i = 0; i <= _敵撃破数 - 1; i++) {
        if (_視線Arr.length == 0) break;
        this.SelfSwCng(_視線Arr[0]._EvId, "A", true); 
        $gameSystem.offSensor(_視線Arr[0]._EvId); 
        _視線Arr.shift(); 
    }
    _視線個数 = _視線Arr.length;
    this._視線数描画();
}
Game_Interpreter.prototype._視線距離計算 = function () {
    console.log(_視線Arr);
    for (var i = 0; i <= _視線Arr.length - 1; i++) {
        var _evId = this.character(_視線Arr[i]._EvId)._eventId; 
        var _XSa = this.character(-1).x - this.character(_evId).x;
        var _YSa = this.character(-1).y - this.character(_evId).y;
        var _Kyori = Math.abs(_XSa) + Math.abs(_YSa);
        _視線Arr[i]._Kyori = _Kyori;
    }
    var _sortArr = [];
    var _unshiftNo = -1;
    for (var i = 0; i <= _視線Arr.length - 1; i++) {
        if (_視線Arr[i]._EvId == _BattleEvNo[0]){
            _unshiftNo = i;
            continue;
        }
        var _inNo = 0; 
        var _pushFlg = true;
        for (var j = 0; j <= _sortArr.length - 1; j++) {
            if (_sortArr[j]._Kyori >= _視線Arr[i]._Kyori){
                _inNo = j; _pushFlg = false;
                _sortArr.splice(_inNo, 0, _視線Arr[i]);
                break;
            }
        }
        if (_pushFlg) _sortArr.push(_視線Arr[i]);
        if (_sortArr.length == 0) _sortArr.push(_視線Arr[i]);
    }
    if (_unshiftNo != -1) {
        _sortArr.unshift(_視線Arr[_unshiftNo]);
    }
    _視線Arr = _sortArr;
}
const VN_TalkWinNo = 4; 
const VN_FukiXZure = 5;  
const VN_FukiYZure = 6;  
var HMsgWinFlg = false; 
var EnoVar = "";
var Nupu_Setting_Pg = PluginManager.parameters('JsScript32Set');
var Talk_ZureSetX = eval(Nupu_Setting_Pg.Talk_ZureX);
var Talk_WinSetY = 220;
var Talk_WinSetX = 340; 
var Talk_WinPicNo = 99;
var Talk_ZureX = 0;
var Talk_ZureY = 0; 
const PN_HMsgWin = 298; 
var Nupu_command101 = Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function () {
    var FaceImg = this._params[0];
    var WinWaku = this._params[2];
    var NumCont = $gameVariables.value(VN_TalkWinNo) - 1;
    if (NumCont > Talk_ZureSetX.length - 1){
        Talk_ZureX = 0;
    } else {
        Talk_ZureX = Number(Talk_ZureSetX[NumCont]);
    }
    var _FZureX = $gameVariables.value(VN_FukiXZure);
    var _FZureY = $gameVariables.value(VN_FukiYZure);
    if ($gameVariables.value(VN_TalkWinNo) == 1) {
        Talk_ZureX = 25;
        switch (this._params[2]) {
            case 0: case 1:
                WinWaku = this._params[2];
                this.SetPict(Talk_WinPicNo, "system/Talk_Win", Talk_WinSetX + _FZureX, Talk_WinSetY + _FZureY); 
                break;
        }
    } else if ($gameVariables.value(VN_TalkWinNo) == 2) {
        Talk_ZureX = 25;
        switch (this._params[2]) {
            case 0: case 1:
                WinWaku = this._params[2];
                this.SetPict(Talk_WinPicNo, "system/Talk_Win2", Talk_WinSetX + _FZureX, Talk_WinSetY + _FZureY); 
                break;
        }
    } else if ($gameVariables.value(VN_TalkWinNo) >= 3) {
        //Talk_ZureX = $gameVariables.value(VN_TWinZureX); //会話吹き出しXズレ
        Talk_ZureX = 25;
        switch (this._params[2]) {
            case 0: case 1:
                WinWaku = this._params[2];
                this.SetPict(Talk_WinPicNo, "system/Talk_Win" + $gameVariables.value(VN_TalkWinNo), 
                Talk_WinSetX + _FZureX, Talk_WinSetY + _FZureY); 
                break;
        }
    }
    this._params[0] = "";
    this._params[2] = 2;
    Nupu_command101.call(this);
    this._params[0] = FaceImg; 
    this._params[2] = WinWaku;
    SpineCmnEvEnd = true; 
}
Window_Message.prototype.updatePlacement = function () {
    this._positionType = $gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    if (this._positionType === 1) {
        this.x += 20 + Talk_ZureX;
        this.y -= 80;
        this.x += $gameVariables.value(VN_FukiXZure);
        this.y += $gameVariables.value(VN_FukiYZure);
    }
};
var NupuMessageCall = Window_Base.prototype.resetFontSettings;
Window_Base.prototype.resetFontSettings = function () {
    NupuMessageCall.call(this);
    this.contents.fontBold = false;
    this.contents.fontItalic = false;
    this.contents.outlineColor = 'rgba(0, 0, 0, 1)';
    this.contents.outlineWidth = 4;
};
var _WinCloseFlg = false;
Window_Base.prototype.close = function () {
    if (!this.isClosed()) {
        this._closing = true;
        _WinCloseFlg = true;
    }
    this._opening = false;
};
var Nupu_Msg_close = Window_Message.prototype.close;
Window_Message.prototype.close = function () {
    Nupu_Msg_close.call(this);
    $gameScreen.erasePicture(Talk_WinPicNo); 
};
Window_NameBox.prototype.initialize = function (parentWindow) {
    this._parentWindow = parentWindow;
    this._ignoreMask = true
    Window_Base.prototype.initialize.call(this, 0, 0, 240, this.windowHeight() + 5);
    this._text = '';
    this._openness = 0;
    this._closeCounter = 0;
    this.deactivate();
    if (eval(Yanfly.Param.MSGNameBoxClear)) {
        this.backOpacity = 0;
        this.opacity = 0;
    }
};
var Nupu_adjustPositionY = Window_NameBox.prototype.adjustPositionX;
Window_NameBox.prototype.adjustPositionY = function () {
    Nupu_adjustPositionY.call(this);
    this.y = 220;
    this.y += $gameVariables.value(VN_FukiYZure);
    if (HMsgWinFlg) {
        this.x = 35;
    }
}
const PBNo_LogBK = 250; 
var BLog = []; 
var NextPicNo = PBNo_LogBK;
const bPicSa = 37; 
const blogMojiYZ = 2;
var BlogZureY = 0;
var BlogZureX = 500;
var NS_BLog_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NS_BLog_Update.call(this)
    this.BLogUpdate(BlogZureX,BlogZureY);
}
Game_Interpreter.prototype.BLogUpdate = function (_BLogZureX, _BLogZureY) {
    var _BLogZureX = typeof _BLogZureX !== 'undefined' ? _BLogZureX : 0;
    var _BLogZureY = typeof _BLogZureY !== 'undefined' ? _BLogZureY : 0;
    if (BLog.length > 0) {
        for (var i = 0; i <= BLog.length - 1; i++) {
            BLog[i][0]--; 
        }
        if (BLog[0][0] <= 0) {
            this.MovePict(BLog[0][2], -521 + _BLogZureX , BLog[0][3] + _BLogZureY, 15, 0);
            this.MovePict(BLog[0][2] + 1, -521 + _BLogZureX, BLog[0][3] + 1 + _BLogZureY, 15, 0);
            for (var i = 1; i <= BLog.length - 1; i++) {
                BLog[i][3] -= bPicSa; 
                if (i <= 4) { 
                    this.MovePict(BLog[i][2], 0 + _BLogZureX, BLog[i][3] + _BLogZureY, 15, 255);
                    this.MovePict(BLog[i][2] + 1, 10 + _BLogZureX, BLog[i][3] + blogMojiYZ + _BLogZureY, 15, 255);
                }
            }
            BLog.shift(); 
        }
    }
    for (var i = 0; i <= BLog.length - 1; i++) {
        if (BLog[i][4] == false) { 
            this.SetPict(BLog[i][2], "PBNo_LogBK", -521 + _BLogZureX, BLog[i][3] + _BLogZureY);
            this.SetPicStr(BLog[i][2] + 1, BLog[i][1], 22, -521 + _BLogZureX, BLog[i][3] + blogMojiYZ + _BLogZureY);
            this.MovePict(BLog[i][2], 0 + _BLogZureX, BLog[i][3] + _BLogZureY, 17);
            this.MovePict(BLog[i][2] + 1, 10 + _BLogZureX, BLog[i][3] + blogMojiYZ + _BLogZureY, 15);
            BLog[i][4] = true;
        }
        if (i == 4) {
            break; 
        }
    }
};
Game_Interpreter.prototype.BLogAdd = function (SSFlame, SetStr) {
    BLog.push([SSFlame, SetStr, NextPicNo, 84 + bPicSa * BLog.length, false]);
    NextPicNo += 2;
    if (NextPicNo >= PBNo_LogBK + 11) {
        NextPicNo = PBNo_LogBK;
    }
};
Game_Interpreter.prototype.BLogAllDel = function () {
    for (var i = 0; i <= BLog.length - 1; i++) {
        BLog[i][0] = 0; 
    }
};
let ChoiseZureX = 0;
let ChoiseZureY = 0;
const _Window_ChoiseList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
Window_ChoiceList.prototype.updatePlacement = function() {
    _Window_ChoiseList_updatePlacement.call(this);
    this.x += ChoiseZureX;
    this.y += ChoiseZureY;
};
let Mapセルフスイッチリセット = function (_mapId) {
    for (let i = 0; i <= 999 - 1; i++) {
        let _key = [_mapId, i, "A"];
        $gameSelfSwitches.setValue(_key, false);
        _key = [_mapId, i, "B"];
        $gameSelfSwitches.setValue(_key, false);
        _key = [_mapId, i, "C"];
        $gameSelfSwitches.setValue(_key, false);
        _key = [_mapId, i, "D"];
        $gameSelfSwitches.setValue(_key, false);
    }
}
