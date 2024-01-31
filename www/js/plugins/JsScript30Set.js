/*:ja
 * @plugindesc 
 */
DataManager._databaseFiles.push({ 
    name:'$Nupu_Ptc',
    src:'Ptc_Collection.json'
});
DataManager._databaseFiles.push({ 
    name:'$Nupu_Ptc_Combo',
    src:'Ptc_Combo.json'
});
let PtcCounter = 0;     
let _TopFlg = false;    
let _BtmFlg = false;    
class PtcOpt_Class { 
    constructor() {
        this.timeRate = 1;  
        this.timeLapse = 1; 
        this.attach = false; 
        this._ZureX = 0;    
        this._ZureY = -24;    
    }
}
let PtcOpt = new PtcOpt_Class();
class PtcPos { 
    constructor(_id, _PtcName, _X, _Y, _CkNo) {
        this._id = _id;
        this._PtcName = _PtcName;
        this._X = _X;
        this._Y = _Y;
        this._CkNo = _CkNo;
    }
}
class _NPtcSe {
    constructor(_flame , _SeStr){
        this.flame = _flame;
        this.SeStr = _SeStr;
    }
}
class _NPtcCombo {
    constructor(_flame , _PtcName , _PlayType , _DataArr , _ZureX , _ZureY){
        _ZureX = typeof _ZureX !== 'undefined' ? _ZureX : 0;
        _ZureY = typeof _ZureY !== 'undefined' ? _ZureY : 0;
        this.flame = _flame;        
        this.PtcName = _PtcName;    
        this.PlayType = _PlayType;  
        this.DataArr = _DataArr;    
        this.ZureX = _ZureX;        
        this.ZureY = _ZureY;        
    }
}
let Ptc_CType = {
    Ev:1,   
    Sc:2,   
    Sc2:3,  
    Pic:4   
};
let NPtcSeArr = [];
let NPtcComboArr = [];
let NPtcSeUpdate = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    NPtcSeUpdate.call(this);
    for (let i = 0; i <= NPtcSeArr.length - 1; i++) {
        NPtcSeArr[i].flame--;
        if(NPtcSeArr[i].flame <= 0) {
            this.PlaySe(NPtcSeArr[i].SeStr);
            NPtcSeArr.splice(i , 1);
            i--;
        }
    }
    for (let i = 0; i <= NPtcComboArr.length - 1; i++) {
        NPtcComboArr[i].flame--;
        if(NPtcComboArr[i].flame <= 0) {
            switch (NPtcComboArr[i].PlayType) {
                case Ptc_CType.Ev:
                    this.PlayPtcEv(NPtcComboArr[i].PtcName , NPtcComboArr[i].DataArr[0] ,
                        NPtcComboArr[i].ZureX , NPtcComboArr[i].ZureY);
                    break;
                //     this.PlayPtcSc(NPtcSeArr[i].PtcName , NPtcSeArr[i].DataArr[0] , NPtcSeArr[i].DataArr[1]);
                //     this.PlayPtcSc2(NPtcSeArr[i].PtcName , NPtcSeArr[i].DataArr[0] , NPtcSeArr[i].DataArr[1]);
                case Ptc_CType.Pic:
                    this.PlayPtcPic(NPtcComboArr[i].PtcName , NPtcComboArr[i].DataArr[0] + NPtcComboArr[i].ZureX , NPtcComboArr[i].DataArr[1] + NPtcComboArr[i].ZureY);
                    break;
            }
            NPtcComboArr.splice(i , 1);
            i--;
        }
    }
}
Game_Interpreter.prototype.NPtcSeSet = function (_PtcName) {
    $Nupu_Ptc.ptc_Syuruis.forEach( ptc_Syurui => {
        ptc_Syurui.ptc_Datas.forEach( ptc_Data => {
            if(ptc_Data.Name == _PtcName) {
                ptc_Data.ptc_Ses.forEach( ptc_Se => {
                    NPtcSeArr.push(new _NPtcSe(ptc_Se.DoFlame , ptc_Se.SeName));
                });
            }
        });
    });
}
Game_Interpreter.prototype.NPtcComboSet = function (_ComboName , _PlayType , _DataArr) {
    $Nupu_Ptc_Combo.Combo_Base.forEach(comboBase => {
        if(comboBase.Name == _ComboName) {
            comboBase.ComboList.forEach( _combo => {
                _combo.Ptc_List.forEach( ptc_data => {
                    let _SetCombo = new _NPtcCombo(_combo.Do_Flame , ptc_data.Name ,
                        _PlayType , _DataArr , ptc_data.ZureX , ptc_data.ZureY);
                    NPtcComboArr.push(_SetCombo);
                });
            });
        }
    });
}
let _NP_GCB_IM = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
    _NP_GCB_IM.call(this);
    this._SetPtc = []; 
};
let clear_Ptc = []; 
let _MpPtcCk = true;
let NP_NUp = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NP_NUp.call(this)
    for (let i = 0; i <= clear_Ptc.length - 1; i++) {
        let args = new Array("clear", clear_Ptc[i]);
        this.pluginCommand("particle", args);
    }
    if (_MpPtcCk) {
        for (let i = 1; i <= $gameMap._events.length - 1; i++) {
            try { 
                let _ckEv = $gameMap._events[i].event();
                let _NPtcStr = MetaChecker(_ckEv, "NPtc");
                if (_NPtcStr != "") {
                    this.SetPtcEv(_NPtcStr, i);
                }
            }catch(ex){ }
        }
        _MpPtcCk = false;
    }
};
let NP_GP_RT = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    NP_GP_RT.call(this, mapId, x, y, d, fadeType);
    SC_SetPtc = []; 
    Rg_SetPtc = [];
    _MpPtcCk = true;
};
Game_Interpreter.prototype.SetPtcOpt = function (_id) {
    this.N_Plgin("particle", ["update", _id, "timeRate", PtcOpt.timeRate]);
    this.N_Plgin("particle", ["update", _id, "timeLapse", PtcOpt.timeLapse]);
    this.N_Plgin("particle", ["update", _id, "pos", PtcOpt._ZureX, PtcOpt._ZureY]);
    PtcOpt = new PtcOpt_Class(); 
}
let Ptc_ZureArr = [];
class Ptc_Zure {
    constructor(_ID , _ZureX , _ZureY) {
        this.ID = _ID;
        this.ZureX = _ZureX;
        this.ZureY = _ZureY;
    }
}
Game_Interpreter.prototype.PlayPtcEv = function (_PtcName, _EvNo , _ZureX , _ZureY) {
    _EvNo = typeof _EvNo !== 'undefined' ? _EvNo : 0;
    _ZureX = typeof _ZureX !== 'undefined' ? _ZureX : 0;
    _ZureY = typeof _ZureY !== 'undefined' ? _ZureY : 0;
    let _SetNo = GetPtcTargetEv(_EvNo); 
    if (PtcOpt.attach) _SetNo = "attach:" + _SetNo;
    let _id = _PtcName + "NP_" + PtcCounter;
    let args = ["play", _id, _SetNo, _PtcName];
    if (_BtmFlg) args = ["play", _id, _SetNo, _PtcName , 1];
    this.NPtcSeSet(_PtcName);
    this.N_Plgin("particle", args);
    if (_ZureX != 0 || _ZureY != 0) {
        let _setPtcZure = new Ptc_Zure(_id , _ZureX , _ZureY);
        Ptc_ZureArr.push(_setPtcZure);
    }
    PtcCounter += 1;
    this.SetPtcOpt(_id); 
};
Game_Interpreter.prototype.SetPtcEv = function (_PtcName, _EvNo, _ckNo) {
    _EvNo = typeof _EvNo !== 'undefined' ? _EvNo : 0;
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    let _SetNo = GetPtcTargetEv(_EvNo); 
    if (PtcOpt.attach) _SetNo = "attach:" + _SetNo;
    let _id = _PtcName + "NP_" + PtcCounter;
    let args = ["set", _id, _SetNo, _PtcName];
    if (_BtmFlg) args = ["set", _id, _SetNo, _PtcName, 1]; 
    this.NPtcSeSet(_PtcName);
    this.N_Plgin("particle", args);
    if (this.character(_EvNo) != undefined){
        this.character(_EvNo)._SetPtc.push(new PtcPos(_id, _PtcName, 0, 0, _ckNo));
    }
    this.SetPtcOpt(_id); 
    PtcCounter += 1;
};
Game_Interpreter.prototype.PlayPtcEvBtm = function (_PtcName, _EvNo) {
    _BtmFlg = true;
    this.PlayPtcEv(_PtcName, _EvNo);
    _BtmFlg = false;
}
Game_Interpreter.prototype.SetPtcEvBtm = function (_PtcName, _EvNo, _ckNo) {
    _BtmFlg = true;
    this.SetPtcEv(_PtcName, _EvNo, _ckNo);
    _BtmFlg = false;
}
let _EvNoArr = []; 
let Get_EvNoArr = function (_EvName) {
    _EvNoArr = [];
    for (let i = 1; i <= $gameMap._events.length - 1; i++) {
        if ($gameMap._events[i].event().name == _EvName) {
            _EvArr.push($gameMap._events[i]._eventId);
        }
    }
};
Game_Interpreter.prototype.PlayPtcEvN = function (_PtcName, _EvName) {
    for (let i = 0; i <= _EvArr.length - 1; i++) {
        this.PlayPtcEv(_PtcName, _EvNoArr[i]);
    }
};
Game_Interpreter.prototype.SetPtcEvN = function (_PtcName, _EvName,_ckNo) {
    for (let i = 0; i <= _EvArr.length - 1; i++) {
        this.SetPtcEv(_PtcName, _EvNoArr[i], _ckNo);
    }
};
Game_Interpreter.prototype.StopPtcEv = function (_EvNo, _ckNo) {
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    if (this.character(_EvNo) != undefined) {
        for (let i = 0; i <= this.character(_EvNo)._SetPtc.length - 1; i++) {
            if (_ckNo != 0) {
                if (_ckNo != SC_SetPtc[i]._CkNo) continue;
            }
            let _id = this.character(_EvNo)._SetPtc[i]._id;
            let _SetNo = GetPtcTargetEv(_EvNo); 
            let args = new Array("off", _id, _SetNo);
            this.pluginCommand("particle", args);
        }
    }
};
Game_Interpreter.prototype.StartPtcEv = function (_EvNo, _ckNo) {
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    if (this.character(_EvNo) != undefined) {
        for (let i = 0; i <= this.character(_EvNo)._SetPtc.length - 1; i++) {
            if (_ckNo != 0) {
                if (_ckNo != SC_SetPtc[i]._CkNo) continue;
            }
            let _id = this.character(_EvNo)._SetPtc[i]._id;
            let _SetNo = GetPtcTargetEv(_EvNo); 
            let args = new Array("on", _id, _SetNo);
            this.pluginCommand("particle", args);
        }
    }
};
let NP_GM_EE = Game_Map.prototype.eraseEvent;
Game_Map.prototype.eraseEvent = function (eventId) {
    if (this._events[eventId] != undefined) {
        NP_GM_EE.apply(this, arguments);
        if (this._events[eventId] != undefined) {
            for (let i = 0; i <= this._events[eventId]._SetPtc.length - 1; i++) {
                clear_Ptc.push(this._events[eventId]._SetPtc[i]._id); 
            }
        }
    }
}
let Rg_SetPtc = [];
Game_Interpreter.prototype.PlayPtcRg = function (_PtcName, _RgNo) {
    let _SetNo = "region:" + _RgNo; 
    if (PtcOpt.attach) _SetNo = "attach:" + _SetNo;
    let _id = _PtcName + "NP_" + PtcCounter;
    let args = ["play", _id, _SetNo, _PtcName];
    if (_BtmFlg) args = ["play", _id, _SetNo, _PtcName, 1]; 
    this.NPtcSeSet(_PtcName);
    this.N_Plgin("particle", args);
    PtcCounter += 1;
    this.SetPtcOpt(_id); 
}
let PtcPosArr = []; 
let SC_SetPtc = []; 
let _PtcPicFlg = false;
Game_Interpreter.prototype.PlayPtcSc = function (_PtcName, _X, _Y) {
    if (_X == true) _X = Graphics.width / 2;
    if (_Y == true) _Y = Graphics.height / 2;
    let _SetNo = "screen"; 
    if (_WeatherFlg) _SetNo = "weather";
    if (_PtcPicFlg) _SetNo = "picture:" + _SetPtcPicNo;
    let _id = _PtcName + "NP_" + PtcCounter;
    let args = new Array("play", _id, _SetNo, _PtcName);
    if (_TopFlg) args = new Array("play", _id, _SetNo, _PtcName, "screen"); 
    this.NPtcSeSet(_PtcName);
    this.pluginCommand("particle", args);
    PtcPosArr.push(new PtcPos(_id, _PtcName, _X, _Y, 0));
    PtcCounter += 1;
};
let _WeatherFlg = false;
Game_Interpreter.prototype.SetPtcSc = function (_PtcName, _X, _Y, _ckNo) {
    if (_X == true) _X = Graphics.width / 2;
    if (_Y == true) _Y = Graphics.height / 2;
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    let _SetNo = "screen"; 
    if (_WeatherFlg) _SetNo = "weather";
    if (_PtcPicFlg) _SetNo = "picture:" + _SetPtcPicNo;
    let _id = _PtcName + "NP_" + PtcCounter;
    let args = new Array("set", _id, _SetNo, _PtcName);
    if (_TopFlg) args = new Array("set", _id, _SetNo, _PtcName, "screen"); 
    if (_BtmFlg) args = new Array("set", _id, _SetNo, _PtcName, "above"); 
    this.NPtcSeSet(_PtcName);
    this.pluginCommand("particle", args);
    SC_SetPtc.push(new PtcPos(_id, _PtcName, _X, _Y, _ckNo));
    PtcPosArr.push(new PtcPos(_id, _PtcName, _X, _Y, 0));
    PtcCounter += 1;
};
Game_Interpreter.prototype.PlayPtcSc2 = function (_PtcName, _X, _Y, _ckNo) {
    _WeatherFlg = true;
    this.PlayPtcSc(_PtcName, _X, _Y);
    _WeatherFlg = false;
};
let _PtcPictCnt = 0;
let _SetPtcPicNo = 0;
const _Picture表示Ptc限界数 = 15; 
Game_Interpreter.prototype.PlayPtcPic = function (_PtcName, _X, _Y) {
    if (_X == true) _X = Graphics.width / 2;
    if (_Y == true) _Y = Graphics.height / 2;
    _PtcPictCnt++;
    if(_PtcPictCnt == _Picture表示Ptc限界数) _PtcPictCnt = 0;
    _SetPtcPicNo = PVS_MaxPicNo - _PtcPictCnt - 15;
    this.SetPict(_SetPtcPicNo , "PtcPoint" , _X , _Y);
    _PtcPicFlg = true;
    this.PlayPtcSc(_PtcName, _X, _Y);
    _PtcPicFlg = false;
};
Game_Interpreter.prototype.SetPtcPic = function (_PtcName, _X, _Y, _ckNo) {
    if (_X == true) _X = Graphics.width / 2;
    if (_Y == true) _Y = Graphics.height / 2;
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    this.SetPict(_SetPtcPicNo , "PtcPoint" , _X , _Y);
    _PtcPicFlg = true;
    this.SetPtcSc(_PtcName, _X, _Y , _ckNo);
    _PtcPicFlg = false;
};
Game_Interpreter.prototype.PlayPtcSc2Top = function (_PtcName, _X, _Y) {
    _TopFlg = true;
    this.PlayPtcSc2(_PtcName, _X, _Y);
    _TopFlg = false;
}
Game_Interpreter.prototype.PlayPtcScTop = function (_PtcName, _X, _Y) {
    _TopFlg = true;
    this.PlayPtcSc(_PtcName, _X, _Y);
    _TopFlg = false;
}
Game_Interpreter.prototype.SetPtcSc2 = function (_PtcName, _X, _Y, _ckNo) {
    _WeatherFlg = true;
    this.SetPtcSc(_PtcName, _X, _Y, _ckNo);
    _WeatherFlg = false;
};
Game_Interpreter.prototype.SetPtcScTop = function (_PtcName, _X, _Y, _ckNo) {
    _TopFlg = true;
    this.SetPtcSc(_PtcName, _X, _Y, _ckNo);
    _TopFlg = false;
};
Game_Interpreter.prototype.SetPtcSc2Top = function (_PtcName, _X, _Y, _ckNo) {
    _TopFlg = true;
    this.SetPtcSc2(_PtcName, _X, _Y, _ckNo);
    _TopFlg = false;
};
Game_Interpreter.prototype.SetPtcScBtm = function (_PtcName, _X, _Y, _ckNo) {
    _BtmFlg = true;
    this.SetPtcSc(_PtcName, _X, _Y, _ckNo);
    _BtmFlg = false;
};
Game_Interpreter.prototype.SetPtcSc2Btm = function (_PtcName, _X, _Y, _ckNo) {
    _BtmFlg = true;
    this.SetPtcSc2(_PtcName, _X, _Y, _ckNo);
    _BtmFlg = false;
};
Game_Interpreter.prototype.ClearPtcAll = function(){
    let args = new Array("clear", "all","true");
    this.pluginCommand("particle", args);
}
let _stpPtcDelFlg = false;
Game_Interpreter.prototype.StopPtcSc = function (_ckNo , _SokuDelFlg) {
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    _SokuDelFlg = typeof _SokuDelFlg !== 'undefined' ? _SokuDelFlg : false;
    for (let i = 0; i <= SC_SetPtc.length - 1; i++) {
        if (_ckNo != 0){
            if (_ckNo != SC_SetPtc[i]._CkNo) continue;
        }
        let _id = SC_SetPtc[i]._id;
        let _FlgStr = "false";
        if (_SokuDelFlg) _FlgStr = "true";
        let _SetNo = "screen"; 
        if (_WeatherFlg) _SetNo = "weather";
        let args = new Array("off", _id, _SetNo , _FlgStr);
        if (_stpPtcDelFlg) args = new Array("clear", _id, _SetNo , _FlgStr);
        this.pluginCommand("particle", args);
    }
    _stpPtcDelFlg = false;
};
Game_Interpreter.prototype.StopPtcSc2 = function (_ckNo , _SokuDelFlg) {
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    _SokuDelFlg = typeof _SokuDelFlg !== 'undefined' ? _SokuDelFlg : false;
    _WeatherFlg = true;
    this.StopPtcSc(_ckNo , _SokuDelFlg);
    _WeatherFlg = false;
};
Game_Interpreter.prototype.StartPtcSc = function (_ckNo) {
    _ckNo = typeof _ckNo !== 'undefined' ? _ckNo : 0;
    for (let i = 0; i <= SC_SetPtc.length - 1; i++) {
        if (_ckNo != 0) {
            if (_ckNo != SC_SetPtc[i]._CkNo) continue;
        }
        let _id = SC_SetPtc[i]._id;
        let _SetNo = "screen"; 
        if (_WeatherFlg) _SetNo = "weather";
        let args = new Array("on", _id, _SetNo);
        this.pluginCommand("particle", args);
    }
};
Game_Interpreter.prototype.StartPtcSc2 = function (_ckNo) {
    _WeatherFlg = true;
    this.StartPtcSc(_ckNo);
    _WeatherFlg = false;
};
let _NP_PE_ST = ParticleEmitter.prototype.setupTarget;
ParticleEmitter.prototype.setupTarget = function (data) {
    _NP_PE_ST.call(this,data);
    for (let i = 0; i <= PtcPosArr.length - 1; i++) {
        if (this._id == PtcPosArr[i]._id) {
            this._target.x = PtcPosArr[i]._X;
            this._target.y = PtcPosArr[i]._Y;
            PtcPosArr.splice(i, 1); 
            i--;
        }
    }
};
let GetPtcTargetEv = function (_EvNo) {
    switch (_EvNo) {
        case -1: return "player";
        case 0: return "this";
        default: return String("event:" + _EvNo);
    }
};
let Ptc_SyuruiArr = ["全て表示", "character", "weather", "screen", "region"]; 
const _ptc_PNo_ck = 49; 
const _ptc_PNo = 50; 
let _ckPicOver = []; 
let _ptc_EMLayer = 0; 
let _PtnArr = []; 
let _PlayPtc_id = ""; 
let _ptcBlkFlg = true;  
Game_Interpreter.prototype.PtcEditorUpdate = function () {
    if (_PlayPtc_id != "") {
        console.log("PtcOff");
        this.N_Plgin("particle", ["off", _PlayPtc_id]);
        _PlayPtc_id = "";
    }
    Ptc_SyuruiArr = ["全て表示", "character", "weather", "screen", "region"]; 
    for (let i = 0; i <= $Nupu_Ptc.ptc_Syuruis.length - 1; i++) {
        if(Ptc_SyuruiArr.indexOf($Nupu_Ptc.ptc_Syuruis[i].Name) == -1) {
            Ptc_SyuruiArr.push($Nupu_Ptc.ptc_Syuruis[i].Name);
        }
    }
    Ptc_SyuruiArr.push("◆組合せTest");
    switch (_ptc_EMLayer){
        case 0:
            this.PtcEdit_L1_Update();
            break;
        case 1:
            this.PtcEdit_L2_Update();
            break;
    }
    if (_ptcBlkFlg) {
        this.SetPicStr(_ptc_PNo_ck, "■黒側表示", 20, 100, 0, 255);
    } else {
        this.SetPicStr(_ptc_PNo_ck, "□白側表示", 20, 100, 0, 255);
    }
    if (overPointerCk(_ptc_PNo_ck)) {
        if (TouchInput.isTriggered()) {
            $gameTemp.clearDestination(); 
            _ptcBlkFlg = !_ptcBlkFlg;
        }
    }
}
let _Syurui_SelNo = -1; let _Bef_Syurui_SelNo = -2;
Game_Interpreter.prototype.Syurui_TxtDraw = function () {
    let _ckPArr = [];
    this.DelPictSpan(_ptc_PNo , _ptc_PNo + Ptc_SyuruiArr.length - 1);
    for (let i = 0; i <= Ptc_SyuruiArr.length - 1; i++) {
        let _SetStr = " " + Ptc_SyuruiArr[i];
        for (let j = _SetStr.length; j <= 15; j++) {
            _SetStr += " ";
        }
        if (_Syurui_SelNo == _ptc_PNo + i) {
            this.SetPicStrBG("#336699");
        }
        this.SetPicStr(_ptc_PNo + i, _SetStr, 20, 300, 0 + (i * 28), 255);
        _ckPArr.push(_ptc_PNo + i);
        _Bef_Syurui_SelNo = _Syurui_SelNo;
    }
    return _ckPArr;
}
let _Ptc_Combo_DrawFlg = false;
Game_Interpreter.prototype.PtcEdit_L1_Update = function () {
    $gameTemp.clearDestination(); 
    if (_Syurui_SelNo != _Bef_Syurui_SelNo) { 
        _ckPicOver = this.Syurui_TxtDraw();
    }
    _Syurui_SelNo = overPointerCkArr(_ckPicOver);
    if (_Syurui_SelNo != -1) {
        if (TouchInput.isTriggered() || TouchInput.isRepeated()) {
            _Ptc_Combo_DrawFlg = false;
            $gameTemp.clearDestination(); 
            _PtnArr = []; 
            let _SyuNo = _Syurui_SelNo - _ptc_PNo; 
            if (_SyuNo == 0) { 
                $Nupu_Ptc.ptc_Syuruis.forEach( ptc_Syurui => {
                    ptc_Syurui.ptc_Datas.forEach( ptc_Data => {
                        _PtnArr.push(ptc_Data);
                    });
                });
            } else if (_SyuNo == Ptc_SyuruiArr.length - 1) { 
                _Ptc_Combo_DrawFlg = true;
                $Nupu_Ptc_Combo.Combo_Base.forEach( _comboBase => {
                    _PtnArr.push(_comboBase);
                });
            } else {
                $Nupu_Ptc.ptc_Syuruis.forEach( ptc_Syurui => {
                    if(ptc_Syurui.Name == Ptc_SyuruiArr[_SyuNo]) {
                        ptc_Syurui.ptc_Datas.forEach( ptc_Data => {
                            _PtnArr.push(ptc_Data);
                        });
                    }
                });
            }
            _ptc_EMLayer = 1;
            _Ptn_SelNo = -1; _Bef_Ptn_SelNo = -2;
            this.Syurui_TxtDraw();
        }
    }
}
let _Ptn_SelNo = -1; let _Bef_Ptn_SelNo = -2;
Game_Interpreter.prototype.PtcEdit_L2_Update = function () {
    $gameTemp.clearDestination(); 
    let _ptc_l1_pNo = _ptc_PNo + Ptc_SyuruiArr.length;
    if (_Ptn_SelNo != _Bef_Ptn_SelNo) {
        this.DelPictSpan(_ptc_l1_pNo , _ptc_l1_pNo + _PtnArr.length - 1);
        _ckPicOver = [];
        for (let i = 0; i <= _PtnArr.length - 1; i++) {
            let _XCnt = Math.floor(i / 29);
            let _stX = 500 + _XCnt * 200;
            let _stY = 0 + ((i - 29 * _XCnt) * 28);
            _ckPicOver.push(_ptc_l1_pNo + i);
            if (_Ptn_SelNo == _ptc_l1_pNo + i) {
                this.DelPict(_ptc_l1_pNo + i);
                this.SetPicStrBG("#336699");
            }
            this.SetPicStr(_ptc_l1_pNo + i, _PtnArr[i].Name + " ", 20, _stX, _stY , 255);
        }
        _Bef_Ptn_SelNo = _Ptn_SelNo;
    }
    _Ptn_SelNo = overPointerCkArr(_ckPicOver);
    if (_Ptn_SelNo != -1) {
        if (TouchInput.isTriggered()) {
            if(_Ptc_Combo_DrawFlg) {
                let _SelNo = _Ptn_SelNo - _ptc_l1_pNo;
                if (_ptcBlkFlg) {
                    this.NPtcComboSet(_PtnArr[_SelNo].Name , Ptc_CType.Ev , [3]);
                } else {
                    this.NPtcComboSet(_PtnArr[_SelNo].Name , Ptc_CType.Ev , [1]);
                }
            } else {
                let _SelNo = _Ptn_SelNo - _ptc_l1_pNo;
                let _SyuruiStr = "";
                let _Name = _PtnArr[_SelNo].Name;
                $Nupu_Ptc.ptc_Syuruis.forEach( ptc_Syurui => {
                    ptc_Syurui.ptc_Datas.forEach( ptc_Data => {
                        if(ptc_Data.Name == _Name) {
                            _SyuruiStr = ptc_Syurui.Name;
                        }
                    });
                });
                switch (_SyuruiStr) {
                    default:
                        if (_ptcBlkFlg) {
                            this.N_Plgin("particle" , ["edit", _PtnArr[_SelNo].Name, "event:3"]
                            );
                        } else {
                            this.N_Plgin("particle" , ["edit", _PtnArr[_SelNo].Name, "event:1"]
                            );
                        }
                        break;
                    case "screen":
                        this.N_Plgin("particle" , ["edit", _PtnArr[_SelNo].Name, "screen"]
                        );
                        break;
                    case "weather":
                        this.N_Plgin("particle" , ["edit", _PtnArr[_SelNo].Name, "weather"]
                        );
                        break;
                }
                _PlayPtc_id = _PtnArr[_SelNo].Name;
                this.N_Plgin("particle", ["on", _PlayPtc_id]);
            }
        }
    }
    if (TouchInput.isCancelled()) {
        this.DelPictArr(_ckPicOver);
        _Syurui_SelNo = -1; _Bef_Syurui_SelNo = -2;
        _ptc_EMLayer = 0;
    }
}
class PtcCombo {
    constructor(_Name , _ComboArr){
        this._Name = _Name;
        this._ComboArr = _ComboArr; 
    }
}
let N_ParticleEmitter_Start = ParticleEmitter.prototype.start;
ParticleEmitter.prototype.start = function(bitmaps){
    N_ParticleEmitter_Start.apply(this, arguments); 
    for (let i = 0; i <= Ptc_ZureArr.length - 1; i++) {
        if(Ptc_ZureArr[i].ID == this._id) {
            switch (this._emitter.spawnType) {
                case "rect":
                    this._emitter.spawnRect.x += Ptc_ZureArr[i].ZureX;
                    this._emitter.spawnRect.y += Ptc_ZureArr[i].ZureY;
                    break;
                case "circle":
                case "ring":
                    this._emitter.spawnCircle.x += Ptc_ZureArr[i].ZureX;
                    this._emitter.spawnCircle.y += Ptc_ZureArr[i].ZureY;
                    break;
            }
        }
    }
}
//■時間操作パッチ(TRP_Particle.jsより下に配置)■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
/*:
 * 時間操作パッチ(TRP_Particle.jsより下に配置)
 *
 * 本パッチを導入するとupdate/animateコマンドで
 * パーティクルの再生速度などを操作できるようになります。
 *
 * ◆timeRate:再生速度(0以上の値。1で等速、0で停止)
 * パーティクルの速度のみでなく、発生間隔などにも影響します。
 *
 * 例) particle update 管理ID timeRate 0.5
 * → 管理IDで指定したパーティクルを半分の速度に変更
 * 例) particle animate 管理ID 60 timeRate 0
 * → 管理IDで指定したパーティクルを60フレームかけて停止
 *
 * ◆timeLapse:タイムラプス間隔(1以上の値。1で通常)
 * 指定した間隔フレームに１度のみ更新し、パラパラアニメのように
 * コマ送りに見えます。（再生速度自体は変化なし）
 * 例) particle udpate 管理ID timeLapse 2
 * → 管理IDで指定したパーティクルを2フレームに1度の
 *   アニメーション更新頻度に変更
 * 例) particle animate 管理ID 60 timeLapse 6
 * → 管理IDで指定したパーティクルを60フレームかけて
 *   6フレームに一度のアニメーション更新頻度に変更
 *
 */
