var btlflg = false;
var MenuFlgSwich = false;
var NAd_GE_start = Game_Event.prototype.start;
Game_Event.prototype.start = function () {
    //if (villaA_waitBlur_switch_on) return; //イベントキャンセル
    NAd_GE_start.call(this);
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
let MapMovedLightFlame = 0;
var Nupu_Game_Character_initialize = Game_Character.prototype.initialize;
Game_Character.prototype.initialize = function () {
    Nupu_Game_Character_initialize.call(this);
    this.save_moveRoute = null;
    this.save_moveRouteIndex = null;
    this.save_moveRouteForcing = null;
}
Game_Character.prototype.saveMoveRoute = function () {
    if (this.save_moveRoute != null) return; 
    this.save_moveRoute = this._moveRoute;
    this.save_moveRouteIndex = this._moveRouteIndex;
    this.save_moveRouteForcing = this._moveRouteForcing;
    this._waitCount = 0;
}
Game_Character.prototype.returnMoveRoute = function () {
    if (this.save_moveRoute == null) return; 
    this._moveRoute = this.save_moveRoute ;
    this._moveRouteIndex = this.save_moveRouteIndex;
    this._moveRouteForcing = this.save_moveRouteForcing;
    this._waitCount = 0;
    this.save_moveRoute = null;
    this.save_moveRouteIndex = null;
    this.save_moveRouteForcing = null;
}
var Nupu_Sprite_Timer = Sprite_Timer.prototype.redraw;
Sprite_Timer.prototype.redraw = function () {
    Nupu_Sprite_Timer.call(this);
    this.bitmap.clear();
};
var Nupu_MKR_PlayerSensor_Ini = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function (mapId, eventId) {
    Nupu_MKR_PlayerSensor_Ini.apply(this, arguments);
    this.lostTimer = 0; 
    this.setlosttimer = 300; 
    this.baseX = 0; 
    this.baseY = 0; 
    this.baseOneFlg = false;
    this.CheckFlg = false; 
    this.CheckX = 0; 
    this.CheckY = 0; 
    this.WaitTimer = 0;
};
Game_Interpreter.prototype.WaitTimer = function (Wtimer) {
    if(this.character(0).WaitTimer == 0){
        this.character(0).WaitTimer = Wtimer;
        return true;
    }
    return false;
}
var PL_ArukiFlame = 0; 
var PL_ArukiCkUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    PL_ArukiCkUpdate.call(this);
    if (this.character(-1)._x != this.character(-1)._realX || 
        this.character(-1)._y != this.character(-1)._realY ){
        PL_ArukiFlame = 60; 
    }
    if (PL_ArukiFlame > 0) PL_ArukiFlame--;
}
Game_Interpreter.prototype.KyoriCk = function (kyori, _Mhos, _Phos) {
    switch (this.character(0)._sensorStatus){
        case -2:
        case 0:
            return false; 
    }
    var _Mhos = typeof _Mhos !== 'undefined' ? _Mhos : kyori; 
    var _Phos = typeof _Phos !== 'undefined' ? _Phos : kyori; 
    var _ckPlx = this.character(-1)._realX;
    var _ckPly = this.character(-1)._realY;
    var _xckflg = false; 
    var _yckflg = false;
    var _MKyori = kyori - _Mhos;
    if (_MKyori < 0) _MKyori = 0;
    var _PKyori = kyori + _Phos;
    switch (this.character(0)._direction){
        case 2:
            _xckflg = Math.abs(this.character(0)._realX - _ckPlx) < kyori;
            _yckflg = (this.character(0)._realY - _ckPly <= (_MKyori)) && 
                (this.character(0)._realY - _ckPly > -(_PKyori));
            break;
        case 4:
            _xckflg = (this.character(0)._realX - _ckPlx < (_PKyori)) &&
                (this.character(0)._realX - _ckPlx >= -(_MKyori));
            _yckflg = Math.abs(this.character(0)._realY - _ckPly) < kyori;
            break;
        case 6:
            _xckflg = (this.character(0)._realX - _ckPlx <= (_MKyori)) &&
                (this.character(0)._realX - _ckPlx > -(_PKyori));
            _yckflg = Math.abs(this.character(0)._realY - _ckPly) < kyori;
            break;
        case 8:
            _xckflg = Math.abs(this.character(0)._realX - _ckPlx) < kyori;
            _yckflg = (this.character(0)._realY - _ckPly < (_PKyori)) &&
                (this.character(0)._realY - _ckPly >= -(_MKyori));
            break;
    }
    if (_xckflg && _yckflg) {
        this.character(0).CheckX = this.character(-1)._realX; 
        this.character(0).CheckY = this.character(-1)._realY; 
        if (PL_ArukiFlame > 0) {
            return true;
        }
    }
    return false;
}
Game_Interpreter.prototype.WaitChker = function (_Timer) {
    return this.character(0).WaitTimer > 0 && this.character(0).WaitTimer < _Timer;
}
Game_Interpreter.prototype.CheckFlg = function (Setbool) {
    this.character(0).CheckFlg = Setbool;
}
Game_Interpreter.prototype.CheckTurn = function () {
    this.character(0).turnCharacter(
        this.character(0).CheckX, this.character(0).CheckY)
}
Game_Character.prototype.turnCharacter = function (_ChrX , _ChrY) {
    var sx = this.deltaXFrom(_ChrX);
    var sy = this.deltaYFrom(_ChrY);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
    }
};
Game_Interpreter.prototype.SettingPos = function () {
    if (this.character(0).baseX == 0 && this.character(0).baseY == 0) {
        this.character(0).baseX = this.character(0)._x;
        this.character(0).baseY = this.character(0)._y;
    }
}
Game_Interpreter.prototype.BaseSmart = function () {
    if (this.character(0).baseX != 0 && this.character(0).baseY != 0) {
        var args = new Array("0", String(this.character(0).baseX), String(this.character(0).baseY));
        this.pluginCommand("SmartPath", args);
    }
}
Game_Interpreter.prototype.BasePosCk = function () {
    if (this.character(0).baseX == this.character(0)._x && this.character(0).baseY == this.character(0)._y)
    {
        if (!this.character(0).baseOneFlg){
            this.character(0).baseOneFlg = true;
            return true;
        }
    } else {
        this.character(0).baseOneFlg = false;
    }
}
Game_Interpreter.prototype.lostTimer_Set = function () {
    this.character(0).lostTimer = this.character(0).setlosttimer;
};
var Nupu_MKR_PlayerSensor_EventUpdate = Game_Event.prototype.update;
Game_Event.prototype.update = function () {
    Nupu_MKR_PlayerSensor_EventUpdate.call(this);
    if (this.lostTimer >= 0) {
        this.lostTimer--;
    };
    if (this.WaitTimer > 0) {
        this.WaitTimer--;
    };
};
