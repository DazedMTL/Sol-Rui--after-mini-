﻿// Copyright (c) 2016 マンカインド
/*:
 *
 * @plugindesc 
 * @author マンカインド
 *
 * @help 
 * @param 探索設定
 * @default ====================================
 *
 * @param Sensor_Switch
 * @text 発見後操作スイッチ
 * @desc [初期値] プレイヤー発見時にONにするスイッチ番号またはセルフスイッチを指定。(ロスト後操作スイッチはOFFになります)
 * @type combo
 * @option A
 * @option B
 * @option C
 * @option D
 * @default D
 * @parent 探索設定
 *
 * @param Lost_Sensor_Switch
 * @text ロスト後操作スイッチ
 * @desc [初期値] プレイヤーロスト時にONにするスイッチ番号またはセルフスイッチを指定。(発見後操作スイッチはOFFになります)
 * @type combo
 * @option A
 * @option B
 * @option C
 * @option D
 * @default
 * @parent 探索設定
 *
 * @param Both_Sensor
 * @text 両隣の視界
 * @desc [初期値:スイッチ可] 探索者の両隣を探索範囲とする場合はON、しない場合はOFFを指定してください。
 * @type combo
 * @option ON
 * @option OFF
 * @default OFF
 * @parent 探索設定
 *
 * @param Terrain_Decision
 * @text 通行不可タイル考慮
 * @desc [初期値:スイッチ可] 視界範囲に通行不可タイルの存在を考慮させる場合はON、しない場合はOFFを指定してください。
 * @type combo
 * @option ON
 * @option OFF
 * @default ON
 * @parent 探索設定
 *
 * @param Auto_Sensor
 * @text 探索自動開始
 * @desc マップ描画時に探索処理を自動的に開始する設定です。デフォルト:開始しない
 * @type boolean
 * @on 開始する
 * @off 開始しない
 * @default false
 * @parent 探索設定
 *
 * @param Event_Decision
 * @text 他イベント考慮
 * @desc [初期値:スイッチ可] 視界範囲にマップイベントの存在を考慮させる場合はON、しない場合はOFFを指定してください。
 * @type combo
 * @option ON
 * @option OFF
 * @default OFF
 * @parent 探索設定
 *
 * @param Region_Decision
 * @text リージョン設定
 * @desc [初期値:変数可] 視界範囲外(壁扱い)とするリージョン番号を指定してください。
 * @type string[]
 * @default []
 * @parent 探索設定
 *
 * @param Real_Range_X
 * @text 探索範囲X拡張
 * @desc 探索範囲を指定した数値分、横に拡張します(視界描画はマス単位)。プレイヤーがピクセル単位で移動する場合に有効です。(デフォルト:0)
 * @type number
 * @decimals 3
 * @max 0.999
 * @min 0.000
 * @default 0.000
 * @parent 探索設定
 *
 * @param Real_Range_Y
 * @text 探索範囲Y拡張
 * @desc 探索範囲を指定した数値分、縦に拡張します(視界描画はマス単位)。プレイヤーがピクセル単位で移動する場合に有効です。(デフォルト:0)
 * @type number
 * @decimals 3
 * @max 0.999
 * @min 0.000
 * @default 0.000
 * @parent 探索設定
 *
 * @param 視界設定
 * @default ====================================
 *
 * @param Range_Visible
 * @text 視界範囲描画
 * @desc [初期値:スイッチ可] 探索者の視界範囲を描画する場合はON、しない場合はOFFを指定してください。
 * @type combo
 * @option ON
 * @option OFF
 * @default ON
 * @parent 視界設定
 *
 * @param Range_Color
 * @text 視界範囲の色
 * @desc 視界範囲を描画する際の色を選択してください。デフォルト:白
 * @type select
 * @option 白
 * @value white
 * @option 赤
 * @value red
 * @option 青
 * @value blue
 * @option 黄
 * @value yellow
 * @default white
 * @parent 視界設定
 *
 * @param Range_Opacity
 * @text 視界範囲の不透明度
 * @desc 視界範囲を描画する際の不透明度を数字で指定してください。デフォルト:80(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 80
 * @parent 視界設定
 *
 * @param Range_Position
 * @text 視界範囲位置
 * @desc 探索者の視界範囲を表示する位置を選択します。デフォルト:1(イベントの上に表示する)
 * @type select
 * @option イベントの上に表示する
 * @value 1
 * @option イベントの下に表示する
 * @value 2
 * @default 1
 * @parent 視界設定
 *
 * @param Player_Found
 * @text プレイヤー発見時設定
 * @desc 探索者がプレイヤーを発見した時の設定です。
 * @type struct<Alert>
 * @default {"Ballon":"0","Se":"{\"Name\":\"\",\"Volume\":\"90\",\"Pitch\":\"100\",\"Pan\":\"0\"}","Common_Event":"0","Delay":"0"}
 *
 * @param Player_Lost
 * @text プレイヤーロスト時設定
 * @desc 探索者がプレイヤーをロストした時の設定です。
 * @type struct<Alert>
 * @default {"Ballon":"0","Se":"{\"Name\":\"\",\"Volume\":\"90\",\"Pitch\":\"100\",\"Pan\":\"0\"}","Common_Event":"0","Delay":"0"}
 *
 * @param マップ設定
 * @default ====================================
 *
 * @param Tracking_Priority
 * @text 追跡優先度
 * @desc プレイヤー発見状態のイベントが他イベントの上または下を通行可能にするか設定します。(デフォルト:通行不可)
 * @type boolean
 * @on 通行可能
 * @off 通行不可
 * @default false
 * @parent マップ設定
 *
 * @param Follower_Through
 * @text フォロワー無視
 * @desc プレイヤー発見状態のイベントがプレイヤーのフォロワー(隊列)をすり抜けるか設定します。(デフォルト:すり抜け不可)
 * @type boolean
 * @on すり抜け可
 * @off すり抜け不可
 * @default false
 * @parent マップ設定
 *
 * @param Location_Reset
 * @text マップ移動時リセット
 * @desc 場所移動コマンド使用時、元のマップに配置された探索者の追跡状態をリセットするか設定します。(デフォルト:リセットしない)
 * @type boolean
 * @on リセットする
 * @off リセットしない
 * @default false
 * @parent マップ設定
 *
*/
/*~struct~Alert:
 *
 * @param Ballon
 * @text [初期値] フキダシ表示
 * @desc 探索者にフキダシを表示させる場合はアイコン番号を指定します。デフォルト:表示しない
 * @type select
 * @option 表示しない
 * @value 0
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザー定義1
 * @value 11
 * @option ユーザー定義2
 * @value 12
 * @option ユーザー定義3
 * @value 13
 * @option ユーザー定義4
 * @value 14
 * @option ユーザー定義5
 * @value 15
 * @default 0
 *
 * @param Se
 * @text SE設定
 * @desc Seに関する設定です。
 * @type struct<Se>
 *
 * @param Common_Event
 * @text [初期値] コモン実行
 * @desc コモンイベントを実行させる場合は指定します。デフォルト:0(なし)
 * @type common_event
 * @default 0
 *
 * @param Delay
 * @text [初期値] 状態移行遅延
 * @desc プレイヤー発見/ロスト状態に移行するタイミングを指定したフレーム分遅らせます(60フレーム=1秒)。デフォルト:0
 * @type number
 * @min 0
 * @default 0
 *
*/
/*~struct~Se:
 *
 * @param Name
 * @text ファイル名
 * @desc 再生するファイルを指定します。デフォルト:空(再生しない)
 * @type file
 * @require 1
 * @dir audio/se
 *
 * @param Volume
 * @text 再生時音量
 * @desc ファイルを再生するときの音量を指定します(0から100までの数値)。デフォルト:90
 * @type number
 * @max 100
 * @min 0
 * @default 90
 *
 * @param Pitch
 * @text 再生時ピッチ
 * @desc ファイルを再生するときのピッチを指定します(50から150までの数値)。デフォルト:100
 * @type number
 * @max 150
 * @min 50
 * @default 100
 *
 * @param Pan
 * @text 再生時位相
 * @desc ファイルを再生するときの位相を指定します(-100から100までの数値)。デフォルト:0
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
*/
var DefBothSensor_Set = false;
var DefTerrainDecision_Set = false;
var DefEventDecision_Set = false;
var SensorDrawGcCounter = 0;
(function () {
    'use strict';
    const PN = "JsScript17Set";
    const CheckParam = function(type, name, value, def, min, max, options) {
        let regExp;
        if(min == undefined || min == null) {
            min = -Infinity;
        }
        if(max == undefined || max == null) {
            max = Infinity;
        }
        if(value == null) {
            value = "";
        } else {
            value = String(value);
        }
        regExp = /^\x1bV\[\d+\]|\x1bS\[\d+\]$/i;
        value = value.replace(/\\/g, '\x1b');
        value = value.replace(/\x1b\x1b/g, '\\');
        if(!regExp.test(value)) {
            switch(type) {
                case "bool":
                    if(value == "") {
                        value = (def)? true : false;
                    } else {
                        value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                    }
                    break;
                case "num":
                    if(value == "") {
                        value = (isFinite(def))? parseInt(def, 10) : 0;
                    } else {
                        value = (isFinite(value))? parseInt(value, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                case "float":
                    if(value == "") {
                        value = (isFinite(def))? parseFloat(def) : 0;
                    } else {
                        value = (isFinite(value))? parseFloat(value) : (isFinite(def))? parseFloat(def) : 0;
                        value = value.clamp(min, max);
                    }
                    break;
                case "string":
                    if(value == "") {
                        value = (def != "")? def : value;
                    }
                    break;
                case "switch":
                    if(value == "") {
                        value = (def != "")? def : value;
                    }
                    if(name == "Lost_Sensor_Switch" && (value == null || value == undefined)) {
                        value = "";
                    }
                    if(name != "Lost_Sensor_Switch" && !value.match(/^([A-D]|\d+)$/i)) {
                        throw new Error('Plugin parameter value is not switch : '+name+' : '+value);
                    }
                    break;
                default:
                    throw new Error("[CheckParam] " + name + "のタイプが不正です: " + type);
                    break;
            }
        }
        return [value, type, def, min, max];
    };
    const CEC = function(params) {
        let text, value, type, def, min, max;
        text = String(params[0]);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        type = params[1];
        def = params[2];
        min = params[3];
        max = params[4];
        text = convertEscapeCharacters(text);
        switch(type) {
            case "bool":
                if(text == "") {
                    value = (def)? true : false;
                } else {
                    value = text === true || text.toUpperCase() === "ON" || text.toUpperCase() === "TRUE" || text.toUpperCase() === "1";
                }
                break;
            case "num":
                value = (isFinite(text))? parseInt(text, 10) : (isFinite(def))? parseInt(def, 10) : 0;
                value = value.clamp(min, max);
                break;
            case "float":
                value = (isFinite(text))? parseFloat(text) : (isFinite(def))? parseFloat(def) : 0;
                value = value.clamp(min, max);
                break;
            case "string":
                if(text == "") {
                    value = (def != "")? def : value;
                } else {
                    value = text;
                }
                break;
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^([A-D]|\d+)$/)) {
                    throw new Error('Plugin parameter value is not switch : '+param+' : '+value);
                }
                break;
            default:
                throw new Error('[CEC] Plugin parameter type is illegal: '+type);
                break;
        }
        return value;
    };
    const convertEscapeCharacters = function(text) {
        let windowChild;
        if(typeof text == "string") {
            if(SceneManager._scene && SceneManager._scene._windowLayer) {
                windowChild = SceneManager._scene._windowLayer.children[0];
                text = windowChild ? windowChild.convertEscapeCharacters(text) : text;
            } else {
                text = ConvVb(text);
            }
        }
        return text;
    };
    const ConvVb = function(text) {
        let num, regExp;
        regExp = /^\x1bV\[(\d+)\]$/i;
        if(typeof text == "string") {
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');
            text = text.replace(regExp, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
            text = text.replace(regExp, function() {
                num = parseInt(arguments[1]);
                return $gameVariables.value(num);
            }.bind(this));
        }
        return text;
    };
    const ConvSw = function(text, target) {
        let num, key, regExp;
        regExp = /^\x1bV\[\d+\]$|^\x1bS\[\d+\]$/i;
        if(typeof text == "string") {
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');
            text = text.replace(/\x1bS\[(\d+)\]/i, function() {
                num = parseInt(arguments[1]);
                return $gameSwitches.value(num);
            }.bind(this));
            text = text.replace(/\x1bS\[([A-D])\]/i, function() {
                if(target) {
                    key = [target._mapId, target._eventId, arguments[1].toUpperCase()];
                    return $gameSelfSwitches.value(key);
                }
                return false;
            }.bind(this));
            if(text === true || text.toLowerCase() === "true" || text == "1") {
                text = 1;
            } else {
                text = 0;
            }
        }
        return text;
    };
    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };
    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };
    const Parameters = paramParse(PluginManager.parameters(PN));
    let DIR_UP, DIR_DOWN, DIR_RIGHT, DIR_LEFT,
        DefSensorSwitch, DefBothSensor, DefRangeVisible,
        DefTerrainDecision, DefRangeColor, DefRangeOpacity,
        DefAutoSensor, DefEventDecision, DefRegionDecisions,
        DefRealRangeX, DefRealRangeY, DefLostSensorSwitch,
        DefFoundBallon, DefFoundCommon, DefFoundDelay, DefFoundSe,
        DefLostBallon, DefLostCommon, DefLostDelay, DefLostSe,
        DefRangePosition, DefTrackingPriority, DefFollowerThrough, DefLocationReset;
    DefSensorSwitch = CheckParam("switch", "Sensor_Switch", Parameters["Sensor_Switch"], "D");
    DefLostSensorSwitch = CheckParam("switch", "Lost_Sensor_Switch", Parameters["Lost_Sensor_Switch"]);
    DefBothSensor = CheckParam("bool", "Both_Sensor", Parameters["Both_Sensor"], false);
    DefRangeVisible = CheckParam("bool", "Range_Visible", Parameters["Range_Visible"], true);
    DefTerrainDecision = CheckParam("bool", "Terrain_Decision", Parameters["Terrain_Decision"], false);
    DefRangeColor = CheckParam("string", "Range_Color", Parameters["Range_Color"], "white");
    DefRangeOpacity = CheckParam("num", "Range_Opacity", Parameters["Range_Opacity"], 80, 0, 255);
    DefRangePosition = CheckParam("num", "Range_Position", Parameters["Range_Position"], 1);
    DefAutoSensor = CheckParam("bool", "Auto_Sensor", Parameters["Auto_Sensor"], false);
    DefEventDecision = CheckParam("bool", "Event_Decision", Parameters["Event_Decision"], false);
    DefRegionDecisions = [];
    Parameters["Region_Decision"].forEach(function(region) {
        DefRegionDecisions.push(CheckParam("string", "Region_Decision", region, 0));
    });
    DefRealRangeX = CheckParam("float", "Real_Range_X", Parameters["Real_Range_X"], 0.000, 0.000, 0.999);
    DefRealRangeY = CheckParam("float", "Real_Range_Y", Parameters["Real_Range_Y"], 0.000, 0.000, 0.999);
    DefFoundBallon = CheckParam("num", "Player_Found.Ballon", Parameters["Player_Found"]["Ballon"], 0, 0);
    DefFoundCommon = CheckParam("num", "Player_Found.Common_Event", Parameters["Player_Found"]["Common_Event"], 0, 0);
    DefFoundDelay = CheckParam("num", "Player_Found.Delay", Parameters["Player_Found"]["Delay"], 0, 0);
    DefFoundSe = {
        "name" : CheckParam("string", "Player_Found.Se.Name", Parameters["Player_Found"]["Se"]["Name"], "")[0],
        "volume" : CheckParam("num", "Player_Found.Se.Volume", Parameters["Player_Found"]["Se"]["Volume"], 90, 0, 100)[0],
        "pitch" : CheckParam("num", "Player_Found.Se.Pitch", Parameters["Player_Found"]["Se"]["Pitch"], 100, 50, 150)[0],
        "pan" : CheckParam("num", "Player_Found.Se.Pan", Parameters["Player_Found"]["Se"]["Pan"], 0, -100, 100)[0],
    }
    DefLostBallon = CheckParam("num", "Player_Lost.Ballon", Parameters["Player_Lost"]["Ballon"], 0, 0);
    DefLostCommon = CheckParam("num", "Player_Lost.Common_Event", Parameters["Player_Lost"]["Common_Event"], 0, 0);
    DefLostDelay = CheckParam("num", "Player_Lost.Delay", Parameters["Player_Lost"]["Delay"], 0, 0);
    DefLostSe = {
        "name" : CheckParam("string", "Player_Lost.Se.Name", Parameters["Player_Lost"]["Se"]["Name"], "")[0],
        "volume" : CheckParam("num", "Player_Lost.Se.Volume", Parameters["Player_Lost"]["Se"]["Volume"], 90, 0, 100)[0],
        "pitch" : CheckParam("num", "Player_Lost.Se.Pitch", Parameters["Player_Lost"]["Se"]["Pitch"], 100, 50, 150)[0],
        "pan" : CheckParam("num", "Player_Lost.Se.Pan", Parameters["Player_Lost"]["Se"]["Pan"], 0, -100, 100)[0],
    }
    DefTrackingPriority = CheckParam("bool", "Tracking_Priority", Parameters["Tracking_Priority"], false);
    DefFollowerThrough = CheckParam("bool", "Follower_Through", Parameters["Follower_Through"], false);
    DefLocationReset = CheckParam("bool", "Location_Reset", Parameters["Location_Reset"], false);
    DIR_UP = 8;
    DIR_DOWN = 2;
    DIR_RIGHT = 6;
    DIR_LEFT = 4;
    DefBothSensor_Set = DefBothSensor[0];
    DefTerrainDecision_Set = DefTerrainDecision[0];
    DefEventDecision_Set = DefEventDecision[0];
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "pss") {
            switch (args[0].toLowerCase()) {
                case "start":
                    $gameSystem.startSensor();
                    break;
                case "force_start":
                    $gameSystem.startSensor(1);
                    break;
                case "stop":
                    $gameSystem.stopSensor();
                    break;
                case "reset":
                    $gameSystem.resetSensor(args);
                    break;
                case "lost":
                    $gameSystem.allForceLost();
                    break;
                case "t_start":
                    $gameSystem.onSensor(this.eventId());
                    break;
                case "t_stop":
                    $gameSystem.offSensor(this.eventId());
                    break;
                case "t_reset":
                    $gameSystem.neutralSensor(this.eventId(), args);
                    break;
                case "t_move":
                    this.moveNearPlayer(args[1]);
                    break;
                case "t_lost":
                    $gameSystem.forceLost(this.eventId());
                    break;
            }
        }
    };
    Game_Interpreter.prototype.moveNearPlayer = function(speed) {
        let event, oldSpeed, newSpeed, list, sx, sy, i, direction;
        event = $gameMap.event(this._eventId);
        oldSpeed = event.moveSpeed();
        newSpeed = oldSpeed;
        sx = Math.abs(event.deltaXFrom($gamePlayer.x));
        sy = Math.abs(event.deltaYFrom($gamePlayer.y));
        list = [];
        if(event) {
            if(speed && isFinite(speed) && speed > 0) {
                newSpeed = parseInt(speed, 10);
            }
            list.push({"code":29,"parameters":[newSpeed]}, {"code":25})
            for(i = 1; i < sx + sy; i++) {
                list.push({"code":10});
            }
            list.push({"code":25}, {"code":29,"parameters":[oldSpeed]}, {"code":0});
            this.setWaitMode('route');
            event.forceMoveRoute({
                "list":list,
                "repeat":false,
                "skippable":true,
                "wait":true
            });
        }
    };
    Game_Interpreter.prototype.setupReservedCommonEventEx = function(eventId) {
        if ($gameTemp.isCommonEventReserved()) {
            this.setup($gameTemp.reservedCommonEvent().list, eventId);
            $gameTemp.clearCommonEvent();
            return true;
        } else {
            return false;
        }
    };
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        _Game_System_initialize.call(this);
        this._sensorStart = false
        this._switchStatuses  = {};
    };
    Game_System.prototype.startSensor = function(type) {
        if(!type) {
            type = 0;
        }
        this.setSensorStart(true);
        this.setSensorStatusAll(1, type);
        this.setViewRangeStatusAll(2);
    };
    Game_System.prototype.stopSensor = function() {
        this.setSensorStart(false);
        this.setSensorStatusAll(0);
        this.setViewRangeStatusAll(0);
    };
    Game_System.prototype.resetSensor = function(args) {
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null) {
                $gameSystem.neutralSensor(event.eventId(), args)
            }
        }, this);
    };
    Game_System.prototype.onSensor = function(eventId) {
        let event = $gameMap.event(eventId);
        if(event && event.getSensorType() != null) {
            event.setSensorStatus(1);
        }
    };
    Game_System.prototype.offSensor = function(eventId) {
        let event = $gameMap.event(eventId);
        if(event && event.getSensorType() != null) {
            event.setSensorStatus(0);
            event.setFoundStatus(0);
        }
    };
    Game_System.prototype.neutralSensor = function(eventId, args) {
        let mapId, event, sw, switches, sensorSwitch;
        mapId = $gameMap.mapId();
        event = $gameMap.event(eventId);
        switches = [];
        if(args && args.length >= 2) {
            switches = args.slice(1);
        }
        sensorSwitch = DefSensorSwitch[0];
        if(event) {
            if(event.getSensorType() != null) {
                sw = (event.getSensorSwitch() != null)? event.getSensorSwitch() : sensorSwitch;
                switches.push(sw);
                switches.forEach(function(sw) {
                    if(isFinite(sw)) {
                        $gameSwitches.setValue(sw, false);
                    } else if(sw.match(/[a-dA-D]/)) {
                        $gameSelfSwitches.setValue([mapId, eventId, sw.toUpperCase()], false);
                    }
                }, this)
            }
        }
    };
    Game_System.prototype.isSensorStart = function() {
        return this._sensorStart;
    };
    Game_System.prototype.setSensorStart = function(sensorStart) {
        this._sensorStart = sensorStart || false;
    };
    Game_System.prototype.getSensorStart = function() {
        return this._sensorStart;
    };
    Game_System.prototype.setSensorStatusAll = function(status, type) {
        if(!type) {
            type = 0;
        }
        if(type) {
            $gameMap.events().forEach(function(event) {
                if(event.getSensorType() != null) {
                    event.setSensorStatus(status);
                    event.setFoundStatus(0);
                }
            }, this);
            return;
        }
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null && event.getSensorStatus() != -1) {
                event.setSensorStatus(status);
                event.setFoundStatus(0);
            }
        }, this);
    }
    Game_System.prototype.setViewRangeStatusAll = function(status) {
        $gameMap.events().forEach(function(event) {
            if(event.getSensorType() != null) event.setViewRangeStatus(status);
        }, this);
    }
    Game_System.prototype.getEventSensorStatus = function(eventId) {
        let event;
        if(eventId && isFinite(eventId) && $gameMap.event(eventId)) {
            event = $gameMap.event(eventId);
            return event.getSensorStatus();
        } else {
            return null;
        }
    };
    Game_System.prototype.getSwitchStatuses = function() {
        return this._switchStatuses;
    };
    Game_System.prototype.setSwitchStatuses = function(sw, eventId) {
        if(this._switchStatuses[sw]) {
            if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                if(!this._switchStatuses[sw].contains(eventId)) {
                    this._switchStatuses[sw].push(eventId);
                }
            } else {
                this._switchStatuses[sw] = [eventId];
            }
        } else {
            this._switchStatuses[sw] = [eventId];
        }
    };
    Game_System.prototype.isSwitchStatuses = function(sw, eventId) {
        if(!sw || !isFinite(sw)) {
            return false;
        }
        if(this._switchStatuses[sw]) {
            if(eventId == null) {
                return true;
            } else {
                if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                    if(this._switchStatuses[sw].contains(eventId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Game_System.prototype.removeSwitchStatuses = function(sw, eventId) {
        if(this._switchStatuses[sw]) {
            if(!eventId) {
                delete this._switchStatuses[sw];
            } else {
                if(this._switchStatuses[sw] instanceof Array && this._switchStatuses[sw].length > 0) {
                    if(this._switchStatuses[sw].contains(eventId)) {
                        this._switchStatuses[sw].some(function(v, i){
                            if (v == eventId) {
                                this._switchStatuses[sw].splice(i, 1);
                            }
                        }, this);
                    }
                }
                if(this._switchStatuses[sw].length == 0) {
                    delete this._switchStatuses[sw];
                }
            }
        }
    };
    Game_System.prototype.isFoundPlayer = function() {
        if(!this.isSensorStart()) return false;
        return $gameMap.events().some(function(event) {
            // return event.getSensorStatus() == 1 && event.getFoundStatus() == 1;
            return event.isSensorFound();
        });
    };
    Game_System.prototype.allForceLost = function() {
        if(!this.isSensorStart()) return false;
        $gameMap.events().filter(function(event) {
            return event.getFoundStatus() == 1;
        }).forEach(function(event) {
            event.setForceLost(1);
        });
    };
    Game_System.prototype.forceLost = function(eventId) {
        let event;
        if(!this.isSensorStart()) return false;
        if(!eventId || !isFinite(eventId) || !$gameMap.event(eventId)) {
            return ;
        }
        event = $gameMap.event(eventId);
        if(event.getFoundStatus() != 1) return false;
        event.setForceLost(1);
    };
    const _Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
        if(DefLocationReset[0] && !$gameParty.inBattle() && !$gameMessage.isBusy()) {
            $gameSystem.resetSensor();
        }
        _Game_Player_reserveTransfer.apply(this, arguments);
    };
    const _Game_CharacterBaseInitMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseInitMembers.call(this);
        let foundBallon, foundCommon, foundSe, foundDelay,
            lostBallon, lostCommon, lostSe, lostDelay;
        foundBallon = DefFoundBallon[0];
        foundCommon = DefFoundCommon[0];
        foundSe = DefFoundSe;
        foundDelay = DefFoundDelay[0];
        lostBallon = DefLostBallon[0];
        lostCommon = DefLostCommon[0];
        lostSe = DefLostSe;
        lostDelay = DefLostDelay[0];
        this._foundStatus = 0;
        this._sensorStatus = -2;
        this._sensorType = null;
        this._sensorRange = 0;
        this._sensorRangeC = 0;
        this._bothSensorR = false;
        this._bothSensorL = false;
        this._viewRangeStatus = 0;
        this._coordinate = [];
        this._sensorSwitch = null;
        this._lostSensorSwitch = null;
        this._sideSensor = -1;
        this._rangeVisible = -1;
        this._terrainDecision = -1;
        this._directionFixed = -1;
        this._eventDecision = -1;
        this._regionDecision = "";
        this._createRange = false;
        this._foundBallon = foundBallon;
        this._foundCommon = foundCommon;
        this._foundSe = foundSe;
        this._foundMaxDelay = foundDelay;
        this._foundDelay = this._foundMaxDelay;
        this._lostBallon = lostBallon;
        this._lostCommon = lostCommon;
        this._lostSe = lostSe;
        this._lostMaxDelay = lostDelay;
        this._lostDelay = this._lostMaxDelay;
        this._activeMode = 0;
        this._forceLost = 0;
    };
    const _Game_CharacterBaseMoveStraight = Game_CharacterBase.prototype.moveStraight;
    Game_CharacterBase.prototype.moveStraight = function(d) {
        let status = (this.direction() == d) ? 1 : 2;
        _Game_CharacterBaseMoveStraight.call(this,d);
        if (this.isMovementSucceeded() && d && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(status);
        }
    };
    const _Game_CharacterBaseMoveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        _Game_CharacterBaseMoveDiagonally.call(this,horz, vert);
        if (this.isMovementSucceeded() && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(2);
        }
    };
    const _Game_CharacterBaseSetDirection = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function(d) {
        let status = (this.direction() == d) ? 1 : 2;
        if (!this.isDirectionFixed() && d && this.getSensorStatus() == 1) {
            this.setViewRangeStatus(status);
        }
        _Game_CharacterBaseSetDirection.call(this,d);
    }
    Game_CharacterBase.prototype.startViewRange = function() {
        this.setViewRangeStatus(1);
    };
    Game_CharacterBase.prototype.setSensorStatus = function(sensorStatus) {
        this._sensorStatus = sensorStatus;
    };
    Game_CharacterBase.prototype.getSensorStatus = function() {
        return this._sensorStatus;
    };
    Game_CharacterBase.prototype.setFoundStatus = function(foundStatus) {
        this._foundStatus = foundStatus;
    };
    Game_CharacterBase.prototype.getFoundStatus = function() {
        return this._foundStatus;
    };
    Game_CharacterBase.prototype.setSensorType = function(sensorType) {
        this._sensorType = sensorType;
    };
    Game_CharacterBase.prototype.getSensorType = function() {
        return this._sensorType;
    };
    Game_CharacterBase.prototype.setSensorRange = function(sensorRange) {
        this._sensorRange = sensorRange;
    };
    Game_CharacterBase.prototype.getSensorRange = function() {
        let value;
        value = parseInt(ConvVb(this._sensorRange), 10);
        return this.getSensorType() == "df" ? value % 2 ? 2 : value : value;
    };
    Game_CharacterBase.prototype.setSensorRangeC = function(sensorRangeC) {
        this._sensorRangeC = sensorRangeC;
    };
    Game_CharacterBase.prototype.getSensorRangeC = function() {
        let value;
        value = parseInt(ConvVb(this._sensorRangeC), 10);
        return this.getSensorType() == "df" ? value % 2 ? 2 : value : value;
    };
    Game_CharacterBase.prototype.setViewRangeStatus = function(viewRangeStatus) {
        this._viewRangeStatus = viewRangeStatus;
    };
    Game_CharacterBase.prototype.getViewRangeStatus = function() {
        return this._viewRangeStatus;
    };
    Game_CharacterBase.prototype.setCoordinate = function(x, y, status) {
        this._coordinate.push([x, y, status, -1]);
    };
    Game_CharacterBase.prototype.getCoordinate = function() {
        return this._coordinate;
    };
    Game_CharacterBase.prototype.clearCoordinate = function() {
        this._coordinate = [];
    };
    Game_CharacterBase.prototype.setBothSensorRight = function(bothSensor) {
        this._bothSensorR = bothSensor;
    };
    Game_CharacterBase.prototype.getBothSensorRight = function() {
        return this._bothSensorR;
    };
    Game_CharacterBase.prototype.setBothSensorLeft = function(bothSensor) {
        this._bothSensorL = bothSensor;
    };
    Game_CharacterBase.prototype.getBothSensorLeft = function() {
        return this._bothSensorL;
    };
    Game_CharacterBase.prototype.setBothSensor = function(bothSensor) {
        this._sideSensor = bothSensor;
    };
    Game_CharacterBase.prototype.getBothSensor = function() {
        return parseInt(ConvSw(this._sideSensor, this), 10);
    };
    Game_CharacterBase.prototype.setSensorSwitch = function(sensorSwitch) {
        if(isFinite(sensorSwitch)) {
            this._sensorSwitch = parseInt(sensorSwitch, 10);
        } else if(sensorSwitch.toLowerCase().match(/[a-d]/)) {
            this._sensorSwitch = sensorSwitch.toUpperCase();
        }
    };
    Game_CharacterBase.prototype.getSensorSwitch = function() {
        return this._sensorSwitch;
    };
    Game_CharacterBase.prototype.setLostSensorSwitch = function(sensorSwitch) {
        if(isFinite(sensorSwitch)) {
            this._lostSensorSwitch = parseInt(sensorSwitch, 10);
        } else if(sensorSwitch.toLowerCase().match(/[a-d]/)) {
            this._lostSensorSwitch = sensorSwitch.toUpperCase();
        }
    };
    Game_CharacterBase.prototype.getLostSensorSwitch = function() {
        return this._lostSensorSwitch;
    };
    Game_CharacterBase.prototype.setRangeVisible = function(rangeVisible) {
        this._rangeVisible = rangeVisible;
    };
    Game_CharacterBase.prototype.getRangeVisible = function() {
        return parseInt(ConvSw(this._rangeVisible, this), 10);
    };
    Game_CharacterBase.prototype.setTerrainDecision = function(terrainDecision) {
        this._terrainDecision = terrainDecision;
    };
    Game_CharacterBase.prototype.getTerrainDecision = function() {
        return parseInt(ConvSw(this._terrainDecision, this), 10);
    };
    Game_CharacterBase.prototype.setEventDecision = function(eventDecision) {
        this._eventDecision = eventDecision;
    };
    Game_CharacterBase.prototype.getEventDecision = function() {
        return parseInt(ConvSw(this._eventDecision, this), 10);
    };
    Game_CharacterBase.prototype.setRegionDecision = function(regionDecision) {
        this._regionDecision = String(regionDecision);
    };
    Game_CharacterBase.prototype.getRegionDecision = function() {
        return parseInt(ConvVb(this._regionDecision), 10);
    };
    Game_CharacterBase.prototype.setDirectionFixed = function(directionFixed) {
        let direction;
        switch(directionFixed) {
            case "u":
                direction = DIR_UP;
                break;
            case "r":
                direction = DIR_RIGHT;
                break;
            case "l":
                direction = DIR_LEFT;
                break;
            case "d":
                direction = DIR_DOWN;
                break;
            default:
                direction = -1;
        }
        this._directionFixed = parseInt(direction, 10);
    };
    Game_CharacterBase.prototype.getDirectionFixed = function() {
        return this._directionFixed;
    };
    Game_CharacterBase.prototype.isMapPassableEx = function(x, y, d) {
        let x2, y2, d2, passableFlag, events, eventDecision, regionDecisions;
        x2 = $gameMap.roundXWithDirection(x, d);
        y2 = $gameMap.roundYWithDirection(y, d);
        d2 = this.reverseDir(d);
        eventDecision = DefEventDecision_Set; 
        regionDecisions = getRegionIds(DefRegionDecisions, this.getRegionDecision());
        passableFlag = true;
        if($gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2)) {
            if(this.getEventDecision() == 1
                    || (this.getEventDecision() == -1 && eventDecision)) {
                events = $gameMap.eventsXyNt(x2, y2);
                passableFlag = !events.some(function(event) {
                    return event.isNormalPriority();
                });
            }
            if(regionDecisions.length > 0 && passableFlag == true) {
                passableFlag = !regionDecisions.contains(""+$gameMap.regionId(x2, y2));
            }
        } else {
            passableFlag = false;
        }
        return passableFlag;
    };
    Game_CharacterBase.prototype.isCreateRange = function() {
        return this._createRange;
    };
    Game_CharacterBase.prototype.enableCreateRange = function() {
        this._createRange = true;
    };
    Game_CharacterBase.prototype.setFoundBallon = function(ballon) {
        this._foundBallon = ballon;
    };
    Game_CharacterBase.prototype.getFoundBallon = function() {
        return parseInt(ConvVb(this._foundBallon), 10);
    };
    Game_CharacterBase.prototype.setFoundCommon = function(common) {
        this._foundCommon = common;
    };
    Game_CharacterBase.prototype.getFoundCommon = function() {
        return parseInt(ConvVb(this._foundCommon), 10);
    };
    Game_CharacterBase.prototype.setFoundDelay = function(delay) {
        this._foundDelay = parseInt(ConvVb(delay), 10);
    };
    Game_CharacterBase.prototype.getFoundDelay = function() {
        return this._foundDelay;
    };
    Game_CharacterBase.prototype.resetFoundDelay = function() {
        this._foundDelay = this.getFoundMaxDelay();
    };
    Game_CharacterBase.prototype.setFoundMaxDelay = function(delay) {
        this._foundMaxDelay = delay;
    };
    Game_CharacterBase.prototype.getFoundMaxDelay = function() {
        return parseInt(ConvVb(this._foundMaxDelay), 10);
    };
    Game_CharacterBase.prototype.setLostBallon = function(ballon) {
        this._lostBallon = ballon;
    };
    Game_CharacterBase.prototype.getLostBallon = function() {
        return parseInt(ConvVb(this._lostBallon), 10);
    };
    Game_CharacterBase.prototype.setLostCommon = function(common) {
        this._lostCommon = common;
    };
    Game_CharacterBase.prototype.getLostCommon = function() {
        return parseInt(ConvVb(this._lostCommon), 10);
    };
    Game_CharacterBase.prototype.setLostDelay = function(delay) {
        this._lostDelay = parseInt(ConvVb(delay), 10);
    };
    Game_CharacterBase.prototype.getLostDelay = function() {
        return this._lostDelay;
    };
    Game_CharacterBase.prototype.resetLostDelay = function() {
        this._lostDelay = this.getLostMaxDelay();
    };
    Game_CharacterBase.prototype.setLostMaxDelay = function(delay) {
        this._lostMaxDelay = delay;
    };
    Game_CharacterBase.prototype.getLostMaxDelay = function() {
        return parseInt(ConvVb(this._lostMaxDelay), 10);
    };
    Game_CharacterBase.prototype.setActiveMode = function(mode) {
        this._activeMode = mode;
    };
    Game_CharacterBase.prototype.getActiveMode = function() {
        return parseInt(ConvSw(this._activeMode, this), 10);;
    };
    Game_CharacterBase.prototype.setForceLost = function(forceLost) {
        this._forceLost = forceLost;
    };
    Game_CharacterBase.prototype.getForceLost = function() {
        return this._forceLost;
    };
    Game_CharacterBase.prototype.isSensorFound = function() {
        return this.getSensorStatus() == 1 && this.getFoundStatus() == 1;
    };
    if(DefAutoSensor[0]) {
        const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
        Game_Map.prototype.setupEvents = function() {
            _Game_Map_setupEvents.call(this);
            $gameSystem.startSensor();
        };
    }
    const _Game_EventSetupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_EventSetupPageSettings.call(this);
        if(this.getSensorStatus() == -2) {
            this.setupSensor();
        }
        // if($gameSystem.isFoundPlayer() == this.eventId()) {
        //     this.turnTowardPlayer();
    };
    Game_Event.prototype.setupSensor = function() {
        let event, pattern, match, note, cnt, i, n, m,
            options, op, value;
        event = this.event();
        pattern = /<(.?)(?:psensor)(l|f|s|d)?(?:\:)(\\v\[\d+\]|\d+)([ 0-9a-z\[\]\\]*)?>/i
        if(event.note) {
            note = event.note.toLowerCase();
            note = note.split(/ (?=<)/);
            cnt = note.length;
            for(i = 0;i < cnt;i++) {
                n = note[i].trim();
                if(n.match(pattern)) {
                    match = n.match(pattern);
                    if(match[1] && match[1] == "!") { 
                        this.setSensorStatus(-1);
                    }
                    switch(match[2]) { 
                        case "l":
                        case "f":
                        case "s":
                        case "d":
                            this.setSensorType(match[2]);
                            break;
                        default:
                            continue;
                            break;
                    }
                    if(match[3]) { 
                        value = String(match[3]);
                        value = value.replace(/\\/g, '\x1b');
                        value = value.replace(/\x1b\x1b/g, '\\');
                        if(this.getSensorType() == "df" && isFinite(value) && (value <= 1 || (value % 2))) {
                            value = 2;
                        }
                        this.setSensorRange(value);
                        this.setSensorRangeC(value);
                    }
                    if(match[4]) { 
                        options = match[4].trim().split(" ");
                        options.forEach(function(op){
                            op = op.replace(/\\/g, '\x1b');
                            op = op.replace(/\x1b\x1b/g, '\\');
                            if(op.match(/^sw([a-d]|\d+)$/)) { 
                                m = op.match(/^sw([a-d]|\d+)$/);
                                this.setSensorSwitch(m[1]);
                            } else if(op.match(/^lsw([a-d]|\d+)$/)) { 
                                m = op.match(/^lsw([a-d]|\d+)$/);
                                this.setLostSensorSwitch(m[1]);
                            } else if(op.match(/^bo([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { 
                                m = op.match(/^bo([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setBothSensor(m[1]);
                            } else if(op.match(/^rv([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { 
                                m = op.match(/^rv([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setRangeVisible(m[1]);
                            } else if(op.match(/^td([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { 
                                m = op.match(/^td([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setTerrainDecision(m[1]);
                            } else if(op.match(/^di([urld])$/)) { 
                                m = op.match(/^di([urld])$/);
                                this.setDirectionFixed(m[1]);
                            } else if(op.match(/^ev([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { 
                                m = op.match(/^ev([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setEventDecision(m[1]);
                            } else if(op.match(/^rg(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^rg(\d+|\x1bv\[(\d+)\])$/);
                                this.setRegionDecision(m[1]);
                            } else if(op.match(/^fb(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^fb(\d+|\x1bv\[(\d+)\])$/);
                                this.setFoundBallon(m[1]);
                            } else if(op.match(/^fc(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^fc(\d+|\x1bv\[(\d+)\])$/);
                                this.setFoundCommon(m[1]);
                            } else if(op.match(/^fd(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^fd(\d+|\x1bv\[(\d+)\])$/);
                                this.setFoundMaxDelay(m[1]);
                                this.setFoundDelay(m[1]);
                            } else if(op.match(/^lb(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^lb(\d+|\x1bv\[(\d+)\])$/);
                                this.setLostBallon(m[1]);
                            } else if(op.match(/^lc(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^lc(\d+|\x1bv\[(\d+)\])$/);
                                this.setLostCommon(m[1]);
                            } else if(op.match(/^ld(\d+|\x1bv\[(\d+)\])$/)) { 
                                m = op.match(/^ld(\d+|\x1bv\[(\d+)\])$/);
                                this.setLostMaxDelay(m[1]);
                                this.setLostDelay(m[1]);
                            } else if(op.match(/^am([0-1]|\x1bs\[(\d+|[a-d])\])$/)) { 
                                m = op.match(/^am([0-1]|\x1bs\[(\d+|[a-d])\])$/);
                                this.setActiveMode(m[1]);
                            }
                        }, this);
                    }
                }
            }
        }
    };
    const _Game_EventUpdate = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_EventUpdate.call(this);
        // if(!this._erased && $gameSystem.isSensorStart()) {
        if(!this.isInvisible() && $gameSystem.isSensorStart()) {
            this.sensorUpdate();
        }
    };
    Game_Event.prototype.sensorUpdate = function() {
        if (btlflg || MenuFlgSwich) return; 
        if(this.getSensorStatus() == 1 && (!this.isStarting() || this.getActiveMode() == 1)){
            if(this.isFoundPlayer() && this.getForceLost() == 0) {
                if(this.getFoundStatus() == 0) {
                    this.foundPlayer();
                }
                if(this.getLostDelay() < this.getLostMaxDelay()) this.resetLostDelay();
            } else if(this.getFoundStatus() == 1 || this.getForceLost() > 0) {
                this.lostPlayer();
                if(this.getFoundDelay() < this.getFoundMaxDelay()) {
                    this.resetFoundDelay();
                    this.setForceLost(0);
                }
            } else {
                if(this.getFoundDelay() < this.getFoundMaxDelay()) {
                    this.resetFoundDelay();
                    this.setForceLost(0);
                }
            }
        }
        // if(this.getSensorStatus() == 1){
        //     if(!this.isStarting() || this.getActiveMode() == 1) {
        //         if(this.isFoundPlayer()) {
        //             if(this.getFoundStatus() == 0) {
        //                 this.foundPlayer();
        //             if(this.getLostDelay() < this.getLostMaxDelay()) this.resetLostDelay();
        //         } else if(this.getFoundStatus() == 1) {
        //             this.lostPlayer();
        //             if(this.getFoundDelay() < this.getFoundMaxDelay()) this.resetFoundDelay();
        //             if(this.getFoundDelay() < this.getFoundMaxDelay()) this.resetFoundDelay();
    };
    Game_Event.prototype.foundPlayer = function() {
        let mapId, eventId, sw, key, sensorSwitch, delay, lostSensorSwitch;
        delay = this.getFoundDelay();
        if(delay <= 0) {
            sensorSwitch = DefSensorSwitch[0];
            lostSensorSwitch = DefLostSensorSwitch[0];
            mapId = $gameMap.mapId();
            eventId = this.eventId();
            this.setFoundStatus(1);
            this.resetFoundDelay();
            this.resetLostDelay();
            sw = (this.getSensorSwitch() != null)? this.getSensorSwitch() : sensorSwitch;
            if(isFinite(sw)) {
                if(!$gameSwitches.value(sw)) {
                    $gameSwitches.setValue(sw, true);
                }
                // $gameSystem.setSwitchStatuses(sw, eventId);
            } else if(sw.match(/[a-dA-D]/)) {
                key = [mapId, eventId, sw.toUpperCase()];
                if(!$gameSelfSwitches.value(key)) {
                    $gameSelfSwitches.setValue(key, true);
                }
            }
            sw = (this.getLostSensorSwitch() != null)? this.getLostSensorSwitch() : lostSensorSwitch;
            if(sw != "") {
                if(isFinite(sw)) {
                    if($gameSwitches.value(sw)) {
                        $gameSwitches.setValue(sw, false);
                    }
                } else if(sw.match(/[a-dA-D]/)) {
                    key = [mapId, eventId, sw.toUpperCase()];
                    if($gameSelfSwitches.value(key)) {
                        $gameSelfSwitches.setValue(key, false);
                    }
                }
            }
            if (this._foundSe.name != "") {
                AudioManager.playSe(this._foundSe);
            }
            if (this._foundBallon > 0) {
                this.requestBalloon(this._foundBallon);
            }
            if (this._foundCommon > 0) {
                $gameTemp.reserveCommonEvent(this._foundCommon);
                if($gameMap._interpreter) {
                    $gameMap._interpreter.setupReservedCommonEventEx(this.eventId());
                }
            }
        } else {
            this.setFoundDelay(--delay);
            // console.log("foundDelay:"+this.getFoundDelay());
        }
    };
    Game_Event.prototype.lostPlayer = function() {
        let mapId, eventId, sw, key, sensorSwitch, delay, lostSensorSwitch;
        delay = this.getLostDelay();
        if(delay <= 0) {
            sensorSwitch = DefSensorSwitch[0];
            lostSensorSwitch = DefLostSensorSwitch[0];
            mapId = $gameMap.mapId();
            eventId = this.eventId();
            this.setForceLost(0);
            this.setFoundStatus(0);
            this.resetLostDelay();
            this.resetFoundDelay();
            sw = (this.getSensorSwitch() != null)? this.getSensorSwitch() : sensorSwitch;
            if(isFinite(sw)) {
                // if($gameSwitches.value(sw) && !$gameSystem.isSwitchStatuses(sw)) {
                if($gameSwitches.value(sw)) {
                    $gameSwitches.setValue(sw, false);
                }
                // $gameSystem.removeSwitchStatuses(sw, eventId);
            } else if(sw.match(/[a-dA-D]/)) {
                key = [mapId, eventId, sw.toUpperCase()];
                if($gameSelfSwitches.value(key)) {
                    $gameSelfSwitches.setValue(key, false);
                }
            }
            sw = (this.getLostSensorSwitch() != null)? this.getLostSensorSwitch() : lostSensorSwitch;
            if(sw != "") {
                if(isFinite(sw)) {
                    if(!$gameSwitches.value(sw)) {
                        $gameSwitches.setValue(sw, true);
                    }
                } else if(sw.match(/[a-dA-D]/)) {
                    key = [mapId, eventId, sw.toUpperCase()];
                    if(!$gameSelfSwitches.value(key)) {
                        $gameSelfSwitches.setValue(key, true);
                    }
                }
            }
            if (this._lostSe.name != "") {
                AudioManager.playSe(this._lostSe);
            }
            if (this._lostBallon > 0) {
                this.requestBalloon(this._lostBallon);
            }
            if (this._lostCommon > 0) {
                $gameTemp.reserveCommonEvent(this._lostCommon);
                if($gameMap._interpreter) {
                    $gameMap._interpreter.setupReservedCommonEventEx(this.eventId());
                }
            }
        } else {
            this.setLostDelay(--delay);
            // console.log("lostDelay:"+this.getLostDelay());
        }
    };
    Game_Event.prototype.isFoundPlayer = function() {
        let result = false;
        switch(this.getSensorType()) {
            case "l": 
                result = this.sensorLine();
                break;
            case "f": 
                result = this.sensorFan();
                break;
            case "s": 
                result = this.sensorSquare();
                break;
            case "d": 
                result = this.sensorDiamond();
                break;
        }
        // if(result) {
        //     $gameSystem.setFoundPlayer(this.eventId());
        return result;
    };
    Game_Event.prototype.sensorLine = function() {
        let sensorRange, sensorRangeC, strDir, diagoDir, dir, dirFixed, ex, ey, i,
        coordinates, px, py, cnt, realX, realY;
        sensorRange = this.getSensorRange();
        dirFixed = this.getDirectionFixed();
        dir = (dirFixed == -1)? this.direction() : dirFixed;
        px = $gamePlayer._realX;
        py = $gamePlayer._realY;
        ex = this._realX;
        ey = this._realY;
        realX = DefRealRangeX[0];
        realY = DefRealRangeY[0];
        //this.setSensorRangeC(sensorRange);
        sensorRangeC = sensorRange;
        this.clearCoordinate();
        switch(dir) {
            case 8:// 上向き(y<0)
                strDir = DIR_UP;
                diagoDir = DIR_RIGHT;
                this.rangeSearch(strDir, 0, 0, 0, -1, sensorRange);
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), -1, 0)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(px >= ex + coordinates[i][0] - realX
                                && px <= ex + coordinates[i][0] + realX
                                && py >= ey - Math.abs(coordinates[i][1]) - realY
                                && py <= ey + Math.abs(coordinates[i][0])) {
                            return true;
                        }
                    }
                }
                break;
            case 6:// 右向き(x>0)
                strDir = DIR_RIGHT;
                diagoDir = DIR_DOWN;
                this.rangeSearch(strDir, 0, 0, 1, 0, sensorRange);
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 0, -1)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(py >= ey + coordinates[i][1] - realY
                                && py <= ey + coordinates[i][1] + realY
                                && px >= ex + Math.abs(coordinates[i][1]) - realX
                                && px <= ex + coordinates[i][0] + realX) {
                            return true;
                        }
                    }
                }
                break;
            case 4:// 左向き(x<0)
                strDir = DIR_LEFT;
                diagoDir = DIR_UP;
                this.rangeSearch(strDir, 0, 0, -1, 0, sensorRange);
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 0, 1)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(py <= ey + coordinates[i][1] + realY
                                && py >= ey + coordinates[i][1] - realY
                                && px <= ex + Math.abs(coordinates[i][1]) + realX
                                && px >= ex + coordinates[i][0] - realX) {
                            return true;
                        }
                    }
                }
                break;
            case 2:// 下向き(y>0)
                strDir = DIR_DOWN;
                diagoDir = DIR_LEFT;
                this.rangeSearch(strDir, 0, 0, 0, 1, sensorRange);
                if(this.isSideSearch(diagoDir, this.reverseDir(diagoDir), 1, 0)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                if(cnt == 1) {
                    i = 0;
                    if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                    } else {
                        if(px >= ex + coordinates[i][0] - realX
                                && px <= ex + coordinates[i][0] + realX
                                && py >= ey + Math.abs(coordinates[i][0])
                                && py <= ey + coordinates[i][1] + realY) {
                            return true;
                        }
                    }
                }
                break;
        }
        return false;
    };
    Game_Event.prototype.sensorFan = function() {
        let sensorRange, sensorRangeC, dir, dirFixed, sx, sy, ex, ey, px, py,
            noPass, noPassTemp, i, j, coordinates, sign, strDir, diagoDir, cnt,
            terrainDecision, realX, realY, rex, rey;
        sensorRange = this.getSensorRange();
        dirFixed = this.getDirectionFixed();
        dir = (dirFixed == -1)? this.direction() : dirFixed;
        px = $gamePlayer._realX;
        py = $gamePlayer._realY;
        sx = this.deltaXFrom($gamePlayer.x);
        sy = this.deltaYFrom($gamePlayer.y);
        ex = this.x;
        ey = this.y;
        rex = this._realX;
        rey = this._realY;
        noPass = 0;
        terrainDecision = DefTerrainDecision_Set; 
        realX = DefRealRangeX[0];
        realY = DefRealRangeY[0];
        this.setSensorRangeC(sensorRange);
        sensorRangeC = sensorRange;
        this.clearCoordinate();
        switch(dir) {
            case DIR_UP:// 上向き(y<0)
                sign = 1;
                strDir = DIR_UP;
                diagoDir = DIR_RIGHT;
                noPass = this.rangeSearch(strDir, 0, 0, 0, -1, sensorRange);
                if(noPass != sensorRange) noPass++;
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j * sign, -j, 0, -1, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j * sign, ey - j, diagoDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey - j, strDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey - j - 1, diagoDir)
                                    || !this.isMapPassableEx(ex + (j + 1) * sign, ey - j, strDir)) {
                                break;
                            }
                        }
                    }
                    this.addCoordinate(sensorRange * i + 1 + i);
                    if(i == 1) {
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, -1, 0)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(px <= rex + coordinates[i][0] + realX
                            && px >= rex + coordinates[i][0] - realX
                            && py <= rey - Math.abs(coordinates[i][0]) + realY
                            && py >= rey + coordinates[i][1] - realY) {
                        return true;
                    }
                }
                break;
            case DIR_RIGHT:// 右向き(x>0)
                sign = 1;
                strDir = DIR_RIGHT;
                diagoDir = DIR_DOWN;
                noPass = this.rangeSearch(strDir, 0, 0, 1, 0, sensorRange);
                if(noPass != sensorRange) noPass++;
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j, j * sign, 1, 0, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex + j, ey + j * sign, strDir)
                                    || !this.isMapPassableEx(ex + j + 1, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex + j, ey + (j + 1) * sign, strDir)) {
                                break;
                            }
                        }
                    }
                    this.addCoordinate(sensorRange * i + 1 + i);
                    if(i == 1) {
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 0, -1)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(py >= rey + coordinates[i][1] - realY
                            && py <= rey + coordinates[i][1] + realY
                            && px >= rex + Math.abs(coordinates[i][1]) - realX
                            && px <= rex + coordinates[i][0] + realX) {
                        return true;
                    }
                }
                break;
            case DIR_LEFT:// 左向き(x<0)
                sign = -1;
                strDir = DIR_LEFT;
                diagoDir = DIR_UP;
                noPass = this.rangeSearch(strDir, 0, 0, -1, 0, sensorRange);
                if(noPass != sensorRange) noPass++;
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, -j, j * sign, -1, 0, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex - j, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex - j, ey + j * sign, strDir)
                                    || !this.isMapPassableEx(ex - j - 1, ey + j * sign, diagoDir)
                                    || !this.isMapPassableEx(ex - j, ey + (j + 1) * sign, strDir)) {
                                break;
                            }
                        }
                    }
                    this.addCoordinate(sensorRange * i + 1 + i);
                    if(i == 1) {
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 0, 1)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(py <= rey + coordinates[i][1] + realY
                            && py >= rey + coordinates[i][1] - realY
                            && px <= rex - Math.abs(coordinates[i][1]) + realX
                            && px >= rex + coordinates[i][0] - realX) {
                        return true;
                    }
                }
                break;
            case DIR_DOWN:// 下向き(y>0)
                sign = -1;
                strDir = DIR_DOWN;
                diagoDir = DIR_LEFT;
                noPass = this.rangeSearch(strDir, 0, 0, 0, 1, sensorRange);
                if(noPass != sensorRange) noPass++;
                this.setCoordinate(0, 0, "C");
                noPassTemp = noPass;
                for(i = 1;i < 3; i++) {
                    for(j = 0; j <= sensorRange; j++) {
                        if(j > 0) {
                            noPassTemp = this.rangeSearch(strDir, j * sign, j, 0, 1, noPassTemp);
                            if(j != noPassTemp) {
                                noPassTemp++;
                            } else {
                                noPassTemp = noPassTemp + j;
                            }
                        }
                        if(this.getTerrainDecision() == 1
                                || (this.getTerrainDecision() == -1 && terrainDecision)) {
                            if(!this.isMapPassableEx(ex + j * sign, ey + j, diagoDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey + j, strDir)
                                    || !this.isMapPassableEx(ex + j * sign, ey + j + 1, diagoDir)
                                    || !this.isMapPassableEx(ex + (j + 1) * sign, ey + j, strDir)) {
                                break;
                            }
                        }
                    }
                    this.addCoordinate(sensorRange * i + 1 + i);
                    if(i == 1) {
                        this.setCoordinate(0, 0, "C");
                        noPassTemp = noPass;
                        sign = signChange(sign);
                        diagoDir = this.reverseDir(diagoDir);
                    }
                }
                if(this.isSideSearch(this.reverseDir(diagoDir), diagoDir, 1, 0)) return true;
                coordinates = this.getCoordinate();
                cnt = coordinates.length;
                for(i = 0; i < cnt; i++) {
                    if(coordinates[i][2] == "Add") {
                        continue;
                    }else if(coordinates[i][2] == "C") {
                        continue;
                    }else if(coordinates[i][0] == 0 && coordinates[i][1] == 0) {
                        continue;
                    }
                    if(px >= rex + coordinates[i][0] - realX
                            && px <= rex + coordinates[i][0] + realX
                            && py >= rey + Math.abs(coordinates[i][0]) - realY
                            && py <= rey + coordinates[i][1] + realY) {
                        return true;
                    }
                }
                break;
        }
        return false;
    };
    // 菱形範囲の探索(地形考慮完全無視)
    Game_Event.prototype.sensorDiamond = function() {
        let sensorRange, sx, sy, realX, realY;
        sensorRange = this.getSensorRange();
        sx = this.deltaXFrom($gamePlayer._realX);
        sy = this.deltaYFrom($gamePlayer._realY);
        realX = DefRealRangeX[0];
        realY = DefRealRangeY[0];
        this.setSensorRangeC(sensorRange);
        this.clearCoordinate();
        this.setCoordinate(0, -sensorRange, DIR_RIGHT);
        this.setCoordinate(sensorRange, 0, DIR_DOWN);
        this.setCoordinate(0, sensorRange, DIR_LEFT);
        this.setCoordinate(-sensorRange, 0, DIR_UP);
        if(Math.abs(sx) + Math.abs(sy) <= sensorRange + Math.max(realX, realY)) {
            return true;
        }
    }
    // 四角範囲の探索(地形考慮完全無視)
    Game_Event.prototype.sensorSquare = function() {
        let sensorRange, sx, sy, realX, realY;
        sensorRange = this.getSensorRange();
        sx = this.deltaXFrom($gamePlayer._realX);
        sy = this.deltaYFrom($gamePlayer._realY);
        realX = DefRealRangeX[0];
        realY = DefRealRangeY[0];
        this.setSensorRangeC(sensorRange);
        this.clearCoordinate();
        if(Math.abs(sx) <= sensorRange + realX && Math.abs(sy) <= sensorRange + realY) {
            return true;
        }
    }
    Game_Event.prototype.isSideSearch = function(directionR, directionL, vx, vy) {
        let sx, sy, ex, ey, bothSensor, terrainDecision, realX, realY;
        sx = this.deltaXFrom($gamePlayer._realX);
        sy = this.deltaYFrom($gamePlayer._realY);
        ex = this.x;
        ey = this.y;
        bothSensor = DefBothSensor_Set; 
        terrainDecision = DefTerrainDecision_Set; 
        realX = DefRealRangeX[0];
        realY = DefRealRangeY[0];
        if(this.getBothSensor() == -1 && bothSensor) {
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                this.setBothSensorRight(this.isMapPassableEx(ex, ey, directionR));
                this.setBothSensorLeft(this.isMapPassableEx(ex, ey, directionL));
            } else {
                this.setBothSensorRight(true);
                this.setBothSensorLeft(true);
            }
        } else if(this.getBothSensor() == 1) {
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                this.setBothSensorRight(this.isMapPassableEx(ex, ey, directionR));
                this.setBothSensorLeft(this.isMapPassableEx(ex, ey, directionL));
            } else {
                this.setBothSensorRight(true);
                this.setBothSensorLeft(true);
            }
        } else {
            this.setBothSensorRight(false);
            this.setBothSensorLeft(false);
        }
        if(this.getBothSensorRight()
                && sx >= vx - realX && sx <= vx + realX
                && sy >= vy - realY && sy <= vy + realY) {
            return true;
        }
        vx = (vx == 0)? vx : -vx;
        vy = (vy == 0)? vy : -vy;
        if(this.getBothSensorLeft()
                && sx >= vx - realX && sx <= vx + realX
                && sy >= vy - realY && sy <= vy + realY) {
            return true;
        }
        return false;
    };
    Game_Event.prototype.rangeSearch = function(strDir, rx, ry, signX, signY, noPass) {
        let sensorRange, ex, ey, cx, cy, sx, sy, j, obstacle ,cnt, status,
            noPassDir, terrainDecision;
        sensorRange = this.getSensorRange();
        cnt = sensorRange - Math.abs(rx);
        ex = this.x;
        ey = this.y;
        obstacle = -1;
        status = "Last";
        noPassDir = (signX != 0)? ry : rx;
        terrainDecision = DefTerrainDecision_Set; 
        for(j = 0; j <= cnt; j++) {
            cx = rx + j * signX;
            cy = ry + j * signY;
            if(this.getTerrainDecision() == 1
                    || (this.getTerrainDecision() == -1 && terrainDecision)) {
                if(!this.isMapPassableEx(ex + cx, ey + cy, strDir) && j < sensorRange) {
                    obstacle = j + Math.abs(rx);
                    status = "Line";
                    break;
                }
                if(j + Math.abs(noPassDir) >= noPass && noPass < sensorRange) {
                    status = "Nopass";
                    break;
                }
            }
        }
        sx = this.deltaXFrom(ex + cx);
        if(sx != 0) sx *= -1;
        sy = this.deltaYFrom(ey + cy);
        if(sy != 0) sy *= -1;
        switch (strDir){
            case 8:
            case 2:
                if (Math.abs(sx) < 5) {
                    this.setCoordinate(sx, sy, status);
                }
                break;
            case 4:
            case 6:
                if (Math.abs(sy) < 5) {
                    this.setCoordinate(sx, sy, status);
                }
                break;
        }
        return (obstacle < 0)? noPass : obstacle;
    };
    const _GameEvent_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function() {
        if(this.getSensorStatus() != 1) {
            _GameEvent_lock.call(this);
        } else {
            // 話しかけられた場合振り向かない(探索者が探索中に限る)
            if (!this._locked) {
                this._prelockDirection = this.direction();
                // this.turnTowardPlayer();
                this._locked = true;
            }
        }
    };
    Game_Event.prototype.addCoordinate = function(length) {
        let coordinates, cnt, j;
        coordinates = this.getCoordinate();
        cnt = coordinates.length;
        for(j = cnt; j < length; j++) {
            this.setCoordinate(0, 0, "Add");
        }
    };
    const _Game_Event_erase = Game_Event.prototype.erase;
    Game_Event.prototype.erase = function() {
        this.setSensorStatus(0);
        this.setFoundStatus(0);
        this.setViewRangeStatus(0);
        _Game_Event_erase.call(this);
    };
    const _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        if(this.isSensorFound() && DefTrackingPriority[0]) {
            return Game_CharacterBase.prototype.isCollidedWithEvents.apply(this, arguments);
        } else {
            return _Game_Event_isCollidedWithEvents.apply(this, arguments);
        }
    };
    Game_Event.prototype.isInvisible = function() {
        return this._erased || this.characterName() == "";
    }
    const _Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
        if(!this.isSensorFound() || !DefFollowerThrough[0]) {
            return _Game_Event_isCollidedWithPlayerCharacters.call(this, x, y);
        }
        return this.isNormalPriority() && !$gamePlayer.isThrough() && $gamePlayer.pos(x, y);
    };
    // Game_Followers.prototype.member = function() {
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createViewRange();
    }
    Spriteset_Map.prototype.createViewRange = function() {
        this._viewRangeSprites = [];
        $gameMap.events().forEach(function(event) {
            if(event._sensorType) {
                this._viewRangeSprites.push(new Sprite_ViewRange(event));
                event.enableCreateRange();
            }
        }, this);
        for (let i = 0; i < this._viewRangeSprites.length; i++) {
            this._tilemap.addChild(this._viewRangeSprites[i]);
        }
    };
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if(this._viewRangeSprites) {
            this.updateViewRange();
        }
    };
    Spriteset_Map.prototype.updateViewRange = function() {
        if (btlflg || MenuFlgSwich) return; 
        let cnt;
        cnt = this._viewRangeSprites.length - 1;
        cnt = cnt >= 0 ? cnt : 0;
        $gameMap.events().filter(function(event) {
            return !event.isCreateRange();
        }).forEach(function(event) {
            if(event._sensorType) {
                this._viewRangeSprites.push(new Sprite_ViewRange(event));
                event.enableCreateRange();
            }
        }, this);
        for (; cnt < this._viewRangeSprites.length; cnt++) {
            this._tilemap.addChild(this._viewRangeSprites[cnt]);
        }
    };
    function Sprite_ViewRange() {
        this.initialize.apply(this, arguments);
    }
    Sprite_ViewRange.prototype = Object.create(Sprite.prototype);
    Sprite_ViewRange.prototype.constructor = Sprite_ViewRange;
    Sprite_ViewRange.prototype.initialize = function(character) {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.setCharacter(character);
        this._frameCount = 0;
        this.z = DefRangePosition[0] == 1 ? 6 : 2;
    };
    Sprite_ViewRange.prototype.initMembers = function() {
        this._character = null;
        this._coordinates = null;
    };
    Sprite_ViewRange.prototype.setCharacter = function(character) {
        this._character = character;
    };
    Sprite_ViewRange.prototype.update = function() {
        if (btlflg || MenuFlgSwich) return; 
        let sensorStatus, rangeStatus, rangeVisible, defVisible;
        Sprite.prototype.update.call(this);
        sensorStatus = this._character.getSensorStatus();
        rangeStatus = this._character.getViewRangeStatus();
        rangeVisible = this._character.getRangeVisible();
        defVisible = ConvSw(DefRangeVisible[0]);
        if(this._character && this._character._erased) {
            this.parent.removeChild(this);
        }
        if(this._character && !this._character._erased && sensorStatus == 1 && (rangeVisible == 1 || (rangeVisible == -1 && defVisible))) {
            this.updatePosition();
            if(this.bitmap) {
                if(rangeStatus == 1) {
                    if(this._coordinate.length == 0) {
                        this._coordinate = this._character.getCoordinate();
                    }
                    this.updateBitmap();
                } else if(rangeStatus == 2) {
                    this._coordinate = this._character.getCoordinate();
                    this.createBitmap();
                }
            } else {
                this._coordinate = this._character.getCoordinate();
                this.createBitmap();
            }
            this.visible = true;
        } else {
            this.visible = false;
        }
    };
    Sprite_ViewRange.prototype.createBitmap = function() {
        if (btlflg || MenuFlgSwich) return; 
        let direction, dirFixed, sensorRange, sensorRangeC, sensorType,
            tileWidth, tileHeight, width, height, coordinates,
            sideSensorR, sideSensorL, bs, bias, color, opacity,
            bothSensor;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        bothSensor = DefBothSensor_Set; 
        coordinates = this._coordinate;
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        sensorRange = this._character.getSensorRange();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        sideSensorR = this._character.getBothSensorRight();
        sideSensorL = this._character.getBothSensorLeft();
        bias = (bothSensor) ? 3
            : (this._character.getBothSensor() > 0) ? 3 : 1;
        color = DefRangeColor[0];
        opacity = DefRangeOpacity[0];
        // if (this._character.bitmapKeep == undefined) {
        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillViewRangeLine(color, this._character);
                break;
            case "f":
                if(direction == DIR_UP) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                this.bitmap = new Bitmap(width, height);
                if(sensorType == "f") {
                    this.bitmap.fillViewRangeFan(color, this._character);
                } else {
                    this.bitmap.fillViewRangeFrontDiamond(color, this._character);
                }
                break;
            case "d":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillViewRangeDiamond(color, this._character);
                break;
            case "s":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                this.bitmap = new Bitmap(width, height);
                this.bitmap.fillAll(color);
                break;
        }
        this.opacity = opacity;
        this.blendMode = Graphics.BLEND_ADD;
        this.visible = true;
        this._character.setViewRangeStatus(1);
    };
    Sprite_ViewRange.prototype.updateBitmap = function() {
        if (btlflg || MenuFlgSwich) return; 
        let direction, dirFixed, sensorRange, sensorRangeC, sensorType,
            tileWidth, tileHeight, width, height, i, cnt,
            tmpCoordinate, coordinate, bias, color, opacity,
            bothSensor;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        bothSensor = DefBothSensor_Set; 
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        sensorRange = this._character.getSensorRange();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        tmpCoordinate =  this._coordinate;
        coordinate = this._character.getCoordinate();
        cnt = (tmpCoordinate.length < coordinate.length)? tmpCoordinate.length : coordinate.length;
        bias = (bothSensor)? 3
            : (this._character.getBothSensor() > 0)? 3 : 1;
        color = DefRangeColor[0];
        opacity = DefRangeOpacity[0];
        for(i = 0; i < cnt; i++) {
            if(coordinate[i][0] != tmpCoordinate[i][0] || coordinate[i][1] != tmpCoordinate[i][1]) {
                if(tmpCoordinate[i][3] == -1) {
                    tmpCoordinate[i][3] = $gameMap.tileWidth();
                } else if(tmpCoordinate[i][3] != 0) {
                    tmpCoordinate[i][3]--;
                }
            } else {
                coordinate[i][3] = 0;
            }
        }
        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * bias;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * bias;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillViewRangeLine(color, this._character);
                break;
            case "f":
                if(direction == DIR_UP) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileWidth;
                    this.anchor.x = 0.5;
                    this.anchor.y = 1;
                } else if(direction == DIR_RIGHT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 0;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_LEFT) {
                    width = tileWidth * sensorRange + tileWidth;
                    height = tileHeight * sensorRange * 2 + tileHeight;
                    this.anchor.x = 1;
                    this.anchor.y = 0.5;
                } else if(direction == DIR_DOWN) {
                    width = tileWidth * sensorRange * 2 + tileWidth;
                    height = tileHeight * sensorRange + tileHeight;
                    this.anchor.x = 0.5;
                    this.anchor.y = 0;
                }
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                if(sensorType == "f") {
                    this.bitmap.fillViewRangeFan(color, this._character);
                } else {
                    this.bitmap.fillViewRangeFrontDiamond(color, this._character);
                }
                break;
            case "d":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillViewRangeDiamond(color, this._character);
                break;
            case "s":
                width = tileWidth * sensorRange * 2 + tileWidth;
                height = tileHeight * sensorRange * 2 + tileHeight;
                this.anchor.x = 0.5;
                this.anchor.y = 0.55;
                if(this.bitmap.width != width || this.bitmap.height != height) {
                    this.bitmap.clear();
                    this.bitmap = new Bitmap(width, height);
                }
                this.bitmap.fillAll(color);
                break;
        }
        this.opacity = opacity;
        this.blendMode = Graphics.BLEND_ADD;
        this.visible = true;
    };
    Sprite_ViewRange.prototype.updatePosition = function() {
        if (btlflg || MenuFlgSwich) return; 
        let direction, dirFixed, sensorRangeC, sensorType, cx, cy, tileWidth, tileHeight, bias;
        direction = this._character.direction();
        dirFixed = this._character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        sensorType = this._character.getSensorType();
        sensorRangeC = this._character.getSensorRangeC();
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        cx = this._character.screenX();
        cy = this._character.screenY();
        bias = 6;
        this.x = cx;
        this.y = cy;
        switch(sensorType) {
            case "l":
                if(direction == DIR_UP) {
                    this.y = cy + bias;
                } else if(direction == DIR_RIGHT) {
                    this.x = cx + tileWidth / 2 - tileWidth;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_LEFT) {
                    this.x = cx + tileWidth / 2;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_DOWN) {
                    this.y = cy - tileHeight + bias;
                }
                break;
            case "f":
                if(direction == DIR_UP) {
                    this.y = cy + bias;
                } else if(direction == DIR_RIGHT) {
                    this.x = cx + tileWidth / 2 - tileWidth;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_LEFT) {
                    this.x = cx + tileWidth / 2;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_DOWN) {
                    this.y = cy - tileHeight + bias;
                }
                break;
            case "df":
                if(direction == DIR_UP) {
                    this.y = cy + bias;
                } else if(direction == DIR_RIGHT) {
                    this.x = cx + tileWidth / 2 - tileWidth;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_LEFT) {
                    this.x = cx + tileWidth / 2;
                    this.y = cy - tileHeight / 2 + bias;
                } else if(direction == DIR_DOWN) {
                    this.y = cy - tileHeight + bias;
                }
                break;
        }
    };
    var SensorDrawGcCounterUp = function (){
        SensorDrawGcCounter++;
        if(SensorDrawGcCounter >= 100){
            SensorDrawGcCounter = 0;
            NaGCUpFlg = true; 
        }
    }
    Bitmap.prototype.fillViewRangeLine = function(color, character) {
        let context, width, height, tileWidth, tileHeight,
            j, cx, cy, cnt, num, distanceX, distanceY,
            direction, dirFixed, coordinates, sideSensorR, sideSensorL;
        context = this._context;
        direction = character.direction();
        dirFixed = character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;
        sideSensorR = character.getBothSensorRight();
        sideSensorL = character.getBothSensorLeft();
        j = 0;
        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();
        if(direction == DIR_UP) {
            if(coordinates && cnt == 1) {
                num = 1;
                cx = width / 2 + tileWidth / 2;
                cy = height - tileHeight;
                distanceX = cx - tileWidth;
                distanceY = cy - Math.abs(coordinates[j][num]) * tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, 1, 1, sideSensorL, -1, 1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_RIGHT) {
            if(coordinates && cnt == 1) {
                num = 0;
                cx = tileWidth;
                cy = height / 2 + tileHeight / 2;
                distanceX = cx + Math.abs(coordinates[j][num]) * tileWidth;
                distanceY = cy - tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, -1, 1, sideSensorL, -1, -1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_LEFT) {
            if(coordinates && cnt == 1) {
                num = 0;
                cx = width - tileWidth;
                cy = height / 2 - tileHeight / 2;
                distanceX = cx - Math.abs(coordinates[j][num]) * tileWidth;
                distanceY = cy + tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, 1, -1, sideSensorL, 1, 1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
            }
        } else if(direction == DIR_DOWN) {
            if(coordinates && cnt == 1) {
                num = 1;
                cx = width / 2 - tileWidth / 2;
                cy = tileHeight;
                distanceX = cx + tileWidth;
                distanceY = cy + Math.abs(coordinates[j][num]) * tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, -1, -1, sideSensorL, 1, -1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
            }
        }
        context.fill();
        context.restore();
        this._setDirty();
        SensorDrawGcCounterUp();
    };
    Bitmap.prototype.fillViewRangeFan = function(color, character) {
        let context, width, height, tileWidth, tileHeight, cx, cy,
            coordinates, direction, dirFixed, sideSensorR, sideSensorL,
            i, j, cnt, num, distanceX, distanceY, sign;
        context = this._context;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;
        direction = character.direction();
        dirFixed = character.getDirectionFixed();
        direction = (dirFixed == -1)? direction : dirFixed;
        sideSensorR = character.getBothSensorRight();
        sideSensorL = character.getBothSensorLeft();
        var _CngFlg = false;
        if (character._direction != character._Bef_direction) {
            _CngFlg = true;
            character._Bef_direction = character._direction;
        }
        if (!_CngFlg){
            return;
        }
        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();
        if(direction == DIR_UP) {
            if(coordinates && cnt > 0) {
                sign = 1;
                num = 1;
                cx = width / 2 + tileWidth / 2;
                cy = height - tileHeight;
                distanceX = cx - tileWidth;
                distanceY = height - tileHeight - Math.abs(coordinates[0][num]) * tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, 1, 1, sideSensorL, -1, 1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width / 2 + tileWidth / 2 * sign + tileWidth * i * sign;
                    cy = height - tileHeight * i;
                    distanceX = cx + tileWidth * signChange(sign);
                    distanceY = height - tileHeight - Math.abs(coordinates[j][num]) * tileHeight;
                    this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_RIGHT) {
            if(coordinates && cnt > 0) {
                sign = 1;
                num = 0;
                cx = tileWidth;
                cy = height / 2 + tileHeight / 2;
                distanceX = tileWidth + Math.abs(coordinates[0][num]) * tileWidth;
                distanceY = cy - tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, -1, 1, sideSensorL, -1, -1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = tileHeight * i;
                    cy = height / 2 + tileHeight / 2 * sign + tileHeight * i * sign;
                    distanceX = tileWidth + Math.abs(coordinates[j][num]) * tileWidth;
                    distanceY = cy + tileHeight * signChange(sign);
                    this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_LEFT) {
            if(coordinates && cnt > 0) {
                sign = -1;
                num = 0;
                cx = width - tileWidth;
                cy = height / 2 - tileHeight / 2;
                distanceX = width - tileWidth - Math.abs(coordinates[0][num]) * tileWidth;
                distanceY = cy + tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, 1, -1, sideSensorL, 1, 1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width - tileHeight * i;
                    cy = height / 2 + tileHeight / 2 * sign + tileHeight * i * sign;
                    distanceX = width - tileWidth - Math.abs(coordinates[j][num]) * tileWidth;
                    distanceY = cy + tileHeight * signChange(sign);
                    this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        } else if(direction == DIR_DOWN) {
            if(coordinates && cnt > 0) {
                sign = -1;
                num = 1;
                cx = width / 2 - tileWidth / 2;
                cy = tileHeight;
                distanceX = cx + tileWidth;
                distanceY = tileHeight + Math.abs(coordinates[0][num]) * tileHeight;
                this.mkrSideDrawLine(context, cx, cy, [sideSensorR, -1, -1, sideSensorL, 1, -1]);
                this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                for(i = 1, j = 2; j < cnt; i++, j++) {
                    if(coordinates[j][2] == "Add") {
                        continue;
                    }else if(coordinates[j][2] == "C") {
                        sign = signChange(sign);
                        i = 1;
                        j++;
                    }else if(coordinates[j][0] == 0 && coordinates[j][1] == 0) {
                        continue;
                    }
                    cx = width / 2 + tileWidth / 2 * sign + tileWidth * i * sign;
                    cy = tileHeight * i;
                    distanceX = cx + tileWidth * signChange(sign);
                    distanceY = tileHeight + Math.abs(coordinates[j][num]) * tileHeight;
                    this.mkrDrawLine(context, cx, cy, distanceX, distanceY);
                }
            }
        }
        context.fill();
        context.restore();
        this._setDirty();
        SensorDrawGcCounterUp();
    };
    Bitmap.prototype.fillViewRangeDiamond = function(color, character) {
        let context, width, height, tileWidth, tileHeight, cx, cy,
            coordinates, rx, ry, dir, dx, dy, ndx, ndy,
            i, j, cnt, num, distanceX, distanceY, sign;
        context = this._context;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        coordinates = character.getCoordinate();
        cnt = coordinates.length;
        this.clear();
        context.save();
        context.fillStyle = color;
        context.beginPath();
        if(coordinates && cnt > 0) {
            sign = 1;
            num = 1;
            cx = width / 2 - tileWidth / 2;
            cy = 0;
            rx = cx;
            ry = cy;
            context.moveTo(cx, cy);
            for(i = 0; i < cnt; i++) {
                dx = coordinates[i][0];
                dy = coordinates[i][1];
                ndx = (i < cnt - 1)? coordinates[i+1][0] : coordinates[0][0];
                ndy = (i < cnt - 1)? coordinates[i+1][1] : coordinates[0][1];
                dir = coordinates[i][2];
                switch(dir) {
                    case DIR_UP:
                        ry -= tileHeight;
                        break;
                    case DIR_RIGHT:
                        rx += tileWidth;
                        break;
                    case DIR_DOWN:
                        ry += tileHeight;
                        break;
                    case DIR_LEFT:
                        rx -= tileWidth;
                        break;
                }
                context.lineTo(rx, ry);
                while(dx != ndx || dy != ndy) {
                    switch(dir) {
                        case DIR_UP:
                        case DIR_DOWN:
                            if(dx < ndx) {
                                rx += tileWidth;
                                dx++;
                            } else if(dx > ndx) {
                                rx -= tileWidth;
                                dx--;
                            }
                            context.lineTo(rx, ry);
                            if(dy < ndy) {
                                ry += tileHeight;
                                dy++;
                            } else if(dy > ndy) {
                                ry -= tileHeight;
                                dy--;
                            }
                            context.lineTo(rx, ry);
                            break;
                        case DIR_RIGHT:
                        case DIR_LEFT:
                            if(dy < ndy) {
                                ry += tileHeight;
                                dy++;
                            } else if(dy > ndy) {
                                ry -= tileHeight;
                                dy--;
                            }
                            context.lineTo(rx, ry);
                            if(dx < ndx) {
                                rx += tileWidth;
                                dx++;
                            } else if(dx > ndx) {
                                rx -= tileWidth;
                                dx--;
                            }
                            context.lineTo(rx, ry);
                            break;
                    }
                }
            }
        }
        context.fill();
        context.restore();
        this._setDirty();
        SensorDrawGcCounterUp();
    };
    Bitmap.prototype.mkrDrawLine = function(context, cx, cy, distanceX, distanceY) {
        let width, height, tileWidth, tileHeight, lx, ly;
        width = this.width;
        height = this.height;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        lx = distanceX;
        ly = distanceY;
        context.moveTo(cx, cy);
        context.lineTo(lx, cy);
        context.lineTo(lx, ly);
        context.lineTo(cx, ly);
        //context.lineTo(cx, cy);
    };
    Bitmap.prototype.mkrSideDrawLine = function(context, cx, cy, sideSensors) {
        let tileWidth, tileHeight, rx, ry, signX, signY, signX2, signY2;
        tileWidth = $gameMap.tileWidth();
        tileHeight = $gameMap.tileHeight();
        signX = sideSensors[1];
        signY = sideSensors[2];
        signX2 = sideSensors[4];
        signY2 = sideSensors[5];
        if(sideSensors[0]) {
            rx = cx;
            ry = cy;
            context.moveTo(rx, ry);
            context.lineTo(rx + tileWidth * signX, ry);
            context.lineTo(rx + tileWidth * signX, ry + tileHeight * signY);
            context.lineTo(rx, ry + tileHeight * signY);
            context.lineTo(rx, ry);
        }
        if(sideSensors[3]) {
            rx = cx + ((signX != signX2)? tileWidth * signX2 : 0);
            ry = cy + ((signY != signY2)? tileHeight * signY2 : 0);
            context.moveTo(rx, ry);
            context.lineTo(rx + tileWidth * signX2, ry);
            context.lineTo(rx + tileWidth * signX2, ry + tileHeight * signY2);
            context.lineTo(rx, ry + tileHeight * signY2);
            context.lineTo(rx, ry);
        }
    };
    function signChange(sign) {
        return sign * -1;
    }
    function getRegionIds() {
        let ArrayRegionId, results, i, argCount, ary;
        ArrayRegionId = [];
        if(arguments && arguments.length > 0) {
            argCount = arguments.length;
            for(i = 0; i < argCount; i++) {
                if(Array.isArray(arguments[i]) && arguments[i].length > 0) {
                    ArrayRegionId.push(CEC(arguments[i][0]));
                } else if(typeof arguments[i] == "string") {
                    ary = arguments[i].split("_").filter(function(val){
                        return val != "" && val != "0";
                    }).map(function(val) {
                        return parseInt(ConvVb(val), 10);
                    });
                    Array.prototype.push.apply(ArrayRegionId, ary);
                } else if(isFinite(arguments[i])) {
                    ArrayRegionId.push(parseInt(arguments[i], 10));
                }
            }
        }
        return ArrayRegionId.filter(function(val, i, self) {
            return self.indexOf(val) === i && val > 0;
        });
    }
})();