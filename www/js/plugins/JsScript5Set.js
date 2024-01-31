/*:
 * @plugindesc 
 * @author ビービー
 * 
 * @param Center X
 * @desc 画面中心点をX方向にずらす数値です。デフォルト：0
 * @default 0
 * 
 * @param Center Y
 * @desc 画面中心点をY方向にずらす数値です。デフォルト：0
 * @default 0
 * 
 * @help 
 */
var BBcenterX;
var BBcenterY;
(function() {
var parameters = PluginManager.parameters('JsScript5Set');
BBcenterX = Number(parameters['Center X'] || 0);
BBcenterY = Number(parameters['Center Y'] || 0);
var BBCSswitch = Number(parameters['Switch ID'] || 1);
Game_Player.prototype.centerX = function() {
    var x = BBcenterX;
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0 + x;
};
Game_Player.prototype.centerY = function() {
    var y = BBcenterY;
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0 + y;
};
})();
