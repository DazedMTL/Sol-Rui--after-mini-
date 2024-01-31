// Copyright (c) 2016 Mokusei Penguin
/*:
 * @plugindesc 
 * @author 木星ペンギン
 *
 * @help 
 * @requiredAssets img/characters/Damage1
 * 
 * @param Search Limit
 * @desc 移動できる距離
 * @default 12
 *
 */
(function() {
var Alias = {};
var parameters = PluginManager.parameters('JsScript20Set');
var searchLimit = Number(parameters['Search Limit']);
Alias.GaCh_processMoveCommand = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function(command) {
    if (command.code === Game_Character.ROUTE_SCRIPT) {
        command = { code: command.code,
            parameters: [this.convertScript(command.parameters[0])] };
    }
    Alias.GaCh_processMoveCommand.call(this, command);
};
Game_Character.prototype.convertScript = function(script) {
    script = script.replace(/^movePos\(/, 'this.movePos(');
    script = script.replace(/^x\s?=\s?(-?\d+\.?\d*)/i, function() {
        return 'this.moveX(' + arguments[1] + ')';
    }.bind(this));
    script = script.replace(/^x\s?\+=\s?(-?\d+\.?\d*)/i, function() {
        var x = this._x + Number(arguments[1]);
        return 'this.moveX(' + x + ')';
    }.bind(this));
    script = script.replace(/^x\s?\-=\s?(-?\d+\.?\d*)/i, function() {
        var x = this._x - Number(arguments[1]);
        return 'this.moveX(' + x + ')';
    }.bind(this));
    script = script.replace(/^y\s?=\s?(-?\d+\.?\d*)/i, function() {
        return 'this.moveY(' + arguments[1] + ')';
    }.bind(this));
    script = script.replace(/^y\s?\+=\s?(-?\d+\.?\d*)/i, function() {
        var y = this._y + Number(arguments[1]);
        return 'this.moveY(' + y + ')';
    }.bind(this));
    script = script.replace(/^y\s?\-=\s?(-?\d+\.?\d*)/i, function() {
        var y = this._y - Number(arguments[1]);
        return 'this.moveY(' + y + ')';
    }.bind(this));
    script = script.replace(/^roundX/, 'this._x = Math.round(this._x)');
    script = script.replace(/^roundY/, 'this._y = Math.round(this._y)');
    return script;
};
Game_Character.prototype.movePos = function(x, y, skippable) {
    skippable = skippable || false;
    var direction = this.findDirectionTo(x, y); 
    if (direction > 0) { 
        this.moveStraight(direction);
        this.setMovementSuccess(false);
    } else if (Math.abs(this._x - x) + Math.abs(this._y - y) < searchLimit) {
        this.setMovementSuccess(skippable || this.pos(x, y));
    }
};
Game_Character.prototype.moveX = function(x) {
    if (this._x > x) this.setDirection(4);
    if (this._x < x) this.setDirection(6);
    this._x = x;
    this.resetStopCount();
};
Game_Character.prototype.moveY = function(y) {
    if (this._y < y) this.setDirection(2);
    if (this._y > y) this.setDirection(8);
    this._y = y;
    this.resetStopCount();
};
Game_Character.prototype.searchLimit = function() {
    return searchLimit;
};
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    if (command === 'WaitRoute') {
        this._waitMode = 'route';
        this._character = this.character(Number(args[0]));
    }
};
})();
