// Copyright (c) 2017 Thirop
/*:
 * @plugindesc 
 * @author Thirop
 *
 *
 * @param fpsHalfDisabledWhenDashing
 * @desc trueでダッシュ中は描画頻度を落とさない。falseで無効
 * Default: false
 * @default false
 *
 * @param configTextHelp
 * @desc オプションの設定項目名
 * Default: 描画FPSの設定
 * @default 描画FPSの設定
 *
 * @param configTextOn
 * @desc 描画Fps30の場合のオプション表示
 * Default: FPS30
 * @default FPS30
 *
 * @param configTextOff
 * @desc 描画Fps60の場合のオプション表示
 * Default: FPS60(標準)
 * @default FPS60(標準)
 *
 * 
 * @help 
 */
var GrpSkipCount = 0;
var Must60FPSFlame = 0;
var NupuLightMoveSetting = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    NupuLightMoveSetting.call(this, mapId, x, y, d, fadeType);
    Must60FPSFlame = 120;
};
(function(){
    var parameters = PluginManager.parameters('JsScript42Set');
    var fpsHalfDisabledWhenDashing = parameters.fpsHalfDisabledWhenDashing === 'true';
    var configTextHelp = parameters.configTextHelp || '描画FPSの設定';
    var configTextOn = parameters.configTextOn || 'FPS30';
    var configTextOff = parameters.configTextOff || 'FPS60(標準)';
var ckbool = false;
Graphics.render = function(stage) {
    if (Must60FPSFlame > 0) Must60FPSFlame--;
    GrpSkipCount = this._skipCount;
    if (this._skipCount === 0) {
        var startTime = Date.now();
        if (stage) {
            this._renderer.render(stage); 
            if (this._renderer.gl && this._renderer.gl.flush) {
                this._renderer.gl.flush();
            }
        }
        var endTime = Date.now();
        var elapsed = endTime - startTime;
        this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
        this._rendered = true;
        if($gameSystem && $gameSystem.isRenderFpsHalf() && Must60FPSFlame <= 0){
        this._skipCount = Math.max(this._skipCount,1);
        }
    } else {
        this._skipCount--;
        this._rendered = false;
    }
    this.frameCount++;
    ckbool = !ckbool
};
var _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
_Game_System_initialize.call(this);
this._fpsHalfDisabled = false;
};
Game_System.prototype.setFpsHalfDisabled = function(disabled){
this._fpsHalfDisabled = disabled;
};
Game_System.prototype.isRenderFpsHalf = function(){
if(!ConfigManager.renderFpsHalf)return false;
if(fpsHalfDisabledWhenDashing && $gamePlayer&&$gamePlayer.isDashing()&&$gamePlayer.isMoving())return false;
return !this._fpsHalfDisabled;
};
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
_Game_Interpreter_pluginCommand.call(this,command,args);
    if(command === 'FpsHalf'){
    if(!args[0])return;
    var arg0 = args[0].toLowerCase();
        switch (arg0) {
        case 'on':
        $gameSystem.setFpsHalfDisabled(false);
            break;
        case 'off':
$gameSystem.setFpsHalfDisabled(true);
            break;
        }
    }
};
ConfigManager.renderFpsHalf = false;
var _ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
var config = _ConfigManager_makeData.call(this);
config.renderFpsHalf = this.renderFpsHalf;
    return config;
};
var _ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
_ConfigManager_applyData.call(this,config);
this.renderFpsHalf = this.readFlag(config, 'renderFpsHalf');
};
var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
_Window_Options_addGeneralOptions.call(this);
    this.addCommand(configTextHelp, 'renderFpsHalf');
};
var _Window_Options_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    if(symbol === 'renderFpsHalf'){
    var value = this.getConfigValue(symbol);
    return this.renderFpsHalfStatusText(value);
    }else{
    return _Window_Options_statusText.call(this,index);
    }
};
Window_Options.prototype.renderFpsHalfStatusText = function(value) {
    return value ? configTextOn : configTextOff;
};
})();
