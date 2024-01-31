const PN_UI_振り払い_裏地 = 105;
const PN_UI_振り払い_ゲージ = PN_UI_振り払い_裏地 + 1;
const PN_UI_振り払い_枠 = PN_UI_振り払い_ゲージ + 1;
const PN_UI_振り払い_ボタン = PN_UI_振り払い_枠 + 1;
const VN_QTE最大値 = 202;
const VN_QTE初期値 = 203;
const VN_QTE減少速度倍率 = 204;
const VN_QTE現在値 = 205;
Game_Interpreter.prototype.SolQteStart = function () {
    this.SetPict( PN_UI_振り払い_裏地 , "UI_Huriharai_Back" , 600 , 400);
    this.SetPict( PN_UI_振り払い_ゲージ , "UI_Huriharai_Gage" , 603 , 403 ,
        255 , ($gameVariables.value(VN_QTE初期値) / $gameVariables.value(VN_QTE最大値)) * 100);
    this.SetPict( PN_UI_振り払い_枠 , "UI_Huriharai_Waku" , 600 , 400);
    sQteFlame = 0;
    sQteBtnNo = Math.floor(Math.random() * 4) + 1;
    this.SolQteBtnDraw();
    sQte現在値 = $gameVariables.value(VN_QTE初期値);
    sQte減少値 = (10 / 60) * ($gameVariables.value(VN_QTE減少速度倍率) / 5);
}
Game_Interpreter.prototype.SolQteEnd = function () {
    this.DelPictSpan(PN_UI_振り払い_裏地 , PN_UI_振り払い_ボタン);
}
Game_Interpreter.prototype.SolQteBtnDraw = function () {
    let btnPicName = "";
    switch (sQteBtnNo) {
        case EnsQteBtnNo._Z: btnPicName = "UI_Huriharai_Btn";
            break;
        case EnsQteBtnNo._Right: btnPicName = "UI_Huriharai_BtnR";
            break;
        case EnsQteBtnNo._Down: btnPicName = "UI_Huriharai_BtnD";
            break;
        case EnsQteBtnNo._Left: btnPicName = "UI_Huriharai_BtnL";
            break;
        case EnsQteBtnNo._Up: btnPicName = "UI_Huriharai_BtnT";
            break;
    }
    let btnAddStr = "A";
    if (sQteFlame % 15 > 5) btnAddStr = "B";
    if (sQteFlame % 15 > 10) btnAddStr = "C";
    this.SetPict( PN_UI_振り払い_ボタン , btnPicName + btnAddStr , 694 , 291);
}
var sQteFlame = 0;
var sQteBtnNo = 0;
var EnsQteBtnNo = {
    _Z: 0,
    _Right: 1,
    _Down: 2,
    _Left: 3,
    _Up: 4
};
var sQte入力成功Flg = false;
var sQteミスFlg = false;
var sQte現在値 = 0;
var sQte減少値 = 0;
var sQteEnd成功Flg = false;
Game_Interpreter.prototype.SolQteUpdate = function () {
    sQte減少値 = (10 / 60) * ($gameVariables.value(VN_QTE減少速度倍率) / 5);
    sQte入力成功Flg = false;
    sQteミスFlg = false;
    let ckInputNo = -1;
    if(Input.isTriggered('ok')) ckInputNo = EnsQteBtnNo._Z;
    if(Input.isTriggered('right')) ckInputNo = EnsQteBtnNo._Right;
    if(Input.isTriggered('down')) ckInputNo = EnsQteBtnNo._Down;
    if(Input.isTriggered('left')) ckInputNo = EnsQteBtnNo._Left;
    if(Input.isTriggered('up')) ckInputNo = EnsQteBtnNo._Up;
    if (ckInputNo != -1){
        sQte入力成功Flg = ckInputNo == sQteBtnNo;
        sQteミスFlg = !sQte入力成功Flg
    }
    this.SolQteBtnDraw();
    sQte現在値 -= sQte減少値;
    if(sQte現在値 < 0) sQte現在値 = 0;
    if(sQte現在値 > $gameVariables.value(VN_QTE最大値)) sQte現在値 = $gameVariables.value(VN_QTE最大値);
    this.SetPict( PN_UI_振り払い_ゲージ , "UI_Huriharai_Gage" , 603 , 403 ,
        255 , sQte現在値 / $gameVariables.value(VN_QTE最大値) * 100);
    sQteFlame++;
    if (sQte現在値 <= 0) {
        sQteEnd成功Flg = false;
        $gameVariables.setValue(VN_QTE現在値 , sQte現在値);
        return false;
    }
    if (sQte現在値 >= $gameVariables.value(VN_QTE最大値)) {
        sQteEnd成功Flg = true;
        $gameVariables.setValue(VN_QTE現在値 , sQte現在値);
        return false;
    }
    $gameVariables.setValue(VN_QTE現在値 , sQte現在値);
    return true; 
}
Game_Interpreter.prototype.SolQteValueCng = function (value) {
    sQte現在値 += value;
}
Game_Interpreter.prototype.SolQteNextKeySet = function () {
    sQteBtnNo = Math.floor(Math.random() * 4) + 1;
}
