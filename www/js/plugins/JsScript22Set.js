/*:ja
 * @plugindesc 
 */
var PL_direction = 0;   
var PL_realX = 0;   
var PL_realY = 0;   
var PL_MouseX = 0;  
var PL_MouseY = 0;  
class Pos2D {
    constructor(_setposx ,_setposy) {
        this._x = _setposx;
        this._y = _setposy;
    }
}
var Pos2DSaGet = function(_Pos1 , _Pos2){
    var _SaX = Math.abs(_Pos1._x - _Pos2._x);
    var _SaY = Math.abs(_Pos1._y - _Pos2._y);
    return _SaX + _SaY;
}
var NUpdateFlame = 0; 
var Bef_PL_MouseX = 0; var Bef_PL_MouseY = 0;
var MouseStopFlame = 0; 
Game_Interpreter.prototype.NUpdate = function () {
    PL_direction = this.character(-1)._direction;
    PL_realX = this.character(-1)._realX;
    PL_realY = this.character(-1)._realY;
    PL_MouseX = TouchInput.mouseX;
    PL_MouseY = TouchInput.mouseY;
    if (PL_MouseX == Bef_PL_MouseX && PL_MouseY == Bef_PL_MouseY) {
        MouseStopFlame++; 
    } else {
        Bef_PL_MouseX = PL_MouseX;
        Bef_PL_MouseY = PL_MouseY;
        MouseStopFlame = 0;
    }
    NUpdateFlame++;
}
var NBB_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NBB_performTransfer.call(this);
    NUpdateFlame = 0;
}
var NBB_Flame = 0;
var _NBB_Game_Screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function () {
    _NBB_Game_Screen_update.call(this);
    NBB_Flame++;
};
Game_Interpreter.prototype.NUpdateSc = function () {
}
var NBB_Flame_ck = 0;
var Nupu_Base_update = Game_Interpreter.prototype.update;
Game_Interpreter.prototype.update = function () {
    Nupu_Base_update.call(this);
    if (NBB_Flame_ck != NBB_Flame){
        this.NUpdateSc(); 
        NBB_Flame_ck = NBB_Flame;
    }
    if (!MapInterpreterFlg) return; 
    this.NUpdate(); 
}
var MapInterpreterFlg = false;
var NupuBase_Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
Game_Map.prototype.updateInterpreter = function () {
    MapInterpreterFlg = true;
    NupuBase_Game_Map_updateInterpreter.call(this);
    MapInterpreterFlg = false;
}
var Nupu_Base_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    Nupu_Base_reserveTransfer.call(this, mapId, x, y, d, fadeType);
    NUpdateFlame = 0; 
};
var CopyArr = function (_copyArr) {
    return _copyArr.slice(0 , _copyArr.length);
};
var ShuffleArr = function (_SetArr) {
    for (i = _SetArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = _SetArr[i];
        _SetArr[i] = _SetArr[j];
        _SetArr[j] = tmp;
    }
}
Game_Interpreter.prototype.SetCmnEvent = function (CmnNo) {
    //$gameTemp.reserveCommonEvent(CmnNo);
    try {
        this.setupChild($dataCommonEvents[CmnNo].list, 0);
    }catch(ex){
        console.log("SetCmnEvent:Err");
    }
};
Game_Interpreter.prototype.SetCmnEventSc = function (CmnNo) {
    try {
        $gameTemp.reserveCommonEvent(CmnNo);
    } catch (ex) {
        console.log("SetCmnEventSc:Err");
    }
};
Game_Interpreter.prototype.LblJump = function (LblName) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].parameters[0] == LblName) {
            this.jumpTo(i)
        }
    }
};
//■指定した文字(seq)の文字位置を調べる■■■■■
var counter = function (str, seq) {
    try {
        return str.split(seq).length - 1;
    } catch (e) { return -1; }
};
function isNumber(numVal) {
    var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
    return pattern.test(numVal);
};
(function () {
    'use strict';
    var _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function (event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        this.mouseX = Graphics.pageToCanvasX(event.pageX);
        this.mouseY = Graphics.pageToCanvasY(event.pageY);
    };
})();
TouchInput._onWheel = function (event) {
    try {
        this._events.wheelX += event.deltaX;
        this._events.wheelY += event.deltaY;
        //event.preventDefault();
    } catch(e) {
        console.log(e);
    }
};
//使用方法 this.N_Plgin([プラグインコマンドをカンマ区切り])
Game_Interpreter.prototype.N_Plgin = function (_CmndStr,_PlginArr) {
    var args = [];
    for (var i = 0; i <= _PlginArr.length - 1; i++) {
        args.push(String(_PlginArr[i]));
    }
    this.pluginCommand(String(_CmndStr), args);
}
var MetaChecker = function (_Obj, _metaStr, _undefineVal) {
    var _undefineVal = typeof _undefineVal !== 'undefined' ? _undefineVal : "";
    try {
        if (_Obj.meta[_metaStr] == undefined) return _undefineVal;
        return _Obj.meta[_metaStr];
    }catch(ex){
        return _undefineVal;
    }
}
var factorial = function(_Var , _回数) {
    var _RtnVar = _Var;
    for (var i = 0; i <= _回数 - 1; i++) {
        _RtnVar *= _Var;
    }
    return _RtnVar;
}
var _以降文字削除 = function(_RtnStr , _ckStr) {
    var _Str = _RtnStr.split(_ckStr)[0];
    return _Str;
}
var EventMetaGet = function (_EvID, _Tag, _undefineVal) {
    var _undefineVal = typeof _undefineVal !== 'undefined' ? _undefineVal : "";
    if ($dataMap.events[_EvID].meta[_Tag] == undefined) {
        return _undefineVal;
    }
    return $dataMap.events[_EvID].meta[_Tag];
}
