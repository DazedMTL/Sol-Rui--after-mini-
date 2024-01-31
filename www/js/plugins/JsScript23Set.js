Game_Interpreter.prototype.SetPlayerImg = function (ImgName, No) {
    this.SetCharaImg(1, ImgName, No)
    $gamePlayer.refresh();
};
Game_Interpreter.prototype.SetCharaImg = function (AcID, ImgName, No) {
    $gameActors.actor(AcID).setCharacterImage(ImgName, No);
};
Game_Interpreter.prototype.EvStart = function (_EvId) {
    $gameMap._events[_EvId].start();
}
Game_Interpreter.prototype.TouchTriger = function (_Kyori) {
    var _Kyori = typeof _Kyori !== 'undefined' ? _Kyori : 1;
    var vvX = Math.abs(this.character(0)._realX - this.character(-1)._realX);
    var vvY = Math.abs(this.character(0)._realY - this.character(-1)._realY);
    if ((vvX <= _Kyori && vvY <= _Kyori) && (vvX == 0 || vvY == 0)) {
        return true;
    } else {
        return false;
    }
};
Game_Interpreter.prototype.SetPlayerMoveSpeed = function (_Speed) {
    var _Speed = typeof _Speed !== 'undefined' ? _Speed : 4;
    this.character(-1).forceMoveRoute({
        "list": [{ "code": 29, "parameters": [_Speed] },
        { "code": 0 }],
        "repeat": false,
        "skippable": true
    });
    this._character = this.character(-1);
    this.setWaitMode('route');
}
var _BefMap = -1;
var NupuBEv_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NupuBEv_performTransfer.call(this);
    if (_BefMap != $gameMap._mapId) {
        _BefMap = $gameMap._mapId;
        $gameMap._events.forEach(function (_event) {
            try {
                var _ckEv = _event.event();
                var _NZRStr = MetaChecker(_ckEv, "NZure");
                if (_NZRStr != "") {
                    var _NZRArr = _NZRStr.split(',');
                    var _NZR_x = Number(_NZRArr[0]);
                    var _NZR_y = Number(_NZRArr[1]);
                    _event._realX += _NZR_x;
                    _event._x += _NZR_x;
                    _event._realY += _NZR_y;
                    _event._y += _NZR_y;
                }
            } catch (e) {
                console.log("Err:NupuBEv_performTransfer");
            }
        })
    }
}
var NupuBEv_EvVarCIndexCng = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NupuBEv_EvVarCIndexCng.call(this);
    $gameMap._events.forEach(function (_event) {
        try {
            var _ckEv = _event.event();
            var _NZRStr = MetaChecker(_ckEv, "画VN");
            if (_NZRStr != "") {
                var _ckStrArr = _NZRStr.split(',');
                var _ckChrStr = ""; 
                var _ckIdxNo = -1; 
                if (_ckStrArr.length > 1){
                    _ckChrStr = $gameVariables.value(Number(_ckStrArr[0]));
                    _event._characterName = _ckChrStr;
                    _ckIdxNo = $gameVariables.value(Number(_ckStrArr[1]));
                } else {
                    _ckIdxNo = $gameVariables.value(Number(_ckStrArr[0]));
                }
                _event._characterIndex = _ckIdxNo;
            }
            _NZRStr = MetaChecker(_ckEv, "画VN2");
            if (_NZRStr != "") {
                _ckChrStr = $gameVariables.value(Number(_NZRStr));
                _event._characterName = _ckChrStr;
            }
        } catch (e) {
            console.log("Err:NupuBEv_EvVarCIndexCng");
        }
    })
}
//使い方：ルートで:this.CGS(_X,_Y);
Game_Character.prototype.CGS = function (PosPX, PosPY) {
    this.StepOff = true;
    this._pattern = PosPX;
    if (PosPY == 0) {
        this._direction = 2;
    }
    if (PosPY == 1) {
        this._direction = 4;
    }
    if (PosPY == 2) {
        this._direction = 6;
    }
    if (PosPY == 3) {
        this._direction = 8;
    }
}
Game_Interpreter.prototype.TmpEvPCall = function (_EvId, _PageId) {
    var _PageId = typeof _PageId !== 'undefined' ? _PageId : 1;
    this.NTM_execCallMapEvent([_EvId, _PageId]);
};
var NpCreatePluginParameter = function (pluginName) {
    var paramReplacer = function (key, value) {
        if (value === 'null') {
            return value;
        }
        if (value[0] === '"' && value[value.length - 1] === '"') {
            return value;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    };
    var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
    PluginManager.setParameters(pluginName, parameter);
    return parameter;
};
var TmParam = NpCreatePluginParameter('JsScript45Set');
var getArgNumber = function (arg, min, max) {
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return (parseInt(arg) || 0).clamp(min, max);
};
Game_Interpreter.prototype.NTM_execCallMapEvent = function (args) {
    var pageIndex = getArgNumber(args[1], 1);
    var eventId = getArgNumber(args[0]);
    if ($gameMap.event(eventId)) {
        this.callMapEventById(pageIndex, eventId);
    } else if (args[0] !== '') {
        this.NTM_callMapEventByName(pageIndex, args[0]);
    } else {
        this.callMapEventById(pageIndex, this._eventId);
    }
};
Game_Interpreter.prototype.NTM_callMapEventByName = function (pageIndex, eventName) {
    var event = DataManager.searchDataItem($dataTemplateEvents, 'name', eventName);
    if (event) {
        this.setupAnotherList(TmParam.KeepEventId ? null : event.id, event.pages, pageIndex);
    }
};
var SetAnimeNo = -1;
Game_Interpreter.prototype.PlayAnime = function (AnimeNo, SetX, SetY) {
    AsetX = SetX / 48 + $gameMap._displayX;
    ASetY = SetY / 48 + $gameMap._displayY;
    if (AsetX <= 0) AsetX = 0;
    if (ASetY <= 0) ASetY = 0;
    var args = new Array(String("NAnime"), String(AsetX), String(ASetY));
    SetAnimeNo = AnimeNo;
    this.pluginCommand("ERS_MAKE_TEMPLATE", args);
}
var Nupu_PrefabEvent_initialize = Game_PrefabEvent.prototype.initialize;
Game_PrefabEvent.prototype.initialize = function (mapId, eventId, originalEventId, x, y, isTemplate) {
    Nupu_PrefabEvent_initialize.apply(this, arguments);
};
var Nupu_spawnEvent = Game_Map.prototype.spawnEvent;
Game_Map.prototype.spawnEvent = function (originalEventId, x, y, isTemplate) {
    Nupu_spawnEvent.apply(this, arguments);
    this._events[this._events.length - 1]._animationId = SetAnimeNo; 
    this._events[this._events.length - 1]._animationPlaying = true;
    this._events[this._events.length - 1]._realX = x;
    this._events[this._events.length - 1]._realY = y;
    this._events[this._events.length - 1]._x = x;
    this._events[this._events.length - 1]._y = y;
    SetAnimeNo = -1; 
};
Game_Interpreter.prototype.NAnime = function () {
    if (!this.character(0)._animationPlaying) {
        $gameMap.eraseEvent(this.character(0)._eventId);
    }
};
Game_Interpreter.prototype.FadeOut = function (_Timer, _waitFlg) {
    var _waitFlg = typeof _waitFlg !== 'undefined' ? _waitFlg : true;
    $gameScreen.startFadeOut(_Timer);
    if (_waitFlg) this.wait(_Timer);
}
Game_Interpreter.prototype.FadeIn = function (_Timer, _waitFlg) {
    var _waitFlg = typeof _waitFlg !== 'undefined' ? _waitFlg : true;
    $gameScreen.startFadeIn(_Timer);
    if (_waitFlg) this.wait(_Timer);
}
Game_Interpreter.prototype.SelfSwCng = function (_EvId, _SwStr , _flg) {
    var _EvId = typeof _EvId !== 'undefined' ? _EvId : 0;
    var _SwStr = typeof _SwStr !== 'undefined' ? _SwStr : "A";
    var _flg = typeof _flg !== 'undefined' ? _flg : true;
    var _mapId = this.character(_EvId)._mapId;
    var _key = [_mapId, _EvId, _SwStr];
    $gameSelfSwitches.setValue(_key, _flg);
}
//透明度の変更::_透明度(0~255の透明度指定) _CNo(キャラNo -1:プレイヤー　0:発動イベント)
Game_Interpreter.prototype.C透明度 = function (_透明度 , _CNo) {
    var _透明度 = typeof _透明度 !== 'undefined' ? _透明度 : 255;
    var _CNo = typeof _CNo !== 'undefined' ? _CNo : 0;
    this.character(_CNo)._opacity = _透明度;
}
Game_Interpreter.prototype.Ev強制Move = function (_mvX , _mvY) {
    this.character(0)._realX += _mvX;
    this.character(0)._x += _mvX;
    this.character(0)._realY += _mvY;
    this.character(0)._y += _mvY;
}
