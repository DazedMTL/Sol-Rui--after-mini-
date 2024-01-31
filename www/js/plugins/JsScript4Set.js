// 2016/12/04 セーブ・ロードに対応、BGS並行演奏プラグイン(ParallelBgs.js)との連携
/*:
 * @plugindesc 
 * @author くらむぼん
 *
 * @param listener
 * @desc 音の「聞き手」をscreenかplayerから選ぶ
 * @default screen
 *
 * @param decay
 * @desc 音源と聞き手の距離が一歩広がった時の音量変化倍率（％）
 * @default 85
 *
 * @param pan
 * @desc 音源が聞き手の一歩右に居る時の変化位相
 * @default 10
 *
 * @param cutoff
 * @desc 音を鳴らすことを許可する最小の音量（％）
 * @default 1
 *
 * @help 
 */
(function() {
'use strict';
var parameters = PluginManager.parameters('JsScript4Set');
var listener = parameters['listener'];
var decay = toNumber(parameters['decay'], 85).clamp(0, Infinity);
var pan = toNumber(parameters['pan'], 10);
var cutoff = toNumber(parameters['cutoff'], 1).clamp(0, 100);
var _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function(command) {
if (command.code === Game_Character.ROUTE_PLAY_SE) playAdjustSe(command.parameters[0], this);
else _Game_Character_processMoveCommand.apply(this, arguments);
};
Sprite_Animation.prototype.processTimingData = function(timing) {
var duration = timing.flashDuration * this._rate;
switch (timing.flashScope) {
case 1:
this.startFlash(timing.flashColor, duration);
break;
case 2:
this.startScreenFlash(timing.flashColor, duration);
break;
case 3:
this.startHiding(duration);
break;
}
if (!this._duplicated && timing.se) {
playAdjustSe(timing.se, this._target && this._target._character);
}
};
var _BattleManager_replayBgmAndBgs = BattleManager.replayBgmAndBgs;
BattleManager.replayBgmAndBgs = function() {
_BattleManager_replayBgmAndBgs.apply(this, arguments);
AudioManager.updateAudioSource();
};
AudioManager.updateAudioSource = function() {
updateParameters(this._currentBgm, $gameMap.event($gameSystem._bgmSource), true);
if ($gameSystem._bgsSources) {
if (!this.iterateAllBgs) return delete $gameSystem._bgsSources;
this.iterateAllBgs(function() {
updateParameters(this._currentBgs, $gameMap.event($gameSystem._bgsSources[this.getBgsLineIndex()]));
}.bind(this));
}
else updateParameters(this._currentBgs, $gameMap.event($gameSystem._bgsSource));
};
var _AudioManager_updateBgmParameters = AudioManager.updateBgmParameters;
AudioManager.updateBgmParameters = function(bgm) {
if ($gameMap && $gameMap.event($gameSystem._bgmSource)) return;
_AudioManager_updateBgmParameters.apply(this, arguments);
};
var _AudioManager_updateBgsParameters = AudioManager.updateBgsParameters;
AudioManager.updateBgsParameters = function(bgs) {
if ($gameMap && $gameSystem) {
if ($gameSystem._bgsSources && this.getBgsLineIndex) {
if ($gameMap.event($gameSystem._bgsSources[this.getBgsLineIndex()])) return;
} else {
if ($gameMap.event($gameSystem._bgsSource)) return;
}
}
_AudioManager_updateBgsParameters.apply(this, arguments);
};
var _AudioManager_bgmVolume = Object.getOwnPropertyDescriptor(AudioManager, 'bgmVolume');
Object.defineProperty(AudioManager, 'bgmVolume', {
get: function() {
return _AudioManager_bgmVolume.get.call(this);
},
set: function(value) {
_AudioManager_bgmVolume.set.call(this, value);
if ($gameMap && $gameSystem) this.updateAudioSource();
},
configurable: true
});
var _AudioManager_bgsVolume = Object.getOwnPropertyDescriptor(AudioManager, 'bgsVolume');
Object.defineProperty(AudioManager, 'bgsVolume', {
get: function() {
return _AudioManager_bgsVolume.get.call(this);
},
set: function(value) {
_AudioManager_bgsVolume.set.call(this, value);
if ($gameMap && $gameSystem) this.updateAudioSource();
},
configurable: true
});
var bgmOnSave = null;
var bgsOnSave = null;
var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
_Scene_Map_onMapLoaded.apply(this, arguments);
if (bgmOnSave) {
AudioManager.playBgm(bgmOnSave);
bgmOnSave = null;
}
if (bgsOnSave) {
AudioManager.playBgs(bgsOnSave);
bgsOnSave = null;
}
AudioManager.updateAudioSource();
};
var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function() {
bgmOnSave = this._bgmOnSave;
bgsOnSave = this._bgsOnSave;
this._bgmOnSave = this._bgsOnSave = {};
_Game_System_onAfterLoad.apply(this, arguments);
this._bgmOnSave = bgmOnSave;
this._bgsOnSave = bgsOnSave;
};
var _Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
_Game_Map_update.apply(this, arguments);
AudioManager.updateAudioSource();
};
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
_Game_Interpreter_pluginCommand.apply(this, arguments);
if (command.toLowerCase() === 'JsScript4Set') {
var eventId = +args[1] === 0 ? this._eventId : +args[1];
switch (args[0].toLowerCase()) {
case 'listener':
$gameSystem._listenerEvent = eventId;
break;
case 'bgm':
$gameSystem._bgmSource = eventId;
break;
case 'bgs':
if ($gameSystem.getBgsLine) {
$gameSystem._bgsSources = $gameSystem._bgsSources || [];
$gameSystem._bgsSources[$gameSystem.getBgsLine()] = eventId;
}
else $gameSystem._bgsSource = eventId;
break;
case 'se':
$gameSystem._seSourceOff = args[1].toLowerCase() === 'off';
break;
default:
break;
}
}
};
function toNumber(str, def) {
return isNaN(str) ? def : +(str || def);
}
function updateParameters(audio, source, isBgm) {
if (audio && source) {
var lastVolume = audio.volume;
var lastPan = audio.pan;
adjust(audio, source);
if (audio.volume < cutoff) audio.volume = 0;
var buffer = AudioManager[isBgm ? '_bgmBuffer' : '_bgsBuffer'];
if (buffer && buffer._gainNode) buffer._gainNode.gain.cancelScheduledValues(0);
AudioManager.updateBufferParameters(buffer, AudioManager[isBgm ? '_bgmVolume' : '_bgsVolume'], audio);
audio.volume = lastVolume;
audio.pan = lastPan;
}
}
function playAdjustSe(se, source) {
if (source && !$gameSystem._seSourceOff) {
var lastVolume = se.volume;
var lastPan = se.pan;
adjust(se, source);
if (se.volume >= cutoff) AudioManager.playSe(se);
se.volume = lastVolume;
se.pan = lastPan;
}
else AudioManager.playSe(se);
}
function adjust(audio, source) {
if (!source) throw new Error('audiosourceエラー：音源となるイベントが存在しません');
var listenerX, listenerY, listenerEvent = $gameMap.event($gameSystem._listenerEvent);
if (listenerEvent) {
listenerX = listenerEvent._realX;
listenerY = listenerEvent._realY;
} else {
switch (listener.toLowerCase()) {
case 'screen':
listenerX = $gameMap.displayX() + $gamePlayer.centerX();
listenerY = $gameMap.displayY() + $gamePlayer.centerY();
break;
case 'player':
listenerX = $gamePlayer._realX;
listenerY = $gamePlayer._realY;
break;
default:
throw new Error('audiosourceエラー：listenerパラメータはscreenかplayerにしてください');
break;
}
}
var dx = $gameMap.deltaX(source._realX, listenerX);
var dy = $gameMap.deltaY(source._realY, listenerY);
var d = Math.sqrt(dx * dx + dy * dy);
if (d > 1) audio.volume *= Math.pow(decay / 100, d - 1);
audio.pan = (dx * pan).clamp(-100, 100);
}
AudioManager.playAdjustSe = playAdjustSe;
})();
