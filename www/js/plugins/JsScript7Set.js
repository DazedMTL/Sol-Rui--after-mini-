// Copyright (c) 2015 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param SaveFileNumber
 * @desc max save file number(1...100)
 * @default 20
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param セーブファイル数
 * @desc 最大セーブファイル数です。
 * @default 20
 *
 * @help 
 */
(function () {
    'use strict';
    var pluginName = 'JsScript7Set';
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var paramSaveFileNumber = getParamNumber(['SaveFileNumber', 'セーブファイル数'], 0);
    var _DataManager_loadGlobalInfo = DataManager.loadGlobalInfo;
    DataManager.loadGlobalInfo = function() {
        if (!this._globalInfo) {
            this._globalInfo = _DataManager_loadGlobalInfo.apply(this, arguments);
        }
        return this._globalInfo;
    };
    var _DataManager_saveGlobalInfo = DataManager.saveGlobalInfo;
    DataManager.saveGlobalInfo = function(info) {
        _DataManager_saveGlobalInfo.apply(this, arguments);
        this._globalInfo = null;
    };
    var _DataManager_maxSavefiles = DataManager.maxSavefiles;
    DataManager.maxSavefiles = function() {
        return paramSaveFileNumber ? paramSaveFileNumber : _DataManager_maxSavefiles.apply(this, arguments);
    };
    var _DataManager_isThisGameFile = DataManager.isThisGameFile;
    DataManager.isThisGameFile = function(savefileId) {
        if (savefileId > this.maxSavefiles()) {
            return false;
        } else {
            return _DataManager_isThisGameFile.apply(this, arguments);
        }
    };
})();
