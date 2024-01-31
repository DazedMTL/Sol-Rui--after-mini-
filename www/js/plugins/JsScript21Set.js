/*:
 * @plugindesc 
 * @author Nupuryu
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author Nupuryu
 *
 * @help 
 */
var voiceOnFlg = false;
var voiceCname = "";
Game_Interpreter.prototype.PVoice = function (cname, vname) {
    if ($gameSwitches.value(VoiceMuteSwNo) || VoiceVol == 0) {
    } else {
        var vvol = VoiceVol; 
        var onevol = AudioManager.seVolume;
        AudioManager.seVolume = VoiceVol;
        voiceOnFlg = true;
        voiceCname = cname;
        AudioManager.playSe({ "name": vname, "volume": vvol, "pitch": 100, "pan": 0 })
        AudioManager.seVolume = onevol;
        GalvSoundOnFlg = false;
    }
}
Game_Interpreter.prototype.PlayBgm = function (SetName, SetVol, SetPic, SetPn) {
    var SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    var SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    var SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playBgm({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn })
}
Game_Interpreter.prototype.PlaySe = function (SetName, SetVol, SetPic, SetPn) {
    var SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    var SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    var SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playSe({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn })
}
Game_Interpreter.prototype.PlayBgs = function (SetName, SetVol, SetPic, SetPn) {
    var SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    var SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    var SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playBgs({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn })
}
AudioManager.createBuffer = function (folder, name) {
    var ext = this.audioFileExt();
    var _nameArr = name.split('/');
    var _folStr = "";
    for (var i = 0; i <= _nameArr.length - 2; i++) {
        _folStr += _nameArr[i] + '/';
    }
    var url = this._path + folder + '/' + _folStr + encodeURIComponent(_nameArr[_nameArr.length - 1]) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if (this._blobUrl) Html5Audio.setup(this._blobUrl);
        else Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};
var voiceName = 'XXXXXXXXXXXXXXXXXXXXXXX';
var voicestflg = false; 
AudioManager.playSe = function (se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function (audio) {
            return audio.isPlaying();
        });
        var sefilepass = 'se';
        if (voiceOnFlg){
            sefilepass = "voice/" + voiceCname;
            voiceOnFlg = false;
            voiceCname = "";
            voiceName = se.name;
            StopVoiceFlg = true;
        }
        voicestflg = true;
        var buffer = this.createBuffer(sefilepass, se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};
