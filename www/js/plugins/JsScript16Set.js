// Copyright (c) 2016-2017 マンカインド
/*:
 *
 * @plugindesc 
 * @author マンカインド
 *
 * @help 
 * @param Default_Move_Flag
 * @text 移動禁止スイッチ
 * @desc ONの間、プレイヤーの移動を禁止するスイッチ番号を指定します。(デフォルト:10)
 * @type switch
 * @default 10
 *
 * @param Default_Menu_Flag
 * @text メニュー開閉制御
 * @desc プレイヤーの移動を禁止している間、メニューの開閉を許可するかどうかを設定します。(デフォルト:許可する)
 * @type boolean
 * @on 許可する
 * @off 許可しない
 * @default true
 *
 * @param Enter Flag
 * @text 決定キー制御
 * @desc プレイヤーの移動を禁止している間、決定キー/タッチ操作による動作を許可するかどうかを設定します。(デフォルト:許可する)
 * @type boolean
 * @on 許可する
 * @off 許可しない
 * @default true
 *
*/
(function () {
    'use strict';
    const PN = "JsScript16Set";
    const CheckParam = function(type, param, def, min, max) {
        let Parameters, regExp, value;
        Parameters = PluginManager.parameters(PN);
        if(arguments.length < 4) {
            min = -Infinity;
            max = Infinity;
        }
        if(arguments.length < 5) {
            max = Infinity;
        }
        if(param in Parameters) {
            value = String(Parameters[param]);
        } else {
            throw new Error("[CheckParam] プラグインパラメーターがありません: " + param);
        }
        switch(type) {
            case "bool":
                if(value == "") {
                    value = (def)? true : false;
                }
                value = value.toUpperCase() === "ON" || value.toUpperCase() === "TRUE" || value.toUpperCase() === "1";
                break;
            case "switch":
                if(value == "") {
                    value = (def != "")? def : value;
                }
                if(!value.match(/^(\d+)$/i)) {
                    throw new Error("[CheckParam] " + param + "の値がスイッチではありません: " + param + " : " + value);
                }
                break;
            default:
                throw new Error("[CheckParam] " + param + "のタイプが不正です: " + type);
                break;
        }
        return [value, type, def, min, max, param];
    }
    const Params = {
        "MoveSwitch" : CheckParam("switch", "Default_Move_Flag", "10"),
        "MenuFlg" : CheckParam("bool", "Default_Menu_Flag", true),
        "EnterFlg" : CheckParam("bool", "Enter Flag", true),
    };
    const _Game_System_isMenuEnabled = Game_System.prototype.isMenuEnabled;
    Game_System.prototype.isMenuEnabled = function() {
        return _Game_System_isMenuEnabled.call(this)
            && ($gameSwitches.value(Params.MoveSwitch[0]) ? Params.MenuFlg[0] == true : true);
    };
    const _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        if(!$gameSwitches.value(Params.MoveSwitch[0])) {
            _Game_Player_executeMove.call(this, direction);
        }
    };
    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if($gameSwitches.value(Params.MoveSwitch[0]) && !Params.EnterFlg[0]) {
        } else {
            _Game_Player_triggerButtonAction.call(this);
        }
        return false;
    };
    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        if($gameSwitches.value(Params.MoveSwitch[0]) && !Params.EnterFlg[0]) {
        } else {
            _Game_Player_triggerTouchAction.call(this);
        }
        return false;
    };
})();
