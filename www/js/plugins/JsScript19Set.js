/*:
 * @plugindesc 
 * @author 奏ねこま（おとぶき ねこま）
 * 
 * @param Spine File
 * @type string[]
 * @default 
 * @desc Spineファイル（*.json）の場所を指定してください。
 *
 * @help 
 */
var Imported = Imported || {};
var Makonet = Makonet || {};
const plugin = 'JsScript19Set';
Imported[plugin] = true;
Makonet[plugin] = {};
const $mpi = Makonet[plugin];
$mpi.parameters = PluginManager.parameters(plugin);
$mpi.spineFiles = eval($mpi.parameters['Spine File']);
$mpi.spineData = {};
(function(){
    'use strict';
    let element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = 'js/libs/pixi-spine.js';
    document.body.appendChild(element);
    (function loadSpine() {
        let loader = new PIXI.loaders.Loader();
        $mpi.spineFiles.forEach(function(file) {
            let name = file.replace(/^.*\//, '').replace(/\.json$/, '');
            $mpi.spineData[name] = null;
            loader = loader.add(name, 'img/spines/' + file.replace(/^\//, '').replace(/\.json$/, '') + '.json');
        });
        loader.load(function(loader, resource) {
            Object.keys(resource).forEach(function(key) {
                if (resource[key].spineData) {
                    $mpi.spineData[key] = resource[key].spineData;
                    }
                });
                if (Object.keys($mpi.spineData).some(function(key) {
                    return !$mpi.spineData[key];
                })) {
                    loader.reset();
                    loadSpine();
                }
            }
        );
    }());
    class MosaicFilter extends PIXI.Filter {
        constructor(size = 10) {
            let fragment = 'precision mediump float;varying vec2 vTextureCoord;uniform vec2 size;uniform sampler2D uSampler;uniform vec4 filterArea;vec2 mapCoord(vec2 coord){coord*=filterArea.xy;coord+=filterArea.zw;return coord;}vec2 unmapCoord(vec2 coord){coord-=filterArea.zw;coord/=filterArea.xy;return coord;}vec2 pixelate(vec2 coord, vec2 size){return floor(coord / size) * size;}void main(void){vec2 coord=mapCoord(vTextureCoord);coord=pixelate(coord, size);coord=unmapCoord(coord);gl_FragColor=texture2D(uSampler, coord);}';
            super(null, fragment);
            this.uniforms.size = [size, size];
        }
    }
    PIXI.filters.MosaicFilter = MosaicFilter;
    function convertVariables(text) {
        if (typeof(text) !== 'string') return text;
        let pattern = '\\\\v\\[(\\d+)\\]';
        while (text.match(RegExp(pattern, 'i'))) {
            text = text.replace(RegExp(pattern, 'gi'), function(){
                return $gameVariables.value(+arguments[1]);
            });
        }
        return text;
    }
    {
        let __isReady = Scene_Boot.prototype.isReady;
        Scene_Boot.prototype.isReady = function() {
            return __isReady.apply(this, arguments) &&
            Object.keys($mpi.spineData).every(function(key) {
                return !!$mpi.spineData[key];
            });
        };
    }
    {
        let __initialize = Game_Temp.prototype.initialize;
        Game_Temp.prototype.initialize = function() {
            __initialize.apply(this, arguments);
            this._MSS_Spines = {};
        };
    }
    {
        let __pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
            __pluginCommand.apply(this, arguments);
            command = command.toLowerCase();
            switch (command) {
            case 'showspine':
                var name = convertVariables(args[0]) || '';
                var animation = convertVariables(args[1]) || '';
                var loop = (convertVariables(args[2]) || 'true').toLowerCase() === 'true';
                $gameTemp._MSS_SpineActions = [{ name: name, animation: animation, loop: loop, type: 0 }];
                break;
            case 'setspineanimation':
            case 'addspineanimation':
                var id = Number(convertVariables(args[0])) || 0;
                var animation = convertVariables(args[1]) || '';
                var loop = (convertVariables(args[2]) || 'true').toLowerCase() === 'true';
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                var type = (command === 'setspineanimation') ? 0 : 1;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ animation: animation, loop: loop, type: type });
                }
                break;
            case 'setspinemix':
                var id = Number(convertVariables(args[0])) || 0;
                var from = convertVariables(args[1]) || '';
                var to = convertVariables(args[2]) || '';
                var duration = Number(convertVariables(args[3])) || 0;
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ from: from, to: to, duration: duration, type: 2 });
                }
                break;
            case 'setspineskin':
                var id = Number(convertVariables(args[0])) || 0;
                var skin = convertVariables(args[1]) || '';
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ skin: skin, type: 3 });
                }
                break;
            case 'addspineskin':
                var id = Number(convertVariables(args[0])) || 0;
                var skin = convertVariables(args[1]) || '';
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ skin: skin, type: 11 });
                }
                break;
            case 'setspinetimescale':
                var id = Number(convertVariables(args[0])) || 0;
                var timescale = Number(convertVariables(args[1])) || 1;
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ timescale: timescale, type: 4 });
                }
                break;
            case 'setspinecolor':
                var id = Number(convertVariables(args[0])) || 0;
                var red = Number(convertVariables(args[1])) || 0;
                var green = Number(convertVariables(args[2])) || 0;
                var blue = Number(convertVariables(args[3])) || 0;
                var alpha = Number(convertVariables(args[4])) || 0;
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ color: { red: red, green: green, blue: blue, alpha: alpha }, type: 5 });
                }
                break;
            case 'setspinerandomanimation':
            case 'addspinerandomanimation':
            case 'setspinerandomanimationex':
            case 'addspinerandomanimationex':
                var id = Number(convertVariables(args[0])) || 0;
                var animations = convertVariables(args[1]) || '';
                var loop = (convertVariables(args[2]) || 'true').toLowerCase() === 'true';
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                var type = 6 + (/^add/.test(command) ? 1 : 0) + (/ex$/.test(command) ? 2 : 0);
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ animations: animations, loop: (type <= 7) ? loop : false, type: type });
                }
                break;
            case 'setspinemosaic':
                var id = Number(convertVariables(args[0])) || 0;
                var image = convertVariables(args[1]) || '';
                var size = Number(convertVariables(args[2])) || 1;
                var picture = (id > 0) ? $gameScreen.picture(id) : null;
                if (picture && picture._MSS_IsSpine) {
                    if (!picture._MSS_SpineActions) {
                        picture._MSS_SpineActions = [];
                    }
                    picture._MSS_SpineActions.push({ image: image, size: size, type: 10 });
                }
                break;
            }
        };
    }
    {
        let __showPicture = Game_Screen.prototype.showPicture;
        Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
            let spineAnimations = $gameTemp._MSS_SpineActions;
            if (spineAnimations) {
                name = '';
            }
            __showPicture.call(this, pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
            let picture = this._pictures[this.realPictureId(pictureId)];
            if (spineAnimations) {
                picture._MSS_SpineActions = spineAnimations;
                picture._MSS_IsSpine = true;
                delete $gameTemp._MSS_SpineActions;
            } else {
                picture._MSS_IsSpine = false;
            }
        };
    }
    {
        let __update = Sprite_Picture.prototype.update;
        Sprite_Picture.prototype.update = function() {
            let picture = this.picture();
            if (!picture || !picture._MSS_IsSpine) {
                if (this._MSS_Spine) {
                    this.removeChild(this._MSS_Spine);
                    delete this._MSS_Spine;
                }
                let realPictureId = $gameScreen.realPictureId(this._pictureId);
                if ($gameTemp._MSS_Spines[realPictureId] != undefined) {
                    delete $gameTemp._MSS_Spines[realPictureId];
                }
                if (picture != undefined) {
                    delete picture._MSS_SpineName;
                    delete picture._MSS_SpineAnimationList;
                    delete picture._MSS_SpineMixList;
                    delete picture._MSS_SpineSkin;
                    delete picture._MSS_SpineTimeScale;
                    delete picture._MSS_SpineStart;
                    delete picture._MSS_SpinePause;
                    delete picture._MSS_SpineColor;
                    delete picture._MSS_SpineRandomAnimationList;
                    delete picture._MSS_SpineMosaicList;
                }
            }
            let update = Sprite.prototype.update;
            if (this._MSS_Spine != undefined) {
                Sprite.prototype.update = function(){};
            }
            __update.apply(this,arguments);
            Sprite.prototype.update = update;
        };
        Sprite_Picture.prototype.playAction = function (PicNo ,Spine_State, Spine_Action) {
            var mLayer = 0;
            var mSpeed = 1;
            var loopflg = true;
            var n = 0;
            for (n = 0; n <= SpinAnimePLayer.length - 1; n++){
                if (SpinAnimePLayer[n]._PicNo == PicNo){
                    if (SpinAnimePLayer[n]._MtnName == Spine_Action.animation) {
                        loopflg = SpinAnimePLayer[n]._loopflg;
                        mLayer = SpinAnimePLayer[n]._Slayer;
                        mSpeed = SpinAnimePLayer[n]._Speed;
                    }
                }
            }
            Spine_State.setAnimation(mLayer, Spine_Action.animation, loopflg, mSpeed);
        }
        Sprite_Picture.prototype.AddAction = function (PicNo, Spine_State, Spine_Action) {
            var mLayer = 0;
            var mSpeed = 1;
            var loopflg = true;
            var n = 0;
            for (n = 0; n <= SpinAnimePLayer.length - 1; n++) {
                if (SpinAnimePLayer[n]._PicNo == PicNo) {
                    if (SpinAnimePLayer[n]._MtnName == Spine_Action.animation) {
                        loopflg = SpinAnimePLayer[n]._loopflg;
                        mLayer = SpinAnimePLayer[n]._Slayer;
                        mSpeed = SpinAnimePLayer[n]._Speed;
                    }
                }
            }
            Spine_State.addAnimation(mLayer, Spine_Action.animation, loopflg, 0, mSpeed);
        }
        let __updateBitmap = Sprite_Picture.prototype.updateBitmap;
        Sprite_Picture.prototype.updateBitmap = function() {
            __updateBitmap.apply(this, arguments);
            let picture = this.picture();
            if (picture != undefined) {
                if (picture._MSS_RsvSpineActions != undefined) {
                    for (var jj = 0; jj <= picture._MSS_RsvSpineActions.length - 1; jj++) {
                        if (picture._MSS_SpineActions == undefined) {
                            picture._MSS_SpineActions  = [];
                        }
                        picture._MSS_SpineActions.push(picture._MSS_RsvSpineActions[jj]);
                    }
                }
                picture._MSS_RsvSpineActions = []; 
                let spineActions = picture._MSS_SpineActions;
                let realPictureId = $gameScreen.realPictureId(this._pictureId);
                if (spineActions) {
                    spineActions.forEach(function(spineAction) {
                        if (spineAction.name) {
                            if (!$mpi.spineData[spineAction.name]) { 
                                console.log("ActionResave"); 
                                picture._MSS_RsvSpineActions.push(spineAction);
                                return;
                            }
                            picture._MSS_SpineName = spineAction.name;
                            picture._MSS_SpineAnimationList = [spineAction];
                            picture._MSS_SpineMixList = {};
                            picture._MSS_SpineSkin = null;
                            picture._MSS_SpineTimeScale = 1;
                            picture._MSS_SpineStart = performance.now();
                            picture._MSS_SpinePause = 0;
                            picture._MSS_SpineColor = null;
                            picture._MSS_SpineRandomAnimationList = null;
                            picture._MSS_SpineMosaicList = null;
                            if (this._MSS_Spine) {
                                this.removeChild(this._MSS_Spine);
                            }
                            this._MSS_Spine = $gameTemp._MSS_Spines[realPictureId] = new PIXI.spine.Spine($mpi.spineData[spineAction.name]);
                            this._MSS_Spine.skeleton.Mdlname = spineAction.name; 
                            this.playAction(realPictureId , this._MSS_Spine.state, spineAction); 
                            if (this._MSS_Spine.spineData.skins.length > 1) {
                                picture._MSS_SpineSkin = this._MSS_Spine.spineData.skins[1].name;
                                this._MSS_Spine.skeleton.setSkinByName(picture._MSS_SpineSkin);
                            }
                            this._MSS_Spine.state.addListener({
                                event: this.onSpineEvent.bind(this),
                                complete: this.onSpineComplete.bind(this)
                            });
                            this.addChild(this._MSS_Spine);
                        } else if (spineAction.type === 0) {
                            this.playAction(realPictureId, this._MSS_Spine.state, spineAction); 
                            picture._MSS_SpineAnimationList = [spineAction];
                            picture._MSS_SpineStart = performance.now();
                            picture._MSS_SpinePause = 0;
                            picture._MSS_SpineRandomAnimationList = null;
                        } else if (spineAction.type === 1) {
                            this.AddAction(realPictureId, this._MSS_Spine.state, spineAction); 
                            picture._MSS_SpineAnimationList.push(spineAction);
                            picture._MSS_SpineRandomAnimationList = null;
                        } else if (spineAction.type === 2) {
                            var si = 0;
                            for (si = 0; si <= this._MSS_Spine.spineData.animations.length - 1; si++){
                                if (spineAction.to != this._MSS_Spine.spineData.animations[si].name) {
                                    this._MSS_Spine.stateData.setMix(this._MSS_Spine.spineData.animations[si].name
                                        , spineAction.to, spineAction.duration);
                                    picture._MSS_SpineMixList[[this._MSS_Spine.spineData.animations[si].name, spineAction.to]] = spineAction;
                                }
                            }
                            //this._MSS_Spine.stateData.setMix(spineAction.from, spineAction.to, spineAction.duration); //nupu元はこれ
                        } else if (spineAction.type === 3) {
                            this._MSS_Spine.skeleton.setSkinByName(spineAction.skin);
                            this._MSS_Spine.skeleton.setSlotsToSetupPose();
                            picture._MSS_SpineSkin = spineAction.skin;
                        } else if (spineAction.type === 4) {
                            this._MSS_Spine.state.timeScale = spineAction.timescale;
                            picture._MSS_SpineTimeScale = spineAction.timescale;
                        } else if (spineAction.type === 5) {
                            let color = spineAction.color;
                            let filter = new PIXI.filters.ColorMatrixFilter();
                            filter.matrix = [
                                color.red, 0, 0, 0, 0,
                                0, color.green, 0, 0, 0,
                                0, 0, color.blue, 0, 0,
                                0, 0, 0, color.alpha, 0
                            ];
                            this._MSS_Spine.filters = [filter];
                            picture._MSS_SpineColor = spineAction.color;
                        } else if (spineAction.type >= 6 && spineAction.type <= 9) {
                            let list = [];
                            let total_weight = 0;
                            spineAction.animations.split(/,/).forEach(animation => {
                                let name = animation.replace(/\((\d+)\)$/, '');
                                let weight = Number(RegExp.$1) || 1;
                                list.push({ name: name, border: total_weight + weight });
                                total_weight += weight;
                            });
                            let value = Math.random() * total_weight;
                            let animation = '';
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].border > value) {
                                    animation = list[i].name;
                                    break;
                                }
                            }
                            if (animation) {
                                spineAction.animation = animation;
                                delete spineAction.animations;
                                if ([6, 8].includes(spineAction.type)) {
                                    this._MSS_Spine.state.setAnimation(0, animation, spineAction.loop);
                                    picture._MSS_SpineAnimationList = [spineAction];
                                    picture._MSS_SpineStart = performance.now();
                                    picture._MSS_SpinePause = 0;
                                } else {
                                    this._MSS_Spine.state.addAnimation(0, animation, spineAction.loop, 0);
                                    picture._MSS_SpineAnimationList.push(spineAction);
                                }
                                picture._MSS_SpineRandomAnimationList = null;
                            }
                            if (spineAction.type >= 8) {
                                picture._MSS_SpineRandomAnimationList = list;
                            }
                        } else if (spineAction.type == 10) {
                            let image = spineAction.image;
                            let size = spineAction.size;
                            this._MSS_Spine.children.forEach(child => {
                                child.children.forEach(child => {
                                    try{ 
                                        if (child.region.name == image) {
                                            let filters = child.filters || [];
                                            let index = filters.findIndex(filter => {
                                                return (filter instanceof MosaicFilter);
                                            });
                                            if (index >= 0) {
                                                if (size > 1) {
                                                    filters.splice(index, 1, new MosaicFilter(size));
                                                    spineAction.index = index;
                                                    MosOkAdd(realPictureId, image, size);
                                                } else {
                                                    filters.splice(index, 1);
                                                }
                                            } else if (size > 1) {
                                                filters.push(new MosaicFilter(size));
                                                spineAction.index = 0;
                                                MosOkAdd(realPictureId, image, size);
                                            }
                                            child.filters = (filters.length > 0) ? filters : null;
                                        }
                                    } catch (ex) {
                                        MosErrAdd(realPictureId, image, size);
                                        //console.log("mosaic:Err:nupu"); //モザイクエラー
                                    }
                                });
                            });
                            let list = picture._MSS_SpineMosaicList || {};
                            (size > 1) ? list[image] = spineAction : delete list[image];
                            picture._MSS_SpineMosaicList = list;
                        } else if (spineAction.type === 11) {
                            this._MSS_Spine.skeleton.setSkinByName(spineAction.skin);
                            this._MSS_Spine.skeleton.setSlotsToSetupPose();
                            picture._MSS_SpineSkin = spineAction.skin;
                        }
                    }, this);
                    delete picture._MSS_SpineActions;
                } else if (!this._MSS_Spine) {
                    if ($gameTemp._MSS_Spines[realPictureId]) {
                        this._MSS_Spine = $gameTemp._MSS_Spines[realPictureId];
                        this.addChild(this._MSS_Spine);
                        this._MSS_Spine.updateTransform();
                        this._MSS_Spine.state.timeScale = picture._MSS_SpineTimeScale || 1;
                    } else if (picture._MSS_IsSpine) {
                        if (picture._MSS_SpineName != undefined) {
                            this._MSS_Spine = $gameTemp._MSS_Spines[realPictureId] = new PIXI.spine.Spine($mpi.spineData[picture._MSS_SpineName]);
                            let trackTime = (picture._MSS_SpinePause - picture._MSS_SpineStart) / 1000;
                            let finished = 0;
                            let durations = {};
                            let durationTotal = 0;
                            this._MSS_Spine.spineData.animations.forEach(function (animation) {
                                durations[animation.name] = animation.duration;
                            });
                            picture._MSS_SpineAnimationList.forEach(function (spineAnimation, index) {
                                if (index === 0) {
                                    this._MSS_Spine.state.setAnimation(0, spineAnimation.animation, spineAnimation.loop);
                                } else {
                                    this._MSS_Spine.state.addAnimation(0, spineAnimation.animation, spineAnimation.loop, 0);
                                }
                                durationTotal += durations[spineAnimation.animation];
                                if (durationTotal <= trackTime) {
                                    finished++;
                                }
                            }, this);
                            Object.keys(picture._MSS_SpineMixList).forEach(function (key) {
                                let spineMix = picture._MSS_SpineMixList[key];
                                try {
                                    this._MSS_Spine.stateData.setMix(spineMix.from, spineMix.to, spineMix.duration);
                                }catch(ex){
                                }
                            }, this);
                            this._MSS_Spine.state.tracks[0].trackTime = trackTime;
                            if (picture._MSS_SpineSkin) {
                                this._MSS_Spine.skeleton.setSkinByName(picture._MSS_SpineSkin);
                            }
                            this._MSS_Spine.state.timeScale = picture._MSS_SpineTimeScale || 1;
                            if (picture._MSS_SpineColor) {
                                let color = picture._MSS_SpineColor;
                                let filter = new PIXI.filters.ColorMatrixFilter();
                                filter.matrix = [
                                    color.red, 0, 0, 0, 0,
                                    0, color.green, 0, 0, 0,
                                    0, 0, color.blue, 0, 0,
                                    0, 0, 0, color.alpha, 0
                                ];
                                this._MSS_Spine.filters = [filter];
                            }
                            if (picture._MSS_SpineMosaicList) {
                                let list = picture._MSS_SpineMosaicList;
                                Object.keys(list).sort((a, b) => list[a].index - list[b].index)
                                    .forEach(key => {
                                        this._MSS_Spine.children.forEach(child => {
                                            child.children.forEach(child => {
                                                if (child.region != undefined) { 
                                                    if (child.region.name == key) {
                                                        child.filters = [new MosaicFilter(list[key].size)];
                                                    }
                                                }
                                            });
                                        });
                                    });
                            }
                            this.addChild(this._MSS_Spine);
                            this._MSS_Spine.state.addListener({ complete: this.onSpineComplete.bind(this) });
                            for (let i = 0; i < finished; i++) {
                                this._MSS_Spine.updateTransform();
                            }
                            this._MSS_Spine.state.addListener({ event: this.onSpineEvent.bind(this) });
                            console.log("Nupu : after Load Spine"); 
                            SpineLoadFlg = true; 
                            this._MSS_Spine.skeleton.Mdlname = picture._MSS_SpineName;
                            this._MSS_Spine.skeleton.setSkinByName("");
                        }
                    }
                }
                if (this._MSS_Spine) {
                    if (this._MSS_Spine.state.timeScale === 0) {
                        if (picture._MSS_SpinePause === 0) {
                            picture._MSS_SpinePause = performance.now();
                        }
                    } else {
                        if (picture._MSS_SpinePause > 0) {
                            picture._MSS_SpineStart += (performance.now() - picture._MSS_SpinePause);
                            picture._MSS_SpinePause = 0;
                        }
                    }
                }
            }
        };
        Sprite_Picture.prototype.onSpineEvent = function(trackEntry, event) {
            Spine_EvName.push(event.data.name);
            if (!event.audioData) {
                let path = event.data.audioPath;
                let dir = '';
                let name = '';
                let volume = event.volume;
                let balance = event.balance;
                let stringValue = event.stringValue;
                let volume_id = null;
                let balance_id = null;
                path = path ? path.replace(/\.[^.]+$/, '') : '';
                if (path.includes('/')) {
                    let index = path.lastIndexOf('/');
                    dir = path.substr(0, index);
                    name = path.substr(index + 1);
                } else {
                    dir = '';
                    name = path;
                }
                volume = (typeof volume == 'number') ? volume * 100 : 100;
                balance = (typeof balance == 'number') ? balance * 100 : 0;
                stringValue.trim().split(/ *, */).forEach(data => {
                    let [name, value] = data.split(/ *: */);
                    switch (name) {
                    case 'volume':
                        volume_id = Number(value);
                        break;
                    case 'balance':
                        balance_id = Number(value);
                        break;
                    }
                });
                event.audioData = {
                    path: path,
                    dir: dir,
                    name: name,
                    volume: volume,
                    balance: balance,
                    volume_id: volume_id,
                    balance_id: balance_id
                };
            }
            let audioData = event.audioData;
            let path = audioData.path;
            let dir = audioData.dir;
            let name = audioData.name;
            let volume = audioData.volume;
            let balance = audioData.balance;
            let volume_id = audioData.volume_id;
            let balance_id = audioData.balance_id;
            if (path) {
                let se = {
                    path: path,
                    dir: dir,
                    name: name,
                    volume: volume_id ? $gameVariables.value(volume_id) : volume,
                    pan: balance_id ? $gameVariables.value(balance_id) : balance,
                    pitch: 100
                };
                AudioManager.playSpineSe(se);
            }
        };
        Sprite_Picture.prototype.onSpineComplete = function(trackEntry) {
            if (!trackEntry.next) {
                let picture = this.picture();
                if (picture) {
                    let list = picture._MSS_SpineRandomAnimationList;
                    if (list) {
                        let value = Math.random() * list[list.length - 1].border;
                        let animation = '';
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].border > value) {
                                animation = list[i].name;
                                break;
                            }
                        }
                        if (animation) {
                            this._MSS_Spine.state.setAnimation(0, animation, false);
                            picture._MSS_SpineAnimationList.reverse().splice(1);
                            picture._MSS_SpineAnimationList[0].animation = animation;
                            picture._MSS_SpineStart = performance.now();
                            picture._MSS_SpinePause = 0;
                        }
                    }
                }
            }
        };
    }
    {
        let __terminate = Scene_Base.prototype.terminate;
        Scene_Base.prototype.terminate = function() {
            __terminate.apply(this, arguments);
            if ($gameTemp) {
                Object.keys($gameTemp._MSS_Spines).forEach(function(key) {
                    $gameTemp._MSS_Spines[key].state.timeScale = 0;
                });
            }
            if (this._spriteset && this._spriteset._pictureContainer) {
                this._spriteset._pictureContainer.children.forEach(function(sprite) {
                    if (sprite instanceof Sprite_Picture) {
                        let picture = sprite.picture();
                        if (picture && picture._MSS_IsSpine) {
                            sprite.update();
                        }
                    }
                });
            }
        };
    }
    AudioManager.playSpineSe = function(se) {
        if (se.name) {
            this.loadSpineSe(se);
            for (var i = 0; i < this._staticBuffers.length; i++) {
                var buffer = this._staticBuffers[i];
                if (buffer._reservedSeName === se.path) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    };
    AudioManager.loadSpineSe = function(se) {
        if (se.name && !this.isStaticSe({ name: se.path })) {
            var buffer = this.createBuffer(se.dir ? 'se/' + se.dir : 'se', se.name);
            buffer._reservedSeName = se.path;
            this._staticBuffers.push(buffer);
            if (this.shouldUseHtml5Audio()) {
                Html5Audio.setStaticSe(buffer._url);
            }
        }
    };
}());
