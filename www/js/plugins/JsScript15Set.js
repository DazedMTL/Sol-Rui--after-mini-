/*:ja
 * @plugindesc 
 * @author まっつＵＰ
 *
 * @param loadtext
 * @desc コマンド「ロード」のコマンド名です。
 * @default ロード
 *
 * @help 
 */
(function() {
    var parameters = PluginManager.parameters('LoadComSim');
    var LCSloadtext = String(parameters['loadtext'] || 'ロード');
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('load', this.commandLoad.bind(this));
    };
    Scene_Menu.prototype.commandLoad = function() { 
        SceneManager.push(Scene_Load);
    };
    var _Window_MenuCommand_addSaveCommand = Window_MenuCommand.prototype.addSaveCommand;
    Window_MenuCommand.prototype.addSaveCommand = function() {
        _Window_MenuCommand_addSaveCommand.call(this);
        var enabled = this.isLoadEnabled();
        this.addCommand(LCSloadtext, 'load', enabled);
    };
    Window_MenuCommand.prototype.isLoadEnabled = function() { 
        if(DataManager.isEventTest()) return false; 
        return DataManager.isAnySavefileExists();
    };
})();