var VoiceStop = WebAudio.prototype.stop;
WebAudio.prototype.stop = function () {
    VoiceStop.call(this);
    if (voicestflg) { 
        this._autoPlay = true;        
    }
};
WebAudio.prototype.play = function (loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (WebAudio._context) {
        this._autoPlay = true;
        this.addLoadListener(function () {
            if (this._autoPlay) {
                this.play(loop, offset);
                voicestflg = false; 
            }
        }.bind(this));
    }
};
var StopVoiceFlg = false;
Game_Interpreter.prototype.StopVoice = function () {
    var encstr = encodeURI(voiceName);
    AudioManager._seBuffers.forEach(function (buffer) {
        if (buffer._url.match('/' + encstr + '.')) {
            buffer.stop();
        }
    });
}
var VUpdateStopFlg = false;
var GInputUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    if ($gameMessage._texts.length != 0 && StopVoiceFlg) {
        StopVoiceFlg = false;
        VUpdateStopFlg = true;
    }
    if ($gameMessage._texts.length == 0 && VUpdateStopFlg) {
        this.StopVoice();
        GalvSoundOnFlg = true; 
        VUpdateStopFlg = false;
    }
    GInputUpdate.call(this); 
}
var FstCmnSaveFlg = false; 
var FstVolCkFlame = 1; 
var StartUpUpdate = Scene_Map.prototype.update;
var GameResetFlame = -1; 
Scene_Map.prototype.update = function () {
    if (FstVolCkFlame > 0) {
        FstVolCkFlame -= 1;
        if (FstVolCkFlame == 0) {
            VoiceVol = $gameVariables.value(VoiceVolVarNo);
            VolMuteFlg = $gameSwitches._data[VoiceMuteSwNo];
            if (VolMuteFlg == undefined) { 
                FirstVolumeSet(); 
                FstCmnSaveFlg = true;
            }
            AudioManager.masterVolume = Math.floor($gameVariables.value(MasterVolVarNo)) / 100;
        }
    }
    if (GameResetFlame >= 0) {
        GameResetFlame -= 1;
        if (GameResetFlame == 0) {
            location.reload();
        }
    }
    StartUpUpdate.call(this); 
}
var FirstVolumeSet = function () {
    $gameSwitches._data[VoiceMuteSwNo] = false;
    VolMuteFlg = false;
    $gameVariables.setValue(MasterVolVarNo, F_MasterVol);
    ConfigManager['bgmVolume'] = F_BGMVol;
    ConfigManager['meVolume'] = F_BGMVol;
    ConfigManager['seVolume'] = F_SEVol;
    ConfigManager['bgsVolume'] = F_SEVol;
    $gameVariables.setValue(VoiceVolVarNo, F_VoiceVol);
    VoiceVol = F_VoiceVol; 
    ConfigManager.save(); 
}
AudioManager.playBgs = function (bgs, pos) {
    if (bgs == undefined) return;
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            if (vbgsflg) {
                this._bgsBuffer._volume = VoiceVol * 0.01;
            }
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};
var vbgsflg = false;
var playingVoice = "";
Game_Interpreter.prototype.VBgsPlay = function (filename, bgsvolume) {
    if (VolMuteFlg) {
    } else {
        var bgsvolume = typeof bgsvolume !== 'undefined' ? bgsvolume : -1;
        if (playingVoice != filename) { 
            var args = new Array("2"); 
            vbgsflg = true;
            this.pluginCommand("PB_BGS_CHANGE_LINE", args);
            if (bgsvolume != -1) {
                AudioManager.playBgs({ "name": filename, "volume": bgsvolume, "pitch": 100, "pan": 0 })
            } else {
                AudioManager.playBgs({ "name": filename, "volume": VoiceVol, "pitch": 100, "pan": 0 })
            }
            playingVoice = filename;
            vbgsflg = false;
            var args = new Array("1"); 
            this.pluginCommand("PB_BGS_CHANGE_LINE", args);
        }
    }
}
Game_Interpreter.prototype.VBgsStop = function (foutcount) {
    var foutcount = typeof foutcount !== 'undefined' ? foutcount : 1;
    playingVoice = "";
    var args = new Array("2"); 
    this.pluginCommand("PB_BGS_CHANGE_LINE", args);
    AudioManager.fadeOutBgs(foutcount);
    var args = new Array("1"); 
    this.pluginCommand("PB_BGS_CHANGE_LINE", args);
}
class BGS_FA {
    constructor(_Line, _EvNo, _Dist, _MaxVol) {
        var _MaxVol = typeof _MaxVol !== 'undefined' ? _MaxVol : 70;
        this._Line = _Line;     
        this._EvNo = _EvNo;     
        this._Dist = _Dist;     
        this._MaxVol = _MaxVol; 
    }
}
var BGS_FA_Arr = []; 
var Nupu_BGS_FA_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    Nupu_BGS_FA_performTransfer.call(this);
    BGS_FA_Arr = []; 
    $gameMap._events.forEach(function (_event) {
        try {
            var _ckEv = _event.event();
            var _LNoStr = MetaChecker(_ckEv, "BGS_FA");
            if (_LNoStr != "") {
                var _BGSArr = _LNoStr.split(',');
                var _LineNo = Number(_BGSArr[0]); 
                var _DistNo = Number(_BGSArr[1]); 
                var _MaxVol = 70
                if (_BGSArr[2] != undefined) {
                    _MaxVol = Number(_BGSArr[2]); 
                }
                BGS_FA_Arr.push(new BGS_FA(_LineNo, _event._eventId, _DistNo, _MaxVol));
            }
        } catch (e) {
            console.log("Err:Nupu_BGS_FA_performTransfer");
        }
    })
}
class Ck_BGSVol {
    constructor(_Line, _Vol) {
        this._Line = _Line; 
        this._Vol = _Vol; 
    }
}
var NupuAudio_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NupuAudio_NUpdate.call(this);
    if (FstCmnSaveFlg) {
        this.UTA_Save(); 
        FstCmnSaveFlg = false;
    }
    var _CkValArr = []; 
    for (var _i = 0; _i <= BGS_FA_Arr.length - 1; _i++){
        var _ckEv = $gameMap._events[BGS_FA_Arr[_i]._EvNo];
        if($gameMap._events[BGS_FA_Arr[_i]._EvNo] == null) continue;
        var _SaX = Math.abs(PL_realX - _ckEv._realX);
        var _SaY = Math.abs(PL_realY - _ckEv._realY);
        var _CkDist = (_SaX + _SaY) - 1;
        var _SetVol = BGS_FA_Arr[_i]._MaxVol * (1 - ((_SaX + _SaY) / BGS_FA_Arr[_i]._Dist));
        if (_SetVol <= 0) _SetVol = 0;
        var _volCntFlg = false;
        for (var _j = 0; _j <= _CkValArr.length - 1; _j++){
            if (_CkValArr[_j]._Vol > _SetVol){
                _volCntFlg = true;
            }
        }
        if (_volCntFlg) continue;
        _CkValArr.push(new Ck_BGSVol(BGS_FA_Arr[_i]._Line, _SetVol)); 
        var args = new Array(String(BGS_FA_Arr[_i]._Line)); 
        this.pluginCommand("PB_BGS_CHANGE_LINE", args);
        var _NCkBGS = AudioManager._currentBgs; 
        if (_NCkBGS != undefined) {
            var _NBGSStr = AudioManager._currentBgs.name; 
            AudioManager.playBgs({ "name": _NBGSStr, "volume": _SetVol, "pitch": 100, "pan": 0 })
        }
    }
}
