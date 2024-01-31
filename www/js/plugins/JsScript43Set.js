// Copyright (c) 2017 n2naokun(柊菜緒)
/*:
 * @plugindesc 
 * 恐らく簡易的なシングルアクタープラグインとして動作すると思われます。
 * @author n2naokun(柊菜緒)
 *
 * @help 
 */
"use strict";
var Imported = Imported || {};
Imported.SimpleSingleActorMenu = true;
(function (_global) {
    Scene_Menu.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this._commandWindow.x = Graphics.boxWidth / 2 - this._commandWindow.width / 2;
        this._commandWindow.y = Graphics.boxHeight / 2 - this._commandWindow.height / 2;
    };
    Window_MenuCommand.prototype.addMainCommands = function() {
        var enabled = this.areMainCommandsEnabled();
        // if (this.needsCommand('item')) { //nupu:メニューにいらないからコメントアウト
        //     this.addCommand(TextManager.item, 'item', enabled);
        // if (this.needsCommand('skill')) { //nupu:メニューにいらないからコメントアウト
        //     this.addCommand(TextManager.skill, 'skill', enabled);
        // if (this.needsCommand('equip')) { //nupu:メニューにいらないからコメントアウト
        //     this.addCommand(TextManager.equip, 'equip', enabled);
        // if (this.needsCommand('status')) { //nupu:メニューにいらないからコメントアウト
        //     this.addCommand(TextManager.status, 'status', enabled);
    };
    Window_MenuCommand.prototype.makeCommandList = function () {
        MenuOpenMapName = $dataMapInfos[NowLoadingMapId].name;
        this.addMainCommands();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    };
    Scene_Menu.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_MenuCommand(0, 0);
        // this._commandWindow.setHandler("item", this.commandItem.bind(this)); //nupu:不要なメニュー項目を削除
        // this._commandWindow.setHandler("skill", this.onPersonalOk.bind(this));
        // this._commandWindow.setHandler("equip", this.onPersonalOk.bind(this));
        // this._commandWindow.setHandler("status", this.onPersonalOk.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this._commandWindow.setHandler("save", this.commandSave.bind(this));
        this._commandWindow.setHandler("load", this.commandLoad.bind(this)); 
        this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.commandWindowSetHandler(); 
        this.addWindow(this._commandWindow);
    };
    Scene_GameEnd.prototype.commandToTitle = function() {
        location.reload(); 
    };
    Scene_Menu.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
    };
    Scene_ItemBase.prototype.determineItem = function () {
        var action = new Game_Action(this.user());
        var item = this.item();
        action.setItemObject(item);
        this.useItem();
        this.activateItemWindow();
    };
    Scene_ItemBase.prototype.itemTargetActors = function () {
        var action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return $gameParty.members();
        }
    };
    Scene_Status.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    };
})(this);
let _DrawSaveId = -1;
Window_SavefileList.prototype.drawContents = function(info, rect, valid , id) {
    _DrawSaveId = id - 1;
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if (valid) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};
Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.title, x, y, width);
    }
};
let SaveMapTextArr = [];
Game_Interpreter.prototype.Title_共有DataLoad = function () {
    let ckSaveMap = $gameVariables.value(VN_SaveMap);
    if (ckSaveMap == 0) ckSaveMap = "";
    if (ckSaveMap == "") {
        for (let i = 0; i < 20; i++) {
            ckSaveMap += ","
        }
        $gameVariables.setValue(VN_SaveMap ,ckSaveMap)
        utakata.CommonSaveManager.save();
    }
    SaveMapTextArr = String(ckSaveMap).split(",");
}
Scene_Menu.prototype.commandWindowSetHandler = function () {
    // this._commandWindow.setHandler('シンボル', 呼ばれる関数.bind(this));
};
Window_MenuCommand.prototype.addOriginalCommands = function () {
};
