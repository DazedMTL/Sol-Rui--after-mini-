// (C) 2016 Triacontane
/*:
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param keepSelfSwitch
 * @text セルフスイッチ維持
 * @desc 有効にすると場所移動時にセルフスイッチをクリアしなくなります。イベントの消去を実行した場合はクリアされます。
 * @default false
 * @type boolean
 *
 * @param tryRandomCount
 * @text 試行回数
 * @desc ランダム生成をする際の試行回数です。イベント生成に失敗する場合は数値を大きくしてください。
 * @default 1000
 * @type number
 *
 * @param CertainSpawnSwitch
 * @text 確定出力方式スイッチ
 * @desc 指定されたスイッチがONのとき、生成時に「確定出力方式」を使用します。詳細はヘルプを確認してください。
 * @default 0
 * @type switch
 *
 * @help 
 */
/**
 * 動的生成イベントを扱うクラスです。
 * @constructor
 */
function Game_PrefabEvent() {
    this.initialize.apply(this, arguments);
}
(function() {
    'use strict';
    var metaTagPrefix = 'ERS_';
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(AltGlossary)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('JsScript10Set');
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || makeRandomCompatible[arg] || 0).clamp(min, max);
    };
    var getArgFloat = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(arg) || 0).clamp(min, max);
    };
    var makeRandomCompatible = {
        none     : 0,
        判定なし     : 0,
        条件なし     : 0,
        passonly : 1,
        通行可能タイルのみ: 1,
        通行のみ     : 1,
        screen   : 1,
        onscreen : 1,
        画面内      : 1,
        offscreen: 2,
        画面外      : 2,
        player   : 1,
        プレイヤー    : 1,
        event    : 2,
        イベント     : 2,
        both     : 3,
        両方       : 3,
    };
    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
    var isNotAString = function(args) {
        return String(args) !== args;
    };
    var convertAllArguments = function(args) {
        return args.map(function(arg) {
            return convertEscapeCharacters(arg);
        });
    };
    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };
    var pluginCommandMap = new Map();
    setPluginCommand('MAKE', 'execMakeEvent');
    setPluginCommand('生成', 'execMakeEvent');
    setPluginCommand('MAKE_RANDOM', 'execMakeEventRandom');
    setPluginCommand('ランダム生成', 'execMakeEventRandom');
    setPluginCommand('テンプレート生成', 'execMakeTemplateEvent');
    setPluginCommand('MAKE_TEMPLATE', 'execMakeTemplateEvent');
    setPluginCommand('テンプレートランダム生成', 'execMakeTemplateEventRandom');
    setPluginCommand('MAKE_TEMPLATE_RANDOM', 'execMakeTemplateEventRandom');
    setPluginCommand('最終生成イベントID取得', 'execGetLastSpawnEventId');
    setPluginCommand('GET_LAST_SPAWN_EVENT_ID', 'execGetLastSpawnEventId');
    setPluginCommand('TRY_COUNT', 'changeTryCount');
    if (!DataManager.searchDataItem) {
        DataManager.searchDataItem = function(dataArray, columnName, columnValue) {
            var result = 0;
            dataArray.some(function(dataItem) {
                if (dataItem && dataItem[columnName] === columnValue) {
                    result = dataItem;
                    return true;
                }
                return false;
            });
            return result;
        };
    }
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            args = convertAllArguments(args);
            if (this.convertAllSelfVariables) {
                args = this.convertAllSelfVariables(args);
            }
            this[pluginCommandMethod](args);
        }
    };
    Game_Interpreter.prototype.execMakeEvent = function(args, extend) {
        var x = getArgFloat(args[1]);
        var y = getArgFloat(args[2]);
        $gameMap.spawnEvent(this.getEventIdForEventReSpawn(args[0], extend), x, y, extend);
    };
    Game_Interpreter.prototype.execMakeEventRandom = function(args, extend) {
        var conditionMap         = {};
        conditionMap.passable    = getArgNumber(args[1], 0);
        conditionMap.screen      = getArgNumber(args[2], 0);
        conditionMap.collided    = getArgNumber(args[3], 0);
        conditionMap.terrainTags = (args[4] || '').split(',').map(function(value) {
            return getArgNumber(value, 0);
        });
        conditionMap.regionIds   = (args[5] || '').split(',').map(function(value) {
            return getArgNumber(value, 0);
        });
        var makeCount = parseInt(args[6]) || 1;
        for (var i = 0; i < makeCount; ++i) {
            $gameMap.spawnEventRandom(this.getEventIdForEventReSpawn(args[0], extend), conditionMap, extend);
        }
    };
    Game_Interpreter.prototype.execMakeTemplateEvent = function(args) {
        this.execMakeEvent(args, true);
    };
    Game_Interpreter.prototype.execMakeTemplateEventRandom = function(args) {
        this.execMakeEventRandom(args, true);
    };
    Game_Interpreter.prototype.execGetLastSpawnEventId = function(args) {
        var eventId = $gameMap.getLastSpawnEventId();
        $gameVariables.setValue(getArgNumber(args[0], 0), eventId);
    };
    Game_Interpreter.prototype.getEventIdForEventReSpawn = function(arg, isTemplate) {
        var id = 0;
        if (!isNaN(convertEscapeCharacters(arg))) {
            id = getArgNumber(arg, 0);
        } else {
            var event = DataManager.searchDataItem(isTemplate ? $dataTemplateEvents : $dataMap.events, 'name', convertEscapeCharacters(arg));    
            id        = event ? event.id : 0;
        }
        return id > 0 ? id : this._eventId;
    };
    Game_Interpreter.prototype.changeTryCount = function(args) {
        if (args[0]) param.tryRandomCount = Number(args[0]);
    };
    var _Game_Map_setupEvents      = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        if ($gamePlayer.isNeedMapReload()) {
            this.unlinkPrefabEvents();
        }
        _Game_Map_setupEvents.apply(this, arguments);
        this._eventIdSequence = this._events.length || 1;
    };
    Game_Map.prototype.spawnEvent = function(originalEventId, x, y, isTemplate) {
        if (this.isExistEventData(originalEventId, isTemplate) && $gameMap.isValid(x, y)) {
            var eventId = this.getEventIdSequence();
            if (!isTemplate) {
                var originalEvent = this.event(originalEventId);
                if (this.isTemplateSpawn(originalEventId)) {
                    isTemplate      = true;
                    originalEventId = originalEvent.getTemplateId();
                }
                if (originalEvent.isPrefab()) {
                    originalEventId = originalEvent.getOriginalEventId();
                }
            }
            var event = new Game_PrefabEvent(this._mapId, eventId, originalEventId, x, y, isTemplate);
            this._lastSpawnEventId = eventId;
            this._events[eventId]  = event;
        } else {
            throw new Error('無効なイベントIDもしくは座標のためイベントを作成できませんでした。');
        }
    };
    Game_Map.prototype.isTemplateSpawn = function(originalEventId) {
        var event = this.event(originalEventId);
        return event.hasTemplate && event.hasTemplate();
    };
    Game_Map.prototype.getLastSpawnEventId = function() {
        return this._lastSpawnEventId;
    };
    Game_Map.prototype.isExistEventData = function(eventId, isTemplate) {
        return isTemplate ? !!$dataTemplateEvents[eventId] : !!this.event(eventId);
    };
    Game_Map.prototype.spawnEventRandom = function(originalEventId, conditionMap, isTemplate) {
        var conditions = [];
        conditions.push(this.isValid.bind(this));
        if (conditionMap.passable) {
            conditions.push(this.isErsCheckAnyDirectionPassable.bind(this));
        }
        if (conditionMap.screen) {
            conditions.push(this.isErsCheckScreenInOut.bind(this, conditionMap.screen));
        }
        if (conditionMap.collided) {
            conditions.push(this.isErsCheckCollidedSomeone.bind(this, conditionMap.collided));
        }
        if (conditionMap.terrainTags) {
            conditions.push(this.isErsCheckTerrainTag.bind(this, conditionMap.terrainTags));
        }
        if (conditionMap.regionIds) {
            conditions.push(this.isErsCheckRegionId.bind(this, conditionMap.regionIds));
        }
        var position = this.getConditionalValidPosition(conditions);
        if (position) {
            this.spawnEvent(originalEventId, position.x, position.y, isTemplate);
        } else {
            console.log(conditionMap);
            console.warn('座標の取得に失敗しました。');
        }
    };
    var _Game_Map_eraseEvent      = Game_Map.prototype.eraseEvent;
    Game_Map.prototype.eraseEvent = function(eventId) {
        _Game_Map_eraseEvent.apply(this, arguments);
        if (this._events[eventId].isExtinct()) {
            delete this._events[eventId];
        }
    };
    Game_Map.prototype.getEventIdSequence = function() {
        return this._eventIdSequence++;
    };
    Game_Map.prototype.getPrefabEvents = function() {
        return this.events().filter(function(event) {
            return event.isPrefab();
        });
    };
    Game_Map.prototype.resetSelfSwitchForPrefabEvent = function() {
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.eraseSelfSwitch();
        });
    };
    Game_Map.prototype.restoreLinkPrefabEvents = function() {
        if (!this.isSameMapReload()) return;
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.linkEventData();
        });
    };
    Game_Map.prototype.unlinkPrefabEvents = function() {
        this.getPrefabEvents().forEach(function(prefabEvent) {
            prefabEvent.unlinkEventData();
        });
    };
    Game_Map.prototype.isSameMapReload = function() {
        return !$gamePlayer.isTransferring() || this.mapId() === $gamePlayer.newMapId();
    };
    Game_Map.prototype.getConditionalValidPosition = function(conditions) {
        var tryCount = param.tryRandomCount || 1000;
        if (!$gameSwitches.value(param.CertainSpawnSwitch) && tryCount > 0) {
            var x, y, count = 0;
            do {
                x = Math.randomInt($dataMap.width);
                y = Math.randomInt($dataMap.height);
            } while (!conditions.every(this.checkValidPosition.bind(this, x, y)) && ++count < tryCount);
            return count < tryCount ? {x: x, y: y} : null;
        } else {
            var positions = [];
            for (var ix = 0; ix < $dataMap.width; ++ix) for (var iy = 0; iy < $dataMap.height; ++iy) {
                if (conditions.every(this.checkValidPosition.bind(this, ix, iy))) {
                    positions.push({x: ix, y: iy});
                }
            }
            return positions.length ? positions[Math.randomInt(positions.length)] : null;
        }
    };
    Game_Map.prototype.checkValidPosition = function(x, y, condition) {
        return condition(x, y);
    };
    Game_Map.prototype.isErsCheckAnyDirectionPassable = function(x, y) {
        return [2, 4, 6, 8].some(function(direction) {
            return $gamePlayer.isMapPassable(x, y, direction);
        });
    };
    Game_Map.prototype.isErsCheckScreenInOut = function(type, x, y) {
        return type === 1 ? this.isErsCheckInnerScreen(x, y) : this.isErsCheckOuterScreen(x, y);
    };
    Game_Map.prototype.isErsCheckInnerScreen = function(x, y) {
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
        return ax >= 0 && ay >= 0 && ax <= this.screenTileX() - 1 && ay <= this.screenTileY() - 1;
    };
    Game_Map.prototype.isErsCheckOuterScreen = function(x, y) {
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
        return ax < -1 || ay < -1 || ax > this.screenTileX() || ay > this.screenTileY();
    };
    Game_Map.prototype.isErsCheckCollidedSomeone = function(type, x, y) {
        if ((type === 1 || type === 3) && $gamePlayer.isCollided(x, y)) {
            return false;
        }
        if ((type === 2 || type === 3) && $gameMap.eventIdXy(x, y) > 0) {
            return false;
        }
        return true;
    };
    Game_Map.prototype.isErsCheckTerrainTag = function(type, x, y) {
        return type.some(function(id) {
            return !id || id === this.terrainTag(x, y);
        }, this);
    };
    Game_Map.prototype.isErsCheckRegionId = function(type, x, y) {
        return type.some(function(id) {
            return !id || id === this.regionId(x, y);
        }, this);
    };
    Game_CharacterBase.prototype.isPrefab = function() {
        return false;
    };
    Game_CharacterBase.prototype.isExtinct = function() {
        return this.isPrefab() && this._erased;
    };
    Game_PrefabEvent.prototype             = Object.create(Game_Event.prototype);
    Game_PrefabEvent.prototype.constructor = Game_PrefabEvent;
    Game_PrefabEvent.prototype.initialize = function(mapId, eventId, originalEventId, x, y, isTemplate) {
        this._originalEventId = originalEventId;
        this._eventId         = eventId;
        this._isTemplate      = isTemplate;
        this.linkEventData();
        Game_Event.prototype.initialize.call(this, mapId, eventId);
        if (typeof Yanfly !== 'undefined' && Yanfly.SEL) {
            $gameTemp._bypassLoadLocation = true;
            this.locateWithoutStraighten(x, y);
            $gameTemp._bypassLoadLocation = undefined;
        } else {
            this.locateWithoutStraighten(x, y);
        }
        this._spritePrepared = false;
    };
    Game_PrefabEvent.prototype.locateWithoutStraighten = function(x, y) {
        this.setPosition(x, y);
        this.refreshBushDepth();
    };
    Game_PrefabEvent.prototype.generateTemplateId = function(event) {
        return this._isTemplate ? this._originalEventId : null;
    };
    Game_PrefabEvent.prototype.linkEventData = function() {
        $dataMap.events[this._eventId] = (this._isTemplate ?
            $dataTemplateEvents[this._originalEventId] : $dataMap.events[this._originalEventId]);
    };
    Game_PrefabEvent.prototype.unlinkEventData = function() {
        $dataMap.events[this._eventId] = null;
    };
    Game_PrefabEvent.prototype.isPrefab = function() {
        return true;
    };
    Game_PrefabEvent.prototype.erase = function() {
        Game_Event.prototype.erase.call(this);
        this.eraseSelfSwitch();
        delete $dataMap.events[this._eventId];
    };
    Game_PrefabEvent.prototype.isSpritePrepared = function() {
        return this._spritePrepared;
    };
    Game_PrefabEvent.prototype.setSpritePrepared = function() {
        this._spritePrepared = true;
    };
    Game_PrefabEvent.prototype.eraseSelfSwitch = function() {
        ['A', 'B', 'C', 'D'].forEach(function(swCode) {
            var key = [this._mapId, this._eventId, swCode];
            $gameSelfSwitches.setValue(key, undefined);
        }.bind(this));
    };
    Game_PrefabEvent.prototype.getOriginalEventId = function() {
        return this._originalEventId;
    };
    Game_Event.prototype.getOriginalEventId = function() {
        return 0;
    };
    Game_Player.prototype.isNeedMapReload = function() {
        return this._needsMapReload;
    };
    Sprite.getCounter = function() {
        return this._counter;
    };
    Sprite_Character.prototype.isCharacterExtinct = function() {
        return this._character.isExtinct();
    };
    Sprite_Character.prototype.endAllEffect = function() {
        this.endBalloon();
        this.endAnimation();
    };
    Sprite_Character.prototype.endAnimation = function() {
        if (this._animationSprites.length > 0) {
            var sprites            = this._animationSprites.clone();
            this._animationSprites = [];
            sprites.forEach(function(sprite) {
                sprite.remove();
            });
        }
    };
    var _Spriteset_Map_createCharacters      = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        this._prefabSpriteId = Sprite.getCounter() + 1;
        _Spriteset_Map_createCharacters.apply(this, arguments);
    };
    var _Spriteset_Map_update      = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.apply(this, arguments);
        this.updatePrefabEvent();
    };
    Spriteset_Map.prototype.updatePrefabEvent = function() {
        $gameMap.getPrefabEvents().forEach(function(event) {
            if (!event.isSpritePrepared()) {
                this.makePrefabEventSprite(event);
            }
        }.bind(this));
        for (var i = 0, n = this._characterSprites.length; i < n; i++) {
            if (this._characterSprites[i].isCharacterExtinct()) {
                this.removePrefabEventSprite(i--);
                n--;
            }
        }
    };
    Spriteset_Map.prototype.makePrefabEventSprite = function(event) {
        event.setSpritePrepared();
        var sprite      = new Sprite_Character(event);
        sprite.spriteId = this._prefabSpriteId;
        this._characterSprites.push(sprite);
        this._tilemap.addChild(sprite);
    };
    Spriteset_Map.prototype.removePrefabEventSprite = function(index) {
        var sprite = this._characterSprites[index];
        this._characterSprites.splice(index, 1);
        sprite.endAllEffect();
        this._tilemap.removeChild(sprite);
    };
    var _Scene_Map_create      = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.apply(this, arguments);
        if (this._transfer && !param.keepSelfSwitch) {
            $gameMap.resetSelfSwitchForPrefabEvent();
        }
    };
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad      = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataMap && $gameMap) $gameMap.restoreLinkPrefabEvents();
    };
    if (typeof Window_EventMiniLabel !== 'undefined') {
        var _Window_EventMiniLabel_gatherDisplayData      = Window_EventMiniLabel.prototype.gatherDisplayData
        Window_EventMiniLabel.prototype.gatherDisplayData = function() {
            if (!this._character.event()) {
                return;
            }
            _Window_EventMiniLabel_gatherDisplayData.apply(this, arguments);
        };
    }
})();
