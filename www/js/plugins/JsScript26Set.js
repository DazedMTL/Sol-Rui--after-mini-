/*:ja
 * @plugindesc 
 */
const DbgFlg = true;       
const DbgPNo = [];          
const CienFlg = true;   
const MouseMukoFlame = 180; 
const VN_BefSaveNo = 76;    
const VN_SaveStr = 77;      
const VoiceMuteSwNo = 11; 
const MasterVolVarNo = 58; 
const VoiceVolVarNo = 59; 
const VN_SaveMap = 281;
const VN_EnoSave = 212; 
const F_MasterVol = 70; 
const F_BGMVol = 70;    
const F_SEVol = 70;     
const F_VoiceVol = 70;  
var _SetKtSW = [VoiceMuteSwNo]; 
for (var i = 0; i <= _SetKtSW.length - 1; i++) {
    utakata.CommonSaveManager._targetSwitchList.push(_SetKtSW[i])
}
var _SetKtVN = [MasterVolVarNo, VoiceVolVarNo, VN_BefSaveNo, VN_SaveStr , VN_EnoSave , VN_SaveMap];
for (var i = 0; i <= _SetKtVN.length - 1; i++) {
    utakata.CommonSaveManager._targetVariableList.push(_SetKtVN[i])
}
var NaGCUpFlg = false; 
const N_Ptcls = [
["test","character","test"]
,["MAP_a","---",""]
,["lite_A","---",""]
,["lite_B","---",""]
,["wa-pu1","screen",""]
,["wa-pu2","screen",""]
,["light_play","character",""]
,["light_ev","character",""]
,["wa-pu3","screen",""]
,["tokeru","character",""]
,["item_A1","screen",""]
,["item_A2","screen",""]
,["item_B1","screen",""]
,["item_C1","screen",""]
,["item_D1","screen",""]
,["item_D2","screen",""]
,["item_D3","screen",""]
,["item_D4","screen",""]
,["item_E1","screen",""]
,["item_G1","screen",""]
,["item_No1","screen",""]
,["item_No2","screen",""]
,["soredoko","screen",""]
,["tyosui","screen",""]
,["indoku","character",""]
,["wa-muA","region",""]
,["wa-muB","region",""]
,["wa-muC","region",""]
,["wa-muD","region",""]
,["wa-muE","region",""]
,["wa-muF","region",""]
,["wa-muG","region",""]
,["wa-muH","region",""]
,["wa-muI","region",""]
,["wa-muJ","region",""]
,["wa-muK","region",""]
,["wa-muL","region",""]
,["wa-muM","region",""]
,["wa-muO","region",""]
,["tokei","screen",""]
];
