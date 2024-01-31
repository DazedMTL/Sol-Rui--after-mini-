/*:ja
 * @plugindesc 
 */
const PN_NChoicesBase = 120; 
let ChoiseSelectNo = -1;
let NChoices_Select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function(index) {
    NChoices_Select.apply(this, arguments);
    ChoiseSelectNo = index;
};
let NChoices_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NChoices_NUpdate.call(this);
    if(ChoiseSelectNo != -1) {
        console.log("選択されたのは：" + ChoiseSelectNo);
        this.DelPictSpan(PN_NChoicesBase , PN_NChoicesBase + 2);
        NChoicesDataArr.forEach( ckData => {
            if (ckData.index == ChoiseSelectNo) {
                for (let i = 0; i < ckData.textArr.length; i++) {
                    this.SetPicStr( PN_NChoicesBase + i , ckData.textArr[i] , ckData.size ,
                        ckData.posX , ckData.posY + i * ckData.saY);
                }
            }
        });
        ChoiseSelectNo = -1;
    }
}
let NChoicesDataArr = [];
class NChoicesData {
    constructor(index , textArr , size , posX , posY , saY){
        this.index = index;
        this.textArr = textArr;
        this.size = size;
        this.posX = posX;
        this.posY = posY;
        this.saY = saY;
    }
}
let NChoices_Setting = function (index , textArr , size , posX , posY , saY) {
    var size = typeof size !== 'undefined' ? size : 24;
    var posX = typeof posX !== 'undefined' ? posX : 0;
    var posY = typeof posY !== 'undefined' ? posY : 0;
    var saY = typeof saY !== 'undefined' ? saY : 30;
    let addFlg = true;
    NChoicesDataArr.forEach( ckData => {
        if (ckData.index == index) {
            addFlg = false;
            ckData.textArr = textArr;
            ckData.size = size;
            ckData.posX = posX;
            ckData.posY = posY;
            ckData.saY = saY;
        }
    });
    if (addFlg) {
        let setData = new NChoicesData(index , textArr , size , posX , posY , saY);
        NChoicesDataArr.push(setData);
    }
}
Game_Interpreter.prototype.NChoices_Clear = function () {
    this.DelPictSpan(PN_NChoicesBase , PN_NChoicesBase + 2);
    NChoicesDataArr = [];
}
