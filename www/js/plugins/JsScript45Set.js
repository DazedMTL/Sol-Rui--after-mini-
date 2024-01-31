// (C)2016 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param TemplateMapId
 * @desc The map ID where the template event resides.
 * @default 1
 * @type number
 *
 * @param KeepEventId
 * @desc Maintain the event ID of the caller when invoking the map event.
 * @default false
 * @type boolean
 *
 * @param OverrideTarget
 * @desc メモ欄で上書き(テンプレートイベントより固有イベントの設定を優先)指定したイベントの上書き対象項目を設定します。
 * @default
 * @type struct<override>
 *
 * @param AutoOverride
 * @desc メモ欄で上書き設定をしなくても「上書き対象項目」の設定を上書きします。
 * @default false
 * @type boolean
 *
 * @param IntegrateNote
 * @desc テンプレートイベントと固有イベントのメモ欄を統合もしくは上書きします。
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Integrate
 * @value 1
 * @option Override
 * @value 2
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param TemplateMapId
 * @text テンプレートマップID
 * @desc テンプレートイベントが存在するマップIDです。
 * @default 1
 * @type number
 *
 * @param KeepEventId
 * @text イベントIDを維持
 * @desc マップイベントを呼び出す際に、呼び出し元のイベントIDを維持します。対象を「このイベント」にした際の挙動が変わります。
 * @default false
 * @type boolean
 *
 * @param OverrideTarget
 * @text 上書き対象項目
 * @desc メモ欄で上書き(テンプレートイベントより固有イベントの設定を優先)指定したイベントの上書き対象項目を設定します。
 * @default
 * @type struct<override>
 *
 * @param AutoOverride
 * @text 自動上書き
 * @desc メモ欄で上書き設定をしなくても「上書き対象項目」の設定を上書きします。
 * @default false
 * @type boolean
 *
 * @param IntegrateNote
 * @text メモ欄統合
 * @desc テンプレートイベントと固有イベントのメモ欄を統合もしくは上書きします。
 * @default 0
 * @type select
 * @option 何もしない
 * @value 0
 * @option 統合
 * @value 1
 * @option 上書き
 * @value 2
 *
 * @help 
 */
/*~struct~override:
 *
 * @param Image
 * @text 画像
 * @desc イベントの画像および画像インデックスです。
 * @type boolean
 * @default false
 *
 * @param Direction
 * @text 向き
 * @desc イベントの向き及びアニメパターンです。
 * @type boolean
 * @default false
 *
 * @param Move
 * @text 自律移動
 * @desc イベントの自律移動です。
 * @type boolean
 * @default false
 *
 * @param Priority
 * @text プライオリティ
 * @desc イベントのプライオリティです。
 * @type boolean
 * @default false
 *
 * @param Trigger
 * @text トリガー
 * @desc イベントのトリガーです。
 * @type boolean
 * @default false
 *
 * @param Option
 * @text オプション
 * @desc イベントのオプションです。
 * @type boolean
 * @default false
 */
