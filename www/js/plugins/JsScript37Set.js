const TyohoPicPath = "pictures/UI_Tyoho/";
const PN_TBase = 180; 
const PN_TSelBtn = PN_TBase + 1; 
const SW_諜報禁止 = 65; 
const VN_諜報結果 = 116;
var TyoPos = new Pos2D(765,621);
var TBPosArr = [
    new Pos2D(TyoPos._x - 3, TyoPos._y - 106),
    new Pos2D(TyoPos._x + 104, TyoPos._y + 1),
    new Pos2D(TyoPos._x - 3, TyoPos._y + 106),
    new Pos2D(TyoPos._x - 109, TyoPos._y + 1)
]
var TyohoBtn_1 = [
    "Btn_1_1", "Btn_1_2", "Btn_1_3","Btn_1_4"
];
var TyohoBtn_2 = [
    "Btn_2_1", "Btn_2_2", "Btn_2_3", "Btn_2_4"
];
var TyohoBtnReset = function(){
    TyohoBtn_1 = [
        "Btn_1_1", "Btn_1_2", "Btn_1_3", "Btn_1_4"
    ];
    TyohoBtn_2 = [
        "Btn_2_1", "Btn_2_2", "Btn_2_3", "Btn_2_4"
    ];
}
var tyoho_flame = 0; 
var tyoho_PArr = [
    PN_TSelBtn + 0, PN_TSelBtn + 1, PN_TSelBtn + 2, PN_TSelBtn + 3
]
var tyo_StartLayer = 1; 
var tyo_layer = 1; 
var tyo_SelNo = 0; 
var _協力Flg = false; 
var tyo_endFlm = 0; 
Game_Interpreter.prototype.諜報Start = function () {
    tyoho_flame = 0; 
    tyo_layer = tyo_StartLayer;
    tyo_SelNo = 0; 
    tyo_endFlm = 0; 
    this.SetPictFInC(PN_TBase, TyohoPicPath + "PN_TBase", TyoPos._x, TyoPos._y, 0, 0, 10);
    for (var i = 0; i <= TBPosArr.length - 1; i++) {
        var _PicStr = "";
        switch (tyo_layer){
            case 1:
                _PicStr = TyohoPicPath + TyohoBtn_1[i];
                break;
            case 2:
                _PicStr = TyohoPicPath + TyohoBtn_2[i];
                break;
        }
        if ($gameSwitches.value(SW_諜報禁止 + i)) _PicStr += "c";
        var _PosX = TBPosArr[i]._x;
        var _PosY = TBPosArr[i]._y;
        this.SetPictFInC(PN_TSelBtn + i, _PicStr, _PosX, _PosY, 0, 0, 10);
    }
}
Game_Interpreter.prototype.諜報Update = function () {
    if (tyo_endFlm > 0){
        if (tyo_endFlm == 1) {
            SoundManager.playOk(); 
            return false;
        }
        tyo_endFlm++;
        return true;
    }
    var _mvFlg = false;
    if (Input.isTriggered('up')) {
        tyo_SelNo = 1; _mvFlg = true;
    } else if (Input.isTriggered('right')) {
        tyo_SelNo = 2; _mvFlg = true;
    } else if (Input.isTriggered('down')) {
        tyo_SelNo = 3; _mvFlg = true;
    } else if (Input.isTriggered('left')) {
        tyo_SelNo = 4; _mvFlg = true;
    }
    var _CNo = overPointerCkArrTm(tyoho_PArr)
    if (_CNo != -1) {
        var _ckSelNo = (_CNo + 1) - PN_TSelBtn;
        if (_ckSelNo != tyo_SelNo && !$gameSwitches.value(SW_諜報禁止 + _ckSelNo - 1)) {
            _mvFlg = true;
            tyo_SelNo = (_CNo + 1) - PN_TSelBtn;
        }
    }
    if (Input.isTriggered('escape') && !$gameSwitches.value(SW_諜報禁止 + 2)) {
        $gameVariables.setValue(VN_諜報結果, 0);
        tyo_endFlm = 1; _mvFlg = true;
    }
    if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
        if (tyo_layer == 1) {
            switch (tyo_SelNo) {
                case 1: 
                    if ($gameSwitches.value(SW_諜報禁止 + 0)) break;
                    $gameVariables.setValue(VN_諜報結果, 1);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 2: 
                    if ($gameSwitches.value(SW_諜報禁止 + 1)) break;
                    $gameVariables.setValue(VN_諜報結果, 2);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 3: 
                    if ($gameSwitches.value(SW_諜報禁止 + 2)) break;
                    $gameVariables.setValue(VN_諜報結果, 0);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 4: 
                    if ($gameSwitches.value(SW_諜報禁止 + 3)) break;
                    $gameVariables.setValue(VN_諜報結果, 3);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
            }
        } else {
            switch (tyo_SelNo) {
                case 1: 
                    if ($gameSwitches.value(SW_諜報禁止 + 0)) break;
                    $gameVariables.setValue(VN_諜報結果, 21);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 2: 
                    if ($gameSwitches.value(SW_諜報禁止 + 1)) break;
                    $gameVariables.setValue(VN_諜報結果, 22);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 3: 
                    if ($gameSwitches.value(SW_諜報禁止 + 2)) break;
                    $gameVariables.setValue(VN_諜報結果, 0);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
                case 4: 
                    if ($gameSwitches.value(SW_諜報禁止 + 3)) break;
                    $gameVariables.setValue(VN_諜報結果, 23);
                    tyo_endFlm = 1; _mvFlg = true;
                    break;
            }
        }
    }
    if (_mvFlg) {
        SoundManager.playCursor(); 
        for (var i = 0; i <= TBPosArr.length - 1; i++) {
            if ($gameSwitches.value(SW_諜報禁止 + i)) continue;
            var _PicStr = "";
            switch (tyo_layer) {
                case 1:
                    _PicStr = TyohoPicPath + TyohoBtn_1[i];
                    break;
                case 2:
                    _PicStr = TyohoPicPath + TyohoBtn_2[i];
                    break;
            }
            var _PosX = TBPosArr[i]._x;
            var _PosY = TBPosArr[i]._y;
            if (i == tyo_SelNo - 1) {
                if (tyo_endFlm > 0) {
                    _PicStr += "b";
                } else { 
                    _PicStr += "a";
                }
                this.SetPictC(PN_TSelBtn + i, _PicStr, _PosX, _PosY, 255, 120, 120);
                this.MovePict(PN_TSelBtn + i, true, true, 10);
            } else {
                this.SetPictC(PN_TSelBtn + i, _PicStr, _PosX, _PosY);
            }
        }
    }
    return true;
}
Game_Interpreter.prototype.諜報End = function () {
    $gameMessageEx.window(0).terminate(); 
    $gameMessageEx.window(0).permitClose(); 
    this.DelPictSpan(PN_TBase, PN_TSelBtn + 3);
}
const TTPicPath = "pictures/UI_TyohoTop/";
const SW_諜報Top表示 = 49;
const VN_諜報Top変数 = 129; 
const PN_TTBase = 25;
const PN_TTMoku = PN_TTBase + 1;
Game_Interpreter.prototype.諜報_Top_View = function () {
    this.DelPictSpan(PN_TTBase, PN_TTMoku + 5);
    if ($gameSwitches.value(SW_諜報Top表示)){
        this.SetPict(PN_TTBase, TTPicPath + "PN_TTBase", 0, 0);
        for (var i = 0; i <= 6 - 1; i++) {
            if ($gameVariables.value(VN_諜報Top変数 + i) != 0){
                var _ImgStr = "PN_TTMoku" + (i + 1) + "_" + $gameVariables.value(VN_諜報Top変数 + i);
                this.SetPict(PN_TTMoku + i, TTPicPath + _ImgStr, 0, 0);
            }
        }
    }
}
