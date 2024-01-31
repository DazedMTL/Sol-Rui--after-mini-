// (C)2015 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param AlwaysDash
 * @desc Always dash(ON/OFF)
 * @default OFF
 *
 * @param CommandRemember
 * @desc Command remember(ON/OFF)
 * @default OFF
 *
 * @param BgmVolume
 * @desc BGM Volume(0-100)
 * @default 100
 *
 * @param BgsVolume
 * @desc BGS Volume(0-100)
 * @default 100
 *
 * @param MeVolume
 * @desc ME Volume(0-100)
 * @default 100
 *
 * @param SeVolume
 * @desc SE Volume(0-100)
 * @default 100
 *
 * @param EraseAlwaysDash
 * @desc Erase AlwaysDash Option(ON/OFF)
 * @default OFF
 *
 * @param EraseCommandRemember
 * @desc Erase CommandRemember Option(ON/OFF)
 * @default OFF
 *
 * @param EraseBgmVolume
 * @desc Erase BgmVolume Option(ON/OFF)
 * @default OFF
 *
 * @param EraseBgsVolume
 * @desc Erase BgsVolume Option(ON/OFF)
 * @default OFF
 *
 * @param EraseMeVolume
 * @desc Erase MeVolume Option(ON/OFF)
 * @default OFF
 *
 * @param EraseSeVolume
 * @desc Erase SeVolume Option(ON/OFF)
 * @default OFF
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param 常時ダッシュ
 * @desc 常にダッシュする。（Shiftキーを押している場合のみ歩行）(ON/OFF)
 * @default OFF
 *
 * @param コマンド記憶
 * @desc 選択したコマンドを記憶する。(ON/OFF)
 * @default OFF
 *
 * @param BGM音量
 * @desc BGMの音量。0-100
 * @default 100
 *
 * @param BGS音量
 * @desc BGSの音量。0-100
 * @default 100
 *
 * @param ME音量
 * @desc MEの音量。0-100
 * @default 100
 *
 * @param SE音量
 * @desc SEの音量。0-100
 * @default 100
 *
 * @param 常時ダッシュ消去
 * @desc 常時ダッシュの項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @param コマンド記憶消去
 * @desc コマンド記憶の項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @param BGM音量消去
 * @desc BGM音量の項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @param BGS音量消去
 * @desc BGS音量の項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @param ME音量消去
 * @desc ME音量の項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @param SE音量消去
 * @desc SE音量の項目を非表示にする。(ON/OFF)
 * @default OFF
 *
 * @help 
 */
(function() {
    'use strict';
    var pluginName = 'JsScript6Set';
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var paramAlwaysDash           = getParamBoolean(['AlwaysDash', '常時ダッシュ']);
    var paramCommandRemember      = getParamBoolean(['CommandRemember', 'コマンド記憶']);
    var paramBgmVolume            = getParamNumber(['BgmVolume', 'BGM音量'], 0, 100);
    var paramBgsVolume            = getParamNumber(['BgsVolume', 'BGS音量'], 0, 100);
    var paramMeVolume             = getParamNumber(['MeVolume', 'ME音量'], 0, 100);
    var paramSeVolume             = getParamNumber(['SeVolume', 'SE音量'], 0, 100);
    var paramEraseAlwaysDash      = getParamBoolean(['EraseAlwaysDash', '常時ダッシュ消去']);
    var paramEraseCommandRemember = getParamBoolean(['EraseCommandRemember', 'コマンド記憶消去']);
    var paramEraseBgmVolume       = getParamBoolean(['EraseBgmVolume', 'BGM音量消去']);
    var paramEraseBgsVolume       = getParamBoolean(['EraseBgsVolume', 'BGS音量消去']);
    var paramEraseMeVolume        = getParamBoolean(['EraseMeVolume', 'ME音量消去']);
    var paramEraseSeVolume        = getParamBoolean(['EraseSeVolume', 'SE音量消去']);
    var _ConfigManagerApplyData = ConfigManager.applyData;
    ConfigManager.applyData     = function(config) {
        _ConfigManagerApplyData.apply(this, arguments);
        if (config.alwaysDash == null)      this.alwaysDash = paramAlwaysDash;
        if (config.commandRemember == null) this.commandRemember = paramCommandRemember;
        if (config.bgmVolume == null)       this.bgmVolume = paramBgmVolume;
        if (config.bgsVolume == null)       this.bgsVolume = paramBgsVolume;
        if (config.meVolume == null)        this.meVolume = paramMeVolume;
        if (config.seVolume == null)        this.seVolume = paramSeVolume;
    };
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        if (paramEraseAlwaysDash) this.eraseOption('alwaysDash');
        if (paramEraseCommandRemember) this.eraseOption('commandRemember');
        if (paramEraseBgmVolume) this.eraseOption('bgmVolume');
        if (paramEraseBgsVolume) this.eraseOption('bgsVolume');
        if (paramEraseMeVolume) this.eraseOption('meVolume');
        if (paramEraseSeVolume) this.eraseOption('seVolume');
    };
    Window_Options.prototype.eraseOption = function(symbol) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol) {
                this._list.splice(i, 1);
                this.adjustIndexManoInputConfig(i);
                break;
            }
        }
    };
    Window_Options.prototype.adjustIndexManoInputConfig = function(index) {
        if (this._gamepadOptionIndex > index) {
            this._gamepadOptionIndex -= 1;
        }
        if (this._keyboardConfigIndex > index) {
            this._keyboardConfigIndex -= 1;
        }
    };
})();
