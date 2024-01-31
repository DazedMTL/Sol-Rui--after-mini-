/*:ja
 * @plugindesc 
 */
const SlayPicPath = "pictures/slaySystem/";
const PN_slayBase = 125;
const PN_slayEv = PN_slayBase + 1;
const PN_slayPlayer = PN_slayEv + 60;
const PN_slayMovePin = PN_slayPlayer + 1;
const CN_slayCmn = 590;
let SlaySystem_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    SlaySystem_Initialize.call(this);
    this.slaySystem = null; 
    this.SlayMapArr = [];   
};
class SlayMapData {
    constructor(types , types確率s , nextNos, positon) {
        this.type = "";
        this.types = types;
        this.types確率s = types確率s;
        this.nextNos = nextNos; 
        this.postion = positon;
        this.picNo = -1;
    }
    SetType() {
        let rndVar = Math.random() * 100;
        let ckValue = 0;
        for (let i = 0; i < this.types確率s.length; i++) {
            ckValue += this.types確率s[i];
            if (ckValue > rndVar) {
                this.type = this.types[i];
                break;
            }
        }
        if (this.type == "") {
            this.type = this.types[i];
        }
    }
    GetPicPath() {
        if (this.type == EnSlay.Event) return "Icon_Event";
        if (this.type == EnSlay.戦闘) return "Icon_Btl";
        if (this.type == EnSlay.戦闘エリート) return "Icon_BtlElt";
        if (this.type == EnSlay.ボス) return "Icon_Boss";
        if (this.type == EnSlay.商人) return "Icon_Shop";
        if (this.type == EnSlay.回復) return "Icon_Kaifuku";
        if (this.type == EnSlay.宝箱) return "Icon_Box";
        return "Icon_Not";
    }
}
var EnSlay = {
    開始: 0,
    Event: 1,
    戦闘: 4,
    戦闘エリート: 41,
    ボス: 5,
    商人: 6,
    回復: 7,
    宝箱: 8
};
let slyaPicGet = function (slayNo) {
    if (slayNo == EnSlay.開始) return;
}
let SlayMapArrSetting = function () {
    $gameSystem.SlayMapArr = [];
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.ボス] , [100], [-1], [391, 101])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.商人],[100], [0], [243, 281]),
        new SlayMapData([EnSlay.回復],[100], [0], [538, 287])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event] , [90,10], [0], [87, 469]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[80,20], [0,1], [390, 467]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.宝箱],[20,80], [1], [680, 469])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.回復 , EnSlay.Event],[30,40,30], [0,1], [246, 650]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event , EnSlay.商人],[20,70,10], [1,2], [536, 650])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘] , [100], [0,1], [242, 835]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[40,60], [1], [537, 835])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.回復 , EnSlay.Event],[50,10,40], [0], [242, 1020]),
        new SlayMapData([EnSlay.戦闘],[100], [0, 1], [537, 1017])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘エリート],[100], [0,1], [391, 1200])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.宝箱],[100], [0], [389, 1383])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[60,40], [0], [243, 1567]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[40,60], [0], [536, 1567])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘],[100], [0, 1], [389, 1752])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.商人],[100], [0], [389, 1943])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘],[100], [0], [142, 2124]),
        new SlayMapData([EnSlay.回復],[100], [0], [389, 2124]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.回復],[80,20], [0], [637, 2124])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.宝箱 , EnSlay.Event],[60,40], [0], [142, 2303]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[50,50], [1], [389, 2303]),
        new SlayMapData([EnSlay.戦闘],[100], [2], [637, 2303])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event , EnSlay.回復],[20,70,10], [0], [142, 2492]),
        new SlayMapData([EnSlay.戦闘],[100], [1], [389, 2492]),
        new SlayMapData([EnSlay.宝箱 , EnSlay.Event],[60,40], [2], [637, 2492])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[50,50], [0,1,2], [389, 2673])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.宝箱],[100], [0], [389, 2850])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘],[100], [0], [389, 3048])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[30,70], [0], [246, 3225]),
        new SlayMapData([EnSlay.戦闘],[100], [0], [533, 3225])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.回復 , EnSlay.商人],[50,50], [0], [246, 3405]),
        new SlayMapData([EnSlay.Event],[100], [0,1], [533, 3405])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘],[100], [0, 1], [246, 3591]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event , EnSlay.回復],[60,30,10], [1], [533, 3591])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘],[100], [0, 1], [390, 3769])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.Event , EnSlay.宝箱],[50,50], [0], [390, 3955])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[70,30], [0], [245, 4140]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[80,20], [0], [533, 4143])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[80,20], [0], [245, 4323]),
        new SlayMapData([EnSlay.戦闘 , EnSlay.Event],[70,30], [1], [533, 4323])]);
    $gameSystem.SlayMapArr.unshift([
        new SlayMapData([-1],[100], [0, 1], [390, 4505])]);
}
const slyaMapSizeX = 759;
const slyaMapSizeY = 3817;
let EnSlayPhase = {
    Start: 1,
    Select: 2,
    Move: 3,
    Event: 4
};
class SlaySystemClass { 
    constructor() {
        this.playFlg = false;
        this.stop = true;
        this.phase = EnSlayPhase.Start;
        this.phaseFlame = 0;
        this.mapRowNo = 0;  
        this.mapColNo = 0;  
        this.selectNo = 0;
        this.selectNo_Bef = 0;
        this.pinX = 438;
        this.pinY = 602;
        this.befSelectData = null;
    }
    Reset() {
        this.stop = true;
        this.phase = EnSlayPhase.Start;
        this.phaseFlame = 0;
        this.mapRowNo = 0;  
        this.mapColNo = 0;  
        this.selectNo = 0;
        this.selectNo_Bef = 0;
        this.pinX = 438;
        this.pinY = 602;
    }
}
let SlaySystem_CngPhase = function (phase) {
    $gameSystem.slaySystem.phaseFlame = 0;
    $gameSystem.slaySystem.phase = phase;
}
let SlayEvent種類 = "";
Game_Interpreter.prototype.SlaySystem_Start = function () {
    $gameSystem.slaySystem = new SlaySystemClass();
    $gameSystem.slaySystem.playFlg = true;
    $gameSystem.slaySystem.Reset();
    SlayMapArrSetting();
    this.SlaySystem_Draw();
    $gameSystem.slaySystem.stop = false;
}
Game_Interpreter.prototype.SlaySystem_End = function () {
    if ($gameSystem.slaySystem == undefined) return; 
    try {
        $gameSystem.slaySystem.playFlg = false;
        $gameSystem.slaySystem.stop = true;
        this.SlaySystem_Clear(true);
    } catch (e) {
        console.log("SlaySystem_End::ErrSkip");
    }
}
Game_Interpreter.prototype.SlaySystem_EventEnd = function () {
    SlaySystem_CngPhase(EnSlayPhase.Select); 
}
Game_Interpreter.prototype.SlaySystem_Draw = function () {
    if (!$gameSystem.slaySystem.playFlg) return;
    let setData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo];
    let setX = -setData.postion[0] + $gameSystem.slaySystem.pinX;
    let setY = -setData.postion[1] + $gameSystem.slaySystem.pinY;
    this.SetPict(PN_slayBase, SlayPicPath + "MapRoot", setX, setY);
    let picCount = 0;
    $gameSystem.SlayMapArr.forEach(ckMapData => {
        ckMapData.forEach(ckData => {
            ckData.SetType();
            ckData.picNo = picCount + PN_slayEv;
            picCount++;
            this.SetPictC(ckData.picNo, SlayPicPath + ckData.GetPicPath(),
                ckData.postion[0] + setX, ckData.postion[1] + setY);
        });
    });
    this.SetPictC(PN_slayPlayer, SlayPicPath + "Player_Pin",
        $gameSystem.slaySystem.pinX, $gameSystem.slaySystem.pinY - 30);
}
let befMapPosX = 0;
let befMapPosY = 0;
Game_Interpreter.prototype.SlaySystem_Clear = function (delFlg) {
    var delFlg = typeof delFlg !== 'undefined' ? delFlg : false;
    let ckData = this.PicObjGet(PN_slayBase);
    befMapPosX = ckData._x;
    befMapPosY = ckData._y;
    for (let i = PN_slayBase; i <= PN_slayMovePin; i++) {
        if (delFlg)
            this.DelPict(i);
        else
            this.MovePict(i, true, true, 10, 0);
    }
}
Game_Interpreter.prototype.SlaySystem_ReDraw = function () {
    if (!$gameSystem.slaySystem.playFlg) return;
    for (let i = PN_slayBase; i <= PN_slayMovePin; i++) {
        this.MovePict(i, true, true, 10, 255);
    }
    this.SetPict(PN_slayBase, SlayPicPath + "MapRoot", befMapPosX, befMapPosY , 0);
    this.MovePict(PN_slayBase, true, true, 10, 255);
}
let SlaySystem_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    SlaySystem_Update.call(this);
    if ($gameSystem.slaySystem != null) {
        if (!$gameSystem.slaySystem.stop && $gameSystem.slaySystem.playFlg) {
            switch ($gameSystem.slaySystem.phase) {
                case EnSlayPhase.Start:
                    this.SlaySystem_Start_Update();
                    break;
                case EnSlayPhase.Select: 
                    this.SlaySystem_Select_Update();
                    break;
                case EnSlayPhase.Move:
                    this.SlaySystem_Move_Update();
                    break;
                case EnSlayPhase.Event:
                    this.SlaySystem_Event_Update();
                    break;
            }
            $gameSystem.slaySystem.phaseFlame++;
        }
    }
}
Game_Interpreter.prototype.SlaySystem_Start_Update = function () {
    if ($gameSystem.slaySystem.phaseFlame == 60) SlaySystem_CngPhase(EnSlayPhase.Select);
}
Game_Interpreter.prototype.SlaySystem_Select_Update = function () {
    if ($gameSystem.slaySystem.phaseFlame == 1) {
        let fstCol = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo].nextNos[0];
        $gameSystem.slaySystem.selectNo = 0;
        $gameSystem.slaySystem.selectNo_Bef = 0;
        let setData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo + 1][fstCol];
        this.SetPictC(PN_slayMovePin, SlayPicPath + "Cursol_Pin",
            $gameScreen.picture(setData.picNo)._x, $gameScreen.picture(setData.picNo)._y - 30);
        this.PicCngColor(setData.picNo, [75, 75, 75, 0]);
    }
    let okFlg = false;
    let plusNo = 0;
    if (Input.isTriggered('left')) plusNo = -1;
    if (Input.isTriggered('right')) plusNo = 1;
    if (plusNo != 0) {
        let ckArr = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo].nextNos;
        $gameSystem.slaySystem.selectNo += plusNo;
        if ($gameSystem.slaySystem.selectNo < 0)
            $gameSystem.slaySystem.selectNo = ckArr.length - 1;
        if ($gameSystem.slaySystem.selectNo >= ckArr.length)
            $gameSystem.slaySystem.selectNo = 0;
    }
    if (Input.isTriggered('ok')) okFlg = true;
    if ($gameSystem.slaySystem.selectNo_Bef != $gameSystem.slaySystem.selectNo) {
        $gameSystem.slaySystem.selectNo_Bef = $gameSystem.slaySystem.selectNo;
        for (let i = PN_slayBase; i <= PN_slayPlayer; i++) this.PicCngColor(i);
        let ckArr = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo].nextNos;
        let setData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo + 1][ckArr[$gameSystem.slaySystem.selectNo]];
        this.SetPictC(PN_slayMovePin, SlayPicPath + "Cursol_Pin",
            $gameScreen.picture(setData.picNo)._x, $gameScreen.picture(setData.picNo)._y - 30);
        this.PicCngColor(setData.picNo, [75, 75, 75, 0]);
    }
    if (okFlg) {
        let ckArr = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo].nextNos;
        for (let i = PN_slayBase; i <= PN_slayPlayer; i++) this.PicCngColor(i);
        this.DelPict(PN_slayMovePin);
        $gameSystem.slaySystem.befSelectData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo];
        $gameSystem.slaySystem.mapRowNo++;
        $gameSystem.slaySystem.mapColNo = ckArr[$gameSystem.slaySystem.selectNo];
        $gameSystem.slaySystem.selectNo = 0;
        SlaySystem_CngPhase(EnSlayPhase.Move);
    }
}
Game_Interpreter.prototype.SlaySystem_Move_Update = function () {
    if ($gameSystem.slaySystem.phaseFlame == 1) {
        let setData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo];
        this.MovePict(PN_slayPlayer,
            $gameScreen.picture(setData.picNo)._x, $gameScreen.picture(setData.picNo)._y - 30,
            30);
    }
    if ($gameSystem.slaySystem.phaseFlame == 30) {
        let setData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo];
        let moveY = $gameSystem.slaySystem.befSelectData.postion[1] - setData.postion[1];
        this.MovePictAdd(PN_slayBase, true, moveY, 30);
        $gameSystem.SlayMapArr.forEach(ckMapData => {
            ckMapData.forEach(ckData => {
                this.MovePictAdd(ckData.picNo, true, moveY, 30);
            });
        });
        this.MovePictAdd(PN_slayPlayer, true, moveY, 30);
    }
    if ($gameSystem.slaySystem.phaseFlame == 90) {
        let ckData = $gameSystem.SlayMapArr[$gameSystem.slaySystem.mapRowNo][$gameSystem.slaySystem.mapColNo];
        SlayEvent種類 = "";
        if (ckData.type == EnSlay.Event) {
            switch (Math.floor(Math.random() * 3)) {
                case 0: SlayEvent種類 = "GoodEv";
                    break;
                case 1: SlayEvent種類 = "BadEv";
                    break;
                case 2: SlayEvent種類 = "特殊Ev";
                    break;
            }
        }
        if (ckData.type == EnSlay.戦闘) SlayEvent種類 = "戦闘";
        if (ckData.type == EnSlay.戦闘エリート) SlayEvent種類 = "戦闘エリート";
        if (ckData.type == EnSlay.ボス) SlayEvent種類 = "ボス";
        if (ckData.type == EnSlay.商人) SlayEvent種類 = "商人";
        if (ckData.type == EnSlay.回復) SlayEvent種類 = "回復";
        if (ckData.type == EnSlay.宝箱) SlayEvent種類 = "宝箱";
        if (SlayEvent種類 != "") {
            this.SetCmnEventSc(CN_slayCmn);
            SlaySystem_CngPhase(EnSlayPhase.Event);
        } else {
            SlaySystem_CngPhase(EnSlayPhase.Select);
        }
    }
}
Game_Interpreter.prototype.SlaySystem_Event_Update = function () {
}