var $dataTemplateEvents = null;
(function() {
    'use strict';
    var metaTagPrefix = 'TE';
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };
    var getMetaValues = function(object, names) {
        if (!object) return undefined;
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };
    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
    var isNotAString = function(args) {
        return String(args) !== args;
    };
    var isExistPlugin = function(pluginName) {
        return Object.keys(PluginManager.parameters(pluginName)).length > 0;
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
    setPluginCommand('固有イベント呼び出し', 'execCallOriginEvent');
    setPluginCommand('_CALL_ORIGIN_EVENT', 'execCallOriginEvent');
    setPluginCommand('マップイベント呼び出し', 'execCallMapEvent');
    setPluginCommand('_CALL_MAP_EVENT', 'execCallMapEvent');
    setPluginCommand('セルフ変数の操作', 'execControlSelfVariable');
    setPluginCommand('_SET_SELF_VARIABLE', 'execControlSelfVariable');
    setPluginCommand('セルフ変数の一括操作', 'execControlSelfVariableRange');
    setPluginCommand('_SET_RANGE_SELF_VARIABLE', 'execControlSelfVariableRange');
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
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
    var param = createPluginParameter('JsScript45Set');
    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command101.apply(this, arguments);
    };
    var _Game_Interpreter_command105      = Game_Interpreter.prototype.command105;
    Game_Interpreter.prototype.command105 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command105.apply(this, arguments);
    };
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](this.convertAllSelfVariables(convertAllArguments(args)));
        }
    };
    Game_Interpreter.prototype.execCallOriginEvent = function(args) {
        this.callOriginEvent(getArgNumber(args[0]));
    };
    Game_Interpreter.prototype.execCallMapEvent = function(args) {
        var pageIndex = getArgNumber(args[1], 1);
        var eventId   = getArgNumber(args[0]);
        if ($gameMap.event(eventId)) {
            this.callMapEventById(pageIndex, eventId);
        } else if (args[0] !== '') {
            this.callMapEventByName(pageIndex, args[0]);
        } else {
            this.callMapEventById(pageIndex, this._eventId);
        }
    };
    Game_Interpreter.prototype.execControlSelfVariable = function(args) {
        var selfIndex   = getArgNumber(args[0], 0) || args[0];
        var controlType = getArgNumber(args[1], 0, 5);
        var operand     = isNaN(Number(args[2])) ? args[2] : getArgNumber(args[2]);
        this.controlSelfVariable(selfIndex, controlType, operand, false);
    };
    Game_Interpreter.prototype.execControlSelfVariableRange = function(args) {
        var selfStartIndex = getArgNumber(args[0], 0) || args[0];
        var selfEndIndex   = getArgNumber(args[1], 0) || args[0];
        var controlType    = getArgNumber(args[2], 0, 5);
        var operand        = isNaN(Number(args[3])) ? args[3] : getArgNumber(args[3]);
        this.controlSelfVariableRange(selfStartIndex, selfEndIndex, controlType, operand, false);
    };
    Game_Interpreter.prototype.callOriginEvent = function(pageIndex) {
        var event = $gameMap.event(this._eventId);
        if (event && event.hasTemplate()) {
            this.setupAnotherList(null, event.getOriginalPages(), pageIndex);
        }
    };
    Game_Interpreter.prototype.callMapEventById = function(pageIndex, eventId) {
        var event = $gameMap.event(eventId);
        if (event) {
            this.setupAnotherList(param.KeepEventId ? null : eventId, event.getPages(), pageIndex);
        }
    };
    Game_Interpreter.prototype.callMapEventByName = function(pageIndex, eventName) {
        var event = DataManager.searchDataItem($dataMap.events, 'name', eventName);
        if (event) {
            this.setupAnotherList(param.KeepEventId ? null : event.id, event.pages, pageIndex);
        }
    };
    Game_Interpreter.prototype.setupAnotherList = function(eventId, pages, pageIndex) {
        var page = pages[pageIndex - 1 || this._pageIndex] || pages[0];
        if (!eventId) eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(page.list, eventId);
    };
    Game_Interpreter.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        var character = this.character(0);
        if (character) {
            character.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };
    Game_Interpreter.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        var character = this.character(0);
        if (character) {
            character.controlSelfVariableRange(startIndex, endIndex, type, operand, formulaFlg);
        }
    };
    Game_Interpreter.prototype.getSelfVariable = function(selfVariableIndex) {
        var character = this.character(0);
        return character ? character.getSelfVariable(selfVariableIndex) : 0;
    };
    Game_Interpreter.prototype.convertAllSelfVariables = function(args) {
        return args.map(function(arg) {
            return $gameSelfSwitches.convertSelfVariableCharacter(this._eventId, arg, false);
        }, this);
    };
    var _Game_Message_clear      = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._eventId = 0;
    };
    Game_Message.prototype.setEventId = function(id) {
        this._eventId = id;
    };
    Game_Message.prototype.getEventId = function() {
        return this._eventId;
    };
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameSelfSwitches.clearVariableIfNeed();
    };
    var _Game_SelfSwitches_initialize      = Game_SelfSwitches.prototype.initialize;
    Game_SelfSwitches.prototype.initialize = function() {
        _Game_SelfSwitches_initialize.apply(this, arguments);
        this.clearVariable();
    };
    Game_SelfSwitches.prototype.clearVariable = function() {
        this._variableData = {};
    };
    Game_SelfSwitches.prototype.clearVariableIfNeed = function() {
        if (!this._variableData) {
            this.clearVariable();
        }
    };
    Game_SelfSwitches.prototype.getVariableValue = function(key) {
        return this._variableData.hasOwnProperty(key) ? this._variableData[key] : 0;
    };
    Game_SelfSwitches.prototype.setVariableValue = function(key, value) {
        if (this._variableData[key] === value) {
            return;
        }
        if (value !== undefined && value !== 0) {
            this._variableData[key] = value;
        } else {
            delete this._variableData[key];
        }
        this.onChange();
    };
    Game_SelfSwitches.prototype.makeSelfVariableKey = function(eventId, index) {
        return eventId > 0 ? [$gameMap.mapId(), eventId, index] : null;
    };
    Game_SelfSwitches.prototype.convertSelfVariableCharacter = function(eventId, text, scriptFlag) {
        text = text.replace(/\x1bSV\[(\w+)]/gi, function() {
            var key   = this.makeSelfVariableKey(eventId, arguments[1]);
            var value = this.getVariableValue(key);
            return isNotAString(value) || !scriptFlag ? value : '\'' + value + '\'';
        }.bind(this));
        return text;
    };
    var _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        var event = $dataMap.events[eventId];
        this.setTemplate(event);
        _Game_Event_initialize.apply(this, arguments);
        if (this.hasTemplate()) {
            this.setPosition(event.x, event.y);
            this.refreshBushDepth();
        }
    };
    var _Game_Event_setupPageSettings      = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.apply(this, arguments);
        if (this.hasTemplate() && param.OverrideTarget && this._override) {
            this.overridePageSettings();
        }
    };
    Game_Event.prototype.overridePageSettings = function() {
        var page = this.getOriginalPage();
        if (!page) {
            return;
        }
        var image = page.image;
        var target = param.OverrideTarget;
        if (target.Image) {
            if (image.tileId > 0) {
                this.setTileImage(image.tileId);
            } else {
                this.setImage(image.characterName, image.characterIndex);
            }
        }
        if (target.Direction) {
            if (this._originalDirection !== image.direction) {
                this._originalDirection = image.direction;
                this._prelockDirection = 0;
                this.setDirectionFix(false);
                this.setDirection(image.direction);
            }
            if (this._originalPattern !== image.pattern) {
                this._originalPattern = image.pattern;
                this.setPattern(image.pattern);
            }
        }
        if (target.Move) {
            this.setMoveSpeed(page.moveSpeed);
            this.setMoveFrequency(page.moveFrequency);
            this.setMoveRoute(page.moveRoute);
            this._moveType = page.moveType;
        }
        if (target.Priority) {
            this.setPriorityType(page.priorityType);
        }
        if (target.Option) {
            this.setWalkAnime(page.walkAnime);
            this.setStepAnime(page.stepAnime);
            this.setDirectionFix(page.directionFix);
            this.setThrough(page.through);
        }
        if (target.Trigger) {
            this._trigger = page.trigger;
            if (this._trigger === 4) {
                this._interpreter = new Game_Interpreter();
            } else {
                this._interpreter = null;
            }
        }
    };
    Game_Event.prototype.setTemplate = function(event) {
        var templateId = this.generateTemplateId(event);
        if (templateId) {
            this._templateId = templateId;
            this._templateEvent = $dataTemplateEvents[this._templateId];
            this._override   = param.AutoOverride || !!getMetaValues(event, ['OverRide', '上書き']);
            if (param.IntegrateNote > 0) {
                this.integrateNote(event, param.IntegrateNote);
            }
        } else {
            this._templateId = 0;
            this._templateEvent = null;
            this._override   = false;
        }
    };
    Game_Event.prototype.generateTemplateId = function(event) {
        var value = getMetaValues(event, '');
        if (!value) {
            return 0;
        }
        var templateId = getArgNumber(value, 0, $dataTemplateEvents.length - 1);
        if (!templateId) {
            var template = DataManager.searchDataItem($dataTemplateEvents, 'name', value);
            if (template) {
                templateId = template.id;
            }
        }
        return templateId;
    };
    Game_Event.prototype.integrateNote = function(event, type) {
        this._templateEvent = JsonEx.makeDeepCopy(this._templateEvent);
        this._templateEvent.note = (type === 1 ? this._templateEvent.note : '') + event.note;
        DataManager.extractMetadata(this._templateEvent);
    };
    Game_Event._userScripts = ['getTemplateId', 'getTemplateName'];
    Game_Event.prototype.getTemplateId = function() {
        return this._templateId;
    };
    Game_Event.prototype.getTemplateName = function() {
        return this.hasTemplate() ? this._templateEvent.name : '';
    };
    Game_Event.prototype.hasTemplate = function() {
        return this._templateId > 0;
    };
    var _Game_Event_event      = Game_Event.prototype.event;
    Game_Event.prototype.event = function() {
        return this.hasTemplate() ? this._templateEvent : _Game_Event_event.apply(this, arguments);
    };
    Game_Event.prototype.getOriginalPages = function() {
        var eventId = isExistPlugin('SAN_MapGenerator') ? this._dataEventId : this._eventId;
        return $dataMap.events[eventId].pages;
    };
    Game_Event.prototype.getOriginalPage = function() {
        return this.getOriginalPages()[this._pageIndex];
    };
    Game_Event.prototype.getPages = function() {
        return this.event().pages;
    };
    var _Game_Event_meetsConditions      = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function(page) {
        return _Game_Event_meetsConditions.apply(this, arguments) && this.meetsConditionsForSelfVariable(page);
    };
    Game_Event.prototype.meetsConditionsForSelfVariable = function(page) {
        var comment = this.getStartComment(page);
        return !(comment && this.execConditionScriptForSelfVariable(comment) === false);
    };
    Game_Event.prototype.getStartComment = function(page) {
        return page.list.filter(function(command) {
            return command && (command.code === 108 || command.code === 408);
        }).reduce(function(prev, command) {
            return prev + command.parameters[0];
        }, '');
    };
    Game_Event.prototype.execConditionScriptForSelfVariable = function(note) {
        var scripts = [];
        note.replace(/\\TE{(.+?)}/gi, function() {
            scripts.push(arguments[1]);
        }.bind(this));
        return scripts.every(function(script) {
            script = convertEscapeCharacters(script);
            script = $gameSelfSwitches.convertSelfVariableCharacter(this._eventId, script, true);
            return eval(script);
        }, this);
    };
    Game_Event.prototype.getSelfVariableKey = function(index) {
        return $gameSelfSwitches.makeSelfVariableKey(this._eventId, index);
    };
    Game_Event.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        var key = this.getSelfVariableKey(index);
        if (key) {
            this.operateSelfVariable(key, type, formulaFlg ? eval(operand) : operand);
        }
    };
    Game_Event.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        for (var index = startIndex; index <= endIndex; index++) {
            this.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };
    Game_Event.prototype.getSelfVariable = function(selfVariableIndex) {
        var key = this.getSelfVariableKey(selfVariableIndex);
        return $gameSelfSwitches.getVariableValue(key);
    };
    Game_Event.prototype.operateSelfVariable = function(key, operationType, value) {
        var oldValue = $gameSelfSwitches.getVariableValue(key);
        switch (operationType) {
            case 0:  
                $gameSelfSwitches.setVariableValue(key, oldValue = value);
                break;
            case 1:  
                $gameSelfSwitches.setVariableValue(key, oldValue + value);
                break;
            case 2:  
                $gameSelfSwitches.setVariableValue(key, oldValue - value);
                break;
            case 3:  
                $gameSelfSwitches.setVariableValue(key, oldValue * value);
                break;
            case 4:  
                $gameSelfSwitches.setVariableValue(key, oldValue / value);
                break;
            case 5:  
                $gameSelfSwitches.setVariableValue(key, oldValue % value);
                break;
        }
    };
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
    var _Window_Base_convertEscapeCharacters      = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        return $gameSelfSwitches.convertSelfVariableCharacter($gameMessage.getEventId(), text, false);
    };
    var _Scene_Boot_create      = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        this._templateMapGenerator = this.templateMapLoadGenerator();
        $dataMap = {};
    };
    var _Scene_Boot_isReady      = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        var isReady = _Scene_Boot_isReady.apply(this, arguments);
        return this._templateMapGenerator.next().done && isReady;
    };
    Scene_Boot.prototype.templateMapLoadGenerator = function*() {
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        if (!$gamePlayer) {
            $gamePlayer = {isTransferring:function() {}};
        }
        DataManager.loadMapData(param.TemplateMapId);
        $gamePlayer = null;
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        $dataTemplateEvents = $dataMap.events;
        $dataMap = {};
        return true;
    };
})();
