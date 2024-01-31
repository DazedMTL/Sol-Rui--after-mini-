var SCol = {
    Def: "\\C[0]", Def0: "\\ow[0]\\C[0]",
    Blk: "\\C[15]", Blk0: "\\ow[0]\\C[15]",
    Red: "\\C[10]", Red0: "\\ow[0]\\C[10]",
    Grn: "\\C[29]", Grn0: "\\ow[0]\\C[29]",
    Blu: "\\C[23]", Blu0: "\\ow[0]\\C[23]",
    Yel: "\\C[17]", Yel0: "\\ow[0]\\C[17]"
};
Game_Interpreter.prototype.GameFileSave = function (_SaveNo) {
    var args = new Array("save", String(_SaveNo));
    this.pluginCommand("SaveCommand", args);
};
Game_Interpreter.prototype.GameFileLoad = function (_SaveNo) {
    var args = new Array("load", String(_SaveNo));
    this.pluginCommand("SaveCommand", args);
};
Game_Interpreter.prototype.UTA_Save = function () {
    var args = new Array("save");
    this.pluginCommand("CommonSave", args);
};
var ErrLogPic = PVS_MaxPicNo - 10; 
var N_ErrMsg = []; 
var N_ErrViewFlg = false; 
var NErrPos = new Pos2D(0, 0);
var Nupu_ErrLogUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_ErrLogUpdate.call(this);
    if (N_ErrMsg.length != 0 && !N_ErrViewFlg) {
        N_ErrViewFlg = true;
        this.SetPict(ErrLogPic, "system/ErrBack", NErrPos._x, NErrPos._y);
        D_Text_Cng_font = ""; 
        var fseSet = "\\ow[0]"
        for (var ei = 0; ei <= N_ErrMsg.length - 1; ei++) {
            this.SetPicStr(ErrLogPic + 1 + ei, fseSet + N_ErrMsg[ei], 16, NErrPos._x + 34, NErrPos._y + 52 + (22 * ei));
            if (ei == 9) {
                break;
            }
        }
        D_Text_Cng_font = ""; 
    }
    if (Input.isTriggered('tab') && N_ErrViewFlg) { 
        N_ErrViewFlg = false; 
        N_ErrMsg = [];
        for (var ei = ErrLogPic; ei <= ErrLogPic + 10; ei++) {
            this.DelPict(ei); 
        }
    }
}
var Nupu_Yanfly_Err = Yanfly.Util.displayError;
Yanfly.Util.displayError = function (e, code, message) {
    try {
        Nupu_Yanfly_Err.call(this, e, code, message);
        if (!N_ErrViewFlg) {
            N_ErrMsg = e.stack.split('\n');
            N_ErrMsg.unshift(e.message); 
            for (var ei = 2; ei <= N_ErrMsg.length - 1; ei++) {
                N_ErrMsg[ei] = N_ErrMsg[ei].slice(-50);
            }
        }
    }catch(ex){
    }
}
var WebPageOpen = function (_URL) {
    var url = _URL;
    if (Utils.isNwjs()) {
        var exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler  "' + url + '"');
                break;
            default:
                exec('open "' + url + '"');
                break;
        }
    } else {
        window.open(url);
    }
}
var Nupu_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function (event) {
    //console.log(event.keyCode); //ここをコメントに戻すと表示されるようになる。
    Nupu_onKeyDown.call(this, event);
};
function ErrConsole(_ErrArr) {
    var outStr = "Err:";
    for (var eri = 0; eri <= _ErrArr.length - 1; eri++) {
        outStr += _ErrArr[eri] + ":";
    }
    console.log(outStr);
};
var Nupu_ImgConsole = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_ImgConsole.call(this); 
    if (i_ConStr != ""){
        this.SetPicStr(ErrLogPic, i_ConStr, 16, 10, 10);
        i_ConStr = "";
    }
}
var i_ConStr = "";
function i_console(_str){
    if (!DbgFlg) return;
    i_ConStr = _str;
};
Scene_Map.prototype.isFastForward = function () {
    return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
        (Input.isLongPressed('ok') || TouchInput.isLongPressed() || Input.isPressed('control')));
};
var isFastForward = function () {
    return (Input.isLongPressed('ok') || TouchInput.isLongPressed() || Input.isPressed('control'));
}
function SpritePicIdGet(pictureId) {
    var sprite_picture = null;
    var spriteset = SceneManager._scene._spriteset;
    if (spriteset) {
        spriteset._pictureContainer.children.some(function(sprite) {
            if ((sprite instanceof Sprite_Picture) && sprite._pictureId === pictureId) {
                sprite_picture = sprite;
                return true;
            }
        });
    }
    console.log(sprite_picture);
}
//使用方法：var sRand = SeedRand(Seed値); //乱数の作成を行う
//sRand.get(); //乱数の取得
class SeedRand {
    constructor(seed = 88675123) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }
    next() {
        let t;
        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }
    random() {
        var min = 0;
        var max = 10000000;
        const r = Math.abs(this.next());
        return (min + (r % (max + 1 - min))) / max;
    }
}
