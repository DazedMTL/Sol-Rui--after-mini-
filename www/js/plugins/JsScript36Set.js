const TitlePicPath = "pictures/Title/";
const PN_titleBase = 125;
const PN_titleMain = PN_titleBase + 1;
const PN_titleLogo = PN_titleMain + 1;
const PN_titleNewgame = PN_titleLogo + 1;
const PN_titleContinue = PN_titleNewgame + 1;
const PN_titleOption = PN_titleContinue + 1;
const PN_titleStartBlack = PN_titleOption + 1;
let TitleSelectNo = 0;
let Title_NewGame選択 = false;
Game_Interpreter.prototype.Title_BlackDel = function () {
    this.DelPictSpan(PN_titleBase , PN_titleStartBlack);
}
let TitleFlame = 0;
var EmTitleMode = {
    Setup: 1 ,
    Select: 2 ,
    End: 3
}
let TitleMode = EmTitleMode.Setup;
Game_Interpreter.prototype.Title_ModeCng = function (setMode) {
    TitleFlame = 0;
    TitleMode = setMode;
}
var EmTitleSelectMode = {
    Start: 1 ,
    Continue: 2 ,
    Option: 3
}
Game_Interpreter.prototype.TitleUpdate = function () {
    switch (TitleMode) {
        case EmTitleMode.Setup: this.Title_SetupUpdate();
        break;
        case EmTitleMode.Select: this.Title_SelectUpdate();
        break;
        case EmTitleMode.End:
            break;
    }
    TitleFlame++;
}
Game_Interpreter.prototype.Title_SetupUpdate = function () {
    console.log("Title_SetupUpdate");
    if (TitleFlame == 1) {
        if (DataManager.isAnySavefileExists()) { 
            TitleFstSelectNo = TitleSelectNo = 1;
        }
        this.Title_初期画像準備();
    }
    if (TitleFlame == 10) this.MovePict(PN_titleBase , 0 , 0 , 10);
    if (TitleFlame == 20) this.MovePict(PN_titleMain , 0 , 0 , 30);
    if (TitleFlame == 40) this.MovePict(PN_titleLogo , 0 , 0 , 60);
    if (TitleFlame == 60) this.MovePict(PN_titleNewgame , 0 , 0 , 30);
    if (TitleFlame == 70) this.MovePict(PN_titleContinue , 0 , 0 , 30);
    if (TitleFlame == 80) this.MovePict(PN_titleOption , 0 , 0 , 30);
    if (TitleFlame == 85) this.Title_ModeCng(EmTitleMode.Select);
}
let TitleFstSelectNo = 0;
Game_Interpreter.prototype.Title_初期画像準備 = function () {
    this.SetPict(PN_titleBase, TitlePicPath + "PN_titleBase", 0, 0, 0);
    this.SetPict(PN_titleMain, TitlePicPath + "PN_titleMain", -20, 0, 0);
    this.SetPict(PN_titleLogo, TitlePicPath + "PN_titleLogo", 0, -20, 0);
    let setPicName = "";
    setPicName = "PN_titleNewgame"; if (TitleFstSelectNo == 0) setPicName += "_S";
    this.SetPict(PN_titleNewgame, TitlePicPath + setPicName, -30, 0, 0);
    setPicName = "PN_titleContinue"; if (TitleFstSelectNo == 1) setPicName += "_S";
    this.SetPict(PN_titleContinue, TitlePicPath + setPicName, -30, 0, 0);
    setPicName = "PN_titleOption"; if (TitleFstSelectNo == 2) setPicName += "_S";
    this.SetPict(PN_titleOption, TitlePicPath + setPicName, -30, 0, 0);
    this.SetPict(PN_titleStartBlack , TitlePicPath + "PN_titleStartBlack" , -2600 , 0);
}
Game_Interpreter.prototype.Title_SelectUpdate = function () {
    let okFlg = false;
    let cngFLg = false;
    let ckNo = overPointerCkArrTm([PN_titleNewgame , PN_titleContinue , PN_titleOption]);
    if (ckNo != -1 && TouchInput.isTriggered()) okFlg = true;
    if (TitleSelectNo != ckNo - PN_titleNewgame && ckNo != -1) {
        TitleSelectNo = ckNo - PN_titleNewgame;
        cngFLg = true;
    }
    if (Input.isTriggered('ok')) {
        okFlg = true;
    }
    if (Input.isTriggered('up')) {
        TitleSelectNo--;
        cngFLg = true;
    }
    if (Input.isTriggered('down')) {
        TitleSelectNo++;
        cngFLg = true;
    }
    if (TitleSelectNo <= -1) TitleSelectNo = 2;
    if (TitleSelectNo > 2) TitleSelectNo = 0;
    if (okFlg) {
        switch (TitleSelectNo) {
            case 0:
                Title_NewGame選択 = true;
                this.MovePict(PN_titleStartBlack , -600 , 0 , 15);
                break;
            case 1:
                SceneManager.push(Scene_Load);
                break;
            case 2:
                SceneManager.push(Scene_Options);
                break;
        }
    }
    if (cngFLg) {
        SoundManager.playCursor();
        let setPicName = "";
        setPicName = "PN_titleNewgame"; if (TitleSelectNo == 0) setPicName += "_S";
        this.SetPict(PN_titleNewgame, TitlePicPath + setPicName, 0, 0);
        setPicName = "PN_titleContinue"; if (TitleSelectNo == 1) setPicName += "_S";
        this.SetPict(PN_titleContinue, TitlePicPath + setPicName, 0, 0);
        setPicName = "PN_titleOption"; if (TitleSelectNo == 2) setPicName += "_S";
        this.SetPict(PN_titleOption, TitlePicPath + setPicName, 0, 0);
    }
}