let _ParticleEmitter_initMembers = ParticleEmitter.prototype.initMembers;
ParticleEmitter.prototype.initMembers = function () {
    _ParticleEmitter_initMembers.call(this);
    this._timeRate = 1;
    this._timeLapse = 1;
    this._timeLapseCount = 0;
};
let _ParticleEmitter_updateParam = ParticleEmitter.prototype._updateParam;
ParticleEmitter.prototype._updateParam = function (key, args, rate) {
    rate = rate || 1;
    switch (key.toLowerCase()) {
        case 'timerate':
            this._timeRate = this.paramWithRate(Number(args[0]) || 0, this._timeRate, rate);
            break;
        case 'timelapse':
            this._timeLapse = Math.max(1, Math.round(this.paramWithRate(Number(args[0]) || 0, this._timeLapse, rate)));
            break;
        default:
            _ParticleEmitter_updateParam.call(this, key, args, rate);
    }
};
let _ParticleEmitter_updateEmitter = ParticleEmitter.prototype.updateEmitter;
ParticleEmitter.prototype.updateEmitter = function () {
    if (this._timeLapse !== 1) {
        this._timeLapseCount += 1;
        if (this._timeLapseCount < this._timeLapse) return;
        this._timeLapseCount = 0;
    }
    _ParticleEmitter_updateEmitter.call(this);
};
ParticleEmitter.prototype.updateDeltaTime = function () {
    return ParticleEmitter.DELTA_TIME * this._timeRate * this._timeLapse;
};
