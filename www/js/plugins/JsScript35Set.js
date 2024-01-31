let SpineLoadFlg = false;
class SpineSave { 
    constructor(_PicNo, _MdlName, _MtnName, _loopflg, _opi) {
        this._PicNo = _PicNo;
        this._MdlName = _MdlName;   
        this._MtnName = _MtnName;   
        this._loopflg = _loopflg;   
        this._opi = _opi;           
    }
}
let ExSpine_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    ExSpine_Game_System_initialize.call(this);
    this.Spine_ViewSave = []; 
};
let Spine_SaveAdd = function (_PicNo, _MdlName, _MtnName, _loopflg, _opi){
    let _sAddFlg = true;
    for (let i = 0; i <= $gameSystem.Spine_ViewSave.length - 1; i++){
        if ($gameSystem.Spine_ViewSave[i]._PicNo == _PicNo){ 
            $gameSystem.Spine_ViewSave[i]._MdlName = _MdlName;
            $gameSystem.Spine_ViewSave[i]._MtnName = _MtnName;
            $gameSystem.Spine_ViewSave[i]._loopflg = _loopflg;
            $gameSystem.Spine_ViewSave[i]._opi = _opi;
            _sAddFlg = false;
        }
    }
    if (_sAddFlg){
        $gameSystem.Spine_ViewSave.push(
            new SpineSave(_PicNo, _MdlName, _MtnName, _loopflg, _opi)
        );
    }
}
let Spine_SaveDel = function (_PicNo) {
    if($gameSystem.Spine_ViewSave == undefined) return;
    for (let i = 0; i <= $gameSystem.Spine_ViewSave.length - 1; i++) {
        if ($gameSystem.Spine_ViewSave[i]._PicNo == _PicNo) {
            $gameSystem.Spine_ViewSave.splice(i, 1);
        }
    }
}
let Spine_erasePicture = Game_Screen.prototype.erasePicture;
Game_Screen.prototype.erasePicture = function (pictureId) {
    Spine_erasePicture.call(this, pictureId);
    Spine_SaveDel(pictureId); 
}
let NupuSpine_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NupuSpine_NUpdate.call(this);
    if (SpineLoadFlg) { 
        for (let i = 0; i <= $gameSystem.Spine_ViewSave.length - 1; i++) {
            this.SpineView(
                $gameSystem.Spine_ViewSave[i]._PicNo,
                $gameSystem.Spine_ViewSave[i]._MdlName,
                $gameSystem.Spine_ViewSave[i]._MtnName,
                $gameSystem.Spine_ViewSave[i]._loopflg,
                true,true,
                $gameSystem.Spine_ViewSave[i]._opi,
                true,true
            );
        }
        SpineLoadFlg = false; 
    }
}
Game_Interpreter.prototype.SpineView = function (PicNo, SpineName, MoveStr, loopflg, setx, sety, opi, mx, my) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    if ($gameScreen.picture(PicNo) != undefined) {
        if (setx == true) setx = $gameScreen.picture(PicNo)._x;
        if (sety == true) sety = $gameScreen.picture(PicNo)._y;
        if (opi == true) opi = $gameScreen.picture(PicNo)._opacity;
        if (mx == true) mx = $gameScreen.picture(PicNo)._scaleX;
        if (my == true) my = $gameScreen.picture(PicNo)._scaleY;
    }
    if (!$mpi.spineData[SpineName]) { 
        console.log("仮ロード処理"); 
        Spn_FileLoad(SpineName);
    }
    loopflg = typeof loopflg !== 'undefined' ? loopflg : true;
    let _LoopStr = "false"
    if (loopflg) {
        _LoopStr = "true";
    }
    let args = new Array(SpineName, MoveStr, _LoopStr);
    this.pluginCommand("ShowSpine", args);
    this.SetPict(PicNo, "", setx, sety, opi, mx, my);
    if(MoveStr != ""){
        this.SetSpineAnime(PicNo , MoveStr , loopflg)
    }
}
Game_Interpreter.prototype.AtcColorCng = function (SpineName, AtcName, Rcol, Gcol, Bcol, Acol) {
    Acol = typeof Acol !== 'undefined' ? Acol : -1;
    try { 
        $mpi.spineData[SpineName].findSlot(AtcName).color.r = Rcol;
        $mpi.spineData[SpineName].findSlot(AtcName).color.g = Gcol;
        $mpi.spineData[SpineName].findSlot(AtcName).color.b = Bcol;
        if (Acol != -1) { 
            $mpi.spineData[SpineName].findSlot(AtcName).color.a = Acol;
        }
    } catch (e) {
        console.log("アタッチメント色変更エラー：" + SpineName + "," + AtcName);
    }
}
Game_Interpreter.prototype.AtcColorCngArr = function (SpineName, _ActArr, Rcol, Gcol, Bcol, Acol){
    for (let i = 0; i <= _ActArr.length - 1; i++) {
        this.AtcColorCng(SpineName, _ActArr[i], Rcol, Gcol, Bcol, Acol);
    }
}
Game_Interpreter.prototype.SpineSetSpeed = function (PicNo, _Speed) {
    _Speed = typeof _Speed !== 'undefined' ? _Speed : 100;
    let _setSpeed = _Speed / 100;
    let args = new Array(String(PicNo), String(_setSpeed));
    this.pluginCommand("SetSpineTimeScale", args);
}
let SpineSkinCnt = 0; 
Game_Interpreter.prototype.SpineSkinCng = function (PicNo) {
    let args = new Array(String(PicNo), String(""));
    this.pluginCommand("SetSpineSkin", args);
    if (SpineSkinCnt <= 0) SpineSkinCnt = 0;
    SpineSkinCnt++;
}
let SpineSkinWait = function(){
    if (SpineSkinCnt <= 0) return false; 
    return true;
}
Game_Interpreter.prototype.SetSpineColor = function (PicNo, Rcol, Gcol, Bcol, Acol) {
    Acol = typeof Acol !== 'undefined' ? Acol : 1;
    let args = new Array(String(PicNo), String(Rcol),
        String(Gcol), String(Bcol), String(Acol));
    this.pluginCommand("SetSpineColor", args);
}
Game_Interpreter.prototype.SetSpineMosaic = function (PicNo, _ImgName , _MSize) {
    _MSize = typeof _MSize !== 'undefined' ? _MSize : 1;
    let args = new Array(String(PicNo), String(_ImgName),String(_MSize));
    this.pluginCommand("SetSpineMosaic", args);
}
let MosErrArr = [];
let _MosOkStac = []; 
Game_Interpreter.prototype._MosErrCover = function () {
    // for (let i = 0; i <= MosErrArr.length - 1; i++) {
    //     this.SetSpineMosaic(MosErrArr[i]._PicNo, MosErrArr[i]._Img, MosErrArr[i]._Size)
}
let MosOkAdd = function (_PicNo, _Img, _Size) {
    let _addFlg = true;
    for (let i = 0; i <= _MosOkStac.length - 1; i++) {
        if (_MosOkStac[i]._PicNo == _PicNo &&
            _MosOkStac[i]._Img == _Img) {
            _addFlg = false; 
        }
    }
    if (_addFlg) _MosOkStac.push(new _Mos(_PicNo, _Img, _Size));
    for (let i = 0; i <= MosErrArr.length - 1; i++) {
        if (MosErrArr[i]._PicNo == _PicNo &&
            MosErrArr[i]._Img == _Img) {
            MosErrArr.splice(i,1);
            return; 
        }
    }
}
let MosErrAdd = function (_PicNo, _Img, _Size){
    for (let i = 0; i <= _MosOkStac.length - 1; i++) {
        if (_MosOkStac[i]._PicNo == _PicNo && 
            _MosOkStac[i]._Img == _Img){
                return; 
        }
    }
    for (let i = 0; i <= MosErrArr.length - 1; i++) {
        if (MosErrArr[i]._PicNo == _PicNo &&
            MosErrArr[i]._Img == _Img) {
            return; 
        }
    }
    MosErrArr.push(new _Mos(_PicNo, _Img, _Size));
}
class _Mos {
    constructor(_PicNo, _Img, _Size) {
        this._PicNo = _PicNo;
        this._Img = _Img;
        this._Size = _Size;
    }
}
class SpinAnime {
    constructor(_PicNo, _MtnName, _loopflg, _Slayer, _Speed) {
        this._PicNo = _PicNo;       
        this._MtnName = _MtnName;   
        this._loopflg = _loopflg;   
        this._Slayer = _Slayer;     
        this._Speed = _Speed;       
    }
}
let SpinAnimePLayer = []; 
let AddSpinAnimePLayer = function (PicNo, Action, loopflg, Slayer, _Speed) {
    let spladdflg = true;
    for (let i = 0; i <= SpinAnimePLayer.length - 1; i++) {
        if (SpinAnimePLayer[i]._PicNo == PicNo) {
            if (SpinAnimePLayer[i]._MtnName == Action) {
                SpinAnimePLayer[i]._loopflg = loopflg;
                SpinAnimePLayer[i]._Slayer = Slayer;
                SpinAnimePLayer[i]._Speed = _Speed;
                spladdflg = false;
            }
        }
    }
    if (spladdflg) {
        SpinAnimePLayer.push(new SpinAnime(PicNo, Action, loopflg, Slayer, _Speed));
    }
}
let AddSpineAnimeCheck = function (PicNo) {
    let outArr = [];
    for (let i = 0; i <= SpinAnimePLayer.length - 1; i++) {
        if (SpinAnimePLayer[i]._PicNo == PicNo) {
            if(outArr.length == 0){
                outArr.push(SpinAnimePLayer[i]);
            } else {
                let _addFlg = false;
                for (let j = 0; j <= outArr.length - 1; j++) {
                    if(outArr[j]._Slayer == SpinAnimePLayer[i]._Slayer) {
                        _addFlg = true;
                        outArr[j] = SpinAnimePLayer[i];
                        break;
                    }
                    if(outArr[j]._Slayer > SpinAnimePLayer[i]._Slayer){
                        _addFlg = true;
                        outArr.splice(j , 0 , SpinAnimePLayer[i]);
                        break;
                    }
                }
                if (!_addFlg) {
                    outArr.push(SpinAnimePLayer[i]);
                }
            }
        }
    }
    return outArr;
}
let delSpinAnimePLayer = function (PicNo, Slayer) {
    Slayer = typeof Slayer !== 'undefined' ? Slayer : -1;
    let outArr = [];
    for (let i = 0; i <= SpinAnimePLayer.length - 1; i++) {
        if (SpinAnimePLayer[i]._PicNo == PicNo) {
            if (SpinAnimePLayer[i]._Slayer == Slayer) {
                SpinAnimePLayer.splice(i , 1);
                i--;
            } else {
                outArr.push(SpinAnimePLayer[i]);
            }
        } else {
            outArr.push(SpinAnimePLayer[i]);
        }
    }
    SpinAnimePLayer = outArr;
}
let Spine_Anime_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Spine_Anime_initialize.call(this);
    this.SpineAnimeApr = []; 
}
Game_Interpreter.prototype.SetSpineAnime = function (PicNo, Action, loopflg, Slayer, _Speed) {
    loopflg = typeof loopflg !== 'undefined' ? loopflg : true;
    Slayer = typeof Slayer !== 'undefined' ? Slayer : -1;
    _Speed = typeof _Speed !== 'undefined' ? _Speed : 100;
    _Speed /= 100;
    if (Slayer == -1) {
        Slayer = counter(Action, "/");
    }
    let tlstr = "true";
    if (loopflg) {
        tlstr = "true";
    } else {
        tlstr = "false";
    }
    AddSpinAnimePLayer(PicNo, Action, loopflg, Slayer, _Speed);
    if(Slayer != 0 && loopflg) {
    }
    let args = new Array(String(PicNo), String(Action), tlstr);
    this.pluginCommand("SetSpineAnimation", args);
};
Game_Interpreter.prototype.MixSetting = function (PicNo, Action, MxTime) {
    let args = new Array(String(PicNo), "", String(Action), String(MxTime / 60));
    this.pluginCommand("SetSpineMix", args);
}
Game_Interpreter.prototype.SetSpineMixAnime = function (PicNo, ActionA, AncitonB, CFlame, loopflg, Slayer) {
    loopflg = typeof loopflg !== 'undefined' ? loopflg : true;
    Slayer = typeof Slayer !== 'undefined' ? Slayer : -1;
    if (Slayer == -1) {
        Slayer = counter(Action, "/");
    }
    let tlstr = "true";
    if (loopflg) {
        tlstr = "true";
    } else {
        tlstr = "false";
    }
    let args = new Array(String(PicNo), String(ActionA), String(AncitonB), String(CFlame / 60));
    this.pluginCommand("SetSpineMix", args);
    args = new Array(String(PicNo), String(AncitonB), tlstr);
    this.pluginCommand("SetSpineAnimation", args);
};
Game_Interpreter.prototype.AddSpineAnime = function (PicNo, Action, loopflg, Slayer, _Speed) {
    loopflg = typeof loopflg !== 'undefined' ? loopflg : true;
    Slayer = typeof Slayer !== 'undefined' ? Slayer : -1;
    _Speed = typeof _Speed !== 'undefined' ? _Speed : 100;
    _Speed /= 100;
    if (Slayer == -1) {
        Slayer = counter(Action, "/");
    }
    let tlstr = "true";
    if (loopflg) {
        tlstr = "true";
    } else {
        tlstr = "false";
    }
    AddSpinAnimePLayer(PicNo, Action, loopflg, Slayer, _Speed);
    let args = new Array(String(PicNo), String(Action), tlstr);
    this.pluginCommand("AddSpineAnimation", args);
};
let CharaLeftPos = 0;
Game_Interpreter.prototype.SpineViewFIn = function (PicNo, SpineName, MoveStr, loopflg, x, y, _timer, mx, my) {
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    this.SpineView(PicNo, SpineName, MoveStr, loopflg, x, y, 255, mx , my);
    this.SetSpineColor(PicNo, 1, 1, 1, 0); 
    let _addflg = true;
    for (let i = 0; i <= SpineFadeTimer.length - 1; i++){
        if (SpineFadeTimer[i][0] == PicNo){
            _addflg = false;
            SpineFadeTimer[i][1] = 1 / _timer;
            SpineFadeTimer[i][2] = 0;
        }
    }
    if (_addflg) SpineFadeTimer.push([PicNo, 1 / _timer,0]);
}
Game_Interpreter.prototype.SpineViewFOut = function (PicNo , _timer) {
    this.SetSpineColor(PicNo, 1, 1, 1, 1); 
    let _addflg = true;
    for (let i = 0; i <= SpineFadeTimer.length - 1; i++) {
        if (SpineFadeTimer[i][0] == PicNo) {
            _addflg = false;
            SpineFadeTimer[i][1] = -(1 / _timer);
            SpineFadeTimer[i][2] = 1;
        }
    }
    if (_addflg) SpineFadeTimer.push([PicNo , -(1 / _timer) , 1]);
    Spine_SaveDel(PicNo);
}
let SpineFadeTimer = []; 
let Nupu_SpineFadeUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_SpineFadeUpdate.call(this);
    let _OutArr = [];
    for (let i = 0; i <= SpineFadeTimer.length - 1; i++) {
        let PicNo = SpineFadeTimer[i][0];
        SpineFadeTimer[i][2] += SpineFadeTimer[i][1];
        if (SpineFadeTimer[i][2] <= 0) SpineFadeTimer[i][2] = 0;
        if (SpineFadeTimer[i][2] >= 1) SpineFadeTimer[i][2] = 1;
        this.SetSpineColor(PicNo, 1, 1, 1, SpineFadeTimer[i][2]); 
        if (SpineFadeTimer[i][2] <= 0 || SpineFadeTimer[i][2] >= 1){
        } else {
            _OutArr.push(SpineFadeTimer[i]);
        }
    }
    SpineFadeTimer = _OutArr;
    this._MosErrCover(); 
}
let SpnLoadKeep = []; 
let Action_Wait = []; 
let Spn_FileLoad = function (loadName) {
    if(SpnLoadKeep.indexOf(loadName) != -1) {
        console.log("ロード命令済み");
        return;
    }
    SpnLoadKeep.push(loadName);
    if ($mpi.spineData[loadName] != null){
        console.log("Spineモデルロード済み");
        return;
    }
    let loader = new PIXI.loaders.Loader();
    //let name = loadName.replace(/^.*\//, '').replace(/\.json$/, '');
    $mpi.spineData[loadName] = null;
    loader = loader.add(loadName, 'img/spines/' + loadName.replace(/^\//, '').replace(/\.json$/, '') + '.json');
    loader.load(
        function (loader, resource) {
            Object.keys(resource).forEach(function (key) {
                if (resource[key].spineData) {
                    $mpi.spineData[key] = resource[key].spineData;
                }
            });
            if (Object.keys($mpi.spineData).some(function (key) {
                return !$mpi.spineData[key];
            })) {
                loader.reset();
                //loadSpine(); //存在しない項目を読み込もうとするとエラーになる。
            }
        }
    )
};
let Spn_LoadingCk = function(_ckName){
    for (let i = 0; i <= SpnLoadKeep.length - 1; i++) {
        if($mpi.spineData[SpnLoadKeep[i]] == null) return true;
    }
    return false;
}
let Spn_AnimeCk = function(_ckName , _ckMtn){
    if($mpi.spineData[_ckName] != null){
        for (let i = 0; i <= $mpi.spineData[_ckName].animations.length - 1; i++) {
            if($mpi.spineData[_ckName].animations[i].name == _ckMtn) return true;
        }
    }
    return false;
}
class SpineSkin { 
    constructor(_MdlName, _SkinName, _Class) {
        this._MdlName = _MdlName;   
        this._SkinName = _SkinName; 
        this._Class = _Class;       
    }
}
let Spine_Skin_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Spine_Skin_initialize.call(this);
    this.SpineSkinApr = []; 
}
Game_Interpreter.prototype.AddSpineSkin = function (SpineName, AddSkinName, Bnrui) {
    Bnrui = typeof Bnrui !== 'undefined' ? Bnrui : "";
    if (Bnrui == "") {
        if (AddSkinName.indexOf('/') != -1) {
            let AutoBunrui = AddSkinName.slice(0, AddSkinName.indexOf('/'));
            Bnrui = AutoBunrui;
        }
    }
    let newFlg = true;
    for (let i = 0; i <= $gameSystem.SpineSkinApr.length - 1; i++) {
        if (Bnrui == "") { 
            if ($gameSystem.SpineSkinApr[i]._MdlName == SpineName && $gameSystem.SpineSkinApr[i]._SkinName == AddSkinName) {
                newFlg = false;
            }
        } else {
            if ($gameSystem.SpineSkinApr[i]._MdlName == SpineName && $gameSystem.SpineSkinApr[i]._Class == Bnrui) {
                newFlg = false;
                $gameSystem.SpineSkinApr[i]._SkinName = AddSkinName; 
            }
        }
    }
    if (newFlg) {
        $gameSystem.SpineSkinApr.push(new SpineSkin(SpineName, AddSkinName, Bnrui));
    }
};
Game_Interpreter.prototype.SpineSkinReset = function () {
    $gameSystem.SpineSkinApr = [];
};
Game_Interpreter.prototype.delSpineSkin = function (SpineName, delSkinName) {
    delSkinName = typeof delSkinName !== 'undefined' ? delSkinName : "";
    let outArr = [];
    for (let i = 0; i <= $gameSystem.SpineSkinApr.length - 1; i++) {
        let delflg = false;
        if (SpineName == $gameSystem.SpineSkinApr[i]._MdlName) {
            if (delSkinName == "" || delSkinName == $gameSystem.SpineSkinApr[i]._SkinName) {
                delflg = true;
            }
        }
        if (!delflg) {
            outArr.push($gameSystem.SpineSkinApr[i]);
        }
    }
    $gameSystem.SpineSkinApr = outArr;
};
Game_Interpreter.prototype.delSpineSkinMdl = function (SpineName) {
    for (let i = 0; i <= $gameSystem.SpineSkinApr.length - 1; i++) {
        if (SpineName == $gameSystem.SpineSkinApr[i]._MdlName) {
            $gameSystem.SpineSkinApr.splice(i, 1);
            i--;
        }
    }
}
Game_Interpreter.prototype.delSpineSkinGrp = function (SpineName, delSkinName) {
    delSkinName = typeof delSkinName !== 'undefined' ? delSkinName : "";
    let outArr = [];
    for (let i = 0; i <= $gameSystem.SpineSkinApr.length - 1; i++) {
        let delflg = false;
        if (SpineName == $gameSystem.SpineSkinApr[i]._MdlName) {
            if (delSkinName == "" || delSkinName == $gameSystem.SpineSkinApr[i]._Class) {
                delflg = true;
            }
        }
        if (!delflg) {
            outArr.push($gameSystem.SpineSkinApr[i]);
        }
    }
    $gameSystem.SpineSkinApr = outArr;
};
let Spine_EvName = []; 
let CkSpineEv = function (_ckName) {
    let _rtnFlg = false;
    for (let i = 0; i <= Spine_EvName.length - 1; i++) {
        if (Spine_EvName[i] == _ckName){
            _rtnFlg = true;
            console.log(_ckName);
            break;
        }
    }
    return _rtnFlg; 
} 
let SpineEvArrReset = function(){
    Spine_EvName = []; 
}
