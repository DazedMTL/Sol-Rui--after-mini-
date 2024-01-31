// Sapphire Script by Khas (arcthunder.blogspot.com/p/sapphire-script.html)
var Khas = Khas || {};
Khas.Core = {};
Khas.Core.version = 2.0;
/*:
 * 
 * @plugindesc 
 * 
 * @author Nilo K. (Khas - arcthunder.blogspot.com)
 * 
 * @help 
 */;
Khas.REGEX_TAG = /\[([\w_\d]+)\]/;
Khas.REGEX_COMMAND = /\[([\w_\d]+)\s(-?[\w_\d]+)\]/;
Khas.REGEX_DOUBLE_COMMAND = /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/;
  Array.prototype.remove = function(value) {
    var index = this.indexOf(value);
    if (index != -1) {
      this.splice(index, 1);
    };
  };
  Array.prototype.include = function(value) {
    return this.indexOf(value) > -1;
  };
  String.prototype.khasTag = function() {
    return this.match(Khas.REGEX_TAG);
  };
  String.prototype.khasCommand = function() {
    return this.match(Khas.REGEX_COMMAND);
  };
  String.prototype.khasDoubleCommand = function() {
    return this.match(Khas.REGEX_DOUBLE_COMMAND);
  };
  PluginManager.loadSource = function(name) {
    var url = "js/" + (name) + "";
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
  };
  SceneManager.khas_core_initialize = SceneManager.initialize;
  SceneManager.initialize = function() {
    this.khas_core_initialize();
    this.loadKhasPlugins();
  };
  SceneManager.loadKhasPlugins = function() {
  };
  Game_Map.prototype.khas_core_setup = Game_Map.prototype.setup;
  Game_Map.prototype.khas_core_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setup = function(mapId) {
    this.khas_core_setup(mapId);
    if ($dataMap) {
      this.khasExtendSetup();
      this.khasScanNote($dataMap.note.split('\n'));
      this.khasScanTilesetNote(this.tileset().note.split('\n'));
      this.khasPostScan();
    };
  };
  Game_Map.prototype.setupEvents = function() {
    this.khasSetupMap();
    this.khas_core_setupEvents();
  };
  Game_Map.prototype.khasScanNote = function(lines) {
    for (var i = 0; i < lines.length; i++) {
      var command = lines[i];
      if (khasTag = command.khasTag()) {
        this.callKhasTag(khasTag[1]);
      } else if (khasCommand = command.khasCommand()) {
        this.callKhasCommand(khasCommand[1], khasCommand[2], null);
      } else if (khasCommand = command.khasDoubleCommand()) {
        this.callKhasCommand(khasCommand[1], khasCommand[2], khasCommand[3]);
      };
    };
  };
  Game_Map.prototype.khasScanTilesetNote = function(lines) {
    for (var i = 0; i < lines.length; i++) {
      var command = lines[i];
      if (khasTag = command.khasTag()) {
        this.callKhasTag(khasTag[1]);
      } else if (khasCommand = command.khasCommand()) {
        this.callKhasTilesetCommand(khasCommand[1], khasCommand[2], null);
      } else if (khasCommand = command.khasDoubleCommand()) {
        this.callKhasTilesetCommand(khasCommand[1], khasCommand[2], khasCommand[3]);
      };
    };
  };
  Game_Map.prototype.khasSetupMap = function() {
  };
  Game_Map.prototype.khasExtendSetup = function() {
  };
  Game_Map.prototype.khasPostScan = function() {
  };
  Game_Map.prototype.callKhasTag = function(tag) {
  };
  Game_Map.prototype.callKhasCommand = function(command, value1, value2) {
  };
  Game_Map.prototype.callKhasTilesetTag = function(tag) {
  };
  Game_Map.prototype.callKhasTilesetCommand = function(command, value1, value2) {
  };
  Game_CharacterBase.prototype.khasType = function() {
    return "character";
  };
  Game_Player.prototype.khasType = function() {
    return "player";
  };
  Game_Event.prototype.kc_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.khasType = function() {
    return "event";
  };
  Game_Event.prototype.setupPage = function() {
    this.kc_setupPage();
    this.khasExtendSetup();
    this.khasScanComments();
  };
  Game_Event.prototype.khasScanComments = function() {
    if (this.page()) {
      var list = this.list(), khasTag, khasCommand;
      if (list) {
        for (var i = 0; i < list.length; i++) {
          if (list[i] && (list[i].code == 108 || list[i].code == 408)) {
            var command = list[i].parameters[0];
            if (khasTag = command.khasTag()) {
              this.callKhasTag(khasTag[1]);
            } else if (khasCommand = command.khasCommand()) {
              this.callKhasCommand(khasCommand[1], khasCommand[2], null);
            } else if (khasCommand = command.khasDoubleCommand()) {
              this.callKhasCommand(khasCommand[1], khasCommand[2], khasCommand[3]);
            };
          };
        };
      };
    };
  };
  Game_Event.prototype.khasExtendSetup = function() {
  };
  Game_Event.prototype.callKhasTag = function(tag) {
  };
  Game_Event.prototype.callKhasCommand = function(command, value1, value2) {
  };
