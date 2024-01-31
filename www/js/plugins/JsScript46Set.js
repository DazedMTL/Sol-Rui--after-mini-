/*---------------------------------------------------------------------------*
 * Torigoya_SaveCommand.js
 *---------------------------------------------------------------------------*
 * 2019/01/26 ru_shalm
 * http:
 *---------------------------------------------------------------------------*/
/*:
 * @plugindesc 
 * @author ru_shalm
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author ru_shalm
 *
 * @help 
 */
(function (global) {
    'use strict';
    var SaveCommand = {
        name: 'JsScript46Set',
        settings: {},
        lastTimestamp: undefined,
        lastAccessId: undefined
    };
    /**
     * スロットID指定文字列からスロットIDを求める
     * @param {string} str
     * @returns {number}
     */
    SaveCommand.parseSlotId = function (str) {
        var slotId, matches;
        if (matches = str.match(/^\[(\d+)\]$/)) {
            slotId = $gameVariables.value(~~matches[1]);
        } else if (str.match(/^\d+$/)) {
            slotId = ~~str;
        } else {
            switch (str) {
                case 'last':
                    slotId = DataManager.lastAccessedSavefileId();
                    break;
                case 'latest':
                    slotId = DataManager.latestSavefileId();
                    break;
            }
        }
        if (~~slotId <= 0) {
            throw '[Torigoya_SaveCommand.js] invalid SlotId: ' + slotId;
        }
        return slotId;
    };
    /**
     * セーブ系コマンド処理の実行
     * @param {Game_Interpreter} gameInterpreter
     * @param {string} type
     * @param {number} slotId
     * @param {boolean} skipTimestamp
     */
    SaveCommand.runCommand = function (gameInterpreter, type, slotId, skipTimestamp) {
        switch (type) {
            case 'load':
                this.runCommandLoad(gameInterpreter, slotId);
                break;
            case 'save':
                this.runCommandSave(gameInterpreter, slotId, skipTimestamp);
                break;
            case 'remove':
                this.runCommandRemove(gameInterpreter, slotId);
                break;
        }
    };
    /**
     * ロード処理
     * @note ちょっと無理やり感があるのでイベントの組み方次第ではまずそう
     * @param {Game_Interpreter} gameInterpreter
     * @param {number} slotId
     */
    SaveCommand.runCommandLoad = function (gameInterpreter, slotId) {
        if (!DataManager.isThisGameFile(slotId)) return;
        var scene = SceneManager._scene;
        scene.fadeOutAll();
        DataManager.loadGame(slotId);
        gameInterpreter.command115(); 
        Scene_Load.prototype.reloadMapIfUpdated.apply(scene);
        SceneManager.goto(Scene_Map);
        $gameSystem.onAfterLoad();
    };
    /**
     * セーブ処理
     * @param {Game_Interpreter} gameInterpreter
     * @param {number} slotId
     * @param {boolean} skipTimestamp
     */
    SaveCommand.runCommandSave = function (gameInterpreter, slotId, skipTimestamp) {
        if (skipTimestamp) {
            var info = DataManager.loadSavefileInfo(slotId);
            SaveCommand.lastTimestamp = info && info.timestamp ? info.timestamp : 0;
            SaveCommand.lastAccessId = DataManager.lastAccessedSavefileId();
        }
        var originalIndex = gameInterpreter._index;
        gameInterpreter._index++;
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(slotId) && StorageManager.cleanBackup) {
            StorageManager.cleanBackup(slotId);
        }
        if (skipTimestamp) {
            DataManager._lastAccessedId = SaveCommand.lastAccessId;
            SaveCommand.lastTimestamp = undefined;
            SaveCommand.lastAccessId = undefined;
        }
        gameInterpreter._index = originalIndex;
    };
    /**
     * セーブファイルの削除処理
     * @param {Game_Interpreter} _
     * @param {number} slotId
     */
    SaveCommand.runCommandRemove = function (_, slotId) {
        StorageManager.remove(slotId);
    };
    var upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function () {
        var info = upstream_DataManager_makeSavefileInfo.apply(this);
        if (SaveCommand.lastTimestamp !== undefined) {
            info.timestamp = SaveCommand.lastTimestamp;
        }
        return info;
    };
    var upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (command === 'SaveCommand') {
            var type = (args[0] || '').trim();
            var slotId = SaveCommand.parseSlotId((args[1] || '').trim());
            var skipTimestamp = (args[2] === 'notime');
            SaveCommand.runCommand(this, type, slotId, skipTimestamp);
            return;
        }
        upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
    };
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.SaveCommand = SaveCommand;
})(window);
