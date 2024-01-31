/* 目次　ピクチャ処理プラグイン
*/
Sprite_Picture.prototype.updateOrigin = function () {
    var picture = this.picture();
    switch (picture.origin()) {
        case 0: 
            this.anchor.x = 0;
            this.anchor.y = 0;
            break;
        case 1: 
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            break;
        case 2: 
            this.anchor.x = 1;
            this.anchor.y = 0;
            break;
        case 3: 
            this.anchor.x = 0;
            this.anchor.y = 1;
            break;
    }
};
var ViewPicArr = []; 
var ViewPicReset = function () {
    ViewPicArr = []; 
};
var ViewPicAdd = function (_PicNo) {
    if (ViewPicArr.indexOf(_PicNo) == -1) { 
        ViewPicArr.push(_PicNo);
    }
};
var ViewPicDel = function (_PicNo) {
    var _index = ViewPicArr.indexOf(_PicNo);
    if (_index != -1) { 
        ViewPicArr.splice(_index, 1);
    }
};
Game_Interpreter.prototype.ViewPicArrFadeIn = function () {
    for (var i = 0; i <= ViewPicArr.length - 1; i++) {
        this.MovePict(ViewPicArr[i], true, true, 10);
    }
}
var NP_原点 = 0; 
var _NP_ImageCacheArr = [];
var _NPicZureX = 0; 
var _NPicZureY = 0; 
Game_Interpreter.prototype.SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    var setx = typeof setx !== 'undefined' ? setx : 0;
    var sety = typeof sety !== 'undefined' ? sety : 0;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    var _blend = typeof _blend !== 'undefined' ? _blend : 0;
    setx += _NPicZureX; sety += _NPicZureY;
    _NP_ImageCacheArr.push(FileName);
    $gameScreen.showPicture(PicNo, FileName, NP_原点, setx, sety, mx, my, opi, _blend);
    ViewPicAdd(PicNo);
    if (NP_原点 == 0) DebugPicNo(PicNo, "SetPict");
    NP_原点 = 0; 
}
Game_Interpreter.prototype.SetPictC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 1;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictC");
}
Game_Interpreter.prototype.SetPictR = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 2;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictR");
}
Game_Interpreter.prototype.SetPictB = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 3;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictB");
}
var _ImLimitOpen = false;
ImageCache.limit = 1000 * 1000 * 1000; 
ImageCache.prototype._truncateCache = function(){
    var items = this._items;
    var sizeLeft = ImageCache.limit;
    if(_ImLimitOpen){
        sizeLeft = 10 * 1000 * 1000; 
    }
    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || this._mustBeHeld(item)){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            console.log("ImageCache.limit");
            delete items[item.key];
        }
    }.bind(this));
};
Game_Interpreter.prototype.SetPictFIn = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    this.SetPict(PicNo, FileName, setx + zureX, sety + zureY, 0, _mx, _my);
    this.MovePict(PicNo, setx, sety, time, _opi , true , true);
}
Game_Interpreter.prototype.SetPictFInC = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    this.SetPictC(PicNo, FileName, setx + zureX, sety + zureY, 0, _mx, _my);
    this.MovePict(PicNo, setx, sety, time, _opi, true, true);
}
Game_Interpreter.prototype.CngPict = function (PicNo, FileName) {
    if ($gameScreen.picture(PicNo) != undefined) {
        $gameScreen.picture(PicNo)._name = FileName;
    }
    DebugPicNo(PicNo, "CngPict");
}
//Pictureの移動 this.MovePict(ピクチャNo , 場所X, 場所Y , フレーム , 透明度 ,拡大X , 拡大Y)
Game_Interpreter.prototype.MovePict = function (PicNo, setx, sety, time, opi, mx, my) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    if ($gameScreen.picture(PicNo) == undefined) return;
    if (setx == true) setx = $gameScreen.picture(PicNo)._x;
    if (sety == true) sety = $gameScreen.picture(PicNo)._y;
    if (opi == true) opi = $gameScreen.picture(PicNo)._opacity;
    if (mx == true) mx = $gameScreen.picture(PicNo)._scaleX;
    if (my == true) my = $gameScreen.picture(PicNo)._scaleY;
    var _origin = $gameScreen.picture(PicNo)._origin; 
    var _blend = $gameScreen.picture(PicNo)._blendMode;
    this.EMoveSet(EasingStr);
    setx += _NPicZureX; sety += _NPicZureY;
    $gameScreen.movePicture(PicNo, _origin, setx, sety, mx, my, opi, _blend, time);
    DebugPicNo(PicNo, "MovePict");
}
Game_Interpreter.prototype.MovePictAdd = function (PicNo, addx, addy, time, opi) {
    var opi = typeof opi !== 'undefined' ? opi : true;
    var setx = true; var sety = true;
    var mx = true; var my = true;
    if ($gameScreen.picture(PicNo) == undefined) return;
    if (setx == true) setx = $gameScreen.picture(PicNo)._x + addx;
    if (sety == true) sety = $gameScreen.picture(PicNo)._y + addy;
    if (opi == true) opi = $gameScreen.picture(PicNo)._opacity;
    if (mx == true) mx = $gameScreen.picture(PicNo)._scaleX;
    if (my == true) my = $gameScreen.picture(PicNo)._scaleY;
    var _origin = $gameScreen.picture(PicNo)._origin; 
    var _blend = $gameScreen.picture(PicNo)._blendMode;
    this.EMoveSet(EasingStr);
    setx += _NPicZureX; sety += _NPicZureY;
    $gameScreen.movePicture(PicNo, _origin, setx, sety, mx, my, opi, _blend, time);
    DebugPicNo(PicNo, "MovePict");
}
Game_Interpreter.prototype.AnglePict = function (PicNo, _Angle) {
    var _Angle = typeof _Angle !== 'undefined' ? _Angle : 0;
    var picture = $gameScreen.picture(PicNo);
    if (picture) {
        picture.setAngleDirect(_Angle);
    }
    DebugPicNo(PicNo, "AnglePict");
}
Game_Picture.prototype.setAngleDirect = function (value) {
    this._rotationSpeed = 0;
    this._angle = value % 360;
};
Game_Interpreter.prototype.PicCngColor = function (PicNo, _ColArr, _timer) {
    var _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; 
    var _timer = typeof _timer !== 'undefined' ? _timer : 0;
    $gameScreen.tintPicture(PicNo, _ColArr, _timer);
    DebugPicNo(PicNo, "PicCngColor");
}
Game_Interpreter.prototype.PicCngColorArr = function (PicArr, _ColArr, _timer) {
    for (var i = 0; i <= PicArr.length - 1; i++) {
        this.PicCngColor(PicArr[i], _ColArr, _timer)
    }
}
Game_Interpreter.prototype.PicArSetOpacity = function (PicArr, SetOpacity) {
    for (var i = 0; i <= PicArr.length - 1; i++) {
        if ($gameScreen.picture(PicArr[i]) != undefined) {
            $gameScreen.picture(PicArr[i])._opacity = SetOpacity;
        }
    }
}
Game_Interpreter.prototype.DelPict = function (PicNo) {
    $gameScreen.erasePicture(PicNo);
    ViewPicDel(PicNo);
    DebugPicNo(PicNo, "DelPict");
}
Game_Interpreter.prototype.DelPictArr = function (DelArr) {
    for (var di = 0; di <= DelArr.length - 1; di++) {
        this.DelPict(DelArr[di]);
        DebugPicNo(DelArr[di], "DelPictArr");
    }
}
Game_Interpreter.prototype.DelPictSpan = function (_開始No , _終了No) {
    for (var i = _開始No; i <= _終了No; i++) this.DelPict(i);
}
Game_Interpreter.prototype.ALLDelPict = function (notarr) {
    var notarr = typeof notarr !== 'undefined' ? notarr : null;
    var _maxPic = $gameScreen.maxPictures();
    for (var i = 1; i <= _maxPic - 10; i++) {
        var notdelflg = false;
        if (notarr != null) {
            for (var j = 0; j <= notarr.length - 1; j++) {
                if (notarr[j] == i) {
                    notdelflg = true;
                }
            }
        }
        if (!notdelflg) {
            this.DelPict(i);
        }
    }
}
Game_Interpreter.prototype.PicNoCng = function (PicNo, _PicCngNo) {
    if ($gameScreen.picture(PicNo) != undefined) { 
        $gameScreen.PicNoCng(PicNo, _PicCngNo);
    }
}
Game_Screen.prototype.PicNoCng = function (PicNo, _PicCngNo) {
    var realPictureId = this.realPictureId(PicNo);
    var cngPictureId = this.realPictureId(_PicCngNo);
    this._pictures[cngPictureId] = this._pictures[realPictureId];
    this._pictures[realPictureId] = null;
};
Game_Interpreter.prototype.PicObjGet = function (_PicNo) {
    if ($gameScreen.picture(_PicNo) != undefined) { 
        return $gameScreen.PicObjGet(_PicNo);
    }
    return null;
}
Game_Screen.prototype.PicObjGet = function (_PicNo) {
    var realPictureId = this.realPictureId(_PicNo);
    return this._pictures[realPictureId];
};
Game_Interpreter.prototype.PicInObj = function (_PicNo, _PicObj) {
    $gameScreen.PicInObj(_PicNo, _PicObj);
}
Game_Screen.prototype.PicInObj = function (_PicNo, _PicObj) {
    this._pictures.splice(_PicNo, 1); 
    this._pictures.splice(_PicNo, 0, _PicObj); 
};
var _OneShotFont = "";
var D_Text_Cng_font = ""; 
Game_Interpreter.prototype.SetPicStr = function (PicNo, moji, Size, setx, sety, opi) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    if (D_Text_Cng_font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", D_Text_Cng_font]);
    if (_OneShotFont != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _OneShotFont]);
    var args = new Array(moji, String(Size));
    this.pluginCommand("D_TEXT", args);
    $gameScreen.showPicture(PicNo, "", NP_原点, setx, sety, 100, 100, opi, 0);
    ViewPicAdd(PicNo);
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    NP_原点 = 0;
    _OneShotFont = "";
};
Game_Interpreter.prototype.SetPicStrC = function (PicNo, moji, Size, setx, sety, opi) {
    NP_原点 = 1; 
    this.SetPicStr(PicNo, moji, Size, setx, sety, opi);
};
Game_Interpreter.prototype.SetPicStrR = function (PicNo, moji, Size, setx, sety, opi) {
    NP_原点 = 2; 
    this.SetPicStr(PicNo, moji, Size, setx, sety, opi);
};
Game_Interpreter.prototype.SetPicStrBG = function (BGcolor) {
    var args = new Array("BG_COLOR", BGcolor);
    this.pluginCommand("D_TEXT_SETTING", args);
};
Game_Interpreter.prototype.SetPicStrFont = function (FontStr) {
    _OneShotFont = FontStr;
};
Game_Interpreter.prototype.SetPicStrPop = function (PicNo, moji, Size, setx, sety, stime, Popy) {
    var stime = typeof stime !== 'undefined' ? stime : 60;
    var Popy = typeof Popy !== 'undefined' ? Popy : 30;
    this.SetPicStr(PicNo, moji, Size, setx, sety);
    this.MovePict(PicNo, setx, sety - Popy, stime, 0)
    ViewPicAdd(PicNo);
}
Game_Interpreter.prototype.SetPicStrPopC = function (PicNo, moji, Size, setx, sety, stime, Popy) {
    var stime = typeof stime !== 'undefined' ? stime : 60;
    var Popy = typeof Popy !== 'undefined' ? Popy : 30;
    this.SetPicStrC(PicNo, moji, Size, setx, sety);
    this.MovePict(PicNo, setx, sety - Popy, stime, 0)
    ViewPicAdd(PicNo);
}
var D_Text_Align = ""; 
Game_Interpreter.prototype.SetPicStrArr = function (PicNo, mojiArr, setx, sety, opi) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    if (D_Text_Cng_font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", D_Text_Cng_font]);
    if (_OneShotFont != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _OneShotFont]);
    switch (D_Text_Align) {
        case "":
        case "l":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "0"]); break;
        case "c":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "1"]); break;
        case "r":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "2"]); break;
    }
    for (var i = 0; i <= mojiArr.length - 1; i++) {
        var args = new Array(mojiArr[i][0], String(mojiArr[i][1]));
        this.pluginCommand("D_TEXT", args);
    }
    $gameScreen.showPicture(PicNo, "", NP_原点, setx, sety, 100, 100, opi, 0);
    ViewPicAdd(PicNo);
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "0"]); 
    NP_原点 = 0;
    _OneShotFont = "";
}
Game_Interpreter.prototype.SetPicStrArrC = function (PicNo, mojiArr, setx, sety, opi) {
    NP_原点 = 1; 
    this.SetPicStrArr(PicNo, mojiArr, setx, sety, opi);
}
Game_Interpreter.prototype.SetPicStrArrR = function (PicNo, mojiArr, setx, sety, opi) {
    NP_原点 = 2; 
    this.SetPicStrArr(PicNo, mojiArr, setx, sety, opi);
}
var PPicAnimeType = 1;
var PPicAnimeLoopFlg = true;
var _PAnimeCenterFlg = false;
var PicAnimeOne = function(){ 
    PPicAnimeLoopFlg = false;
}
var _PicAnimeLCLoop = 0;
var PicAnimeLCLoop = function (_lcnt) { 
    _PicAnimeLCLoop = _lcnt;
}
Game_Interpreter.prototype.PlayPicAnime = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    var args = new Array(String(CellSu), String(CellFlm), "横", "0");
    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    if (PPicAnimeLoopFlg) {
        var args2 = new Array(String(PicNo), String(PPicAnimeType));
        if (_PicAnimeLCLoop != 0) {
            var _SetCC = "[" + CellSu;
            for (var ci = 1; ci <= CellSu; ci++) {
                if (_SetCC == "[") {
                    _SetCC += String(ci);
                } else {
                    _SetCC += "," + String(ci)
                }
            }
            for (var i = 0; i <= _PicAnimeLCLoop - 1; i++) {
                _SetCC += "," + String(ci - 1); 
            }
            _SetCC += "]";
            args2 = new Array(String(PicNo), "3", _SetCC);
        }
        this.pluginCommand("PA_START_LOOP", args2);
    } else {
        var _SetCC = "[" + CellSu;
        for (var ci = 1; ci <= CellSu; ci++) {
            if (_SetCC == "[") {
                _SetCC += String(ci);
            } else {
                _SetCC += "," + String(ci)
            }
        }
        _SetCC += "]";
        var args2 = new Array(String(PicNo), "3", _SetCC);
        this.pluginCommand("PA_START", args2);
    }
    _PicAnimeLCLoop = 0;
    PPicAnimeType = 1;
    PPicAnimeLoopFlg = true; 
}
//アニメ表示(中心)
Game_Interpreter.prototype.PlayPicAnimeC = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PlayPicAnime(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PicAnimeCell = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    var _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    var CellFlm = 10;
    var args = new Array(String(CellSu), String(CellFlm), "横", "0");
    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); 
    this.pluginCommand("PA_STOP_FORCE", [String(PicNo)]); 
}
Game_Interpreter.prototype.PicAnimeCellC = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    var _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PicAnimeCell(PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PicAnimeCellCng = function (PicNo, _CellNo) {
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); 
}
var EasingStr = ""; 
Game_Interpreter.prototype.EMoveSet = function (_EasingStr) {
    var args = new Array(_EasingStr);
    this.pluginCommand("easing", args);
}
function overPointerCk(_PicNo) {
    if (MouseStopFlame > MouseMukoFlame) return false; 
    var picture = SceneManager.getPictureSprite(_PicNo); 
    if (picture.opacity === 0) return false; 
    return $gameScreen.isPointerInnerPicture(_PicNo);
};
function overPointerCkTm(_PicNo) {
    if (MouseStopFlame > MouseMukoFlame) return false; 
    return $gameScreen.isPointerInnerPictureTm(_PicNo);
};
//対象のピクチャ上にポインタがあるかを調べる(配列で)：一番数値の大きい数字を返す：ない場合は-1
function overPointerCkArr(_PicNoArr) {
    for (var _i = 0; _i <= _PicNoArr.length - 1; _i++) {
        if (this.overPointerCk(_PicNoArr[_i])) {
            return _PicNoArr[_i];
        }
    }
    return -1;
};
function overPointerCkArrTm(_PicNoArr) {
    for (var _i = 0; _i <= _PicNoArr.length - 1; _i++) {
        if (this.overPointerCkTm(_PicNoArr[_i])) {
            return _PicNoArr[_i];
        }
    }
    return -1;
};
Game_Screen.prototype.isPointerInnerPictureTm = function (pictureId) {
    var picture = SceneManager.getPictureSprite(pictureId);
    if (picture) {
        var _rtnFlg = picture.isIncludePointer();
        if (_rtnFlg) {
            return !picture.isTransparentN();
        }
    } else {
        return false;
    }
}
Sprite_Picture.prototype.isTransparentN = function () {
    if (this.opacity === 0) return true; 
    var dx = this.getTouchScreenX() - this.x;
    var dy = this.getTouchScreenY() - this.y;
    var sin = Math.sin(-this.rotation);
    var cos = Math.cos(-this.rotation);
    var bx = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
    var by = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
    return this.bitmap.getAlphaPixel(bx, by) === 0; 
};
var _TcPosX = 0;
var _TcPosY = 0;
var Nupu_updatePointer = Game_Screen.prototype.updatePointer;
Game_Screen.prototype.updatePointer = function () {
    Nupu_updatePointer.call(this);
    _TcPosX = TouchInput.x;
    _TcPosY = TouchInput.y;
};
function overPicClickable(_PicNo, _CMapArr) {
    if (this.overPointerCk(_PicNo)) {
        var _CkZureX = 0;
        var _CkZureY = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureX = _CkPicWidth(_PicNo) / 2;
            _CkZureY = _CkPicHeight(_PicNo) / 2;
        }
        for (var _oi = 0; _oi <= _CMapArr.length - 1; _oi++) {
            if (_TcPosX >= _CMapArr[_oi][0] + $gameScreen.picture(_PicNo)._x - _CkZureX &&
                _TcPosX <= _CMapArr[_oi][0] + _CMapArr[_oi][2] + $gameScreen.picture(_PicNo)._x - _CkZureX &&
                _TcPosY >= _CMapArr[_oi][1] + $gameScreen.picture(_PicNo)._y - _CkZureY &&
                _TcPosY <= _CMapArr[_oi][1] + _CMapArr[_oi][3] + $gameScreen.picture(_PicNo)._y - _CkZureY) {
                return _oi;
            }
        }
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のX箇所が全体の何%の位置かを返す(0~100)
function overPicParX(_PicNo) {
    if (this.overPointerCk(_PicNo)) {
        var _CkZureX = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureX = _CkPicWidth(_PicNo) / 2;
        }
        return (_TcPosX - ($gameScreen.picture(_PicNo)._x - _CkZureX)) / _CkPicWidth(_PicNo) * 100;
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のY箇所が全体の何%の位置かを返す(0~100)
function overPicParY(_PicNo) {
    if (this.overPointerCk(_PicNo)) {
        var _CkZureY = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureY = _CkPicHeight(_PicNo) / 2;
        }
        return (_TcPosY - ($gameScreen.picture(_PicNo)._y - _CkZureY)) / _CkPicHeight(_PicNo) * 100;
    }
    return -1; 
}
var _CkPicWidth = function (_PicNo) {
    var pictureId = _PicNo;
    var spritePicture = SceneManager._scene._spriteset._pictureContainer.children.filter(function (picture) {
        return picture._pictureId === pictureId;
    })[0];
    return spritePicture.width;
}
var _CkPicHeight = function (_PicNo) {
    var pictureId = _PicNo;
    var spritePicture = SceneManager._scene._spriteset._pictureContainer.children.filter(function (picture) {
        return picture._pictureId === pictureId;
    })[0];
    return spritePicture.height;
}
var GetPicName = function (_PicNo) {
    if ($gameScreen.picture(_PicNo) == undefined) return "";
    return $gameScreen.picture(_PicNo)._name;
}
var _cmpSetting = ""; 
Game_Interpreter.prototype.CmpPict = function (_APictNo, _BPictNo, _xPos, _yPos, _xSize, _ySize) {
    var _xPos = typeof _xPos !== 'undefined' ? _xPos : 0;
    var _yPos = typeof _yPos !== 'undefined' ? _yPos : 0;
    var _setCmp = "source-over";
    if (_cmpSetting != "") {
        _setCmp = _cmpSetting;
    }
    var _SetArr = [_APictNo, _BPictNo, _setCmp, _xPos, _yPos];
    if (_xSize != undefined) _SetArr.push(_xSize);
    if (_ySize != undefined) _SetArr.push(_ySize);
    this.N_Plgin("compose_picture", _SetArr);
    this.DelPict(_BPictNo);
}
Game_Interpreter.prototype.PicFilterSet = function (_PicNo , _FilStr) {
    var _SetArr = [5000 + _PicNo , _FilStr , 5000 + _PicNo];
    this.N_Plgin("createFilter", _SetArr);
}
Game_Interpreter.prototype.PicFilterPraSet = function (_PicNo , _PraArr) {
    var _SetArr = [5000 + _PicNo];
    for (var i = 0; i <= _PraArr.length - 1; i++) {
            _SetArr.push(_PraArr[i]);
    }
    this.N_Plgin("setFilter", _SetArr);
}
Game_Interpreter.prototype.PicTranIn = function (_PicNo , _TranPic , _time) {
    var _time = typeof _time !== 'undefined' ? _time : 15;
    var _SetArr = ["picture",_PicNo,"fadeIn",_TranPic,_time];
    this.N_Plgin("GWFade", _SetArr);
}
Game_Interpreter.prototype.PicTranOut = function (_PicNo , _TranPic , _time) {
    var _time = typeof _time !== 'undefined' ? _time : 15;
    var _SetArr = ["picture",_PicNo,"fadeOut",_TranPic,_time];
    this.N_Plgin("GWFade", _SetArr);
}
var DebugPicNo = function (_CkPNo, _PlsStr) {
    var _PlsStr = typeof _PlsStr !== 'undefined' ? _PlsStr : "";
    for (var cdi = 0; cdi <= DbgPNo.length - 1; cdi++) {
        if (DbgPNo[cdi] == _CkPNo) {
            console.log("[デバッグ]Picture:" + DbgPNo[cdi] + ":" + _PlsStr);
        }
    }
}
ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        if (filename.indexOf('/') !== -1) {
            path = "img/" + filename + '.png';
        }
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
